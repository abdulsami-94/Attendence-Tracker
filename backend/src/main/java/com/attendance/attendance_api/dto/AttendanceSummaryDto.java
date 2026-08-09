package com.attendance.attendance_api.dto;

public class AttendanceSummaryDto {
    private double overallPercentage;
    private int presentLectures;
    private int absentLectures;
    private int totalLectures;

    public AttendanceSummaryDto(double overallPercentage, int presentLectures, int absentLectures, int totalLectures) {
        this.overallPercentage = overallPercentage;
        this.presentLectures = presentLectures;
        this.absentLectures = absentLectures;
        this.totalLectures = totalLectures;
    }

    public double getOverallPercentage() { return overallPercentage; }
    public int getPresentLectures() { return presentLectures; }
    public int getAbsentLectures() { return absentLectures; }
    public int getTotalLectures() { return totalLectures; }
}