'use client';
import { Component } from '@/components/ui/scroll-progress';

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="max-w-[400px] h-[400px] w-full rounded-xl bg-muted relative">
        <Component />
      </div>
    </div>
  );
};

export { DemoOne };
