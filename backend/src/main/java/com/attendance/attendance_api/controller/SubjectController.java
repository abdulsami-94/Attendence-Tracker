package com.attendance.attendance_api.controller;

import com.attendance.attendance_api.dto.SubjectResponse;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.SubjectRepository;
import com.attendance.attendance_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getMySubjects(Authentication authentication) {
        User teacher = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in DB"));

        List<SubjectResponse> subjects = subjectRepository.findByTeacherOrderByNameAsc(teacher).stream()
                .map(s -> new SubjectResponse(s.getId(), s.getName(), s.isHasTheory(), s.isHasLab()))
                .toList();

        return ResponseEntity.ok(subjects);
    }
}
