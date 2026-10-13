import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LeadPage from "./page";

vi.mock("@/app/actions/leads", () => ({
  createLeadAction: vi.fn(),
}));

afterEach(cleanup);

describe("LeadPage", () => {
  it("encaja el formulario en el viewport de escritorio sin bloquear el scroll móvil", () => {
    const { container } = render(<LeadPage />);

    expect(container.querySelector("main")).toHaveClass("lg:h-dvh", "lg:overflow-hidden");
    expect(container.querySelector("section")).toHaveClass("lg:h-dvh", "lg:overflow-hidden");
    expect(container.querySelector("main")).not.toHaveClass("h-dvh", "overflow-hidden");
  });
});
