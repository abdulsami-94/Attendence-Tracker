package com.attendance.attendance_api.service;

import com.attendance.attendance_api.dto.AttendanceRequest;
import com.attendance.attendance_api.model.AttendanceRecord;
import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.AttendanceRecordRepository;
import com.attendance.attendance_api.repository.SessionRepository;
import com.attendance.attendance_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired private AttendanceRecordRepository attendanceRepository;
    @Autowired private SessionRepository sessionRepository;
    @Autowired private UserRepository userRepository;

    public AttendanceRecord markAttendance(AttendanceRequest req) {
        Session session = sessionRepository.findById(req.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.isActive()) {
            throw new RuntimeException("Session is not active");
        }
        if (LocalDateTime.now().isAfter(session.getExpiryTime())) {
            throw new RuntimeException("Session expired");
        }
        if (!session.getCurrentToken().equals(req.getToken())) {
            throw new RuntimeException("Invalid token");
        }
        if (attendanceRepository.existsByStudentIdAndSessionId(req.getStudentId(), req.getSessionId())) {
            throw new RuntimeException("Already marked");
        }

        User student = userRepository.findById(req.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        AttendanceRecord record = new AttendanceRecord();
        record.setStudent(student);
        record.setSession(session);
        record.setTimestamp(LocalDateTime.now());
        record.setLatitude(req.getLatitude());
        record.setLongitude(req.getLongitude());
        record.setDeviceId(req.getDeviceId());

        return attendanceRepository.save(record);
    }

    public List<AttendanceRecord> getRecordsForSession(Long sessionId) {
        return attendanceRepository.findBySessionId(sessionId);
    }
}