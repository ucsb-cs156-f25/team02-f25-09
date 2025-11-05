import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequests/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Team ID")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Table or Breakout Room"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Request Time (in UTC)"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Explanation")).toBeInTheDocument();
      expect(screen.getByLabelText("Solved")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /helprequest", async () => {
    const queryClient = new QueryClient();
    const request = {
      id: 3,
      requesterEmail: "dkim876@ucsb.edu",
      teamId: "Team ID",
      tableOrBreakoutRoom: "Table 01",
      requestTime: "2025-10-10T10:10",
      explanation: "This is a test.",
      solved: "false",
    };

    axiosMock.onPost("/api/helprequest/post").reply(202, request);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Team ID")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Table or Breakout Room"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Request Time (in UTC)"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Explanation")).toBeInTheDocument();
      expect(screen.getByLabelText("Solved")).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByLabelText("Requester Email");
    expect(requesterEmailInput).toBeInTheDocument();

    const teamIdInput = screen.getByLabelText("Team ID");
    expect(teamIdInput).toBeInTheDocument();

    const tableOrBreakoutRoomInput = screen.getByLabelText(
      "Table or Breakout Room",
    );
    expect(tableOrBreakoutRoomInput).toBeInTheDocument();

    const requestTimeInput = screen.getByLabelText("Request Time (in UTC)");
    expect(requestTimeInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const solvedInput = screen.getByLabelText("Solved");
    expect(solvedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(requesterEmailInput, {
      target: { value: "changed@ucsb.edu" },
    });
    fireEvent.change(teamIdInput, {
      target: { value: "Changed Team ID" },
    });
    fireEvent.change(tableOrBreakoutRoomInput, {
      target: { value: "Changed Table" },
    });
    fireEvent.change(requestTimeInput, {
      target: { value: "2020-10-10T10:10" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "Changed Explanation" },
    });
    fireEvent.change(solvedInput, {
      target: { value: true },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "changed@ucsb.edu",
      teamId: "Changed Team ID",
      tableOrBreakoutRoom: "Changed Table",
      requestTime: "2020-10-10T10:10Z",
      explanation: "Changed Explanation",
      solved: false,
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      `New request Created - id: 3 
      requesterEmail: dkim876@ucsb.edu 
      teamId: Team ID 
      tableOrBreakoutRoom: Table 01 
      requestTime: 2025-10-10T10:10 
      explanation: This is a test. 
      solved: false`,
    );

    expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
  });
});
