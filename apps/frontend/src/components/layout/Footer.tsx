"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Logo } from '../shared/Logo';

export const Footer = () => {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFooterClick = () => {
    const newCount = clickCount + 1;
    
    if (newCount >= 5) {
      router.push('/boost-studio');
      setClickCount(0);
    } else {
      setClickCount(newCount);
    }

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };
  return (
    <footer id="footer" className="bg-black/40 text-text-muted py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
        
        {/* Top: Newsletter */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-xl mx-auto">
          <h3 className="text-2xl font-medium text-text-main">Subscribe to Our Newsletter</h3>
          <p className="text-sm">Get the latest travel tips, guides, and stories delivered straight to your inbox.</p>
          <div className="flex w-full flex-col sm:flex-row gap-4 mt-2">
            <Input 
              placeholder="Enter your email" 
              className="flex-1 bg-surface/50 border-white/10" 
            />
            <Button size="md" className="sm:w-auto w-full">Subscribe</Button>
          </div>
        </div>

        {/* Bottom: Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-10 border-t border-white/5 text-sm">
          
          {/* Logo Column */}
          <div className="space-y-4">
            <Logo textSize="text-2xl" interactive={false} />
            <p className="text-text-muted/80 leading-relaxed max-w-xs">
              A premium travel blog platform sharing the beauty of the world, one story at a time.
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-text-main font-medium mb-4">SOCIALS</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Twitter / X', url: '#' },
                { name: 'Facebook', url: '#' },
                { name: 'Instagram', url: '#' },
                { name: 'YouTube', url: '#' }
              ].map((link) => (
                <Link key={link.name} href={link.url} className="hover:text-text-main transition-colors duration-300">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-text-main font-medium mb-4">EXPLORE</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: 'About Us', url: '/about' },
                { name: 'Blog', url: '/blog' },
                { name: 'Privacy Policy', url: '/policy' },
                { name: 'Terms of Service', url: '/terms' }
              ].map((link) => (
                <Link key={link.name} href={link.url} className="hover:text-text-main transition-colors duration-300">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-text-main font-medium mb-4">CONTACT</h4>
            <div className="flex flex-col gap-3 text-text-muted/80">
              <p>Email: hello@boostblog.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p className="mt-2">123 Travel Avenue, <br />World City, 10110</p>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div 
          className="text-center text-xs text-text-muted/40 pt-8 cursor-pointer select-none"
          onClick={handleFooterClick}
        >
          © {new Date().getFullYear()} Boost Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
