package com.attendance.attendance_api.service;

import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    public Session startSession(User teacher, String subject, String roomNumber) {
        Session session = new Session();
        session.setTeacher(teacher);
        session.setSubject(subject);
        session.setRoomNumber(roomNumber);
        session.setStartTime(LocalDateTime.now());
        session.setExpiryTime(LocalDateTime.now().plusMinutes(10)); // 10 min window
        session.setCurrentToken(UUID.randomUUID().toString());
        session.setActive(true);
        return sessionRepository.save(session);
    }

    public Session getActiveSession() {
        return sessionRepository.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active session"));
    }
}