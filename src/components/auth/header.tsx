import { Bowlby_One_SC, DM_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

const bowlby = Bowlby_One_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bowlby-sc",
  weight: "400",
});

const mono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: "400",
})


interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", mono.className)}>Endustry AI</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};