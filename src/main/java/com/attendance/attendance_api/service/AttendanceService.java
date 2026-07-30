package com.attendance.attendance_api.service;

import com.attendance.attendance_api.dto.AttendanceRequest;
import com.attendance.attendance_api.dto.AttendanceResponse;
import com.attendance.attendance_api.model.AttendanceRecord;
import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.AttendanceRecordRepository;
import com.attendance.attendance_api.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRepository;
    private final SessionRepository sessionRepository;

    private static final double EARTH_RADIUS_METERS = 6_371_000;

    public AttendanceResponse markAttendance(User student, AttendanceRequest req) {
        Session session = sessionRepository.findByCurrentToken(req.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid session token"));

        if (!session.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Session is not active");
        }
        if (LocalDateTime.now().isAfter(session.getExpiryTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Session expired");
        }
        if (attendanceRepository.existsByStudentIdAndSessionId(student.getId(), session.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Attendance already marked for this session");
        }

        double distance = distanceMeters(
                session.getLatitude(), session.getLongitude(),
                req.getLatitude(), req.getLongitude());
        if (distance > session.getRadiusMeters()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Outside geofence (" + Math.round(distance) + "m from session, limit "
                            + session.getRadiusMeters() + "m)");
        }

        AttendanceRecord record = new AttendanceRecord();
        record.setStudent(student);
        record.setSession(session);
        record.setTimestamp(LocalDateTime.now());
        record.setLatitude(req.getLatitude());
        record.setLongitude(req.getLongitude());
        record.setDeviceId(req.getDeviceId());

        return toResponse(attendanceRepository.save(record));
    }

    public List<AttendanceResponse> getMyAttendance(User student) {
        return attendanceRepository.findByStudentOrderByTimestampDesc(student).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AttendanceResponse> getRecordsForSession(Long sessionId, User teacher) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

        if (!session.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your session");
        }

        return attendanceRepository.findBySessionId(sessionId).stream()
                .map(this::toResponse)
                .toList();
    }

    private AttendanceResponse toResponse(AttendanceRecord r) {
        return new AttendanceResponse(
                r.getId(),
                r.getSession().getId(),
                r.getSession().getSubject(),
                r.getTimestamp(),
                r.getLatitude(),
                r.getLongitude(),
                r.getDeviceId());
    }

    /** Haversine distance between two WGS84 points, in meters. */
    static double distanceMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
