"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '../shared/Logo';
import { SearchButton } from '../ui/SearchButton';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  { name: 'DESTINATIONS', path: '/destinations' },
  { name: 'PHOTOS', path: '/photos' },
  { name: 'BLOG', path: '/blog' },
  { name: 'CONTACT', path: '/contact' }
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center relative">
        
        {/* Mobile Menu Button (Left) */}
        <div className="md:hidden flex items-center">
          <button 
            className="p-2 text-text-main hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo (Center on mobile, Left on desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <Logo />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white">
          {NAV_LINKS.map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              className="hover:text-primary hover:-translate-y-0.5 transition-all duration-300 ease-out"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center">
          <SearchButton />
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-surface/95 backdrop-blur-md border-b border-white/5 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {NAV_LINKS.map((item) => (
              <Link 
                key={item.name} 
                href={item.path} 
                className="text-text-main hover:text-primary font-medium py-2 border-b border-white/5 last:border-none transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
