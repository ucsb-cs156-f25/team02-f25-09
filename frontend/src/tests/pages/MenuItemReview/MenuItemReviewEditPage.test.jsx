import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "tests/testutils/mockConsole";
import { beforeEach, afterEach } from "vitest";

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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("MenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText(/Welcome/);
      await screen.findByText("Edit MenuItemReview");
      expect(
        screen.queryByTestId("menuItemReview-id"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).reply(200, {
        dateReviewed: "2022-12-25T08:00",
        reviewerEmail: "yorble@ucsb.edu",
        itemId: "4",
        stars: "5",
        comments: "Hello"
      });
      axiosMock.onPut("/api/menuitemreview").reply(200, {
        dateReviewed: "2022-12-25T08:00",
        reviewerEmail: "yorble@ucsb.edu",
        itemId: "4",
        stars: "5",
        comments: "Hello"
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText(/Welcome/);
      await screen.findByTestId("MenuItemReviewForm-id");
      expect(
        screen.getByTestId("MenuItemReviewForm-id"),
      ).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starField = screen.getByTestId("MenuItemReviewForm-stars");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");

      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(itemIdField).toHaveValue("4");
      expect(reviewerEmailField).toHaveValue("yorble@ucsb.edu");
      expect(starField).toHaveValue("5");
      expect(dateReviewedField).toHaveValue("2022-12-25T08:00");
      expect(commentsField).toHaveValue("Hello");

      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-itemId");

      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starField = screen.getByTestId("MenuItemReviewForm-stars");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");

      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(itemIdField).toHaveValue("4");
      expect(reviewerEmailField).toHaveValue("yorble@ucsb.edu");
      expect(starField).toHaveValue("5");
      expect(dateReviewedField).toHaveValue("2022-12-25T08:00");
      expect(commentsField).toHaveValue("Hello");

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(itemIdField, { target: { value: "4" } });
      fireEvent.change(reviewerEmailField, { target: { value: "yorble@ucsb.edu" } });
      fireEvent.change(dateReviewedField, {
        target: { value: "2022-12-25T08:00" },
      });
      fireEvent.change(starField, { target: { value: "5" } });
      fireEvent.change(commentsField, { target: { value: "Hello" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - ItemId: 4 reviewerEmail: yorble@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: "" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "4",
          reviewerEmail: "yorble@ucsb.edu",
          dateReviewed: "2022-12-25T08:00",
          stars: "5",
          comments: "Hello"
        }),
      ); // posted object
    });
  });
});
