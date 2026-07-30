package com.attendance.attendance_api.dto;

import lombok.Data;

@Data
public class StartSessionRequest {
    private String subject;
    private String roomNumber;
    private Integer durationMinutes; // optional — null defaults to 10 in the service
}