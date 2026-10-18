package com.attendance.attendance_api.repository;

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
}