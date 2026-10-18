package com.attendance.attendance_api.repository;

import com.attendance.attendance_api.dto.LegacySessionCount;
import com.attendance.attendance_api.dto.SessionSubjectCount;
import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findFirstByActiveTrue();
    Optional<Session> findByTeacherAndActiveTrue(User teacher);
    Optional<Session> findByCurrentToken(String currentToken);
    List<Session> findByTeacherOrderByStartTimeDesc(User teacher);

    @Query("SELECT COUNT(s) FROM Session s WHERE s.active = false OR s.expiryTime < :now")
    long countCompletedSessions(@Param("now") LocalDateTime now);

    @Query("SELECT s.subject.id AS subjectId, s.sessionType AS sessionType, COUNT(s.id) AS count " +
           "FROM Session s " +
           "WHERE (s.active = false OR s.expiryTime < :now) " +
           "  AND s.subject IS NOT NULL " +
           "  AND s.sessionType IS NOT NULL " +
           "GROUP BY s.subject.id, s.sessionType")
    List<SessionSubjectCount> countCompletedNewSessionsGrouped(@Param("now") LocalDateTime now);

    @Query("SELECT MAX(TRIM(s.legacySubject)) AS subjectName, COUNT(s.id) AS count " +
           "FROM Session s " +
           "WHERE (s.active = false OR s.expiryTime < :now) " +
           "  AND s.subject IS NULL " +
           "  AND s.legacySubject IS NOT NULL " +
           "  AND TRIM(s.legacySubject) <> '' " +
           "GROUP BY LOWER(TRIM(s.legacySubject))")
    List<LegacySessionCount> countCompletedLegacySessionsGrouped(@Param("now") LocalDateTime now);
}