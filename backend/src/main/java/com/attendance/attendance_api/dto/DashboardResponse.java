package com.attendance.attendance_api.dto;

public class DashboardResponse {
    private StudentInfoDto student;
    private AttendanceSummaryDto attendanceSummary;

    public DashboardResponse(StudentInfoDto student, AttendanceSummaryDto attendanceSummary) {
        this.student = student;
        this.attendanceSummary = attendanceSummary;
    }

    public StudentInfoDto getStudent() { return student; }
    public AttendanceSummaryDto getAttendanceSummary() { return attendanceSummary; }
}