package com.attendance.attendance_api.dto;

import com.attendance.attendance_api.model.SessionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionResponse {
    private Long id;
    private String subject;
    private String roomNumber;
    private LocalDateTime startTime;
    private LocalDateTime expiryTime;
    private String currentToken;
    private boolean active;
    private Double latitude;
    private Double longitude;
    private Integer radiusMeters;
    private SessionType sessionType;
    private Long subjectId;

    public SessionResponse(Long id, String subject, String roomNumber,
                           LocalDateTime startTime, LocalDateTime expiryTime,
                           String currentToken, boolean active,
                           Double latitude, Double longitude, Integer radiusMeters) {
        this(id, subject, roomNumber, startTime, expiryTime, currentToken, active, latitude, longitude, radiusMeters, null, null);
    }
}
