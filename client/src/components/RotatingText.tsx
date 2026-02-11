import React, { forwardRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';

export interface RotatingTextProps {
  texts: string[];
  transition?: Transition;
  initial?: any;
  animate?: any;
  exit?: any;
  animatePresenceMode?: 'sync' | 'wait' | 'popLayout';
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: 'characters' | 'words' | 'lines' | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

const RotatingText = forwardRef<any, RotatingTextProps>((props, ref) => {
  const {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName = "",
    splitLevelClassName = "",
    elementLevelClassName = "",
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentTextIndex((prev) => {
      const nextIndex = prev === texts.length - 1 ? (loop ? 0 : prev) : prev + 1;
      if (nextIndex !== prev && onNext) {
        onNext(nextIndex);
      }
      return nextIndex;
    });
  }, [texts.length, loop, onNext]);

  const previous = useCallback(() => {
    setCurrentTextIndex((prev) => {
      const nextIndex = prev === 0 ? (loop ? texts.length - 1 : prev) : prev - 1;
      if (nextIndex !== prev && onNext) {
        onNext(nextIndex);
      }
      return nextIndex;
    });
  }, [texts.length, loop, onNext]);

  const jumpTo = useCallback((index: number) => {
    const targetIndex = Math.max(0, Math.min(index, texts.length - 1));
    setCurrentTextIndex(targetIndex);
    if (onNext) onNext(targetIndex);
  }, [texts.length, onNext]);

  useImperativeHandle(ref, () => ({
    next,
    previous,
    jumpTo,
    reset: () => setCurrentTextIndex(0),
  }));

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [auto, rotationInterval, next]);

  const currentText = texts[currentTextIndex];

  const elements = splitBy === 'characters' 
    ? currentText.split('') 
    : splitBy === 'words' 
    ? currentText.split(' ') 
    : splitBy === 'lines' 
    ? currentText.split('\n') 
    : currentText.split(splitBy);

  const getStaggerDelay = (index: number, total: number) => {
    const duration = staggerDuration;
    if (staggerFrom === 'first') return index * duration;
    if (staggerFrom === 'last') return (total - 1 - index) * duration;
    if (staggerFrom === 'center') {
      const center = Math.floor(total / 2);
      return Math.abs(center - index) * duration;
    }
    if (staggerFrom === 'random') {
      const randomIndex = Math.floor(Math.random() * total);
      return Math.abs(randomIndex - index) * duration;
    }
    if (typeof staggerFrom === 'number') {
        return Math.abs(staggerFrom - index) * duration;
    }
    return index * duration;
  };

  return (
    <motion.span
      className={`flex flex-wrap whitespace-pre-wrap relative ${mainClassName}`}
      layout
      transition={transition}
    >
        <span className="sr-only">{currentText}</span>
        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.div
            key={currentTextIndex}
            className={`${splitBy === 'lines' ? 'flex-col w-full' : 'flex flex-wrap'} ${splitLevelClassName}`}
            layout
            aria-hidden="true"
          >
            {elements.map((word, index) => (
              <motion.span
                key={index}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay: getStaggerDelay(index, elements.length),
                }}
                className={`inline-block ${elementLevelClassName}`}
              >
                {word}
                {splitBy === 'words' && index < elements.length - 1 && '\u00A0'}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
    </motion.span>
  );
});

export default RotatingText;
