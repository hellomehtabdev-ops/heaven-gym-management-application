import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Smoothly reveals content when scrolled into the viewport using native IntersectionObserver.
 * Fully respects prefers-reduced-motion for accessibility.
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = '',
  once = true,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    const currentElem = domRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [threshold, once]);

  const getAnimationStyles = () => {
    const baseTransition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return {
            opacity: 0,
            transform: 'translate3d(0, 32px, 0)',
            transition: baseTransition,
          };
        case 'fade-down':
          return {
            opacity: 0,
            transform: 'translate3d(0, -32px, 0)',
            transition: baseTransition,
          };
        case 'fade-left':
          return {
            opacity: 0,
            transform: 'translate3d(40px, 0, 0)',
            transition: baseTransition,
          };
        case 'fade-right':
          return {
            opacity: 0,
            transform: 'translate3d(-40px, 0, 0)',
            transition: baseTransition,
          };
        case 'zoom-in':
          return {
            opacity: 0,
            transform: 'scale3d(0.94, 0.94, 1)',
            transition: baseTransition,
          };
        default:
          return {
            opacity: 0,
            transition: baseTransition,
          };
      }
    }

    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
      transition: baseTransition,
    };
  };

  return (
    <div
      ref={domRef}
      style={getAnimationStyles()}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
