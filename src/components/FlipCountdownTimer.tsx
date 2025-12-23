// components/FlipCountdownTimer.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface FlipCountdownTimerProps {
  targetDate?: string;
}

export default function FlipCountdownTimer({
  targetDate = "2026-01-01T00:00:00",
}: FlipCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: "08",
    hours: "21",
    minutes: "17",
    seconds: "36",
  });

  const prevSeconds = useRef(timeLeft.seconds);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Only update seconds if they changed
        if (seconds.toString().padStart(2, "0") !== timeLeft.seconds) {
          prevSeconds.current = timeLeft.seconds;
        }

        setTimeLeft({
          days: days.toString().padStart(2, "0"),
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, timeLeft.seconds]);

  const FlipDigit = ({
    value,
    label,
    prevValue,
  }: {
    value: string;
    label: string;
    prevValue?: string;
  }) => (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-12 md:h-20 md:w-16 bg-slate-900 rounded-lg overflow-hidden shadow-lg">
        {/* Current number (bottom half) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl md:text-3xl font-bold text-white">
            {value}
          </span>
        </div>

        {/* Previous number (top half - sliding out) */}
        {prevValue && (
          <div className="absolute -top-full left-0 right-0 h-full flex items-center justify-center animate-slideDown">
            <span className="text-2xl md:text-3xl font-bold text-white opacity-70">
              {prevValue}
            </span>
          </div>
        )}

        {/* Top cover to create flip effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-slate-800/50 to-transparent"></div>

        {/* Bottom cover */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>
      <span className="mt-2 text-xs md:text-sm text-slate-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4">
      <FlipDigit value={timeLeft.days} label="Days" />
      <span className="text-xl md:text-2xl text-slate-500 mb-8">:</span>
      <FlipDigit value={timeLeft.hours} label="Hours" />
      <span className="text-xl md:text-2xl text-slate-500 mb-8">:</span>
      <FlipDigit value={timeLeft.minutes} label="Minutes" />
      <span className="text-xl md:text-2xl text-slate-500 mb-8">:</span>
      <FlipDigit
        value={timeLeft.seconds}
        label="Seconds"
        prevValue={prevSeconds.current}
      />
    </div>
  );
}
