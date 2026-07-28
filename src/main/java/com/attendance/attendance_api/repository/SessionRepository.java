package com.attendance.attendance_api.repository;

import com.attendance.attendance_api.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByActiveTrue();
}