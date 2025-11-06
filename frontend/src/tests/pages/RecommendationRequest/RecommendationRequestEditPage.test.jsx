import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "tests/testutils/mockConsole";
import { beforeEach, afterEach } from "vitest";

const mockToast2 = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast2(x)),
  };
});

const mockNavigate2 = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({ id: 11 })),
    Navigate: vi.fn((x) => {
      mockNavigate2(x);
      return null;
    }),
  };
});

let axiosMock2;
describe("RecommendationRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock2 = new AxiosMockAdapter(axios);
      axiosMock2
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock2
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock2
        .onGet("/api/recommendationrequests", { params: { id: 11 } })
        .timeout();
    });

    afterEach(() => {
      mockToast2.mockClear();
      mockNavigate2.mockClear();
      axiosMock2.restore();
      axiosMock2.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit RecommendationRequest");
      expect(
        screen.queryByTestId("RecommendationRequestForm-requesterEmail"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock2 = new AxiosMockAdapter(axios);
      axiosMock2.reset();
      axiosMock2.resetHistory();
      axiosMock2
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock2
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock2
        .onGet("/api/recommendationrequests", { params: { id: 11 } })
        .reply(200, {
          id: 11,
          requesterEmail: "student@ucsb.edu",
          professorEmail: "prof@ucsb.edu",
          explanation: "Grad school applications",
          dateRequested: "2022-03-14",
          dateNeeded: "2022-04-01",
        });
      axiosMock2.onPut("/api/recommendationrequests").reply(200, {
        id: "11",
        requesterEmail: "student@ucsb.edu",
        professorEmail: "prof@ucsb.edu",
        explanation: "Fellowship recommendation",
        dateRequested: "2022-03-15",
        dateNeeded: "2022-04-10",
      });
    });

    afterEach(() => {
      mockToast2.mockClear();
      mockNavigate2.mockClear();
      axiosMock2.restore();
      axiosMock2.resetHistory();
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
      await screen.getByLabelText("Code");
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

      const idField = screen.getByLabelText("id");
      const codeField = screen.getByLabelText("Code");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText("Date Requested (ISO)");
      const dateNeededField = screen.getByLabelText("Date Needed (ISO)");
      const doneField = screen.getByLabelText("Done");

      const submitButton = screen.getAllByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toHaveValue("11");
      expect(codeField).toHaveValue("CMPSC 156");
      expect(requesterEmailField).toHaveValue("student@ucsb.edu");
      expect(professorEmailField).toHaveValue("prof@ucsb.edu");
      expect(explanationField).toHaveValue("Grad school applications");
      expect(dateRequestedField).toHaveValue("2022-03-14");
      expect(dateNeededField).toHaveValue("2022-04-01");
      expect(doneField).not.toBeChecked();
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

      await screen.getByLabelText("Code");

      const idField = screen.getByLabelText("id");
      const codeField = screen.getByLabelText("Code");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText("Date Requested (ISO)");
      const dateNeededField = screen.getByLabelText("Date Needed (ISO)");
      const doneField = screen.getByLabelText("Done");

      const submitButton = screen.getAllByTestId("Update");

      expect(idField).toHaveValue("11");
      expect(codeField).toHaveValue("CMPSC 156");

      fireEvent.change(explanationField, {
        target: { value: "Fellowship recommendation" },
      });
      fireEvent.change(dateRequestedField, { target: { value: "2022-03-15" } });
      fireEvent.change(dateNeededField, { target: { value: "2022-04-10" } });
      fireEvent.click(doneField); // toggle to true

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast2).toBeCalled());
      expect(mockToast2).toBeCalledWith(
        "RecommendationRequest Updated - id: 11 code: CMPSC 156",
      );
      expect(mockNavigate2).toBeCalledWith({ to: "/recommendationrequests" });

      expect(axiosMock2.history.put.length).toBe(1); // times called
      expect(axiosMock2.history.put[0].params).toEqual({ id: 11 });
      expect(axiosMock2.history.put[0].data).toBe(
        JSON.stringify({
          code: "CMPSC 156",
          requesterEmail: "student@ucsb.edu",
          professorEmail: "prof@ucsb.edu",
          explanation: "Fellowship recommendation",
          dateRequested: "2022-03-15",
          dateNeeded: "2022-04-10",
          done: true,
        }),
      ); // posted object
    });
  });
});
