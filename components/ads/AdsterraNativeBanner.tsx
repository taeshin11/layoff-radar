'use client';
import { useEffect, useRef } from 'react';

export function AdsterraNativeBanner() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || ref.current.dataset.loaded) return;
    ref.current.dataset.loaded = '1';
    const s = document.createElement('script');
    s.async = true; s.setAttribute('data-cfasync', 'false');
    s.src = 'https://pl29147367.profitablecpmratenetwork.com/19b10077f7c2e7fc7852b9fe85b5b0b6/invoke.js';
    ref.current.appendChild(s);
  }, []);
  return <div ref={ref} id="container-19b10077f7c2e7fc7852b9fe85b5b0b6" style={{ margin: '1.5rem 0', minHeight: '90px' }} />;
}
