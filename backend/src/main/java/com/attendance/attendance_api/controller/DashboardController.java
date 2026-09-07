package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.dto.AttendanceSummaryDto;
import com.attendance.attendance_api.dto.DashboardResponse;
import com.attendance.attendance_api.dto.StudentInfoDto;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('STUDENT')")
public class DashboardController {

    private final AttendanceService attendanceService;

    public DashboardController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal User user) {
        List<?> records = attendanceService.getMyAttendance(user);
        int present = records.size();

        // TODO: no "expected total lectures" concept exists yet (no enrollment/timetable model).
        // Faking total = present so percentage renders as 100% instead of crashing on divide-by-zero.
        // This number is not real. Fix once Session/enrollment tracking exists.
        int total = present;
        double percentage = total == 0 ? 0 : (present * 100.0 / total);

        // TODO: rollNumber/department/semester/division don't exist on User yet.
        // Stubbed until you decide whether to extend User or add a proper Student entity.
        StudentInfoDto student = new StudentInfoDto(
            user.getId(), user.getName(), "N/A", "N/A", 0, "N/A"
        );

        AttendanceSummaryDto summary = new AttendanceSummaryDto(percentage, present, 0, total);

        return ResponseEntity.ok(new DashboardResponse(student, summary));
    }
}