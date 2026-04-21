'use client';
import { useEffect } from 'react';

export function AdSocialBar() {
  useEffect(() => {
    const srcs = ["https://pl29147366.profitablecpmratenetwork.com/86/1b/99/861b99d7e167bb57a924e558d8fbafad.js", "https://pl29147369.profitablecpmratenetwork.com/52/b0/4d/52b04daa458e7b92cf70df2bab223056.js"];
    const scripts = srcs.map((src) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      document.head.appendChild(s);
      return s;
    });
    return () => scripts.forEach((s) => s.parentNode?.removeChild(s));
  }, []);
  return null;
}
