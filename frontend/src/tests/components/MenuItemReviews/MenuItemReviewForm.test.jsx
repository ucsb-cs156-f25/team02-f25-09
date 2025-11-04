import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByText(/Item Id/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Item Id/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a MenuItemReviewForm", async () => {
    render(
      <Router>
        <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneMenuItemReview} />
      </Router>,
    );
    await screen.findByTestId(/MenuItemReviewForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemForm-itemId");
    
    const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
    

    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(dateReviewedField, { target: { value: "bad-input" } });

    fireEvent.click(submitButton);

    await screen.findByText(/dateReviewed must be in ISO format/);
    expect(
      screen.getByText(/dateReviewed must be in ISO format/),
    ).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-submit");
    const submitButton = screen.getByTestId("MenuItemForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Item ID is required./);
    expect(screen.getByText(/reviewerEmail is required./)).toBeInTheDocument();
    expect(screen.getByText(/stars are required./)).toBeInTheDocument();
    expect(screen.getByText(/comments are required./)).toBeInTheDocument();
    expect(screen.getByText(/dateReviewed is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <MenuItemReviewForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-itemId");

    const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
    const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
    const dateReviewedField = screen.getByTestId("MenuItemReviewForm-localDateTime");
    const starField = screen.getByTestId("MenuItemReviewForm-stars");
    const commentField = screen.getByTestId("MenuItemReview-comments")
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIdField, { target: { value: "3" } });
    fireEvent.change(reviewerEmailField, { target: { value: "oyararbas@ucsb.edu" } });
    fireEvent.change(dateReviewedField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(starField, { target: { value: "4" } });
    fireEvent.change(commentField, { target: { value: "Absolutely amazing!" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/ItemId is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/dateReviewed must be in ISO format/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/reviewerEmail is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/stars are required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/comments are required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/dateReviewed is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemForm-cancel");
    const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
