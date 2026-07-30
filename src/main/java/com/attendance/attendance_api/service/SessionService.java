package com.attendance.attendance_api.service;

import com.attendance.attendance_api.dto.SessionResponse;
import com.attendance.attendance_api.dto.StartSessionRequest;
import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private static final int DEFAULT_DURATION_MINUTES = 10;

    public SessionResponse startSession(User teacher, StartSessionRequest request) {
        sessionRepository.findByTeacherAndActiveTrue(teacher).ifPresent(s -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You already have an active session (id=" + s.getId() + "). End it first.");
        });

        int duration = request.getDurationMinutes() != null ? request.getDurationMinutes() : DEFAULT_DURATION_MINUTES;

        Session session = new Session();
        session.setSubject(request.getSubject());
        session.setRoomNumber(request.getRoomNumber());
        session.setStartTime(LocalDateTime.now());
        session.setExpiryTime(LocalDateTime.now().plusMinutes(duration));
        session.setCurrentToken(UUID.randomUUID().toString());
        session.setActive(true);
        session.setTeacher(teacher);

        return toResponse(sessionRepository.save(session));
    }

    public SessionResponse endSession(User teacher, Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

        if (!session.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your session to end");
        }

        session.setActive(false);
        return toResponse(sessionRepository.save(session));
    }

    public SessionResponse getCurrentSession(User teacher) {
        Session session = sessionRepository.findByTeacherAndActiveTrue(teacher)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No active session"));
        return toResponse(session);
    }

    public List<SessionResponse> getMySessions(User teacher) {
        return sessionRepository.findByTeacherOrderByStartTimeDesc(teacher).stream()
                .map(this::toResponse)
                .toList();
    }

    private SessionResponse toResponse(Session s) {
        return new SessionResponse(s.getId(), s.getSubject(), s.getRoomNumber(),
                s.getStartTime(), s.getExpiryTime(), s.getCurrentToken(), s.isActive());
    }
}