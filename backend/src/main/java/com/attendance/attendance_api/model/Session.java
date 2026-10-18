package com.attendance.attendance_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Getter
@Setter
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject")
    private String legacySubject;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_type")
    private SessionType sessionType;

    private String roomNumber;
    private LocalDateTime startTime;
    private LocalDateTime expiryTime;
    private String currentToken;
    private boolean active;
    private Double latitude;
    private Double longitude;
    private Integer radiusMeters;

    @ManyToOne
    private User teacher;

    public String getDisplayName() {
        if (subject != null) {
            String typeStr = sessionType == SessionType.THEORY ? "Theory" : "Lab";
            return subject.getName() + " (" + typeStr + ")";
        }
        return legacySubject != null ? legacySubject.trim() : "";
    }
}
