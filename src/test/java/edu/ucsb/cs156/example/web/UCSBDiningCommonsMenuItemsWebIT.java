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
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItems;


@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemsWebIT extends WebTestCase {

@Autowired UCSBDiningCommonsMenuItemsRepository UCSBDiningCommonsMenuItemsRepository;

@Test
public void admin_user_can_create_edit_delete_UCSBDiningCommonsMenuItems() throws Exception {
    
    setupUser(true);

    UCSBDiningCommonsMenuItems UCSBDiningCommonsMenuItems1 =
    UCSBDiningCommonsMenuItems.builder()
        .diningCommonsCode("ortega")
        .name("pasta")
        .station("italian")
        .build();

    UCSBDiningCommonsMenuItemsRepository.save(UCSBDiningCommonsMenuItems1);

    page.getByText("UCSB Dining Commons Menu Items").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name"))
        .hasText("pasta");

    page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Delete-button").click();
    
    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name")).not().isVisible();

}

@Test
    public void regular_user_cannot_create_UCSBDiningCommonsMenuItems() throws Exception {
    setupUser(false);

    page.getByText("UCSB Dining Commons Menu Items").click();

    assertThat(page.getByText("Create UCSBDiningCommonsMenuItems")).not().isVisible();
}

@Test
public void admin_user_can_see_edit_create_UCSBDiningCommonsMenuItems_button() throws Exception {
    setupUser(true);

    page.getByText("UCSB Dining Commons Menu Items").click();

    assertThat(page.getByText("Create UCSBDiningCommonsMenuItems")).isVisible();
  }

}
