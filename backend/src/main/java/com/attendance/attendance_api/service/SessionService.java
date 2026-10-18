package com.attendance.attendance_api.service;

import com.attendance.attendance_api.dto.SessionResponse;
import com.attendance.attendance_api.dto.StartSessionRequest;
import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.SessionType;
import com.attendance.attendance_api.model.Subject;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.SessionRepository;
import com.attendance.attendance_api.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SubjectRepository subjectRepository;
    private static final int DEFAULT_DURATION_MINUTES = 10;
    private static final int DEFAULT_RADIUS_METERS = 100;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Transactional
    public SessionResponse startSession(User teacher, StartSessionRequest request) {
        if (request.getSubjectId() == null || request.getSessionType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "subjectId and sessionType are required");
        }

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));

        if (!subject.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Subject does not belong to you");
        }

        if (request.getSessionType() == SessionType.THEORY && !subject.isHasTheory()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject does not support THEORY session type");
        }
        if (request.getSessionType() == SessionType.LAB && !subject.isHasLab()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject does not support LAB session type");
        }

        sessionRepository.findByTeacherAndActiveTrue(teacher).ifPresent(s -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "You already have an active session (id=" + s.getId() + "). End it first.");
        });

        int duration = request.getDurationMinutes() != null ? request.getDurationMinutes() : DEFAULT_DURATION_MINUTES;
        int radius = request.getRadiusMeters() != null ? request.getRadiusMeters() : DEFAULT_RADIUS_METERS;

        Session session = new Session();
        session.setSubject(subject);
        session.setSessionType(request.getSessionType());
        session.setRoomNumber(request.getRoomNumber());
        session.setStartTime(LocalDateTime.now());
        session.setExpiryTime(LocalDateTime.now().plusMinutes(duration));
        session.setCurrentToken(generateUniqueCode());
        session.setActive(true);
        session.setLatitude(request.getLatitude());
        session.setLongitude(request.getLongitude());
        session.setRadiusMeters(radius);
        session.setTeacher(teacher);

        return toResponse(sessionRepository.save(session));
    }

    @Transactional
    public SessionResponse endSession(User teacher, Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

        if (!session.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your session to end");
        }

        session.setActive(false);
        return toResponse(sessionRepository.save(session));
    }

    @Transactional(readOnly = true)
    public SessionResponse getCurrentSession(User teacher) {
        Session session = sessionRepository.findByTeacherAndActiveTrueAndExpiryTimeAfter(teacher, LocalDateTime.now())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No active session"));
        return toResponse(session);
    }

    @Transactional(readOnly = true)
    public SessionResponse getCurrentActiveSessionForStudent() {
        Session session = sessionRepository.findFirstByActiveTrueAndExpiryTimeAfter(LocalDateTime.now())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No active session"));
        return toResponseWithoutToken(session);
    }

    @Transactional(readOnly = true)
    public List<SessionResponse> getMySessions(User teacher) {
        return sessionRepository.findByTeacherOrderByStartTimeDesc(teacher).stream()
                .map(this::toResponse)
                .toList();
    }

    /** Generates a zero-padded 6-digit code that isn't used by any currently active session. */
    private String generateUniqueCode() {
        for (int i = 0; i < 10; i++) {
            String code = String.format("%06d", RANDOM.nextInt(1_000_000));
            if (sessionRepository.findFirstByActiveTrue()
                    .map(session -> code.equals(session.getCurrentToken()))
                    .orElse(false) == false) {
                return code;
            }
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not generate a unique session code");
    }

    private SessionResponse toResponse(Session s) {
        return new SessionResponse(
                s.getId(), s.getDisplayName(), s.getRoomNumber(),
                s.getStartTime(), s.getExpiryTime(), s.getCurrentToken(), s.isActive(),
                s.getLatitude(), s.getLongitude(), s.getRadiusMeters(),
                s.getSessionType(), s.getSubject() != null ? s.getSubject().getId() : null);
    }

    /** Returns response without exposing the session token — for student-facing endpoints. */
    private SessionResponse toResponseWithoutToken(Session s) {
        return new SessionResponse(
                s.getId(), s.getDisplayName(), s.getRoomNumber(),
                s.getStartTime(), s.getExpiryTime(), null, s.isActive(),
                s.getLatitude(), s.getLongitude(), s.getRadiusMeters(),
                s.getSessionType(), s.getSubject() != null ? s.getSubject().getId() : null);
    }
}