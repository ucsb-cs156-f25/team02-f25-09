import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

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
describe("HelpRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
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
      axiosMock.onGet("/api/restaurants", { params: { id: 17 } }).timeout();
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
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Request");
      expect(
        screen.queryByTestId("HelpRequest-requesterEmail"),
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "dkim877@ucsb.edu",
        teamId: "two",
        tableOrBreakoutRoom: "table02",
        requestTime: "2025-11-02T11:12:00",
        explanation: "This is a test.",
        solved: true,
      });
      axiosMock.onPut("/api/helprequest").reply(200, {
        id: "17",
        requesterEmail: "dkim878@ucsb.edu",
        teamId: "three",
        tableOrBreakoutRoom: "table03",
        requestTime: "2025-11-03T11:12:00",
        explanation: "This is a test..?",
        solved: false,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      // const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      // const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
      // const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
      // const explanationField = screen.getByTestId("HelpRequestForm-explanation");
      // const solvedField = screen.getByTestId("HelpRequestForm-solved");

      const teamIdField = screen.getByLabelText(/Team ID/i);
      const tableOrBreakoutRoomField = screen.getByLabelText(
        /Table or Breakout Room/i,
      );
      const requestTimeField = screen.getByLabelText(/Request Time/i);
      const explanationField = screen.getByLabelText(/Explanation/i);
      const solvedField = screen.getByLabelText(/Solved/i);
      const submitButton = screen.getByRole("button", { name: /Update/i });

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("dkim877@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("two");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("table02");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2025-11-02T11:12");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("This is a test.");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "dkim878@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "three" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "table03" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2025-11-03T11:12:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "This is a test..?" },
      });
      fireEvent.click(solvedField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Request Updated - id: 17 requesterEmail: dkim878@ucsb.edu",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "dkim878@ucsb.edu",
          teamId: "three",
          tableOrBreakoutRoom: "table03",
          requestTime: "2025-11-03T11:12",
          explanation: "This is a test..?",
          solved: false,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByLabelText(/Team ID/i);
      const tableOrBreakoutRoomField = screen.getByLabelText(
        /Table or Breakout Room/i,
      );
      const requestTimeField = screen.getByLabelText(/Request Time/i);
      const explanationField = screen.getByLabelText(/Explanation/i);
      const solvedField = screen.getByLabelText(/Solved/i);
      const submitButton = screen.getByRole("button", { name: /Update/i });

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("dkim877@ucsb.edu");
      expect(teamIdField).toHaveValue("two");
      expect(tableOrBreakoutRoomField).toHaveValue("table02");
      expect(requestTimeField).toHaveValue("2025-11-02T11:12");
      expect(explanationField).toHaveValue("This is a test.");
      expect(solvedField).toBeChecked();

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "dkim878@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "three" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "table03" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2025-11-03T11:12:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "This is a test..?" },
      });
      fireEvent.click(solvedField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Request Updated - id: 17 requesterEmail: dkim878@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
    });
  });
});
