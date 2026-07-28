package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.dto.AttendanceRequest;
import com.attendance.attendance_api.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/mark")
    public ResponseEntity<?> mark(@RequestBody AttendanceRequest req) {
        return ResponseEntity.ok(attendanceService.markAttendance(req));
    }

    @GetMapping("/records")
    public ResponseEntity<?> records(@RequestParam Long sessionId) {
        return ResponseEntity.ok(attendanceService.getRecordsForSession(sessionId));
    }
}