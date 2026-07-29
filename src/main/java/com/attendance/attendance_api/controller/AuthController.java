package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.dto.RegisterRequest;
import com.attendance.attendance_api.dto.UserResponse;
import com.attendance.attendance_api.dto.LoginRequest;
import com.attendance.attendance_api.dto.UserResponse;
import com.attendance.attendance_api.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
        public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}