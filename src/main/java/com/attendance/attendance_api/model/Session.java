package com.attendance.attendance_api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Session {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subject;
    private String roomNumber;
    private LocalDateTime startTime;
    private LocalDateTime expiryTime;
    private String currentToken;
    private boolean active;
    @ManyToOne
    private User teacher;
}