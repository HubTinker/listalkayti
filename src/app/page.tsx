'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Instagram, Youtube, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type VideoType = 'instagram' | 'tiktok' | 'youtube';

interface Video {
  id: number;
  type: VideoType;
  originalUrl: string;
  embedUrl: string | null;
  title: string;
  platform: string;
}

const VIDEOS: Video[] = [
  {
    id: 3,
    type: 'tiktok',
    originalUrl: 'https://www.tiktok.com/@edisashahini/video/7585313280596512022',
    embedUrl: 'https://www.tiktok.com/embed/v2/7585313280596512022',
    title: 'TikTok by @edisashahini',
    platform: 'TikTok'
  },
  {
    id: 4,
    type: 'tiktok',
    originalUrl: 'https://www.tiktok.com/@collinskey/video/7581609282748124446',
    embedUrl: 'https://www.tiktok.com/embed/v2/7581609282748124446',
    title: 'TikTok by @collinskey',
    platform: 'TikTok'
  },
  {
    id: 5,
    type: 'youtube',
    originalUrl: 'https://www.youtube.com/shorts/kODq1PfF8Fg',
    embedUrl: 'https://www.youtube.com/embed/kODq1PfF8Fg',
    title: 'YouTube Short #1',
    platform: 'YouTube'
  },
  {
    id: 6,
    type: 'youtube',
    originalUrl: 'https://www.youtube.com/shorts/3foTo6ziyy4',
    embedUrl: 'https://www.youtube.com/embed/3foTo6ziyy4',
    title: 'YouTube Short #2',
    platform: 'YouTube'
  },
  {
    id: 7,
    type: 'youtube',
    originalUrl: 'https://www.youtube.com/shorts/LclT6fR5NbQ',
    embedUrl: 'https://www.youtube.com/embed/LclT6fR5NbQ',
    title: 'YouTube Short #3',
    platform: 'YouTube'
  }
];

export default function VideoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentVideo = VIDEOS[currentIndex];

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevVideo();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextVideo();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Свайпы для мобильных
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextVideo();
      } else {
        prevVideo();
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
    setIsPlaying(true);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
    setIsPlaying(true);
  };

  const getPlatformIcon = (type: VideoType) => {
    switch (type) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      case 'tiktok':
        return <Smartphone className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (type: VideoType) => {
    switch (type) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'youtube':
        return 'bg-red-600';
      case 'tiktok':
        return 'bg-black';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4 md:p-8">
      {/* Мобильный контейнер */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-[12px] border-gray-900">
        {/* Камера iPhone */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-50"></div>

        {/* Статус бар */}
        <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-8 z-40">
          <span className="text-sm font-medium">9:41</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Основной контент */}
        <div
          className="w-full h-full pt-12 pb-24"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {/* Видео контейнер */}
              <div className="relative w-full h-full bg-black">
                {currentVideo.type === 'youtube' && currentVideo.embedUrl && (
                  <iframe
                    ref={iframeRef}
                    src={`${currentVideo.embedUrl}?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                )}

                {currentVideo.type === 'tiktok' && currentVideo.embedUrl && (
                  <iframe
                    src={currentVideo.embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                )}

                {currentVideo.type === 'instagram' && (
                  <div className="w-full h-full relative">
                    {/* Instagram виджет */}
                    <blockquote
                      className="instagram-media w-full h-full"
                      data-instgrm-permalink={currentVideo.originalUrl}
                      data-instgrm-version="14"
                      data-instgrm-captioned
                      style={{
                        minWidth: '326px',
                        maxWidth: '540px',
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        padding: 0
                      }}
                    />

                    {/* Резервная ссылка */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <a
                        href={currentVideo.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-colors"
                      >
                        Открыть в Instagram
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Оверлей с информацией */}
          <div className="absolute bottom-24 left-0 right-0 px-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 ${getPlatformColor(currentVideo.type)} text-white px-3 py-1 rounded-full`}>
                {getPlatformIcon(currentVideo.type)}
                <span className="text-sm font-medium">{currentVideo.platform}</span>
              </div>

              <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-medium">
                  {currentIndex + 1} / {VIDEOS.length}
                </span>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>

            {isMobile && (
              <div className="text-center text-gray-400 text-sm mt-4">
                Свайпайте влево/вправо для навигации
              </div>
            )}
          </div>
        </div>

        {/* Навигационные кнопки */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-8">
          <button
            onClick={prevVideo}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
            aria-label="Предыдущее видео"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7" />
            )}
          </button>

          <button
            onClick={nextVideo}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
            aria-label="Следующее видео"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Инструкция для ПК */}
      {!isMobile && (
        <div className="mt-8 text-center text-gray-400">
          <p className="mb-2">Используйте ← → стрелки для навигации, пробел для паузы</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Instagram</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>YouTube</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black"></div>
              <span>TikTok</span>
            </div>
          </div>
        </div>
      )}

      {/* Информация для клиента */}
      <div className="mt-8 max-w-2xl text-center text-gray-400 text-sm">
        <p>📱 Прототип видео-галереи под размер iPhone 16 (390×844)</p>
        <p className="mt-1">✅ Готов к интеграции с Google Sheets и добавлению функционала "поделиться"</p>
      </div>
    </div>
  );
}