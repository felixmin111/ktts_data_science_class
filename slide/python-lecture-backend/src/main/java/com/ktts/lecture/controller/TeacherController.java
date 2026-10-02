package com.ktts.lecture.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ktts.lecture.dto.TeacherDtos.StudentDetail;
import com.ktts.lecture.dto.TeacherDtos.StudentSummary;
import com.ktts.lecture.service.TeacherService;

import lombok.RequiredArgsConstructor;

/** Read-only class overview. Restricted to ROLE_TEACHER in SecurityConfig. */
@RestController
@RequestMapping("/api/v1/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("/students")
    public List<StudentSummary> students() {
        return teacherService.listStudents();
    }

    @GetMapping("/students/{studentId}")
    public StudentDetail student(@PathVariable UUID studentId) {
        return teacherService.studentDetail(studentId);
    }
}
