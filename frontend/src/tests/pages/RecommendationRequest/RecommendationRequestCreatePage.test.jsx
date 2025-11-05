import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast3 = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast3(x)),
  };
});

const mockNavigate3 = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate3(x);
      return null;
    }),
  };
});

describe("RecommendationRequestCreatePage tests", () => {
  const axiosMock3 = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock3.reset();
    axiosMock3.resetHistory();
    axiosMock3.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock3.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
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
      expect(screen.getByTestId("RecommendationRequestForm-code")).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it posts JSON to the backend", async () => {
    const queryClient = new QueryClient();
    const created = {
      id: 17,
      code: "CMPSC 156",
      requesterEmail: "student@ucsb.edu",
      professorEmail: "prof@ucsb.edu",
      explanation: "Grad school applications",
      dateRequested: "2022-03-14",
      dateNeeded: "2022-04-01",
      done: false,
    };

    axiosMock3.onPost("/api/recommendationrequest/post").reply(202, created);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("RecommendationRequestForm-code")).toBeInTheDocument();
    });

    const codeField = screen.getByTestId("RecommendationRequestForm-code");
    const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
    const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
    const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
    const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
    const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(codeField, { target: { value: "CMPSC 156" } });
    fireEvent.change(requesterEmailField, { target: { value: "student@ucsb.edu" } });
    fireEvent.change(professorEmailField, { target: { value: "prof@ucsb.edu" } });
    fireEvent.change(explanationField, { target: { value: "Grad school applications" } });
    fireEvent.change(dateRequestedField, { target: { value: "2022-03-14" } });
    fireEvent.change(dateNeededField, { target: { value: "2022-04-01" } });
    // done defaults to unchecked; leave as false

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock3.history.post.length).toBe(1));

    // For RecommendationRequest we send JSON in the body (not query params)
    expect(axiosMock3.history.post[0].data).toBe(
      JSON.stringify({
        code: "CMPSC 156",
        requesterEmail: "student@ucsb.edu",
        professorEmail: "prof@ucsb.edu",
        explanation: "Grad school applications",
        dateRequested: "2022-03-14",
        dateNeeded: "2022-04-01",
        done: false,
      }),
    );

    expect(mockToast3).toBeCalledWith(
      "New recommendationRequest Created - id: 17 code: CMPSC 156",
    );
    expect(mockNavigate3).toBeCalledWith({ to: "/recommendationrequest" });
  });
});
