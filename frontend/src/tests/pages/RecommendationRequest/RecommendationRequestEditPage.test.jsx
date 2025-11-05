import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestsEditPage from "main/pages/RecommendationRequest/RecommendationRequestsEditPage";

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
vi.mock("react-router-dom", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({ id: 17 })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("RecommendationRequestsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByText(/Welcome/);
      await screen.findByText("Edit RecommendationRequest");
      expect(screen.queryByTestId("RecommendationRequestForm-code")).not.toBeInTheDocument();

      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

      axiosMock.onGet("/api/recommendationrequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        code: "CS156",
        requesterEmail: "lauren@ucsb.edu",
        professorEmail: "prof@ucsb.edu",
        explanation: "Please write me a recommendation.",
        dateRequested: "2025-01-01T12:00",
        dateNeeded: "2025-01-10T12:00",
        done: false,
      });

      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: 17,
        code: "CS156-UPDATED",
        requesterEmail: "lauren@ucsb.edu",
        professorEmail: "prof@ucsb.edu",
        explanation: "Updated explanation",
        dateRequested: "2025-01-02T09:00",
        dateNeeded: "2025-01-15T17:00",
        done: true,
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
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByText(/Welcome/);
      await screen.findByTestId("RecommendationRequestForm-code");
      expect(screen.getByTestId("RecommendationRequestForm-code")).toBeInTheDocument();
    });

    test("is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("RecommendationRequestForm-code");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const code = screen.getByTestId("RecommendationRequestForm-code");
      const requesterEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
      const professorEmail = screen.getByTestId("RecommendationRequestForm-professorEmail");
      const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
      const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
      const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
      const done = screen.getByTestId("RecommendationRequestForm-done");
      const submit = screen.getByTestId("RecommendationRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(code).toHaveValue("CS156");
      expect(requesterEmail).toHaveValue("lauren@ucsb.edu");
      expect(professorEmail).toHaveValue("prof@ucsb.edu");
      expect(explanation).toHaveValue("Please write me a recommendation.");
      expect(dateRequested).toHaveValue("2025-01-01T12:00");
      expect(dateNeeded).toHaveValue("2025-01-10T12:00");
      expect(submit).toBeInTheDocument();
    });

    test("changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("RecommendationRequestForm-code");

      const code = screen.getByTestId("RecommendationRequestForm-code");
      const requesterEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
      const professorEmail = screen.getByTestId("RecommendationRequestForm-professorEmail");
      const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
      const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
      const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
      const done = screen.getByTestId("RecommendationRequestForm-done");
      const submit = screen.getByTestId("RecommendationRequestForm-submit");

      fireEvent.change(code, { target: { value: "CS156-UPDATED" } });
      fireEvent.change(requesterEmail, { target: { value: "lauren@ucsb.edu" } });
      fireEvent.change(professorEmail, { target: { value: "prof@ucsb.edu" } });
      fireEvent.change(explanation, { target: { value: "Updated explanation" } });
      fireEvent.change(dateRequested, { target: { value: "2025-01-02T09:00" } });
      fireEvent.change(dateNeeded, { target: { value: "2025-01-15T17:00" } });

      fireEvent.click(submit);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        expect.stringMatching(/RecommendationRequest updated/i)
      );
      expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequests" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          code: "CS156-UPDATED",
          requesterEmail: "lauren@ucsb.edu",
          professorEmail: "prof@ucsb.edu",
          explanation: "Updated explanation",
          dateRequested: "2025-01-02T09:00",
          dateNeeded: "2025-01-15T17:00",
          done: true,
        })
      );
    });
  });
});
