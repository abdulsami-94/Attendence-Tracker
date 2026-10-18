package com.attendance.attendance_api.dto;

public record SubjectResponse(
    Long id,
    String name,
    boolean hasTheory,
    boolean hasLab
) {}
