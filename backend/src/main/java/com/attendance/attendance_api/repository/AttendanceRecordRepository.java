package com.attendance.attendance_api.repository;

import com.attendance.attendance_api.dto.LegacySessionCount;
import com.attendance.attendance_api.dto.SessionSubjectCount;
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

    @Query("SELECT ar.session.subject.id AS subjectId, ar.session.sessionType AS sessionType, COUNT(DISTINCT ar.session.id) AS count " +
           "FROM AttendanceRecord ar " +
           "WHERE ar.student.id = :studentId " +
           "  AND (ar.session.active = false OR ar.session.expiryTime < :now) " +
           "  AND ar.session.subject IS NOT NULL " +
           "  AND ar.session.sessionType IS NOT NULL " +
           "GROUP BY ar.session.subject.id, ar.session.sessionType")
    List<SessionSubjectCount> countAttendedNewSessionsGrouped(@Param("studentId") Long studentId, @Param("now") LocalDateTime now);

    @Query("SELECT LOWER(TRIM(ar.session.legacySubject)) AS subjectName, COUNT(DISTINCT ar.session.id) AS count " +
           "FROM AttendanceRecord ar " +
           "WHERE ar.student.id = :studentId " +
           "  AND (ar.session.active = false OR ar.session.expiryTime < :now) " +
           "  AND ar.session.subject IS NULL " +
           "  AND ar.session.legacySubject IS NOT NULL " +
           "  AND TRIM(ar.session.legacySubject) <> '' " +
           "GROUP BY LOWER(TRIM(ar.session.legacySubject))")
    List<LegacySessionCount> countAttendedLegacySessionsGrouped(@Param("studentId") Long studentId, @Param("now") LocalDateTime now);
}