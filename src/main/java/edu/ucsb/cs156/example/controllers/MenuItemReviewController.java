package edu.ucsb.cs156.example.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "MenuItemReview")
@RequestMapping("/api/menuitemreview")
@RestController
@Slf4j
public class MenuItemReviewController extends ApiController {

  @Autowired MenuItemReviewRepository menuItemReviewRepository;

  @Operation(summary = "List all menu item reviews")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("/all")
  public Iterable<MenuItemReview> allMenuItemReviews() {
    Iterable<MenuItemReview> reviews = menuItemReviewRepository.findAll();
    return reviews;
  }

  @Operation(summary = "Create a new MenuItemReview")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PostMapping("/post")
  public MenuItemReview postMenuItemReview(

      /*
        private String quarterYYYYQ;
        private String name;
        private LocalDateTime localDateTime;
      */

      /*

      private long itemId;
      private String reviewerEmail;
      private int stars;
      private LocalDateTime dateReviewed;
      private String comments;

          */
      @Parameter(name = "itemId") @RequestParam long itemId,
      @Parameter(name = "reviewerEmail") @RequestParam String reviewerEmail,
      @Parameter(name = "stars") @RequestParam int stars,
      @Parameter(name = "comments") @RequestParam String comments,
      @Parameter(
              name = "dateReviewed",
              description =
                  "date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)")
          @RequestParam("dateReviewed")
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
          LocalDateTime dateReviewed)
      throws JsonProcessingException {

    // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    // See: https://www.baeldung.com/spring-date-parameters

    // log.info("dateReviewed={}", dateReviewed);

    MenuItemReview menuitemreview = new MenuItemReview();
    menuitemreview.setItemId(itemId);
    menuitemreview.setReviewerEmail(reviewerEmail);
    menuitemreview.setStars(stars);
    menuitemreview.setComments(comments);
    menuitemreview.setDateReviewed(dateReviewed);

    MenuItemReview savedMenuItemReview = menuItemReviewRepository.save(menuitemreview);

    return savedMenuItemReview;
  }

  @Operation(summary = "Get a single menu item review")
  @PreAuthorize("hasRole('ROLE_USER')")
  @GetMapping("")
  public MenuItemReview getById(@Parameter(name = "id") @RequestParam Long id) {
    MenuItemReview menuItemReview1 =
        menuItemReviewRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));

    return menuItemReview1;
  }

  /**
   * Update a single menuitemreview
   *
   * @param id id of the menuitemreview to update
   * @param incoming the new menuitemreview
   * @return the updated date object
   */
  @Operation(summary = "Update a single menu item review")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @PutMapping("")
  public MenuItemReview updateMenuItemReview(
      @Parameter(name = "id") @RequestParam Long id, @RequestBody @Valid MenuItemReview incoming) {

    MenuItemReview menuItemReview1 =
        menuItemReviewRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));

    /*

      private long itemId;
      private String reviewerEmail;
      private int stars;
      private LocalDateTime dateReviewed;
      private String comments;
    */

    menuItemReview1.setItemId(incoming.getItemId());
    menuItemReview1.setReviewerEmail(incoming.getReviewerEmail());
    menuItemReview1.setStars(incoming.getStars());
    menuItemReview1.setComments(incoming.getComments());
    menuItemReview1.setDateReviewed(incoming.getDateReviewed());

    menuItemReviewRepository.save(menuItemReview1);

    return menuItemReview1;
  }

  /**
   * Delete a menuitemreview
   *
   * @param id the id of the menuitemreview to delete
   * @return a message indicating the menuitemreview was deleted
   */
  @Operation(summary = "Delete a MenuItemReview")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  @DeleteMapping("")
  public Object deleteMenuItemReview(@Parameter(name = "id") @RequestParam Long id) {
    MenuItemReview menuItemReview1 =
        menuItemReviewRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));

    menuItemReviewRepository.delete(menuItemReview1);
    return genericMessage("MenuItemReview with id %s deleted".formatted(id));
  }
}
