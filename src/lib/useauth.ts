import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role as UserRole;
};

export const getSession = async () => {
  const session = await auth();

  return session;
};


