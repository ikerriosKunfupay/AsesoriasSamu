import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import InviteClientPage from "./page";

vi.mock("@/app/actions/admin", () => ({
  inviteClientAction: vi.fn(),
  saveAssignmentAction: vi.fn(),
  saveClientAdminNoteAction: vi.fn(),
  saveFeeAction: vi.fn(),
  setClientStatusAction: vi.fn(),
}));

afterEach(cleanup);

describe("InviteClientPage", () => {
  it("centra la cabecera y el formulario como un único bloque", () => {
    const { container } = render(<InviteClientPage />);
    const layout = container.firstElementChild;

    expect(layout).toHaveClass("mx-auto", "w-full", "max-w-3xl");
    expect(layout?.querySelector("h1")).toHaveTextContent("Nueva invitación");
    expect(layout?.querySelector("form")).toBeInTheDocument();
  });
});
