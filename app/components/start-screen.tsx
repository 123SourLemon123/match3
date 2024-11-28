'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaderboard } from './leaderboard';
import { register, login } from '../actions/auth';
import { User } from '../lib/db';
import { DebugLog } from './debug-log';

interface StartScreenProps {
  onStart: (playerName: string, user: User) => void;
  initialLeaderboard: User[];
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, initialLeaderboard }) => {
  const [playerName, setPlayerName] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<User[]>(initialLeaderboard);

  const handleAuth = async () => {
    console.log('Client: handleAuth called');
    setIsLoading(true);
    setMessage('');
    const action = isLogin ? login : register;
    try {
      console.log(`Client: Attempting to ${isLogin ? 'login' : 'register'} user: ${playerName}`);
      const result = await action(playerName, password);
      console.log('Client: Auth result:', result);
      setMessage(result.message);
      if (result.success && result.user) {
        console.log('Client: Auth successful, starting game');
        onStart(playerName, result.user);
      }
    } catch (error) {
      console.error('Client: Error during authentication:', error);
      setMessage(`Произошла ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4">
      <h1 className="text-4xl font-bold text-black">Три в ряд v1.009</h1>
      <div className="flex flex-col items-center space-y-4">
        <Input
          type="text"
          placeholder="Имя пользователя"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          onClick={handleAuth} 
          disabled={isLoading}
          className="bg-black hover:bg-gray-800 text-white"
        >
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-black">
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
        </Button>
        {message && <p className={`text-${message.includes('успешн') ? 'green' : 'red'}-500`}>{message}</p>}
      </div>
      <Leaderboard scores={leaderboard} />
      <DebugLog />
    </div>
  );
};

