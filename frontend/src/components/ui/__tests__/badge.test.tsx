import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
  });

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText("Secondary Badge");
    expect(badge).toBeInTheDocument();
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Error Badge</Badge>);
    const badge = screen.getByText("Error Badge");
    expect(badge).toBeInTheDocument();
  });
});
