package com.ktts.lecture.config;

import java.util.Locale;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.ktts.lecture.config.properties.AppProperties;
import com.ktts.lecture.domain.Role;
import com.ktts.lecture.dto.AuthDtos;
import com.ktts.lecture.repository.AppUserRepository;
import com.ktts.lecture.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Teachers cannot sign up through the API. The first one is created at startup from TEACHER_EMAIL and
 * TEACHER_PASSWORD; nothing happens when they are unset or the email already exists.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TeacherBootstrap implements ApplicationRunner {

    private final AppProperties appProperties;
    private final AppUserRepository userRepository;
    private final AuthService authService;

    @Override
    public void run(ApplicationArguments args) {
        AppProperties.BootstrapTeacher teacher = appProperties.bootstrapTeacher();
        if (teacher == null || isBlank(teacher.email()) || isBlank(teacher.password())) {
            return;
        }
        if (userRepository.existsByEmail(teacher.email().strip().toLowerCase(Locale.ROOT))) {
            return;
        }
        if (!teacher.password().matches(AuthDtos.PASSWORD_PATTERN)) {
            throw new IllegalStateException("TEACHER_PASSWORD must be 8-72 characters with a letter and a digit");
        }
        String name = isBlank(teacher.displayName()) ? "Teacher" : teacher.displayName();
        authService.createUser(teacher.email(), teacher.password(), name, Role.TEACHER);
        log.info("Created bootstrap teacher account {}", teacher.email());
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
