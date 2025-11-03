import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import { UCSBDiningCommonsMenuItemsFixtures } from "fixtures/UCSBDiningCommonsMenuItems";
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

describe("UCSBDiningCommonsMenuItemsForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>,
    );
    await screen.findByText(/diningCommonsCode/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/diningCommonsCode/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a UCSBDiningCommonsMenuItems", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm initialContents={UCSBDiningCommonsMenuItemsFixtures.oneItems} />
      </Router>,
    );
    await screen.findByTestId(/UCSBDiningCommonsMenuItemsForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBDiningCommonsMenuItemsForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
    const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "bad-input" } });
    fireEvent.change(nameField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/diningCommonsCode must be in the format String/);
    expect(
      screen.getByText(/diningCommonsCode must be in the format String/),
    ).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-submit");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/diningCommonsCode is required./);
    expect(screen.getByText(/Name is required./)).toBeInTheDocument();
    expect(screen.getByText(/Station is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");

    const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
    const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "ortega" } });
    fireEvent.change(nameField, { target: { value: "pasta" } });
    fireEvent.change(stationField, {
      target: { value: "italian" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/diningCommonsCode must be in the format String/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Name and Station must be in format String/),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-cancel");
    const cancelButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
