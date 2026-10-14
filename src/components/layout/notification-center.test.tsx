import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NotificationCenter } from "./notification-center";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("NotificationCenter", () => {
  it("muestra los avisos, enlaza al registro y permite marcarlos como leídos", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        notifications: [
          {
            id: "11111111-1111-4111-8111-111111111111",
            category: "lead",
            title: "Nueva solicitud de información",
            message: "Ana quiere saber más sobre las asesorías.",
            href: "/admin/interesados#interesado-1",
            read_at: null,
            created_at: "2026-10-14T08:30:00.000Z",
          },
        ],
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<NotificationCenter />);

    const trigger = await screen.findByRole("button", { name: "Notificaciones: 1 sin leer" });
    fireEvent.click(trigger);

    expect(screen.getByRole("region", { name: "Centro de notificaciones" })).toBeInTheDocument();
    expect(screen.getByText("Ana quiere saber más sobre las asesorías.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nueva solicitud de información/i })).toHaveAttribute(
      "href",
      "/admin/interesados#interesado-1",
    );

    fireEvent.click(screen.getByRole("button", { name: "Marcar todo como leído" }));
    await waitFor(() => expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/admin/notifications",
      expect.objectContaining({ method: "PATCH" }),
    ));
    expect(screen.getByRole("button", { name: "Notificaciones" })).toBeInTheDocument();
  });
});
