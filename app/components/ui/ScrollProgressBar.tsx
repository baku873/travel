"use client";

import { useEffect } from "react";

export default function ScrollProgressBar() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      document.documentElement.style.setProperty('--scroll-progress', String(progress));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 to-blue-600 origin-left z-[100]"
      style={{
        transform: 'scaleX(var(--scroll-progress, 0))',
        transition: 'transform 0.15s ease-out',
      }}
    />
  );
}
