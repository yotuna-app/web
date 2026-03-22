import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Toast from "@/components/common/Toast";

describe("Toast", () => {
  it("renders message when visible", () => {
    render(<Toast message="Copied!" visible={true} />);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("applies opacity-0 class when not visible", () => {
    render(<Toast message="Hidden" visible={false} />);
    const el = screen.getByText("Hidden");
    expect(el.className).toContain("opacity-0");
  });

  it("applies opacity-100 class when visible", () => {
    render(<Toast message="Shown" visible={true} />);
    const el = screen.getByText("Shown");
    expect(el.className).toContain("opacity-100");
  });
});

describe("PageLoader", async () => {
  const { default: PageLoader } = await import("@/components/common/PageLoader");

  it("renders a loading spinner", () => {
    const { container } = render(<PageLoader />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

describe("SearchBar", async () => {
  const userEvent = (await import("@testing-library/user-event")).default;
  const { default: SearchBar } = await import("@/components/common/SearchBar");

  it("renders with placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} placeholder="Search..." />);
    const input = screen.getByPlaceholderText("Search...");
    await userEvent.type(input, "jazz");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows clear button when value is not empty", () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    const clearButton = screen.getByRole("button");
    expect(clearButton).toBeInTheDocument();
  });

  it("does not show clear button when value is empty", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onChange with empty string when clearing", async () => {
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);
    const clearButton = screen.getByRole("button");
    await userEvent.click(clearButton);
    expect(onChange).toHaveBeenCalledWith("");
  });
});
