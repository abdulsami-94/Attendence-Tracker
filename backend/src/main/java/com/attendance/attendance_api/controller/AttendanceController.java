package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.dto.AttendanceRequest;
import com.attendance.attendance_api.dto.AttendanceResponse;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.UserRepository;
import com.attendance.attendance_api.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AttendanceResponse> mark(@Valid @RequestBody AttendanceRequest req,
                                                   Authentication authentication) {
        return ResponseEntity.ok(attendanceService.markAttendance(currentUser(authentication), req));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AttendanceResponse>> mine(Authentication authentication) {
        return ResponseEntity.ok(attendanceService.getMyAttendance(currentUser(authentication)));
    }

    @GetMapping("/records")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<AttendanceResponse>> records(@RequestParam Long sessionId,
                                                            Authentication authentication) {
        return ResponseEntity.ok(attendanceService.getRecordsForSession(sessionId, currentUser(authentication)));
    }

    private User currentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in DB"));
    }
}
