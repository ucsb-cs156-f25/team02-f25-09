import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

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
vi.mock("react-router-dom", async (importOriginal) => {
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
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("RecommendationRequestForm-code")).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();

    const rr = {
      id: 17,
      code: "CS156",
      requesterEmail: "lauren@ucsb.edu",
      professorEmail: "prof@ucsb.edu",
      explanation: "Please write me a recommendation.",
      dateRequested: "2025-01-01T12:00",
      dateNeeded: "2025-01-10T12:00",
      done: true,
    };

    axiosMock.onPost("/api/recommendationrequests/post").reply(202, rr);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("RecommendationRequestForm-code")).toBeInTheDocument();
    });

    const code = screen.getByTestId("RecommendationRequestForm-code");
    const requesterEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
    const professorEmail = screen.getByTestId("RecommendationRequestForm-professorEmail");
    const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
    const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
    const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
    const done = screen.getByTestId("RecommendationRequestForm-done");
    const submit = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(code, { target: { value: rr.code } });
    fireEvent.change(requesterEmail, { target: { value: rr.requesterEmail } });
    fireEvent.change(professorEmail, { target: { value: rr.professorEmail } });
    fireEvent.change(explanation, { target: { value: rr.explanation } });
    fireEvent.change(dateRequested, { target: { value: rr.dateRequested } });
    fireEvent.change(dateNeeded, { target: { value: rr.dateNeeded } });
  
    expect(submitButton).toBeInTheDocument();
    
    // submit
    fireEvent.click(submit);

    // axios called once
    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    // request params
    expect(axiosMock.history.post[0].url).toBe("/api/recommendationrequests/post");
    expect(axiosMock.history.post[0].params).toEqual({
      code: rr.code,
      requesterEmail: rr.requesterEmail,
      professorEmail: rr.professorEmail,
      explanation: rr.explanation,
      dateRequested: rr.dateRequested,
      dateNeeded: rr.dateNeeded,
      done: true,
    });

    // toast + navigate
    expect(mockToast).toHaveBeenCalledWith(
      expect.stringContaining("New RecommendationRequest created")
    );
    expect(mockToast).toHaveBeenCalledWith(
      expect.stringContaining(`id: ${rr.id}`)
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequests" });
  });
});
