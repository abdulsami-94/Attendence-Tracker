package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.dto.AttendanceRequest;
import com.attendance.attendance_api.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/mark")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> mark(@RequestBody AttendanceRequest req) {
        return ResponseEntity.ok(attendanceService.markAttendance(req));
    }

    @GetMapping("/records")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> records(@RequestParam Long sessionId) {
        return ResponseEntity.ok(attendanceService.getRecordsForSession(sessionId));
    }
}
