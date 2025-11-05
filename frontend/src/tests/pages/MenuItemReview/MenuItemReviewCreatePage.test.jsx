import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("MenuItemReview tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-itemId"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const menuItemReview = {
      itemId: 5,
      reviewerEmail: "yorble@ucsb.edu",
      stars: 4,
      dateReviewed: "2022-02-02T00:00",
      comments: "Great"
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, menuItemReview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-itemId"),
      ).toBeInTheDocument();
    });

    const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
    const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
    const starField = screen.getByTestId("MenuItemReviewForm-stars");
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");


    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIdField, { target: { value: 5 } });
    fireEvent.change(reviewerEmailField, { target: { value: "yorble@ucsb.edu" } });
    fireEvent.change(dateReviewedField, {
      target: { value: "2022-02-02T00:00" },
    });
    fireEvent.change(starField, { target: { value: 4 } });
    fireEvent.change(commentsField, { target: { value: "Hello" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      dateReviewed: "2022-02-02T00:00",
      reviewerEmail: "yorble@ucsb.edu",
      itemId: "5",
      stars: "4",
      comments: "Hello"
    });

    expect(mockToast).toBeCalledWith(
      "New menuItemReview Created - itemId: 5 reviewerEmail: yorble@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
  });
});
