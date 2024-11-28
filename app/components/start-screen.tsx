'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login, register } from '../actions/auth';

interface StartScreenProps {
  onStartGame: (playerName: string) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (action: 'login' | 'register') => {
    setIsLoading(true);
    setMessage('');

    try {
      const result = action === 'login' 
        ? await login(name, password)
        : await register(name, password);

      if (result.success) {
        onStartGame(name);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('Произошла ошибка при аутентификации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Добро пожаловать в игру "Три в ряд"</h1>
        <Input
          type="text"
          placeholder="Имя игрока"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <div className="flex justify-between">
          <Button onClick={() => handleAuth('login')} disabled={isLoading}>
            Войти
          </Button>
          <Button onClick={() => handleAuth('register')} disabled={isLoading}>
            Регистрация
          </Button>
        </div>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

