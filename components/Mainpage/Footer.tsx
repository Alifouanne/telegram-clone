import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "#home", label: "Home", active: true },
  { href: "#features", label: "Features" },
  { href: "#social-proof", label: "Social" },
  { href: "#cta", label: "Join us" },
];

export default function FooterSection() {
  return (
    <footer className="py-16  border-t">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto block size-fit group animate-in fade-in duration-700"
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            <Image
              src={Logo || "/placeholder.svg"}
              alt="Logo"
              width={40}
              height={40}
            />
          </div>
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary block duration-300 relative group animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${(index + 1) * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                {link.label}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <span
          className="text-muted-foreground block text-center text-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "600ms", animationFillMode: "both" }}
        >
          © {new Date().getFullYear()} Lynk, All rights reserved
        </span>
      </div>
    </footer>
  );
}
