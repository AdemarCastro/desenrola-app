import React from 'react';
import { cn } from '@/lib/utils';

export function AnimatedBackground() {
  const circles = [
    { size: 'h-[300px] w-[300px] md:h-[400px] md:w-[400px]', duration: '90s', direction: 'normal', opacity: 'opacity-100' },
    { size: 'h-[500px] w-[500px] md:h-[650px] md:w-[650px]', duration: '75s', direction: 'reverse', opacity: 'opacity-100' },
    { size: 'h-[700px] w-[700px] md:h-[900px] md:w-[900px]', duration: '120s', direction: 'normal', opacity: 'opacity-80' },
    { size: 'h-[900px] w-[900px] md:h-[1150px] md:w-[1150px]', duration: '100s', direction: 'reverse', opacity: 'opacity-50' },
    { size: 'hidden lg:block h-[1100px] w-[1100px] md:h-[1400px] md:w-[1400px]', duration: '150s', direction: 'normal', opacity: 'opacity-50' },
    { size: 'hidden lg:block h-[1300px] w-[1300px] md:h-[1600px] md:w-[1600px]', duration: '110s', direction: 'reverse', opacity: 'opacity-40' },
  ];

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div className="absolute inset-x-0 top-0 h-screen -z-10 flex items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          {circles.map((circle, index) => (
            <div
              key={index}
              className={cn(
                'absolute rounded-full border-3 border-dashed border-zinc-200',
                circle.size,
                circle.opacity
              )}
              style={{
                animation: `spin ${circle.duration} linear infinite`,
                animationDirection: circle.direction as 'normal' | 'reverse',
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
