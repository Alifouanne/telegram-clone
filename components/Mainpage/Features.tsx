import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Shield, Users, VideoIcon, Zap } from "lucide-react";
import type { ReactNode } from "react";

export default function Features() {
  return (
    <section className="py-16 md:py-32">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Everything you need to stay connected
          </h2>
          <p className="mt-4">
            {" "}
            Powerful features designed for seamless communication, whether
            you&apos;re chatting with friends or collaborating with your team.
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]">
          {[
            {
              icon: MessageCircle,
              title: "Instant Messaging",
              description:
                "lightning-fast messages with real-time delivery. Chat with friends and colleagues seamlessly",
              delay: "delay-100",
            },
            {
              icon: VideoIcon,
              title: "HD Video Calls",
              description:
                "Crystal-clear video calls with one click. Perfect quality for personal calls and team meetings",
              delay: "delay-200",
            },
            {
              icon: Shield,
              title: "Privacy First",
              description:
                "End-to-end encryption keeps your conversations private. Your data belongs to you,always",
              delay: "delay-300",
            },
            {
              icon: Users,
              title: "Group Chats",
              description:
                "Create groups with friend,family or colleagues. Manage conversations with advanced controls.",
              delay: "delay-[400ms]",
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description:
                "Optimized for speed and performance. Works seamlessly across all your devices with instant sync",
              delay: "delay-500",
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className={`group border-0 shadow-none animate-in fade-in slide-in-from-bottom-6 duration-700 ${feature.delay} hover:scale-105 transition-all hover:shadow-lg hover:shadow-primary/10`}
            >
              <CardHeader className="pb-3">
                <CardDecorator>
                  <feature.icon
                    className="size-6 transition-colors group-hover:text-primary"
                    aria-hidden
                  />
                </CardDecorator>

                <h3 className="mt-6 font-medium transition-colors group-hover:text-primary">
                  {feature.title}
                </h3>
              </CardHeader>

              <CardContent>
                <p className="text-sm transition-colors group-hover:text-foreground/80">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-300 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)] group-hover:scale-110 transition-transform">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50 transition-opacity group-hover:opacity-70"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t transition-all group-hover:border-primary/20 group-hover:shadow-md">
      {children}
    </div>
  </div>
);
