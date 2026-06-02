'use client';

// page.tsx — Root page: runs the intro sequence, then hands off to the Three.js brain canvas
import { useState, useRef } from 'react';
import IntroSequence from '@/components/intro/IntroSequence';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Three.js canvas placeholder — hidden until intro hands off */}
      <div
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
          opacity: 0,
          background: '#000',
        }}
      />

      {!introComplete && (
        <IntroSequence
          onComplete={() => setIntroComplete(true)}
          canvasRef={canvasRef}
        />
      )}
    </>
  );
}
