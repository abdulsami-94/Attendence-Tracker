package com.attendance.attendance_api.dto;

import com.attendance.attendance_api.model.SessionType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartSessionRequest {
    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Session type is required")
    private SessionType sessionType;

    private String roomNumber;

    private Integer durationMinutes; // optional — null defaults to 10 in the service

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Integer radiusMeters; // optional — null defaults in the service
}
