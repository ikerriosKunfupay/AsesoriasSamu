import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  resend: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { resend: mocks.resend } })),
}));

import { resendConfirmationAction } from "./auth";

function emailForm(email: string) {
  const formData = new FormData();
  formData.set("email", email);
  return formData;
}

describe("reenvío de confirmación", () => {
  beforeEach(() => {
    mocks.resend.mockReset();
    process.env.NEXT_PUBLIC_APP_URL = "https://team-ortega.vercel.app";
  });

  it("solicita un nuevo correo con el callback del cuestionario", async () => {
    mocks.resend.mockResolvedValue({ error: null });

    const result = await resendConfirmationAction(
      { status: "idle" },
      emailForm("cliente@example.com"),
    );

    expect(mocks.resend).toHaveBeenCalledWith({
      type: "signup",
      email: "cliente@example.com",
      options: {
        emailRedirectTo: "https://team-ortega.vercel.app/auth/callback?next=/app/cuestionario",
      },
    });
    expect(result.status).toBe("success");
  });

  it("explica el intervalo mínimo cuando Supabase limita el reenvío", async () => {
    mocks.resend.mockResolvedValue({
      error: { status: 429, code: "over_email_send_rate_limit" },
    });

    const result = await resendConfirmationAction(
      { status: "idle" },
      emailForm("cliente@example.com"),
    );

    expect(result).toMatchObject({ status: "error" });
    expect(result.message).toContain("un minuto");
  });

  it("rechaza correos no válidos sin llamar a Supabase", async () => {
    const result = await resendConfirmationAction(
      { status: "idle" },
      emailForm("correo-invalido"),
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors?.email).toBeDefined();
    expect(mocks.resend).not.toHaveBeenCalled();
  });

  it("no presenta como enviado un error del proveedor", async () => {
    mocks.resend.mockResolvedValue({
      error: { status: 500, code: "unexpected_failure" },
    });

    const result = await resendConfirmationAction(
      { status: "idle" },
      emailForm("cliente@example.com"),
    );

    expect(result.status).toBe("error");
    expect(result.message).toContain("No se pudo procesar");
  });
});
