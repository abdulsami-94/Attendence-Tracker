package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.dto.LoginRequest;
import com.attendance.attendance_api.dto.RegisterRequest;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        User user = authService.register(req);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = authService.login(req);
        return ResponseEntity.ok(user);
    }
}