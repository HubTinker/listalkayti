'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlay, FaPause } from 'react-icons/fa';

// Хардкод ссылок (можно менять)
const VIDEO_URLS = [
  // YouTube видео
  { id: 1, type: 'youtube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: 2, type: 'youtube', url: 'https://www.youtube.com/embed/9bZkp7q19f0' },

  // TikTok видео (embed ссылки)
  { id: 3, type: 'tiktok', url: 'https://www.tiktok.com/embed/v2/7316948841556372742' },
  { id: 4, type: 'tiktok', url: 'https://www.tiktok.com/embed/v2/7316948841556372742' },

  // Ещё YouTube
  { id: 5, type: 'youtube', url: 'https://www.youtube.com/embed/jNQXAC9IVRw' },
];

export default function VideoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevVideo();
      if (e.key === 'ArrowRight') nextVideo();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % VIDEO_URLS.length);
    setHasError(false);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + VIDEO_URLS.length) % VIDEO_URLS.length);
    setHasError(false);
  };

  const currentVideo = VIDEO_URLS[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎬 Видео-галерея</h1>
          <p className="text-gray-400">Прототип листалки (без интеграций)</p>
          <div className="text-sm text-gray-500 mt-4">
            Используйте ← → или кнопки. Пробел — пауза
          </div>
        </div>

        {/* Основной контейнер */}
        <div className="relative bg-gray-800 rounded-2xl p-4 md:p-6 shadow-2xl">
          {/* Счетчик */}
          <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentIndex + 1} / {VIDEO_URLS.length}
          </div>

          {/* Видео контейнер */}
          <div className="aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden bg-black relative">
            {hasError ? (
              <div className="h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <p>Не удалось загрузить видео</p>
                  <button
                    onClick={() => setHasError(false)}
                    className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
                  >
                    Повторить
                  </button>
                </div>
              </div>
            ) : currentVideo.type === 'youtube' ? (
              <iframe
                key={currentVideo.id}
                src={`${currentVideo.url}?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setHasError(true)}
              />
            ) : (
              <iframe
                key={currentVideo.id}
                src={currentVideo.url}
                className="w-full h-full"
                allowFullScreen
                onError={() => setHasError(true)}
              />
            )}
          </div>

          {/* Кнопки управления */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <button
              onClick={prevVideo}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
              aria-label="Предыдущее видео"
            >
              <FaArrowLeft className="text-2xl text-white" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
            >
              {isPlaying ? (
                <FaPause className="text-2xl text-white" />
              ) : (
                <FaPlay className="text-2xl text-white" />
              )}
            </button>

            <button
              onClick={nextVideo}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
              aria-label="Следующее видео"
            >
              <FaArrowRight className="text-2xl text-white" />
            </button>
          </div>

          {/* Индикатор платформы */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full">
              <div className={`w-3 h-3 rounded-full ${currentVideo.type === 'youtube' ? 'bg-red-500' : 'bg-black'}`} />
              <span className="text-white">
                {currentVideo.type === 'youtube' ? 'YouTube' : 'TikTok'}
              </span>
            </div>
          </div>
        </div>

        {/* Подсказки для будущего функционала */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Планируется</h3>
            <ul className="text-gray-400 space-y-2">
              <li>✓ Интеграция с Google Sheets</li>
              <li>✓ Автор видео</li>
              <li>✓ Кнопка "Поделиться"</li>
              <li>✓ Загрузка новых таблиц</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Технологии</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Next.js 14</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Vercel</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Быстрые клавиши</h3>
            <ul className="text-gray-400 space-y-2">
              <li>← → — навигация</li>
              <li>Пробел — пауза</li>
              <li>F — полный экран</li>
              <li>R — перезагрузить</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}