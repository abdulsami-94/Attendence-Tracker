package com.attendance.attendance_api.service;

import com.attendance.attendance_api.config.TeacherSeeder;
import com.attendance.attendance_api.dto.*;
import com.attendance.attendance_api.model.AttendanceRecord;
import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.Subject;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.AttendanceRecordRepository;
import com.attendance.attendance_api.repository.SessionRepository;
import com.attendance.attendance_api.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRepository;
    private final SessionRepository sessionRepository;
    private final SubjectRepository subjectRepository;

    private static final double EARTH_RADIUS_METERS = 6_371_000;

    @Transactional
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

        // Validate geofence only if the session has location data
        if (session.getLatitude() != null && session.getLongitude() != null
                && session.getRadiusMeters() != null
                && req.getLatitude() != null && req.getLongitude() != null) {
            double distance = distanceMeters(
                    session.getLatitude(), session.getLongitude(),
                    req.getLatitude(), req.getLongitude());
            if (distance > session.getRadiusMeters()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Outside geofence (" + Math.round(distance) + "m from session, limit "
                                + session.getRadiusMeters() + "m)");
            }
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

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMyAttendance(User student) {
        return attendanceRepository.findByStudentOrderByTimestampDesc(student).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AttendanceSummaryResponse getAttendanceSummary(User student) {
        LocalDateTime now = LocalDateTime.now();
        long totalSessions = sessionRepository.countCompletedSessions(now);
        long attendedSessions = attendanceRepository.countAttendedPastSessions(student.getId(), now);

        double percentage = calcPercentage(attendedSessions, totalSessions);

        // Aggregate counts for new sessions
        List<SessionSubjectCount> totalNewCounts = sessionRepository.countCompletedNewSessionsGrouped(now);
        List<SessionSubjectCount> attendedNewCounts = attendanceRepository.countAttendedNewSessionsGrouped(student.getId(), now);

        Map<String, Long> totalNewMap = new HashMap<>();
        for (SessionSubjectCount sc : totalNewCounts) {
            totalNewMap.put(sc.getSubjectId() + "_" + sc.getSessionType().name(), sc.getCount());
        }

        Map<String, Long> attendedNewMap = new HashMap<>();
        for (SessionSubjectCount sc : attendedNewCounts) {
            attendedNewMap.put(sc.getSubjectId() + "_" + sc.getSessionType().name(), sc.getCount());
        }

        Map<String, Subject> subjectsByName = subjectRepository.findAllByOrderByNameAsc().stream()
                .collect(Collectors.toMap(Subject::getName, s -> s, (s1, s2) -> s1));

        List<SubjectAttendanceSummaryDto> subjectRows = new ArrayList<>();

        // Generate the 9 valid (subject, type) combinations sorted by subject name, Theory before Lab
        List<TeacherSeeder.SubjectDefinition> sortedDefs = TeacherSeeder.SUBJECT_DEFINITIONS.stream()
                .sorted(Comparator.comparing(TeacherSeeder.SubjectDefinition::name))
                .toList();

        for (TeacherSeeder.SubjectDefinition def : sortedDefs) {
            Subject entity = subjectsByName.get(def.name());
            Long subjectId = entity != null ? entity.getId() : null;

            if (def.hasTheory()) {
                String rowName = def.name() + " (Theory)";
                long rowTotal = 0;
                long rowAttended = 0;
                if (subjectId != null) {
                    rowTotal = totalNewMap.getOrDefault(subjectId + "_THEORY", 0L);
                    rowAttended = attendedNewMap.getOrDefault(subjectId + "_THEORY", 0L);
                }
                double rowPct = calcPercentage(rowAttended, rowTotal);
                subjectRows.add(new SubjectAttendanceSummaryDto(rowName, rowTotal, rowAttended, rowPct));
            }

            if (def.hasLab()) {
                String rowName = def.name() + " (Lab)";
                long rowTotal = 0;
                long rowAttended = 0;
                if (subjectId != null) {
                    rowTotal = totalNewMap.getOrDefault(subjectId + "_LAB", 0L);
                    rowAttended = attendedNewMap.getOrDefault(subjectId + "_LAB", 0L);
                }
                double rowPct = calcPercentage(rowAttended, rowTotal);
                subjectRows.add(new SubjectAttendanceSummaryDto(rowName, rowTotal, rowAttended, rowPct));
            }
        }

        // Aggregate counts for legacy sessions
        List<LegacySessionCount> totalLegacyCounts = sessionRepository.countCompletedLegacySessionsGrouped(now);
        List<LegacySessionCount> attendedLegacyCounts = attendanceRepository.countAttendedLegacySessionsGrouped(student.getId(), now);

        Map<String, Long> attendedLegacyMap = new HashMap<>();
        for (LegacySessionCount lc : attendedLegacyCounts) {
            attendedLegacyMap.put(lc.getSubjectName().toLowerCase().trim(), lc.getCount());
        }

        List<SubjectAttendanceSummaryDto> legacyRows = new ArrayList<>();
        for (LegacySessionCount lc : totalLegacyCounts) {
            String rawName = lc.getSubjectName().trim();
            String lowerKey = rawName.toLowerCase();
            long rowTotal = lc.getCount();
            long rowAttended = attendedLegacyMap.getOrDefault(lowerKey, 0L);
            double rowPct = calcPercentage(rowAttended, rowTotal);
            legacyRows.add(new SubjectAttendanceSummaryDto(rawName, rowTotal, rowAttended, rowPct));
        }

        legacyRows.sort(Comparator.comparing(SubjectAttendanceSummaryDto::getName, String.CASE_INSENSITIVE_ORDER));
        subjectRows.addAll(legacyRows);

        return new AttendanceSummaryResponse(totalSessions, attendedSessions, percentage, subjectRows);
    }

    @Transactional(readOnly = true)
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

    private double calcPercentage(long attended, long total) {
        if (total <= 0) {
            return 0.0;
        }
        return BigDecimal.valueOf((double) attended / total * 100.0)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private AttendanceResponse toResponse(AttendanceRecord r) {
        return new AttendanceResponse(
            r.getId(),
            r.getSession().getId(),
            r.getSession().getDisplayName(),
            r.getTimestamp(),
            r.getLatitude(),
            r.getLongitude(),
            r.getDeviceId(),
            r.getStudent().getName(),
            r.getStudent().getEmail());
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
