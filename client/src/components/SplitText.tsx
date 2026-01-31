import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: any;
  to?: any;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete
}: SplitTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const chars = containerRef.current?.querySelectorAll('.split-char');
    if (!chars || chars.length === 0) return;

    gsap.fromTo(chars, 
      from,
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: containerRef.current,
          start: `top 90%`, // Trigger when top of element hits 90% viewport height
          once: true,
        },
        onComplete: onLetterAnimationComplete
      }
    );
  }, { scope: containerRef, dependencies: [text] });

  return (
    <div ref={containerRef} className={className} style={{ textAlign: textAlign as any, overflow: 'hidden' }}>
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className="split-char" 
          style={{ 
            display: 'inline-block', 
            whiteSpace: 'pre',
            willChange: 'transform, opacity' 
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
