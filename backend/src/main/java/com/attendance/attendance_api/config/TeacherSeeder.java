package com.attendance.attendance_api.config;

import com.attendance.attendance_api.model.Role;
import com.attendance.attendance_api.model.Subject;
import com.attendance.attendance_api.model.User;
import com.attendance.attendance_api.repository.SubjectRepository;
import com.attendance.attendance_api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TeacherSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(TeacherSeeder.class);

    public record SubjectDefinition(
        String name,
        boolean hasTheory,
        boolean hasLab,
        int teacherSlot
    ) {}

    // Fixed constant mapping: subject -> teacher slot
    public static final List<SubjectDefinition> SUBJECT_DEFINITIONS = List.of(
        new SubjectDefinition("Software Engineering and Testing", true, false, 1),
        new SubjectDefinition("Core Java", false, true, 1),
        new SubjectDefinition("Fundamentals of Artificial Intelligence", true, true, 2),
        new SubjectDefinition("Fundamentals of Data Science", true, true, 2),
        new SubjectDefinition("Fundamentals of Cyber Security", true, true, 3),
        new SubjectDefinition("IoT", true, false, 3)
    );

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    public TeacherSeeder(UserRepository userRepository,
                         SubjectRepository subjectRepository,
                         PasswordEncoder passwordEncoder,
                         Environment env) {
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
    }

    @Override
    public void run(String... args) {
        seedTeachers();
        seedSubjects();
    }

    private void seedTeachers() {
        for (int i = 1; i <= 20; i++) {
            String email = getEnv("TEACHER_" + i + "_EMAIL");
            String password = getEnv("TEACHER_" + i + "_PASSWORD");
            String name = getEnv("TEACHER_" + i + "_NAME");

            // For slot 1, support legacy single-teacher env vars if TEACHER_1_... is missing
            if (i == 1 && isBlank(email) && isBlank(password) && isBlank(name)) {
                email = getEnv("TEACHER_EMAIL");
                if (isBlank(email)) {
                    email = getEnv("SEED_TEACHER_EMAIL");
                }
                password = getEnv("TEACHER_PASSWORD");
                if (isBlank(password)) {
                    password = getEnv("SEED_TEACHER_PASSWORD");
                }
                name = getEnv("TEACHER_NAME");
                if (isBlank(name)) {
                    name = getEnv("SEED_TEACHER_NAME");
                }
            }

            // Create only if missing and only if all 3 env vars are set; no default passwords or fallbacks
            if (!isBlank(email) && !isBlank(password) && !isBlank(name)) {
                if (userRepository.findByEmail(email).isEmpty()) {
                    User teacher = new User();
                    teacher.setName(name);
                    teacher.setEmail(email);
                    teacher.setPassword(passwordEncoder.encode(password));
                    teacher.setRole(Role.TEACHER);
                    userRepository.save(teacher);
                    log.info("Teacher account seeded for slot {} ({})", i, email);
                }
            }
        }
    }

    private void seedSubjects() {
        for (SubjectDefinition def : SUBJECT_DEFINITIONS) {
            if (subjectRepository.findByName(def.name()).isPresent()) {
                // Never duplicate, never silently overwrite an existing assignment
                continue;
            }

            Optional<User> teacherOpt = resolveTeacherForSlot(def.teacherSlot());
            if (teacherOpt.isEmpty()) {
                log.warn("Teacher for slot {} does not exist; skipping subject '{}'", def.teacherSlot(), def.name());
                continue;
            }

            Subject subject = new Subject();
            subject.setName(def.name());
            subject.setHasTheory(def.hasTheory());
            subject.setHasLab(def.hasLab());
            subject.setTeacher(teacherOpt.get());
            subjectRepository.save(subject);
            log.info("Subject seeded: '{}' (slot {}, teacher: {})", def.name(), def.teacherSlot(), teacherOpt.get().getEmail());
        }
    }

    private Optional<User> resolveTeacherForSlot(int slot) {
        String email = getEnv("TEACHER_" + slot + "_EMAIL");
        if (slot == 1 && isBlank(email)) {
            email = getEnv("TEACHER_EMAIL");
            if (isBlank(email)) {
                email = getEnv("SEED_TEACHER_EMAIL");
            }
        }

        if (isBlank(email)) {
            return Optional.empty();
        }

        return userRepository.findByEmail(email).filter(u -> u.getRole() == Role.TEACHER);
    }

    private String getEnv(String key) {
        String val = env.getProperty(key);
        return val != null ? val.trim() : null;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
