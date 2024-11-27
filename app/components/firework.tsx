import React, { useEffect, useState } from 'react';

interface FireworkProps {
  color?: string;
  onComplete: () => void;
}

const Firework: React.FC<FireworkProps> = ({ color = '#0066FF', onComplete }) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const particleCount = 20;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const x = Math.cos(angle) * 20;
      const y = Math.sin(angle) * 20;
      const size = Math.random() * 4 + 2;
      const duration = Math.random() * 0.5 + 0.5;

      newParticles.push(
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            transform: `translate(${x}px, ${y}px) scale(0)`,
            animation: `firework-particle ${duration}s ease-out forwards`,
          }}
        />
      );
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [color, onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles}
    </div>
  );
};

export default Firework;

