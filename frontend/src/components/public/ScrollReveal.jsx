import React, { useEffect, useRef } from 'react';
import { gsap, isReducedMotion } from '@/utils/gsapAnimation';

/**
 * ScrollReveal Component
 * Smoothly reveals content using GSAP ScrollTrigger with automatic context cleanup.
 * Fully respects prefers-reduced-motion for accessibility.
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  once = true,
}) {
  const domRef = useRef(null);

  useEffect(() => {
    if (!domRef.current) return;

    if (isReducedMotion()) {
      gsap.set(domRef.current, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const el = domRef.current;
    let fromVars = { opacity: 0 };

    switch (animation) {
      case 'fade-up':
        fromVars = { opacity: 0, y: 32 };
        break;
      case 'fade-down':
        fromVars = { opacity: 0, y: -32 };
        break;
      case 'fade-left':
        fromVars = { opacity: 0, x: 38 };
        break;
      case 'fade-right':
        fromVars = { opacity: 0, x: -38 };
        break;
      case 'zoom-in':
        fromVars = { opacity: 0, scale: 0.94 };
        break;
      default:
        fromVars = { opacity: 0 };
    }

    const durationSec = typeof duration === 'number' && duration > 10 ? duration / 1000 : (duration || 0.7);
    const delaySec = typeof delay === 'number' && delay > 10 ? delay / 1000 : (delay || 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        fromVars,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: durationSec,
          delay: delaySec,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        }
      );
    }, domRef);

    return () => ctx.revert();
  }, [animation, delay, duration, once]);

  return (
    <div ref={domRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
