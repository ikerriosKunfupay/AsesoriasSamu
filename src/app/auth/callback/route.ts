import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  accountChangeCookieName,
  type AccountChangeKind,
  verifyAccountChangeToken,
} from "@/lib/auth/account-change-token";
import { createClient } from "@/lib/supabase/server";

function isAccountChangeKind(value: string | null): value is AccountChangeKind {
  return value === "email" || value === "password";
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requestedNext = request.nextUrl.searchParams.get("next") ?? "/app/inicio";
  const safeNext = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/app/inicio";
  const changeKind = request.nextUrl.searchParams.get("settings_change");
  const proof = request.nextUrl.searchParams.get("proof") ?? undefined;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const response = NextResponse.redirect(new URL(safeNext, request.url));
      if (isAccountChangeKind(changeKind)) {
        const expectedDestination = changeKind === "email"
          ? "/app/ajustes/correo"
          : "/app/ajustes/contrasena";
        let validProof = false;
        try {
          validProof = safeNext === expectedDestination
            && verifyAccountChangeToken(proof, changeKind, data.user.id);
        } catch {
          validProof = false;
        }

        if (!validProof) {
          return NextResponse.redirect(new URL("/app/ajustes?verification=invalid", request.url));
        }

        response.cookies.set(accountChangeCookieName(changeKind), proof!, {
          httpOnly: true,
          maxAge: 10 * 60,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
      return response;
    }
  }

  return NextResponse.redirect(new URL("/login?error=invalid-link", request.url));
}
