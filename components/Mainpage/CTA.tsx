import { Button } from "@/components/ui/button";
import { SignedOut, SignUpButton } from "@clerk/nextjs";

export default function CallToAction() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl rounded-3xl border px-6 py-12  animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-150">
            Ready to transform your conversations?
          </h2>
          <p className="mt-4 text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-300">
            Join thousands of users who are experiencing the future of
            messaging. Sign up today and start chatting smarter!
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-500">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-1 duration-700 delay-700 hover:text-foreground transition-colors">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              No credit card required
            </div>
            <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-1 duration-700 delay-800 hover:text-foreground transition-colors">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              Free forever plan
            </div>
            <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-1 duration-700 delay-900 hover:text-foreground transition-colors">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              Setup in 30 seconds
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
