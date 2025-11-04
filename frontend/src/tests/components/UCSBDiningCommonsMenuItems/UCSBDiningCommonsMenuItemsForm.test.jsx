import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm";
import { Create, Update } from "../../../stories/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsForm.stories";
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
      </Router>
    );
    await screen.findByText(/diningCommonsCode/);
    expect(screen.getByText(/Create/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a UCSBDiningCommonsMenuItems", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm initialContents={UCSBDiningCommonsMenuItemsFixtures.oneItems} />
      </Router>
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-id");
    expect(screen.getByTestId("UCSBDiningCommonsMenuItemsForm-id")).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>
    );
    const diningCommonsCodeField = await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
    const submit = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "bad-input" } });
    fireEvent.change(nameField, { target: { value: "bad-input" } });
    fireEvent.click(submit);

    await screen.findByText(/diningCommonsCode must be in the format String/);
    expect(screen.getByText(/diningCommonsCode must be in the format String/)).toBeInTheDocument();
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>
    );
    const submitButton = await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/diningCommonsCode is required./);
    expect(screen.getByText(/Name is required./)).toBeInTheDocument();
    expect(screen.getByText(/Station is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = vi.fn();
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm submitAction={mockSubmitAction} />
      </Router>
    );

    const diningCommonsCodeField = await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
    const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "ortega" } });
    fireEvent.change(nameField, { target: { value: "pasta" } });
    fireEvent.change(stationField, { target: { value: "italian" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm />
      </Router>
    );
    const cancelButton = await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-cancel");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("submits correctly in edit mode (with initialContents)", async () => {
    const mockSubmitAction = vi.fn();
    render(
      <Router>
        <UCSBDiningCommonsMenuItemsForm
          submitAction={mockSubmitAction}
          initialContents={UCSBDiningCommonsMenuItemsFixtures.oneItems}
        />
      </Router>
    );

    const nameField = await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-name");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

    fireEvent.change(nameField, { target: { value: "updated pasta" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    const submitted = mockSubmitAction.mock.calls[0][0];
    expect(submitted.name).toBe("updated pasta");
    expect(submitted.diningCommonsCode).toBe("ortega");
    expect(submitted.station).toBe("italian");
  });

  describe("Storybook coverage", () => {
    test("Create story renders", () => {
      render(
        <Router>
          <Create {...Create.args} />
        </Router>
      );
      expect(screen.getByText(/Create/)).toBeInTheDocument();
    });

    test("Update story renders", () => {
      render(
        <Router>
          <Update {...Update.args} />
        </Router>
      );
      expect(screen.getByText(/Update/)).toBeInTheDocument();
    });
  });

  describe("Storybook coverage - submit", () => {
  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {}); // prevent popup
    vi.spyOn(console, "log").mockImplementation(() => {}); // silence console.log
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
test("Create story executes submitAction", async () => {
  render(
    <Router>
      <Create {...Create.args} />
    </Router>
  );

  const diningCommonsCodeField = await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
  const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
  const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
  const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

  fireEvent.change(diningCommonsCodeField, { target: { value: "ortega" } });
  fireEvent.change(nameField, { target: { value: "pasta" } });
  fireEvent.change(stationField, { target: { value: "italian" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledTimes(1);
    const alertCall = window.alert.mock.calls[0][0];
    expect(alertCall).toContain("Submit was clicked with data: ");  
    expect(alertCall).toContain('"diningCommonsCode":"ortega"');
    expect(console.log).toHaveBeenCalledWith(
      "Submit was clicked with data: ",
      expect.objectContaining({
        diningCommonsCode: "ortega",
        name: "pasta",
        station: "italian",
      })
    );
  });
});

test("Update story executes submitAction", async () => {
  render(
    <Router>
      <Update {...Update.args} />
    </Router>
  );

  const nameField = await screen.findByTestId("UCSBDiningCommonsMenuItemsForm-name");
  const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

  fireEvent.change(nameField, { target: { value: "new pasta" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledTimes(1);
    const alertCall = window.alert.mock.calls[0][0];
    expect(alertCall).toContain("Submit was clicked with data: ");  // Add this line
    expect(alertCall).toContain('"name":"new pasta"');
    expect(console.log).toHaveBeenCalledWith(
      "Submit was clicked with data: ",
      expect.objectContaining({
        diningCommonsCode: "ortega",
        name: "new pasta",
        station: "italian",
        })
        );
    });
    });
  });

test("diningCommonsCode field shows error styling when there's an error", async () => {
  render(
    <Router>
      <UCSBDiningCommonsMenuItemsForm />
    </Router>,
  );
  
  const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");
  fireEvent.click(submitButton);
  
  await screen.findByText(/diningCommonsCode is required./);
  const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
  
  expect(diningCommonsCodeField).toHaveClass("is-invalid");
});

test("name field shows error styling when there's an error", async () => {
  render(
    <Router>
      <UCSBDiningCommonsMenuItemsForm />
    </Router>,
  );
  
  const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");
  fireEvent.click(submitButton);
  
  await screen.findByText(/Name is required./);
  const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
  
  expect(nameField).toHaveClass("is-invalid");
});

test("station field shows error styling when there's an error", async () => {
  render(
    <Router>
      <UCSBDiningCommonsMenuItemsForm />
    </Router>,
  );
  
  const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");
  fireEvent.click(submitButton);
  
  await screen.findByText(/Station is required./);
  const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
  
  expect(stationField).toHaveClass("is-invalid");
});

test("fields do not show error styling when valid", async () => {
  const mockSubmitAction = vi.fn();

  render(
    <Router>
      <UCSBDiningCommonsMenuItemsForm submitAction={mockSubmitAction} />
    </Router>,
  );

  const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
  const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
  const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
  const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");

  fireEvent.change(diningCommonsCodeField, { target: { value: "ortega" } });
  fireEvent.change(nameField, { target: { value: "pasta" } });
  fireEvent.change(stationField, { target: { value: "italian" } });
  fireEvent.click(submitButton);

  await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  
  expect(diningCommonsCodeField).not.toHaveClass("is-invalid");
  expect(nameField).not.toHaveClass("is-invalid");
  expect(stationField).not.toHaveClass("is-invalid");
});

});
