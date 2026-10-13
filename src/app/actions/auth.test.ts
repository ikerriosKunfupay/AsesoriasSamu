import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  resend: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      resend: mocks.resend,
      signUp: mocks.signUp,
    },
  })),
}));

import { registerAction, resendConfirmationAction } from "./auth";

function emailForm(email: string) {
  const formData = new FormData();
  formData.set("email", email);
  return formData;
}

function registrationForm(email: string) {
  const formData = new FormData();
  formData.set("fullName", "Cliente de prueba");
  formData.set("email", email);
  formData.set("password", "clave-segura");
  formData.set("confirmation", "clave-segura");
  return formData;
}

describe("reenvío de confirmación", () => {
  beforeEach(() => {
    mocks.resend.mockReset();
    mocks.signUp.mockReset();
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

describe("registro con correo existente", () => {
  beforeEach(() => {
    mocks.signUp.mockReset();
    process.env.NEXT_PUBLIC_APP_URL = "https://team-ortega.vercel.app";
  });

  it("no promete un correo cuando Supabase devuelve una identidad ofuscada", async () => {
    mocks.signUp.mockResolvedValue({
      data: {
        session: null,
        user: { identities: [] },
      },
      error: null,
    });
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);

    const result = await registerAction(
      { status: "idle" },
      registrationForm("existente@example.com"),
    );

    expect(result.status).toBe("error");
    expect(result.message).toContain("no ha generado una cuenta nueva");
    expect(info).toHaveBeenCalledWith("auth.signup_existing_identity");
    info.mockRestore();
  });

  it("mantiene la confirmación para una identidad recién creada", async () => {
    mocks.signUp.mockResolvedValue({
      data: {
        session: null,
        user: {
          identities: [{ id: "identity-1" }],
          confirmation_sent_at: "2026-10-13T17:00:00.000Z",
        },
      },
      error: null,
    });
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);

    const result = await registerAction(
      { status: "idle" },
      registrationForm("nuevo@example.com"),
    );

    expect(result.status).toBe("success");
    expect(result.message).toContain("Revisa tu correo");
    expect(info).toHaveBeenCalledWith("auth.signup_created", {
      confirmationRequested: true,
    });
    info.mockRestore();
  });
});
