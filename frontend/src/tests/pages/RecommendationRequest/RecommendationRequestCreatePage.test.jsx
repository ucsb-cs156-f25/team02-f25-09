import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {
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
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

 
    await waitFor(() => {
      expect(screen.getByLabelText("Code")).toBeInTheDocument();
    });

  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {

      id: 11,
      code: "karenchorr",
      requesterEmail: "karencho@ucsb.edu",
      professorEmail: "laurencho@ucsb.edu",
      explanation: "request for recommendation request for college application",
      dateRequested: "2022-01-02T00:00",
      dateNeeded: "2022-02-02T00:00",
      done: false,
    };

    axiosMock.onPost("/api/recommendationrequests/post").reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Code")).toBeInTheDocument();
    });

    const code = screen.getByLabelText("Code");
    const requesterEmail = screen.getByLabelText("Requester Email");
    const professorEmail = screen.getByLabelText("Professor Email");
    const explanation = screen.getByLabelText("Explanation");
    const dateRequested = screen.getByLabelText("Date Requested (ISO)");
    const dateNeeded = screen.getByLabelText("Date Needed (ISO)");
    const done = screen.getByLabelText("Done");

    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(code, { target: { value: "karenchorr" } });
    fireEvent.change(requesterEmail, { target: { value: "karencho@ucsb.edu" } });
    fireEvent.change(professorEmail, { target: { value: "laurencho@ucsb.edu" } });
    fireEvent.change(explanation, { target: { value: "request for recommendation request for college application" } });
    fireEvent.change(dateRequested, { target: { value: "2022-01-02T00:00" } });
    fireEvent.change(dateNeeded, { target: { value: "2022-02-02T00:00" } });
    fireEvent.change(done, { target: { value: "false" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      code: "karenchorr",
      requesterEmail: "karencho@ucsb.edu",
      professorEmail: "laurencho@ucsb.edu",
      explanation: "request for recommendation request for college application",
      dateRequested: "2022-01-02T00:00",
      dateNeeded: "2022-02-02T00:00",
      done: false,
    });

    expect(mockToast).toBeCalledWith(
      "New Recommendation Request Created - id: 11 code: karenchorr",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequests" });
  });
});
