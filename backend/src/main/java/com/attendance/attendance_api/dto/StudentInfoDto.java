package com.attendance.attendance_api.dto;

public class StudentInfoDto {
    private Long id;
    private String fullName;
    private String rollNumber;
    private String department;
    private int semester;
    private String division;

    public StudentInfoDto(Long id, String fullName, String rollNumber, String department, int semester, String division) {
        this.id = id;
        this.fullName = fullName;
        this.rollNumber = rollNumber;
        this.department = department;
        this.semester = semester;
        this.division = division;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getRollNumber() { return rollNumber; }
    public String getDepartment() { return department; }
    public int getSemester() { return semester; }
    public String getDivision() { return division; }
}