'use server'

import { cookies } from 'next/headers';
import { createUser, getUser } from '../lib/db';

export async function register(name: string, password: string) {
  console.log('Attempting to register user:', name);
  try {
    console.log('Checking if user already exists...');
    const existingUser = await getUser(name);
    if (existingUser) {
      console.log('User already exists:', name);
      return { success: false, message: 'Пользователь с таким именем уже существует' };
    }

    console.log('Creating new user...');
    await createUser({ name, password, highScore: 0, totalScore: 0 });
    cookies().set('user', name);
    console.log('User registered successfully:', name);
    return { success: true, message: 'Регистрация успешна' };
  } catch (error) {
    console.error('Error during registration:', error);
    return { 
      success: false, 
      message: `Произошла ошибка при регистрации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
    };
  }
}

export async function login(name: string, password: string) {
  console.log('Attempting to log in user:', name);
  try {
    console.log('Getting user from database...');
    const user = await getUser(name);
    if (!user || user.password !== password) {
      console.log('Login failed for user:', name);
      return { success: false, message: 'Неверное имя пользователя или пароль' };
    }

    cookies().set('user', name);
    console.log('User logged in successfully:', name);
    return { success: true, message: 'Вход выполнен успешно' };
  } catch (error) {
    console.error('Error during login:', error);
    return { 
      success: false, 
      message: `Произошла ошибка при входе: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
    };
  }
}

export async function logout() {
  cookies().delete('user');
  console.log('User logged out');
}

