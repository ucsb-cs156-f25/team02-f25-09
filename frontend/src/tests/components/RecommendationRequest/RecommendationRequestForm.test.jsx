import { render, waitFor, fireEvent, screen } from "@testing-library/react";
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

// helper to disable native HTML5 validation so RHF errors render
const renderNV = (ui) => {
  const r = render(ui);
  r.container.querySelector("form")?.setAttribute("novalidate", "");
  return r;
};

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    renderNV(
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
    renderNV(
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

  // BAD INPUT (use explanation minLength to avoid JSDOM email quirks)
  test("Correct Error messsages on bad input", async () => {
    renderNV(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    fireEvent.change(
      await screen.findByTestId("RecommendationRequestForm-code"),
      {
        target: { value: "INT-2025" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      {
        target: { value: "alice@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
      {
        target: { value: "prof@ucsb.edu" },
      },
    );
    // Too short -> triggers minLength validation
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-explanation"),
      {
        target: { value: "hi" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
      {
        target: { value: "2025-11-01T12:00" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
      {
        target: { value: "2025-11-15T17:00" },
      },
    );

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    expect(
      await screen.findByText(/Please provide a bit more detail\./i),
    ).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    renderNV(
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

    renderNV(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );

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
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/is required\./i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Enter a valid email address\./i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Use ISO format\./i)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    renderNV(
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

  test("shows email format errors when emails are invalid", async () => {
    renderNV(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    // valid requireds except invalid emails
    fireEvent.change(await screen.findByTestId("RecommendationRequestForm-code"), {
      target: { value: "INT-2025" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-requesterEmail"), {
      target: { value: "bad" }, // invalid
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-professorEmail"), {
      target: { value: "also-bad" }, // invalid
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-explanation"), {
      target: { value: "Need reference" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-dateRequested"), {
      target: { value: "2025-11-01T12:00" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-dateNeeded"), {
      target: { value: "2025-11-15T17:00" },
    });

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    const msgs = await screen.findAllByText(/Enter a valid email address\./i);
    expect(msgs).toHaveLength(2);
  });

  test("shows ISO format errors when dates are invalid", async () => {
    renderNV(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    fireEvent.change(await screen.findByTestId("RecommendationRequestForm-code"), {
      target: { value: "INT-2025" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-requesterEmail"), {
      target: { value: "alice@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-professorEmail"), {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-explanation"), {
      target: { value: "Need reference" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-dateRequested"), {
      target: { value: "not-a-date" }, // invalid for our pattern
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-dateNeeded"), {
      target: { value: "also-not-a-date" }, // invalid for our pattern
    });

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    expect(await screen.findAllByText(/Use ISO format\./i)).toHaveLength(2);
  });

  test("applies and clears 'is-invalid' class based on errors", async () => {
    renderNV(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    const codeInput = screen.getByTestId("RecommendationRequestForm-code");
    const dateReqInput = screen.getByTestId("RecommendationRequestForm-dateRequested");

    expect(codeInput).toHaveClass("is-invalid");
    expect(dateReqInput).toHaveClass("is-invalid");

    // Fix both and fill the remaining required fields
    fireEvent.change(codeInput, { target: { value: "INT-2025" } });
    fireEvent.change(dateReqInput, { target: { value: "2025-11-01T12:00" } });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-requesterEmail"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-professorEmail"), {
      target: { value: "c@d.com" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-explanation"), {
      target: { value: "ok explanation" },
    });
    fireEvent.change(screen.getByTestId("RecommendationRequestForm-dateNeeded"), {
      target: { value: "2025-11-15T17:00" },
    });

    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    await waitFor(() => {
      expect(codeInput).not.toHaveClass("is-invalid");
      expect(dateReqInput).not.toHaveClass("is-invalid");
    });
  });
});
