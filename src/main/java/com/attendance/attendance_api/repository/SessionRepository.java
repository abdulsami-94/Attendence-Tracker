package com.attendance.attendance_api.repository;

import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByActiveTrue();
    Optional<Session> findByTeacherAndActiveTrue(User teacher);
    List<Session> findByTeacherOrderByStartTimeDesc(User teacher);
}