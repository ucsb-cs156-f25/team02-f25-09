import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "tests/testutils/mockConsole";
import { expect } from "vitest";

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
      id: 11,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("RecommendationRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 11 } })
        .timeout();
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
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText(/Welcome/);
      await screen.findByText("Edit RecommendationRequest");
      expect(
        screen.queryByTestId("RecommendationRequestForm-code"),
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
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 11 } })
        .reply(200, {
          id: 11,
          code: "karenchorr",
          requesterEmail: "karencho@ucsb.edu",
          professorEmail: "laurencho@ucsb.edu",
          explanation:
            "request for recommendation request for college application",
          dateRequested: "2022-01-02T00:00",
          dateNeeded: "2022-02-02T00:00",
          done: false,
        });
      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: 11,
        code: "karenchorr",
        requesterEmail: "karencho@ucsb.edu",
        professorEmail: "laurencho@ucsb.edu",
        explanation:
          "request for recommendation request for college application",
        dateRequested: "2022-01-02T00:00",
        dateNeeded: "2022-02-02T00:00",
        done: false,
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
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText(/Welcome/);
      await screen.findByTestId("RecommendationRequestForm-code");
      expect(screen.getByLabelText("Code")).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.getByLabelText("Code");

      const codeField = screen.getByLabelText("Code");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText("Date Requested (ISO)");
      const dateNeededField = screen.getByLabelText("Date Needed (ISO)");
      const doneField = screen.getByLabelText("Done");

      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(codeField).toHaveValue("karenchorr");
      expect(requesterEmailField).toHaveValue("karencho@ucsb.edu");
      expect(professorEmailField).toHaveValue("laurencho@ucsb.edu");
      expect(explanationField).toHaveValue(
        "request for recommendation request for college application",
      );
      expect(dateRequestedField).toBeInTheDocument("2022-01-02T00:00");
      expect(dateNeededField).toBeInTheDocument("2022-02-02T00:00");
      expect(doneField).toBeInTheDocument("done");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Code")).toBeInTheDocument();
      });

      const idField = screen.getByLabelText("id");
      const codeField = screen.getByLabelText("Code");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText("Date Requested (ISO)");
      const dateNeededField = screen.getByLabelText("Date Needed (ISO)");
      const doneField = screen.getByLabelText("Done");

      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toHaveValue("11");
      expect(codeField).toHaveValue("karenchorr");
      expect(requesterEmailField).toHaveValue("karencho@ucsb.edu");
      expect(professorEmailField).toHaveValue("laurencho@ucsb.edu");
      expect(explanationField).toHaveValue(
        "request for recommendation request for college application",
      );
      expect(dateRequestedField).toBeInTheDocument("2022-01-02T00:00");
      expect(dateNeededField).toBeInTheDocument("2022-02-02T00:00");
      expect(doneField).toBeInTheDocument("false");

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(codeField, { target: { value: "laurenchorr" } });
      fireEvent.change(requesterEmailField, {
        target: { value: "laurencho@ucsb.edu" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "pconrad@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: {
          value: "Requesting a latter of recommendation for ERSP 2025",
        },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2025-11-05T00:00" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2025-11-15T00:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "RecommendationRequest Updated - id: 11 code: laurenchorr",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 11 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          id: 11,
          code: "laurenchorr",
          requesterEmail: "laurencho@ucsb.edu",
          professorEmail: "pconrad@ucsb.edu",
          explanation: "Requesting a latter of recommendation for ERSP 2025",
          dateRequested: "2025-11-05T00:00",
          dateNeeded: "2025-11-15T00:00",
          done: false,
        }),
      ); // posted object
    });
  });
});
