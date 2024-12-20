'use server'

import { cookies } from 'next/headers';
import { createUser, getUser, User } from '../lib/db';

export async function register(name: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  console.log('Server: Attempting to register user:', name);
  try {
    console.log('Server: Checking if user already exists...');
    const existingUser = await getUser(name);
    if (existingUser) {
      console.log('Server: User already exists:', name);
      return { success: false, message: 'Пользователь с таким именем уже существует' };
    }

    console.log('Server: Creating new user...');
    const newUser = { name, password, highScore: 0, totalScore: 0 };
    await createUser(newUser);
    cookies().set('user', name);
    console.log('Server: User registered successfully:', name);
    return { success: true, message: 'Регистрация успешна', user: newUser };
  } catch (error) {
    console.error('Server: Error during registration:', error);
    return { 
      success: false, 
      message: `Произошла ошибка при регистрации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
    };
  }
}

export async function login(name: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  console.log('Server: Attempting to log in user:', name);
  try {
    console.log('Server: Getting user from database...');
    const user = await getUser(name);
    if (!user || user.password !== password) {
      console.log('Server: Login failed for user:', name);
      return { success: false, message: 'Неверное имя пользователя или пароль' };
    }

    cookies().set('user', name);
    console.log('Server: User logged in successfully:', name);
    return { success: true, message: 'Вход выполнен успешно', user };
  } catch (error) {
    console.error('Server: Error during login:', error);
    return { 
      success: false, 
      message: `Произошла ошибка при входе: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
    };
  }
}

export async function logout() {
  cookies().delete('user');
  console.log('Server: User logged out');
}

