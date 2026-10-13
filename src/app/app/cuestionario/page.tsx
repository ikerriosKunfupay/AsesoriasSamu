import { OnboardingForm } from "@/components/forms/client-forms";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";
import { DismissibleNotice } from "@/components/ui/dismissible-notice";
import { requireClient } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export default async function QuestionnairePage() {
  const user = await requireClient();
  const supabase = await createClient();
  const { data } = await supabase.from("onboarding_submissions").select("*").eq("user_id", user.id).maybeSingle();
  return (
    <>
      <PageHeading
        eyebrow="Tu perfil"
        title="Cuestionario inicial"
        description="Esta información permite adaptar el plan a tu situación. Puedes actualizarla si algo cambia."
      />
      <Card className="max-w-5xl">
        <DismissibleNotice className="mb-7">
          No incluyas diagnósticos o informes completos. Indica solo lo que tu entrenador
          necesite conocer para adaptar la actividad de forma segura.
        </DismissibleNotice>
        <OnboardingForm initial={data ?? undefined} />
      </Card>
    </>
  );
}
