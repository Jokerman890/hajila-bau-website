'use client';
import * as React from 'react';
import { ArrowDown } from 'lucide-react';
import {
  motion,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from 'motion/react';
import { cn } from '@/lib/utils';

type ScrollProgressProps = React.ComponentProps<'div'> & {
  progressProps?: HTMLMotionProps<'div'>;
};

export function ScrollProgress({
  ref,
  className,
  children,
  progressProps,
  ...props
}: ScrollProgressProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 40,
    bounce: 0,
  });

  return (
    <>
      <motion.div
        data-slot="scroll-progress"
        {...progressProps}
        style={{ scaleX }}
        className={cn(
          'fixed z-50 top-0 left-0 right-0 h-2 bg-blue-500 origin-left',
          progressProps?.className,
        )}
      />
      <div
        ref={containerRef}
        data-slot="scroll-progress-container"
        className={cn('', className)}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export const Component = () => {
  return (
    <div className="absolute inset-0">
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <ScrollProgress progressProps={{ className: 'absolute' }}>
          <div className="size-full flex items-center justify-center dark:bg-neutral-950 bg-white">
            <p className="flex items-center gap-2 font-medium">
              Scroll down to see the progress bar{' '}
              <motion.span
                animate={{ y: [3, -3, 3] }}
                transition={{
                  duration: 1.25,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  type: 'keyframes',
                }}
              >
                <ArrowDown className="size-5" />
              </motion.span>
            </p>
          </div>
          <div className="size-full dark:bg-neutral-900 bg-neutral-100" />
          <div className="size-full dark:bg-neutral-950 bg-white" />
          <div className="size-full dark:bg-neutral-900 bg-neutral-100" />
          <div className="size-full dark:bg-neutral-950 bg-white" />
        </ScrollProgress>
      </div>
    </div>
  );
};
