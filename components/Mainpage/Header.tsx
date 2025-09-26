"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { usePathname } from "next/navigation";
import { ThemeToggleButton } from "./mode-toggle";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Logo from "@/public/logo.svg";
const menuItems = [
  { href: "#home", label: "Home", active: true },
  { href: "#features", label: "Features" },
  { href: "#social-proof", label: "Social" },
  { href: "#cta", label: "Join us" },
];

function AuthButtons({ isDashboard }: { isDashboard: boolean }) {
  const hasAuth =
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !!process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!hasAuth) {
    return (
      <Button
        variant="outline"
        className="w-full sm:w-auto bg-transparent opacity-50 cursor-not-allowed"
        disabled
      >
        Sign in (Setup Required)
      </Button>
    );
  }

  return (
    <>
      <Authenticated>
        {!isDashboard && (
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full sm:w-auto hover:bg-primary hover:text-muted-foreground transition-all duration-300 hover:scale-105 bg-transparent"
            >
              Dashboard
            </Button>
          </Link>
        )}
        <div className="flex items-center justify-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "hover:scale-110 transition-transform duration-300",
              },
            }}
          />
        </div>
      </Authenticated>

      <Unauthenticated>
        <SignInButton
          mode="modal"
          forceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
        >
          <Button
            variant="outline"
            className="w-full sm:w-auto hover:bg-primary hover:text-muted-foreground transition-all duration-300 hover:scale-105 group bg-transparent"
          >
            <span className="group-hover:translate-x-0.5 transition-transform duration-300">
              Sign in
            </span>
          </Button>
        </SignInButton>
      </Unauthenticated>
    </>
  );
}

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const pathName = usePathname();
  const isDashboard = pathName.startsWith("/dashboard");

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-background/80 backdrop-blur-xl border-b border-border/40 fixed z-50 w-full transition-all duration-300 hover:bg-background/90"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
              >
                <Image src={Logo} alt="Logo" height={40} width={40} />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden group"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 m-auto size-6 transition-all duration-300 ${
                      menuState
                        ? "rotate-180 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    } group-hover:text-primary`}
                  />
                  <X
                    className={`absolute inset-0 m-auto size-6 transition-all duration-300 ${
                      menuState
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-180 scale-0 opacity-0"
                    } group-hover:text-primary`}
                  />
                </div>
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="relative text-muted-foreground hover:text-foreground block duration-300 py-2 px-3 rounded-lg hover:bg-accent/50 transition-all group"
                      >
                        <span className="relative z-10">{item.label}</span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={`
              bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/5
              mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-2xl p-6 
              transition-all duration-500 ease-out
              md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 
              lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none
              ${menuState ? "block animate-in slide-in-from-top-5 fade-in-0" : "hidden lg:flex"}
            `}
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground block duration-300 py-2 px-4 rounded-lg hover:bg-accent/50 transition-all"
                        onClick={() => setMenuState(false)}
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ThemeToggleButton variant="circle" blur />
                <AuthButtons isDashboard={isDashboard} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
