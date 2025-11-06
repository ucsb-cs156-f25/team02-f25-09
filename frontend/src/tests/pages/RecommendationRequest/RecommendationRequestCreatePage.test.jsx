import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  const actual = await importOriginal();
  return {
    ...actual,
    // Provide a simple Link that renders an anchor so Navbar.Brand as={Link} works.
    Link: ({ to, children, ...rest }) => (
      <a href={typeof to === "string" ? to : "#"} {...rest}>
        {children}
      </a>
    ),
    // Intercept Navigate to assert redirects
    Navigate: vi.fn((props) => {
      mockNavigate(props);
      return null; // don’t actually render anything
    }),
  };
});

describe("RecommendationRequestCreatePage tests", () => {
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
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequests", async () => {
    const queryClient = new QueryClient();
    const created = {
      id: 11,
      code: "laurenchorr",
      requesterEmail: "laurencho@ucsb.edu",
      professorEmail: "pconrad@ucsb.edu",
      explanation: "Please write me a recommendation.",
      dateRequested: "2025-01-01T12:00Z",
      dateNeeded: "2025-01-10T12:00Z",
      done: false,
    };

    axiosMock.onPost("/api/recommendationrequests/post").reply(202, created);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const codeInput = screen.getByLabelText("Code");
    expect(codeInput).toBeInTheDocument();

    const requesterEmailInput = screen.getByLabelText("Requester Email");
    expect(requesterEmailInput).toBeInTheDocument();

    const professorEmailInput = screen.getByLabelText("Professor Email");
    expect(professorEmailInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const dateRequestedInput = screen.getByLabelText("Date Requested (ISO)");
    expect(dateRequestedInput).toBeInTheDocument();

    const dateNeededInput = screen.getByLabelText("Date Needed (ISO)");
    expect(dateNeededInput).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Code"), {
      target: { value: "laurenchorr" },
    });
    fireEvent.change(screen.getByLabelText("Requester Email"), {
      target: { value: "laurencho@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Professor Email"), {
      target: { value: "pconrad@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: "Please write me a recommendation." },
    });
    fireEvent.change(screen.getByLabelText("Date Requested (ISO)"), {
      target: { value: "2025-01-01T12:00" },
    });
    fireEvent.change(screen.getByLabelText("Date Needed (ISO)"), {
      target: { value: "2025-01-10T12:00" },
    });

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      code: "laurenchorr",
      requesterEmail: "laurencho@ucsb.edu",
      professorEmail: "pconrad@ucsb.edu",
      explanation: "Please write me a recommendation.",
      dateRequested: "2025-01-01T12:00Z",
      dateNeeded: "2025-01-10T12:00Z",
      done: false,
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New Recommendation Request Created - id: 11 requester email: laurencho@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequests" });
  });
});
