package com.attendance.attendance_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long sessionId;
    private String subject;
    private LocalDateTime timestamp;
    private Double latitude;
    private Double longitude;
    private String deviceId;
}
