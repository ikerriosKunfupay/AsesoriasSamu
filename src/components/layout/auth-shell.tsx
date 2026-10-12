import { BrandLogo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";

export function AuthShell({ title, description, children }: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="brand-grid grid min-h-screen place-items-center bg-surface-inverse px-4 py-12">
      <div className="w-full max-w-md">
        <BrandLogo className="mb-7 justify-center text-white" />
        <Card className="p-6 sm:p-8">
          <h1 className="font-display text-3xl font-black">{title}</h1>
          <p className="mt-2 mb-7 text-sm leading-6 text-muted">{description}</p>
          {children}
        </Card>
      </div>
    </main>
  );
}
