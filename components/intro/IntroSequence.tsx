'use client';

// IntroSequence.tsx — Orchestrates the full GSAP photo intro timeline with all four frames
import { useEffect, useRef, RefObject } from 'react';
import Image from 'next/image';
import { createIntroTimeline } from '@/lib/gsap/intro-timeline';

interface IntroSequenceProps {
  onComplete: () => void;
  canvasRef: RefObject<HTMLDivElement>;
}

export default function IntroSequence({ onComplete, canvasRef }: IntroSequenceProps) {
  const profileSideRef = useRef<HTMLDivElement>(null);
  const profileThreeqrtRef = useRef<HTMLDivElement>(null);
  const profileFrontRef = useRef<HTMLDivElement>(null);
  const eyePhotoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const tl = createIntroTimeline(
        {
          profileSide: profileSideRef,
          profileThreeqrt: profileThreeqrtRef,
          profileFront: profileFrontRef,
          eyePhoto: eyePhotoRef,
          canvas: canvasRef,
        },
        onComplete
      );
      tl.play();

      return () => {
        tl.kill();
      };
    }, 300);

    return () => clearTimeout(timer);
  }, [onComplete, canvasRef]);

  const layerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#000',
      }}
    >
      {/* f1 — side profile */}
      <div ref={profileSideRef} style={layerStyle}>
        <Image
          src="/photos/profile-side.png"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* f2 — three-quarter */}
      <div
        ref={profileThreeqrtRef}
        style={{ ...layerStyle, transform: 'scale(0.96)' }}
      >
        <Image
          src="/photos/profile-threeqrt.png"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* f3 — front facing */}
      <div
        ref={profileFrontRef}
        style={{ ...layerStyle, transform: 'scale(0.96)' }}
      >
        <Image
          src="/photos/profile-front.png"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* f4 — eye close-up */}
      <div
        ref={eyePhotoRef}
        style={{
          ...layerStyle,
          transformOrigin: '50% 50%',
          willChange: 'transform, filter, opacity',
        }}
      >
        <Image
          src="/photos/eye-close.png"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
