import { InviteClientForm } from "@/components/forms/admin-forms";
import { PageHeading } from "@/components/layout/page-heading";
import { Card } from "@/components/ui/card";

export default function InviteClientPage() {
  return <><PageHeading eyebrow="Clientes" title="Nueva invitación" description="El cliente recibirá un correo para crear su contraseña. No se permite el registro público." /><Card className="max-w-2xl"><InviteClientForm /></Card></>;
}
