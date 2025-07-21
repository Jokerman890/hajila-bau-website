'use client';
import { Component } from '@/components/ui/scroll-progress';
import { Stats } from "@/components/ui/stats-section"

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="max-w-[400px] h-[400px] w-full rounded-xl bg-muted relative">
        <Component />
      </div>
    </div>
  );
};

function StatsDemo() {
  return (
    <div className="w-full min-h-screen bg-background">
      <Stats />
    </div>
  );
}

// Alternative: Hajila Bau Stats als Teil einer größeren Sektion
function HajilaBauStats() {
  return (
    <section className="w-full">
      <Stats />
    </section>
  );
}

export { DemoOne, StatsDemo, HajilaBauStats };

