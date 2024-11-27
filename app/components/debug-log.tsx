'use client'

import React, { useState, useEffect } from 'react';

export const DebugLog: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = (...args) => {
      setLogs(prev => [...prev, `LOG: ${args.join(' ')}`]);
      originalConsoleLog.apply(console, args);
    };

    console.error = (...args) => {
      setLogs(prev => [...prev, `ERROR: ${args.join(' ')}`]);
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg max-h-60 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Debug Logs:</h3>
      {logs.map((log, index) => (
        <pre key={index} className="text-sm">{log}</pre>
      ))}
    </div>
  );
};

