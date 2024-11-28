import React from 'react';
import Image from 'next/image';
import { Cell as CellType } from '../types';

interface CellProps {
  cell: CellType;
  isSelected?: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ cell, isSelected, onClick }) => {
  return (
    <div
      className={`
        w-full h-full flex items-center justify-center
        text-3xl cursor-pointer
        transition-all duration-200 ease-in-out
        ${isSelected ? 'bg-primary/20' : 'hover:bg-primary/10'}
        rounded-lg
      `}
      onClick={onClick}
    >
      {cell.type === 'ozon' ? (
        <div className="relative w-8 h-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OzonBank-tsKUmAFsSSYyqECmKW4llgBElttFMv.png"
            alt="Ozon Bank"
            width={32}
            height={32}
            className="object-contain"
            priority
          />
        </div>
      ) : (
        cell.type
      )}
    </div>
  );
};

