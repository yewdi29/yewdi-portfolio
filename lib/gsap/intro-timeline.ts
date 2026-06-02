// intro-timeline.ts — GSAP master timeline factory for the cinematic intro sequence
import gsap from 'gsap';
import { RefObject } from 'react';

export interface IntroRefs {
  profileSide: RefObject<HTMLDivElement>;
  profileThreeqrt: RefObject<HTMLDivElement>;
  profileFront: RefObject<HTMLDivElement>;
  eyePhoto: RefObject<HTMLDivElement>;
  canvas: RefObject<HTMLDivElement>;
}

export function createIntroTimeline(
  refs: IntroRefs,
  onComplete: () => void
): gsap.core.Timeline {
  const { profileSide, profileThreeqrt, profileFront, eyePhoto, canvas } = refs;

  const tl = gsap.timeline({ onComplete, paused: true });

  // f1: side profile fades in
  tl.to(profileSide.current, { opacity: 1, duration: 1.5, ease: 'power2.out' });

  // hold
  tl.to({}, { duration: 1.5 });

  // f1 exits, f2 (three-quarter) crossfades in
  tl.to(profileSide.current, { opacity: 0, xPercent: 8, duration: 1.0, ease: 'power2.in' });
  tl.to(
    profileThreeqrt.current,
    { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' },
    '<-0.5'
  );

  // hold on three-quarter
  tl.to({}, { duration: 0.8 });

  // f2 exits, f3 (front) crossfades in
  tl.to(profileThreeqrt.current, { opacity: 0, xPercent: 5, duration: 0.9, ease: 'power2.in' });
  tl.to(
    profileFront.current,
    { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' },
    '<-0.6'
  );

  // hold on front
  tl.to({}, { duration: 1.2 });

  // f3 slow pull back
  tl.to(profileFront.current, { scale: 1.08, duration: 1.5, ease: 'power1.in' });

  // eye enters
  tl.to(eyePhoto.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '<-1.0');

  // f3 exits
  tl.to(profileFront.current, { opacity: 0, duration: 0.5, ease: 'power1.in' }, '<-0.4');

  // hold before zoom
  tl.to({}, { duration: 0.5 });

  // eye zoom to scale 22 with quadratic blur ramp
  tl.to(eyePhoto.current, {
    scale: 22,
    duration: 3.2,
    ease: 'power4.in',
    onUpdate: function () {
      const p = this.progress();
      if (eyePhoto.current) {
        eyePhoto.current.style.filter = `blur(${p * p * 28}px)`;
      }
    },
  });

  // canvas fades in underneath at ~60% through zoom
  tl.to(canvas.current, { opacity: 1, duration: 1.4, ease: 'power1.out' }, '<-2.2');

  // eye exits
  tl.to(eyePhoto.current, { opacity: 0, duration: 0.6, ease: 'power1.in' }, '<-1.2');

  return tl;
}
