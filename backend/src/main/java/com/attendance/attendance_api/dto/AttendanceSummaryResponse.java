package com.attendance.attendance_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {
    private long totalSessions;
    private long attendedSessions;
    private double percentage;
    private List<SubjectAttendanceSummaryDto> subjects;

    public AttendanceSummaryResponse(long totalSessions, long attendedSessions, double percentage) {
        this(totalSessions, attendedSessions, percentage, List.of());
    }
}
