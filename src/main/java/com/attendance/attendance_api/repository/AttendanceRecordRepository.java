package com.attendance.attendance_api.repository;

import com.attendance.attendance_api.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findBySessionId(Long sessionId);
    boolean existsByStudentIdAndSessionId(Long studentId, Long sessionId);
}