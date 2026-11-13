import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Returns true if the user's OS or browser has requested reduced motion.
 */
export function isReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Custom React hook that sets up a scoped GSAP context and automatically
 * reverts all animations and ScrollTriggers on component unmount or dependency change.
 * Respects prefers-reduced-motion.
 */
export function useGsapContext(scopeRef, animationCallback, deps = []) {
  useEffect(() => {
    if (!scopeRef.current) return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      animationCallback();
    }, scopeRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Animate a set of cards with a subtle, luxurious stagger.
 */
export function animateStaggerCards(containerEl, cardSelector, options = {}) {
  if (isReducedMotion() || !containerEl) return;
  const cards = containerEl.querySelectorAll(cardSelector);
  if (!cards.length) return;

  const {
    y = 36,
    duration = 0.85,
    stagger = 0.12,
    ease = 'power3.out',
    start = 'top 85%',
  } = options;

  gsap.fromTo(
    cards,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: containerEl,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
}

/**
 * Animate a section headline and subtitle.
 */
export function animateSectionHeader(headerEl, options = {}) {
  if (isReducedMotion() || !headerEl) return;

  const {
    y = 28,
    duration = 0.8,
    ease = 'power2.out',
    start = 'top 88%',
  } = options;

  gsap.fromTo(
    headerEl.children,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger: 0.12,
      ease,
      scrollTrigger: {
        trigger: headerEl,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
}

/**
 * Hero section entrance animation sequence.
 */
export function animateHeroSequence(scopeEl, selectors = {}) {
  if (isReducedMotion() || !scopeEl) return;

  const badge = scopeEl.querySelector(selectors.badge || '.hero-badge');
  const title = scopeEl.querySelector(selectors.title || '.hero-title');
  const description = scopeEl.querySelector(selectors.description || '.hero-desc');
  const ctas = scopeEl.querySelectorAll(selectors.ctas || '.hero-cta');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (badge) {
    tl.fromTo(badge, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7 });
  }
  if (title) {
    tl.fromTo(title, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.4');
  }
  if (description) {
    tl.fromTo(description, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
  }
  if (ctas && ctas.length) {
    tl.fromTo(ctas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');
  }

  return tl;
}

export { gsap, ScrollTrigger };
