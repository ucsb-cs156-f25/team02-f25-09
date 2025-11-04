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

  const queryClient = new QueryClient();
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
        expect(screen.getByLabelText("diningCommonsCode")).toBeInTheDocument();
        });
    });

  test("when you fill in the form and hit submit, it makes a request to the backend, redirects to /ucsbdiningcommons", async () => {
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
      expect(
        screen.getByLabelText("diningCommonsCode"),
      ).toBeInTheDocument();
    });

    const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode");
    expect(diningCommonsCodeField).toBeInTheDocument();

    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-name");
    expect(nameField).toBeInTheDocument();
    
    const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-station");
    expect(stationField).toBeInTheDocument();
    
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemsForm-submit");
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(diningCommonsCodeField, { target: { value: "ortega" } });
    fireEvent.change(nameField, { target: { value: "pasta" } });
    fireEvent.change(stationField, {
      target: { value: "italian" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "ortega",
      name: "pasta",
      station: "italian",
    });

    expect(mockToast).toBeCalledWith(
      "New UCSBDiningCommonsMenuItems Created - id: 1 name: pasta",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsbdiningcommons" });
  });
});
