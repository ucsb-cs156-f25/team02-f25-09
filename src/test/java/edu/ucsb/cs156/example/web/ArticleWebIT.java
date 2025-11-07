package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.Article;
import edu.ucsb.cs156.example.repositories.ArticleRepository;
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
public class ArticleWebIT extends WebTestCase {
  @Autowired ArticleRepository articleRepository;

  @Test
  public void admin_user_can_create_edit_delete_article() throws Exception {

    Article article =
        Article.builder()
            .title("All the right notes: the ENO's 'Dead Man Walking'")
            .url("https://www.thearticle.com/all-the-right-notes-the-enos-dead-man-walking")
            .explanation("This harrowing opera is based")
            .email("markronan@gmail.com")
            .dateAdded(LocalDateTime.parse("2025-11-03T19:25:00"))
            .build();

    articleRepository.save(article);

    setupUser(true);

    page.getByText("Articles").click();

    assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title"))
        .hasText("All the right notes: the ENO's 'Dead Man Walking'");

    page.getByTestId("ArticleTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_article() throws Exception {
    setupUser(false);

    page.getByText("Articles").click();

    assertThat(page.getByText("Create Article")).not().isVisible();
    assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).not().isVisible();
  }

  @Test
  public void admin_user_can_see_create_article_button() throws Exception {
    setupUser(true);

    page.getByText("Articles").click();

    assertThat(page.getByText("Create Article")).isVisible();
  }
}
