package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_restaurant() throws Exception {
    setupUser(true);

    page.getByText("Help Requests").click();

    page.getByText("Create Help Requests").click();
    assertThat(page.getByText("Create New Help Request")).isVisible();
    page.getByTestId("HelpRequestForm-requesterEmail").fill("dkim876@ucsb.edu");
    page.getByLabel("Team ID").fill("Team 01");
    page.getByLabel("Table or Breakout Room").fill("Table 01");
    page.getByLabel("Request Time (in UTC)").fill("2022-10-10T10:10");
    page.getByLabel("Explanation").fill("This is a test.");
    page.getByLabel("Solved").check();
    page.locator("button:has-text('Create')").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId")).hasText("Team 01");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Request")).isVisible();
    page.getByLabel("Team ID").fill("Team 02");
    page.locator("button:has-text('Update')").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId")).hasText("Team 02");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_restaurant() throws Exception {
    setupUser(false);

    page.getByText("Help Requests").click();

    assertThat(page.getByText("Create Help Request")).not().isVisible();
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-teamId")).not().isVisible();
  }

  @Test
  public void admin_user_can_see_create_request_button() throws Exception {
    setupUser(true);

    page.getByText("Help Requests").click();

    assertThat(page.getByText("Create Help Requests")).isVisible();
  }
}
