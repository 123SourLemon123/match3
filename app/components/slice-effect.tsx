import React, { useEffect, useState } from 'react';

interface SliceEffectProps {
  color: string;
  onComplete: () => void;
}

const SliceEffect: React.FC<SliceEffectProps> = ({ color, onComplete }) => {
  const [slices, setSlices] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const sliceCount = 8;
    const newSlices = [];

    for (let i = 0; i < sliceCount; i++) {
      const angle = (Math.PI * 2 * i) / sliceCount;
      const length = Math.random() * 10 + 10; // Длина полоски от 10 до 20px
      
      newSlices.push(
        <div
          key={i}
          className="absolute"
          style={{
            backgroundColor: color,
            width: '2px',
            height: `${length}px`,
            transform: `rotate(${angle}rad) translateY(-${length / 2}px)`,
            transformOrigin: 'bottom center',
            animation: `slice-effect 0.5s ease-out forwards`,
          }}
        />
      );
    }

    setSlices(newSlices);

    const timer = setTimeout(() => {
      onComplete();
    }, 500);

    return () => clearTimeout(timer);
  }, [color, onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {slices}
    </div>
  );
};

export default SliceEffect;

