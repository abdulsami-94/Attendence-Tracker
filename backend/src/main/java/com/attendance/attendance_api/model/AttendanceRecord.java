package com.attendance.attendance_api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class AttendanceRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User student;
    @ManyToOne
    private Session session;
    private LocalDateTime timestamp;
    private Double latitude;
    private Double longitude;
    private String deviceId;
}