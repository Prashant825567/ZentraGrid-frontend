'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { HardDrive, Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '/features' },
    { name: 'Developers', href: '/docs' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Security', href: '/security' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'liquid-glass-nav scrolled py-3.5'
          : 'bg-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group focus:outline-none"
          id="nav-brand-logo"
        >
          <div className="w-9 h-9 rounded-xl liquid-glass flex items-center justify-center border border-[#FF4FD8]/40 group-hover:border-[#FF4FD8] group-hover:shadow-[0_0_15px_rgba(255,79,216,0.4)] transition-all">
            <HardDrive className="w-5 h-5 text-[#FF4FD8]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
              Zentra<span className="text-[#FF4FD8]">Grid</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 liquid-glass-subtle px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] border border-[#FF4FD8]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="liquid-glass px-4 py-2 rounded-xl border border-[#FF4FD8]/40 text-xs font-medium text-white hover:border-[#FF4FD8] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,79,216,0.15)]"
                id="nav-dashboard-link"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#FF4FD8]" />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                id="nav-login-btn"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="liquid-glass px-4 py-2 rounded-xl border border-[#FF4FD8]/50 text-xs font-semibold text-white bg-gradient-to-r from-[#FF4FD8]/20 to-[#FF2FB3]/20 hover:from-[#FF4FD8]/30 hover:to-[#FF2FB3]/30 hover:border-[#FF4FD8] transition-all shadow-[0_0_20px_rgba(255,79,216,0.25)] flex items-center gap-1.5"
                id="nav-get-started-btn"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 text-[#FF9BE8]" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl liquid-glass border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden liquid-glass border-b border-white/10 px-6 py-6 mt-3 mx-4 rounded-2xl backdrop-blur-2xl bg-[#06070B]/95 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center liquid-glass py-2.5 rounded-xl border border-[#FF4FD8]/50 text-sm font-semibold text-white bg-[#FF4FD8]/20"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-sm text-slate-300 hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center liquid-glass py-2.5 rounded-xl border border-[#FF4FD8]/50 text-sm font-semibold text-white bg-gradient-to-r from-[#FF4FD8]/25 to-[#FF2FB3]/25"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
