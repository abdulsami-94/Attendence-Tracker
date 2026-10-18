package com.attendance.attendance_api.config;

import com.attendance.attendance_api.model.Role;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TeacherSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(TeacherSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    public TeacherSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder, Environment env) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByRole(Role.TEACHER)) {
            String email = env.getProperty("TEACHER_EMAIL");
            if (email == null || email.isBlank()) {
                email = env.getProperty("SEED_TEACHER_EMAIL");
            }

            String password = env.getProperty("TEACHER_PASSWORD");
            if (password == null || password.isBlank()) {
                password = env.getProperty("SEED_TEACHER_PASSWORD");
            }

            String name = env.getProperty("TEACHER_NAME");
            if (name == null || name.isBlank()) {
                name = env.getProperty("SEED_TEACHER_NAME", "Teacher");
            }

            if (email != null && !email.isBlank() && password != null && !password.isBlank()) {
                if (userRepository.findByEmail(email).isEmpty()) {
                    User teacher = new User();
                    teacher.setName(name);
                    teacher.setEmail(email);
                    teacher.setPassword(passwordEncoder.encode(password));
                    teacher.setRole(Role.TEACHER);
                    userRepository.save(teacher);
                    log.info("Initial teacher account seeded for {}", email);
                }
            }
        }
    }
}
