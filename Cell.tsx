import React from 'react';
import { Cell as CellType } from './types';

interface CellProps {
  cell: CellType;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ cell, onClick }) => {
  const colorMap: Record<string, string> = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div
      className={`w-6 h-6 rounded-full cursor-pointer ${colorMap[cell.type]}`}
      onClick={onClick}
    />
  );
};

