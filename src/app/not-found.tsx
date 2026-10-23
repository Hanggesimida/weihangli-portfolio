import "@/styles/globals.css";
import { Figtree } from "next/font/google";
import Link from "next/link";

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export default function NotFound() {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-sans">
        <main className="flex min-h-svh flex-col justify-between px-8 py-8 sm:px-10">
          <p className="text-base font-medium tracking-tight text-foreground/60 md:text-lg">
            Weihang Li
          </p>

          <div>
            <h1 className="text-[32vw] font-semibold leading-[0.8] tracking-tighter text-foreground/95 md:text-[24vw]">
              404
            </h1>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[32ch] text-xl font-medium tracking-tight text-foreground/60 md:text-2xl">
                This page could not be found.
              </p>
              <Link
                href="/"
                className="w-fit rounded-full bg-foreground/80 px-6 py-4 text-sm font-bold uppercase text-background transition-colors hover:bg-foreground md:text-base"
              >
                Go home ↗
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
