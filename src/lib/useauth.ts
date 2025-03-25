import { auth } from "@/lib/auth";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};

export const getSession = async () => {
  const session = await auth();

  return session;
};


