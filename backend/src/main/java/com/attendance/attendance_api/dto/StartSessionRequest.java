package com.attendance.attendance_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartSessionRequest {
    @NotBlank(message = "Subject is required")
    private String subject;

    private String roomNumber;

    private Integer durationMinutes; // optional — null defaults to 10 in the service

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Integer radiusMeters; // optional — null defaults in the service
}
