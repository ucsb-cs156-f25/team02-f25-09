import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/Create/);
    // spot-check a couple of labels/inputs exist
    expect(screen.getByLabelText(/Code/i)).toBeInTheDocument();
    expect(
      screen.getByTestId("RecommendationRequestForm-submit"),
    ).toBeInTheDocument();
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={
            recommendationRequestFixtures.oneRecommendationRequest
          }
        />
      </Router>,
    );
    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
  const mockSubmitAction = vi.fn();

  const { container } = render(
    <Router>
      <RecommendationRequestForm submitAction={mockSubmitAction} />
    </Router>,
  );

  container.querySelector("form")?.setAttribute("novalidate", "");

  fireEvent.change(
    await screen.findByTestId("RecommendationRequestForm-code"),
    { target: { value: "" } }, // code missing
  );
  fireEvent.change(
    screen.getByTestId("RecommendationRequestForm-requesterEmail"),
    { target: { value: "bad" } }, // invalid email
  );
  fireEvent.change(
    screen.getByTestId("RecommendationRequestForm-professorEmail"),
    { target: { value: "also-bad" } }, // invalid email
  );
  fireEvent.change(
    screen.getByTestId("RecommendationRequestForm-explanation"),
    { target: { value: "" } }, // now trigger required (no min length rule)
  );

  fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

  // explanation required (minLength message removed)
  expect(
    await screen.findByText(/Explanation is required\./i),
  ).toBeInTheDocument();

  const emailErrors = await screen.findAllByText(/Enter a valid email address\./i);
  expect(emailErrors).toHaveLength(2);

  await waitFor(() => expect(mockSubmitAction).not.toHaveBeenCalled());
});

  
  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    const submitButton = await screen.findByTestId(
      "RecommendationRequestForm-submit",
    );

    fireEvent.click(submitButton);

    await screen.findByText(/Code is required\./i);

    expect(
      screen.getByText(/Requester email is required\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Professor email is required\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/Date requested is required\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Date needed is required\./i)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

   const { container } = render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );

    container.querySelector("form")?.setAttribute("novalidate", "");

    const user = userEvent.setup();
    const codeField = await screen.findByTestId(
      "RecommendationRequestForm-code",
    );
    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(codeField, { target: { value: "INT-2025" } });
    fireEvent.change(requesterEmailField, {
      target: { value: "alice@ucsb.edu" },
    });
    fireEvent.change(professorEmailField, {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(explanationField, {
      target: { value: "Applying for internship; need reference." },
    });
    fireEvent.change(dateRequestedField, {
      target: { value: "2025-11-01T12:00" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2025-11-15T17:00" },
    });

    fireEvent.change(requesterEmailField, {
      target: { value: "prefix alice@ucsb.edu" }, //should fail
    });
    fireEvent.change(requesterEmailField, {
      target: { value: "alice@ucsb.edu garbage" },
    });
    await user.clear(requesterEmailField);
    await user.type(requesterEmailField, "alice@ucsb.edu");
  
    await user.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/is required\./i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Enter a valid email address\./i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Use ISO format\./i)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    const cancelButton = await screen.findByTestId(
      "RecommendationRequestForm-cancel",
    );
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
