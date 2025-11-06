import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { UCSBDiningCommonsMenuItemsFixtures } from "fixtures/UCSBDiningCommonsMenuItems";
import UCSBDiningCommonsMenuItemsTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/UCSBDiningCommonsMenuItemsUtils";
import * as toastify from "react-toastify";
import AxiosMockAdapter from "axios-mock-adapter";

vi.mock("react-toastify", () => {
  return {
    toast: vi.fn(),
  };
});

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsTable
            items={UCSBDiningCommonsMenuItemsFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["id", "diningCommonsCode", "Name", "Station"];
    const expectedFields = ["id", "diningCommonsCode", "name", "station"];
    const testId = "UCSBDiningCommonsMenuItemsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`),
    ).toHaveTextContent(
      UCSBDiningCommonsMenuItemsFixtures.threeItems[0].diningCommonsCode,
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-diningCommonsCode`),
    ).toHaveTextContent(
      UCSBDiningCommonsMenuItemsFixtures.threeItems[1].diningCommonsCode,
    );

    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Has the expected colum headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsTable
            items={UCSBDiningCommonsMenuItemsFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["id", "diningCommonsCode", "Name", "Station"];
    const expectedFields = ["id", "diningCommonsCode", "name", "station"];
    const testId = "UCSBDiningCommonsMenuItemsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`),
    ).toHaveTextContent(
      UCSBDiningCommonsMenuItemsFixtures.threeItems[0].diningCommonsCode,
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-diningCommonsCode`),
    ).toHaveTextContent(
      UCSBDiningCommonsMenuItemsFixtures.threeItems[1].diningCommonsCode,
    );

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsTable
            items={UCSBDiningCommonsMenuItemsFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`UCSBDiningCommonsMenuItemsTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const editButton = screen.getByTestId(
      `UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/ucsbdiningcommonsmenuitems/edit/1"),
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/ucsbdiningcommonsmenuitems")
      .reply(200, { message: "Item deleted" });

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsTable
            items={UCSBDiningCommonsMenuItemsFixtures.threeItems}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered

    await waitFor(() => {
      expect(
        screen.getByTestId(`UCSBDiningCommonsMenuItemsTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const deleteButton = screen.getByTestId(
      `UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    // assert - check that the delete endpoint was called

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].url).toBe("/api/ucsbdiningcommonsmenuitems");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });

  test("onDeleteSuccess logs message and calls toast", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    onDeleteSuccess("Test message");

    expect(consoleSpy).toHaveBeenCalledWith("Test message");
    expect(toastify.toast).toHaveBeenCalledWith("Test message");

    consoleSpy.mockRestore();
  });

  test("cellToAxiosParamsDelete returns correct axios params", () => {
    const cell = { row: { original: { id: 123 } } };
    const result = cellToAxiosParamsDelete(cell);

    expect(result).toEqual({
      url: "/api/ucsbdiningcommonsmenuitems",
      method: "DELETE",
      params: { id: 123 },
    });
  });
});
