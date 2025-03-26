"use client";

import { User } from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={user?.image || ""} />
        <AvatarFallback className="bg-sky-500">
          <User className="text-white" />
        </AvatarFallback>
      </Avatar>
      <LogoutButton>
        <div className="flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
          <ExitIcon className="h-4 w-4 mr-2" />
          Logout
        </div>
      </LogoutButton>
    </div>
  );
};