package com.attendance.attendance_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {
    private long totalSessions;
    private long attendedSessions;
    private double percentage;
}
