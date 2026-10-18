package com.attendance.attendance_api.repository;

import com.attendance.attendance_api.model.AttendanceRecord;
import com.attendance.attendance_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findBySessionId(Long sessionId);
    List<AttendanceRecord> findByStudentOrderByTimestampDesc(User student);
    boolean existsByStudentIdAndSessionId(Long studentId, Long sessionId);

    @Query("SELECT COUNT(DISTINCT ar.session.id) FROM AttendanceRecord ar " +
           "WHERE ar.student.id = :studentId " +
           "AND (ar.session.active = false OR ar.session.expiryTime < :now)")
    long countAttendedPastSessions(@Param("studentId") Long studentId, @Param("now") LocalDateTime now);
}