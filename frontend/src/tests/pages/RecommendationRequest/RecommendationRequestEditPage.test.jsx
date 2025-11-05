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
    useParams: vi.fn(() => ({ id: 17 })),
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
      axiosMock2.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock2.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
      axiosMock2.onGet("/api/recommendationrequests", { params: { id: 17 } }).timeout();
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

      await screen.findByText(/Welcome/);
      await screen.findByText("Edit RecommendationRequest");
      expect(screen.queryByTestId("RecommendationRequestForm-code")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock2 = new AxiosMockAdapter(axios);
      axiosMock2.reset();
      axiosMock2.resetHistory();
      axiosMock2.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock2.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
      axiosMock2.onGet("/api/recommendationrequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        code: "CMPSC 156",
        requesterEmail: "student@ucsb.edu",
        professorEmail: "prof@ucsb.edu",
        explanation: "Grad school applications",
        dateRequested: "2022-03-14",
        dateNeeded: "2022-04-01",
        done: false,
      });
      axiosMock2.onPut("/api/recommendationrequests").reply(200, {
        id: "17",
        code: "CMPSC 156",
        requesterEmail: "student@ucsb.edu",
        professorEmail: "prof@ucsb.edu",
        explanation: "Fellowship recommendation",
        dateRequested: "2022-03-15",
        dateNeeded: "2022-04-10",
        done: true,
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
      await screen.findByTestId("RecommendationRequestForm-code");
      expect(screen.getByTestId("RecommendationRequestForm-code")).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-code");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const codeField = screen.getByTestId("RecommendationRequestForm-code");
      const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
      const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
      const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
      const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
      const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
      const doneField = screen.getByTestId("RecommendationRequestForm-done");
      const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

      expect(idField).toHaveValue("17");
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

      await screen.findByTestId("RecommendationRequestForm-code");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const codeField = screen.getByTestId("RecommendationRequestForm-code");
      const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
      const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
      const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
      const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
      const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
      const doneField = screen.getByTestId("RecommendationRequestForm-done");
      const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(codeField).toHaveValue("CMPSC 156");

      fireEvent.change(explanationField, { target: { value: "Fellowship recommendation" } });
      fireEvent.change(dateRequestedField, { target: { value: "2022-03-15" } });
      fireEvent.change(dateNeededField, { target: { value: "2022-04-10" } });
      fireEvent.click(doneField); // toggle to true

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast2).toBeCalled());
      expect(mockToast2).toBeCalledWith(
        "RecommendationRequest Updated - id: 17 code: CMPSC 156",
      );
      expect(mockNavigate2).toBeCalledWith({ to: "/recommendationrequests" });

      expect(axiosMock2.history.put.length).toBe(1); // times called
      expect(axiosMock2.history.put[0].params).toEqual({ id: 17 });
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
