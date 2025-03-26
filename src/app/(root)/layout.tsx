import { redirect } from 'next/navigation';
import MainLayout from "@/components/layout/MainLayout";
import { auth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  return <MainLayout>{children}</MainLayout>;
}