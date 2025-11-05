import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemsCreatePage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage";
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

describe("UCSBDiningCommonsMenuItemsCreatePage tests", () => {
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
          <UCSBDiningCommonsMenuItemsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode")).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend, redirects to /UCSBDiningCommonsMenuItems", async () => {
    const queryClient = new QueryClient();
    const item = {
      id: 1,
      diningCommonsCode: "ortega",
      name: "pasta",
      station: "italian",
    };

    axiosMock.onPost("/api/ucsbdiningcommons/post").reply(202, item);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode")).toBeInTheDocument();
    });

    const diningCommonsCodeField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemsForm-diningCommonsCode",
    );

    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");

    const stationField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemsForm-station",
    );
    
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemsForm-submit",
    );

    fireEvent.change(diningCommonsCodeField, { target: { value: "ortega" } });
    fireEvent.change(nameField, { target: { value: "pasta" } });
    fireEvent.change(stationField, {
      target: { value: "italian" },
    });
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].data).toEqual({
      station: "italian",
      name: "pasta",
      diningCommonsCode: "ortega",
    });

    expect(mockToast).toBeCalledWith(
      "New UCSBDiningCommonsMenuItems Created - id: 1 name: pasta",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/UCSBDiningCommonsMenuItems" });
  });
});
