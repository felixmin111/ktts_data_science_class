package com.ktts.lecture;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;

import com.ktts.lecture.domain.Role;
import com.ktts.lecture.service.AuthService;

@SpringBootTest
@AutoConfigureMockMvc
class ProgressApiTest extends ApiTestSupport {

    @Autowired
    AuthService authService;

    @Test
    void recordsSectionVisitsAndResetsALesson() throws Exception {
        Account student = register(uniqueEmail());
        for (int i = 0; i < 2; i++) {
            mvc.perform(put("/api/v1/me/progress/ds-7/filtering").header("Authorization", bearer(student)))
                    .andExpect(status().isOk());
        }
        mvc.perform(put("/api/v1/me/progress/day-1/variables").header("Authorization", bearer(student)))
                .andExpect(status().isOk());

        mvc.perform(get("/api/v1/me/progress").header("Authorization", bearer(student)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(
                        jsonPath("$[?(@.sectionId == 'filtering')].visitCount").value(2));

        mvc.perform(delete("/api/v1/me/progress/ds-7").header("Authorization", bearer(student)))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/v1/me/progress").header("Authorization", bearer(student)))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].lessonId").value("day-1"));
    }

    @Test
    void rejectsIdsThatAreNotSlugs() throws Exception {
        Account student = register(uniqueEmail());
        mvc.perform(put("/api/v1/me/progress/DS 7/x").header("Authorization", bearer(student)))
                .andExpect(status().isBadRequest());
        mvc.perform(put("/api/v1/me/progress/ds-7/" + "a".repeat(80)).header("Authorization", bearer(student)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void studentsOnlySeeTheirOwnData() throws Exception {
        Account alice = register(uniqueEmail());
        Account bob = register(uniqueEmail());
        mvc.perform(put("/api/v1/me/progress/ds-1/definition").header("Authorization", bearer(alice)))
                .andExpect(status().isOk());
        mvc.perform(post("/api/v1/me/game-results")
                        .header("Authorization", bearer(alice))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(game("bug-hunter", 900, 6, 8, 4)))
                .andExpect(status().isCreated());

        mvc.perform(get("/api/v1/me/progress").header("Authorization", bearer(bob)))
                .andExpect(jsonPath("$.length()").value(0));
        mvc.perform(get("/api/v1/me/game-results").header("Authorization", bearer(bob)))
                .andExpect(jsonPath("$.totalItems").value(0));
    }

    @Test
    void recordsGameHistoryAndTracksBestScores() throws Exception {
        Account student = register(uniqueEmail());
        mvc.perform(post("/api/v1/me/game-results")
                        .header("Authorization", bearer(student))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(game("type-detective", 1200, 9, 10, 7)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.newBest").value(true));
        mvc.perform(post("/api/v1/me/game-results")
                        .header("Authorization", bearer(student))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(game("type-detective", 700, 6, 10, 3)))
                .andExpect(jsonPath("$.newBest").value(false));
        mvc.perform(post("/api/v1/me/game-results")
                        .header("Authorization", bearer(student))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(game("chart-picker", 400, 4, 10, 2)))
                .andExpect(jsonPath("$.newBest").value(true));

        mvc.perform(get("/api/v1/me/game-results?size=2").header("Authorization", bearer(student)))
                .andExpect(jsonPath("$.totalItems").value(3))
                .andExpect(jsonPath("$.items.length()").value(2))
                .andExpect(jsonPath("$.items[0].gameId").value("chart-picker"));

        mvc.perform(get("/api/v1/me/game-results/best").header("Authorization", bearer(student)))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[?(@.gameId == 'type-detective')].score").value(1200));
    }

    @Test
    void rejectsImpossibleGameResults() throws Exception {
        Account student = register(uniqueEmail());
        for (String body : new String[] {
            game("bug-hunter", 100, 9, 8, 2), // more correct than total
            game("bug-hunter", 100, 4, 8, 6), // streak longer than correct answers
            game("bug-hunter", -5, 1, 8, 1),
            game("Bug Hunter", 100, 1, 8, 1)
        }) {
            mvc.perform(post("/api/v1/me/game-results")
                            .header("Authorization", bearer(student))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest());
        }
    }

    @Test
    void onlyTeachersCanSeeTheClass() throws Exception {
        Account student = register(uniqueEmail());
        mvc.perform(put("/api/v1/me/progress/ds-2/centre").header("Authorization", bearer(student)))
                .andExpect(status().isOk());
        mvc.perform(get("/api/v1/teacher/students").header("Authorization", bearer(student)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));

        String teacherEmail = uniqueEmail();
        authService.createUser(teacherEmail, PASSWORD, "Teacher", Role.TEACHER);
        Account teacher = login(teacherEmail, PASSWORD);

        mvc.perform(get("/api/v1/teacher/students").header("Authorization", bearer(teacher)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.email == '%s')].sectionsVisited".formatted(student.email()))
                        .value(1))
                .andExpect(jsonPath("$[?(@.email == '%s')]".formatted(teacherEmail))
                        .isEmpty());
        mvc.perform(get("/api/v1/teacher/students/" + student.userId()).header("Authorization", bearer(teacher)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.progress[0].sectionId").value("centre"));
        mvc.perform(get("/api/v1/teacher/students/" + teacher.userId()).header("Authorization", bearer(teacher)))
                .andExpect(status().isNotFound());
    }

    private static String game(String gameId, int score, int correct, int total, int bestStreak) {
        return """
                {"gameId":"%s","score":%d,"correct":%d,"total":%d,"bestStreak":%d}""".formatted(gameId, score, correct, total, bestStreak);
    }
}
