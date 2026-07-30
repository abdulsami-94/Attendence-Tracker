package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.dto.SessionResponse;
import com.attendance.attendance_api.dto.StartSessionRequest;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.UserRepository;
import com.attendance.attendance_api.service.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class SessionController {

    private final SessionService sessionService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<SessionResponse> start(@Valid @RequestBody StartSessionRequest request,
                                                 Authentication authentication) {
        return ResponseEntity.ok(sessionService.startSession(getCurrentTeacher(authentication), request));
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<SessionResponse> end(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(sessionService.endSession(getCurrentTeacher(authentication), id));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SessionResponse>> mine(Authentication authentication) {
        return ResponseEntity.ok(sessionService.getMySessions(getCurrentTeacher(authentication)));
    }

    @GetMapping("/current")
    public ResponseEntity<SessionResponse> current(Authentication authentication) {
        return ResponseEntity.ok(sessionService.getCurrentSession(getCurrentTeacher(authentication)));
    }

    private User getCurrentTeacher(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in DB"));
    }
}
