package com.attendance.attendance_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SessionResponse {
    private Long id;
    private String subject;
    private String roomNumber;
    private LocalDateTime startTime;
    private LocalDateTime expiryTime;
    private String currentToken;
    private boolean active;
}