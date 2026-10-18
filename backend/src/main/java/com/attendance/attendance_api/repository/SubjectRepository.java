package com.attendance.attendance_api.repository;

import com.attendance.attendance_api.model.Subject;
import com.attendance.attendance_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByName(String name);
    boolean existsByName(String name);
    List<Subject> findByTeacherOrderByNameAsc(User teacher);
    List<Subject> findAllByOrderByNameAsc();
}
