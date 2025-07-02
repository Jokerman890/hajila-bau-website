"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { Building2, Hammer, Home, Wrench, Paintbrush, Flame, HardHat, Construction } from "lucide-react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          // Simple CSS transition instead of motion library
          element.style.transition = `--start ${movementDuration}s cubic-bezier(0.16, 1, 0.3, 1)`;
          element.style.setProperty("--start", String(newAngle));
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
                radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
                radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), 
                radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #dd7bbb 0%,
                  #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
                  #5a922c calc(50% / var(--repeating-conic-gradient-times)), 
                  #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
                  #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <div className="relative h-full rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
        movementDuration={1.5}
      />
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const GlowingServiceGrid = () => {
  const services = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Klinkerarbeiten & Verblendmauerwerk",
      description: "Hochwertige Klinkerfassaden und Verblendmauerwerk für anspruchsvolle Bauvorhaben mit jahrzehntelanger Haltbarkeit."
    },
    {
      icon: <Hammer className="h-6 w-6" />,
      title: "Klinker-Detailarbeiten",
      description: "Präzise Ausführung von Bögen, Gesimsen, Pfeilern und anderen architektonischen Klinker-Details."
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: "WDVS mit Klinkeroptik",
      description: "Energieeffiziente WDVS-Lösungen mit authentischer Klinkeroptik für moderne Gebäude."
    },
    {
      icon: <Flame className="h-6 w-6" />,
      title: "Schornstein- und Kaminverkleidungen",
      description: "Fachgerechte Verkleidung von Schornsteinen und Kaminen mit hochwertigen Klinkermaterialien."
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Betonbau",
      description: "Fundamente, Bodenplatten und weitere Betonarbeiten als solide Basis für Ihre Bauvorhaben."
    },
    {
      icon: <HardHat className="h-6 w-6" />,
      title: "Eisenflechterarbeiten",
      description: "Professionelles Bewehrung binden für stabile und langlebige Betonkonstruktionen."
    },
    {
      icon: <Construction className="h-6 w-6" />,
      title: "Bauausführung im Rohbau",
      description: "Komplette Rohbauten von der Planung bis zur schlüsselfertigen Ausführung."
    },
    {
      icon: <Paintbrush className="h-6 w-6" />,
      title: "Sanierung",
      description: "Umfassende Sanierung von Bestandsgebäuden, inklusive Modernisierung und Instandsetzung."
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlowingServiceGrid;
