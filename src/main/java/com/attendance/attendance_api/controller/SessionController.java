package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.model.Session;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.UserRepository;
import com.attendance.attendance_api.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    @Autowired private SessionService sessionService;
    @Autowired private UserRepository userRepository;

    // simplified: pass teacherId as a query param for now, real auth comes later
    @PostMapping("/start")
    public ResponseEntity<?> start(@RequestParam Long teacherId,
                                    @RequestParam String subject,
                                    @RequestParam String roomNumber) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        Session session = sessionService.startSession(teacher, subject, roomNumber);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/active")
    public ResponseEntity<?> active() {
        return ResponseEntity.ok(sessionService.getActiveSession());
    }
}