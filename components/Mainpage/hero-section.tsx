import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import HeroPic from "@/public/HeroPic.jpg";
export default function HeroSection() {
  return (
    <>
      <main className="overflow-x-hidden overflow-y-hidden">
        <section>
          <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                  Content instantly Chat smarter.
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg">
                  Highly customizable components for building The modern
                  messaging platform that combines lightning-fast chat and
                  crystal-clear video calls, all in one seamless experience.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button
                        size="lg"
                        className="th-12 rounded-full pl-5 pr-3 text-base"
                      >
                        <span className="text-nowrap">Start Chatting Free</span>
                        <ChevronRight className="ml-1" />
                      </Button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
              <Image
                className="-z-10 order-first ml-auto h-96 w-full  object-cover overflow-visible invert sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-96 lg:order-last lg:h-max lg:w-2/3 lg:object-contain dark:mix-blend-lighten dark:invert-0 "
                src={HeroPic}
                alt="Abstract Object"
                height="4000"
                width="3000"
                unoptimized
                priority
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
