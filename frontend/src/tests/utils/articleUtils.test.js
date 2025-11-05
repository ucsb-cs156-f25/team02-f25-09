import { toast } from "react-toastify";
import { onDeleteSuccess, cellToAxiosParamsDelete } from "main/utils/articleUtils";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("articleUtils", () => {
  describe("onDeleteSuccess", () => {
    test("it should log to the console and show a toast", () => {
      const consoleSpy = vi.spyOn(console, "log");
      onDeleteSuccess("Article deleted");
      expect(consoleSpy).toHaveBeenCalledWith("Article deleted");
      expect(toast).toHaveBeenCalledWith("Article deleted");
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("it should return the correct object", () => {
      const cell = {
        row: {
          original: {
            id: 42,
          },
        },
      };
      const result = cellToAxiosParamsDelete(cell);
      expect(result).toEqual({
        url: "/api/articles",
        method: "DELETE",
        params: {
          id: 42,
        },
      });
    });
  });
});
