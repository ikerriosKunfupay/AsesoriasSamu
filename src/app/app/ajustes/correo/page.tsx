import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChangeEmailDialog } from "@/components/forms/account-change-dialog";
import { accountChangeCookieName, verifyAccountChangeToken } from "@/lib/auth/account-change-token";
import { requireCompletedClient } from "@/lib/auth/current-user";

export default async function ChangeEmailPage() {
  const user = await requireCompletedClient();
  const token = (await cookies()).get(accountChangeCookieName("email"))?.value;
  if (!verifyAccountChangeToken(token, "email", user.id)) {
    redirect("/app/ajustes?verification=invalid");
  }

  return <ChangeEmailDialog currentEmail={user.email} />;
}
