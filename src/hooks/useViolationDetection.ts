import { useEffect, useState, useRef } from 'react';

export const useViolationDetection = (isActive: boolean = true) => {
  const [violationDetected, setViolationDetected] = useState(false);
  const consoleCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const devToolsCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastWidthRef = useRef<number>(window.innerWidth);
  const lastHeightRef = useRef<number>(window.innerHeight);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    // Отслеживание перехода на другую вкладку и скрытия браузера
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationDetected(true);
      }
    };

    // Отслеживание потери фокуса (blur) - скрытие браузера
    const handleBlur = () => {
      setViolationDetected(true);
    };

    // Отслеживание открытия инструментов разработчика через изменение размеров окна
    const checkDevTools = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Проверка разницы между внешними и внутренними размерами окна
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const threshold = 160;

      // Если разница значительна, возможно открылись DevTools
      if (widthDiff > threshold || heightDiff > threshold) {
        setViolationDetected(true);
      }

      lastWidthRef.current = currentWidth;
      lastHeightRef.current = currentHeight;
    };

    // Проверка на открытие DevTools через изменение размеров
    devToolsCheckIntervalRef.current = setInterval(checkDevTools, 500);

    // Проверка на открытие консоли через изменение размеров
    const detectConsole = () => {
      const threshold = 160;

      consoleCheckIntervalRef.current = setInterval(() => {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if (widthDiff > threshold || heightDiff > threshold) {
          setViolationDetected(true);
        }
      }, 500);
    };

    detectConsole();

    // Отслеживание событий клавиатуры для F12 и Ctrl+Shift+I
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        setViolationDetected(true);
        return false;
      }
      // Ctrl+Shift+I или Ctrl+Shift+J
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')
      ) {
        e.preventDefault();
        setViolationDetected(true);
        return false;
      }
      // Ctrl+U (просмотр исходного кода)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        setViolationDetected(true);
        return false;
      }
      // Ctrl+Shift+C (инспектор элементов)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'C' || e.key === 'c')
      ) {
        e.preventDefault();
        setViolationDetected(true);
        return false;
      }
    };

    // Отслеживание открытия контекстного меню (правый клик)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setViolationDetected(true);
      return false;
    };

    // Подписка на события
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Очистка
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      if (consoleCheckIntervalRef.current) {
        clearInterval(consoleCheckIntervalRef.current);
      }
      if (devToolsCheckIntervalRef.current) {
        clearInterval(devToolsCheckIntervalRef.current);
      }
    };
  }, [isActive]);

  return violationDetected;
};

