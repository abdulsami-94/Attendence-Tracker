package com.attendance.attendance_api.dto;

import lombok.Data;

@Data
public class AttendanceRequest {
    private Long studentId;
    private Long sessionId;
    private String token;
    private Double latitude;
    private Double longitude;
    private String deviceId;
}
