package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
  @Autowired RecommendationRequestRepository recommendationRequestRepository;

  @Test
  public void admin_user_can_create_edit_delete_recommendationrequest() throws Exception {
    setupUser(true);

    LocalDateTime reqDate = LocalDateTime.parse("2025-11-10T12:00:00");
    LocalDateTime needDate = LocalDateTime.parse("2025-12-01T23:59:00");

    RecommendationRequest recommendationRequest =
        RecommendationRequest.builder()
            .code("laurenchorr")
            .requesterEmail("laurengracecho@ucsb.edu")
            .professorEmail("professorconrad@ucsb.edu")
            .explanation("Requesting letter of recommendation to appply for Master's program")
            .dateRequested(reqDate)
            .dateNeeded(needDate)
            .done(false)
            .build();

    recommendationRequestRepository.save(recommendationRequest);

    page.getByText("Recommendation Request").click();

    assertThat(page.getByTestId("RecommendationRequestsTable-cell-row-0-col-code"))
        .hasText("laurenchorr");

    page.getByTestId("RecommendationRequestsTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("RecommendationRequestsTable-cell-row-0-col-code"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_recommendationrequests() throws Exception {
    setupUser(false);

    page.getByText("Recommendation Request").click();

    assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
  }
}
