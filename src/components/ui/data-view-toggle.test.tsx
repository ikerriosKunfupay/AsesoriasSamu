import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DataViewToggle, usePersistedDataView } from "./data-view-toggle";

function Harness() {
  const [view, setView] = usePersistedDataView("test:data-view");
  return <DataViewToggle view={view} onChange={setView} label="Vista del listado" />;
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("DataViewToggle", () => {
  it("alterna y recuerda tabla, lista o galería", () => {
    render(<Harness />);
    expect(screen.getByRole("button", { name: "Tabla" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Galería" }));
    expect(screen.getByRole("button", { name: "Galería" })).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("test:data-view")).toBe("gallery");
  });
});
