import { redirect } from "next/navigation";
import { verifySession } from "@/lib/admin/session";
import { AdminHeader } from "@/features/admin/AdminHeader";
import { SubmissionsPanel } from "@/features/admin/SubmissionsPanel";

export default async function AdminPage() {
  const session = await verifySession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-muted-bg">
      <AdminHeader email={session.email} />
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-4 pb-8">
        <SubmissionsPanel />
      </main>
    </div>
  );
}
