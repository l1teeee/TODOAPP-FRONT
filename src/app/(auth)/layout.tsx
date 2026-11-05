import type { ReactNode } from "react";
import { RedirectIfSession } from "@/shared/auth/auth-guard";
import { ThemeToggle } from "@/shared/theme/theme-toggle";
import { AuthMediaCard } from "./_components/auth-media-card";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <RedirectIfSession>
      <div className="relative min-h-dvh w-full bg-surface-muted lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_45%] lg:p-8 lg:gap-8">
        <div className="relative flex min-h-dvh w-full items-center justify-center px-5 py-12 lg:min-h-0 lg:px-12">
          <div className="absolute right-5 top-5 lg:right-0 lg:top-0">
            <ThemeToggle />
          </div>
          <main className="flex w-full justify-center lg:justify-start xl:pl-[8%]">
            {children}
          </main>
        </div>

        <div className="hidden lg:block lg:min-h-0">
          <AuthMediaCard />
        </div>
      </div>
    </RedirectIfSession>
  );
}
