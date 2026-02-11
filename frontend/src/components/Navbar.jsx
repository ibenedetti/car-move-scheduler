"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { LuMenu, LuX } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import Logo from "./Logo";

export function Navbar({ variant = "static" }) {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "floating") return;
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      setIsScrolled(window.scrollY > viewportHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  const positionClasses = variant === "static" 
    ? "relative" 
    : "fixed top-0 right-0 left-0 z-[100]";

  const bgClasses = variant === "solid" 
    ? "bg-black/40 backdrop-blur-xl border-b border-white/10"
    : variant === "floating" && isScrolled
      ? "bg-black/40 backdrop-blur-xl border-b border-white/10" 
      : "bg-transparent border-b-transparent";

  const navLinks = [
    { title: "Nosotros", href: "/nosotros" }, 
    { title: "Misión", href: "/mision" },
    { title: "Testimonios", href: "/testimonios" },
    { title: "Nuestro Equipo", href: "/nuestro-equipo" },
    { title: "Contacto", href: "/contacto" },
  ];

  return (
    <header className={`${positionClasses} flex items-center justify-between p-6 transition-colors duration-500 ${bgClasses}`}>
      <Link href="/" className="shrink-0 hover:scale-105 transition-transform">
        <Logo className="h-6 w-auto fill-white text-white" /> 
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="text-sm font-semibold uppercase tracking-widest text-white/90 hover:text-white transition-colors font-sans"
          >
            {link.title}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="md:hidden flex size-10 items-center justify-center rounded-full bg-white/10 text-white">
            <LuMenu className="size-6" />
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
            <DialogContent className="fixed inset-y-0 right-0 z-[110] w-full bg-black p-8 shadow-xl">
              <div className="flex justify-between items-center mb-12">
                <Logo className="h-5 w-auto fill-white" />
                <DialogClose className="text-white">
                  <LuX className="size-8" />
                </DialogClose>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-3xl font-bold text-white font-sans"
                  >
                    {link.title}
                  </Link>
                ))}
                <hr className="border-white/10 my-4" />
              </nav>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    </header>
  );
}