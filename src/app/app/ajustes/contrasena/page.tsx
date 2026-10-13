import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChangePasswordDialog } from "@/components/forms/account-change-dialog";
import { accountChangeCookieName, verifyAccountChangeToken } from "@/lib/auth/account-change-token";
import { requireCompletedClient } from "@/lib/auth/current-user";

export default async function ChangePasswordPage() {
  const user = await requireCompletedClient();
  const token = (await cookies()).get(accountChangeCookieName("password"))?.value;
  if (!verifyAccountChangeToken(token, "password", user.id)) {
    redirect("/app/ajustes?verification=invalid");
  }

  return <ChangePasswordDialog />;
}
