import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlayerScore } from '../types';

interface LeaderboardProps {
  scores: PlayerScore[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  return (
    <Table>
      <TableCaption>Таблица лидеров</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Позиция</TableHead>
          <TableHead>Имя игрока</TableHead>
          <TableHead className="text-right">Рекорд за игру</TableHead>
          <TableHead className="text-right">Общие очки</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores.map((entry, index) => (
          <TableRow key={entry.name}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{entry.name}</TableCell>
            <TableCell className="text-right">{entry.highScore}</TableCell>
            <TableCell className="text-right">{entry.totalScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

