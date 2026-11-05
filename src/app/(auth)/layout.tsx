import type { ReactNode } from "react";
import { ThemeToggle } from "@/shared/theme/theme-toggle";
import { AuthBrandPanel } from "./_components/auth-brand-panel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh w-full bg-canvas lg:grid lg:grid-cols-2">
      <div className="hidden lg:block">
        <AuthBrandPanel />
      </div>

      <div className="relative flex min-h-dvh w-full flex-col items-center justify-center p-[20px]">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
        <main className="w-full max-w-[420px] py-12">{children}</main>
      </div>
    </div>
  );
}
