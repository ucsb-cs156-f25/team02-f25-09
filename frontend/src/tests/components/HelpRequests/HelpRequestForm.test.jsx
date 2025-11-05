import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { removeZ } from "main/components/HelpRequests/RemoveZ.jsx";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("HelpRequestForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Requester Email",
    "Team ID",
    "Table or Breakout Room",
    "Request Time (in UTC)",
    "Explanation",
    "Solved",
  ];
  const testId = "HelpRequestForm";

  test("that the removeZ function works properly", () => {
    expect(removeZ("ABC")).toBe("ABC");
    expect(removeZ("ABCZ")).toBe("ABC");
  });

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    expect(screen.getByLabelText("Id")).toHaveValue(
      String(helpRequestFixtures.oneRequest.id),
    );
    expect(screen.getByLabelText("Requester Email")).toHaveValue(
      helpRequestFixtures.oneRequest.requesterEmail,
    );
    expect(screen.getByLabelText("Team ID")).toHaveValue(
      helpRequestFixtures.oneRequest.teamId,
    );
    expect(screen.getByLabelText("Table or Breakout Room")).toHaveValue(
      helpRequestFixtures.oneRequest.tableOrBreakoutRoom,
    );
    expect(screen.getByLabelText("Explanation")).toHaveValue(
      helpRequestFixtures.oneRequest.explanation,
    );

    if (helpRequestFixtures.oneRequest.solved) {
      expect(screen.getByLabelText("Solved")).toBeChecked();
    } else {
      expect(screen.getByLabelText("Solved")).not.toBeChecked();
    }
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required/);
    expect(screen.getByText(/Team ID is required/)).toBeInTheDocument();
    expect(
      screen.getByText(/Table or Breakout Room is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Request Time is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Team ID is required/)).toBeInTheDocument();
    expect(screen.getByText(/Solved is required/)).toBeInTheDocument();

    const requesterEmailInput = screen.getByTestId(`${testId}-requesterEmail`);
    fireEvent.change(requesterEmailInput, {
      target: { value: "a".repeat(256) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });
});
