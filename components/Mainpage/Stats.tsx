// export default function StatsSection() {
//   return (
//     <section className="py-12 md:py-20">
//       <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
//         <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
//           <h2 className="text-4xl font-medium lg:text-5xl">Lynk in numbers</h2>
//           <p> Trusted by thousand of users worldwide</p>
//         </div>

//         <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
//           <div className="space-y-4">
//             <div className="text-5xl font-bold">50K+</div>
//             <p>Active Users</p>
//           </div>
//           <div className="space-y-4">
//             <div className="text-5xl font-bold">1M+</div>
//             <p>Messages Sent</p>
//           </div>
//           <div className="space-y-4">
//             <div className="text-5xl font-bold">99.9%</div>
//             <p>Uptime</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return { count, ref };
}

export default function StatsSection() {
  const users = useCountUp(50);
  const messages = useCountUp(1000);
  const uptime = useCountUp(99.9);

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl font-medium lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Lynk in numbers
          </h2>
          <p className="text-muted-foreground text-lg">
            Trusted by thousands of users worldwide
          </p>
        </div>

        <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-8 md:divide-x md:divide-y-0 md:divide-border/50">
          <div
            ref={users.ref}
            className="group space-y-4 pt-8 md:pt-0 transition-all duration-300 hover:scale-105 cursor-default"
          >
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110">
              {users.count}K+
            </div>
            <p className="text-muted-foreground font-medium transition-colors duration-300 group-hover:text-foreground">
              Active Users
            </p>
          </div>

          <div
            ref={messages.ref}
            className="group space-y-4 pt-8 md:pt-0 transition-all duration-300 hover:scale-105 cursor-default"
          >
            <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110">
              {messages.count >= 1000
                ? `${(messages.count / 1000).toFixed(0)}M+`
                : `${messages.count}+`}
            </div>
            <p className="text-muted-foreground font-medium transition-colors duration-300 group-hover:text-foreground">
              Messages Sent
            </p>
          </div>

          <div
            ref={uptime.ref}
            className="group space-y-4 pt-8 md:pt-0 transition-all duration-300 hover:scale-105 cursor-default"
          >
            <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110">
              {uptime.count.toFixed(1)}%
            </div>
            <p className="text-muted-foreground font-medium transition-colors duration-300 group-hover:text-foreground">
              Uptime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
