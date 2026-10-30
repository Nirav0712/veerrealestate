'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Video,
  ExternalLink,
  X,
  Building2,
  ArrowUpRight,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface SocialVideoItem {
  id: number;
  title: string;
  platform: 'instagram' | 'youtube';
  video_url: string;
  project_id: number | null;
  project_name: string | null;
  project_slug: string | null;
  project_zone: string | null;
  project_url: string | null;
  thumbnail_url: string | null;
  description: string | null;
  display_order: number;
  is_active: number | boolean;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const shorts = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return shorts[1];
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return watch[1];
  const be = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (be) return be[1];
  const embed = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return embed[1];
  return null;
}

function extractInstagramCode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/(reel|p)\/([a-zA-Z0-9_-]+)/);
  return match ? match[2] : null;
}

export default function ProjectsInMotion() {
  const [videos, setVideos] = useState<SocialVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);
  const [activeModalVideo, setActiveModalVideo] = useState<SocialVideoItem | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollPosRef = useRef<number>(0);

  // 1. Load active social videos from database
  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        const res = await fetch('/api/social-videos');
        if (res.ok) {
          const data = await res.json();
          setVideos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load social videos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // 2. High-speed continuous smooth scrolling (Never pauses on mouse hover/scroll)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || videos.length === 0) return;

    let animId: number;
    let lastTime = performance.now();
    // Fast, lively continuous speed: 220 pixels per second
    const speed = 220;

    const step = (now: number) => {
      if (!container) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Increment position continuously
      scrollPosRef.current += speed * Math.min(dt, 0.1);

      const halfWidth = container.scrollWidth / 2;
      if (scrollPosRef.current >= halfWidth) {
        scrollPosRef.current -= halfWidth;
      }

      container.scrollLeft = scrollPosRef.current;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [videos.length]);

  // 3. Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalVideo(null);
      }
    };
    if (activeModalVideo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModalVideo]);

  const handleMouseEnter = (videoId: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredVideoId(videoId);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoveredVideoId(null);
  };

  // 4. Manual Arrow Navigation (Next / Prev)
  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    const targetScroll =
      direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
    scrollPosRef.current = Math.max(0, targetScroll);
  };

  if (loading) {
    return (
      <section className="py-10 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">PROJECTS IN MOTION</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our properties and projects through videos, reels and walkthroughs.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  // Duplicate items array so continuous horizontal scrolling runs seamlessly
  const duplicatedVideos =
    videos.length < 5
      ? [...videos, ...videos, ...videos, ...videos]
      : [...videos, ...videos];

  return (
    <section className="py-10 md:py-20 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4">
        {/* Section Header with Clean Arrow Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
              PROJECTS IN MOTION
            </h2>
            <p className="text-xl text-gray-600">
              Explore our properties and projects through videos, reels and walkthroughs.
            </p>
          </div>

          {/* Manual Arrow Controls (Positioned cleanly in header, not covering cards) */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
            <button
              onClick={() => handleManualScroll('left')}
              className="w-11 h-11 rounded-full bg-white hover:bg-secondary text-secondary hover:text-white shadow-md border border-gray-200 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Previous Video"
              aria-label="Previous Video"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleManualScroll('right')}
              className="w-11 h-11 rounded-full bg-white hover:bg-secondary text-secondary hover:text-white shadow-md border border-gray-200 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Next Video"
              aria-label="Next Video"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Track Container with Edge Fades */}
      <div className="relative w-full">
        {/* Left Fade Gradient */}
        <div className="absolute left-0 top-0 h-full w-12 md:w-20 bg-linear-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />

        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 h-full w-12 md:w-20 bg-linear-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

        {/* Horizontal Slider Track (Continuous Fast Scroll & Manual Drag) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth py-4 px-6 md:px-12 no-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedVideos.map((item, index) => {
            const isYouTube = item.platform === 'youtube';
            const isInstagram = item.platform === 'instagram';
            const ytId = isYouTube ? extractYouTubeId(item.video_url) : null;
            const igCode = isInstagram ? extractInstagramCode(item.video_url) : null;
            const isHovered = hoveredVideoId === item.id;

            const displayThumb =
              item.thumbnail_url ||
              (ytId
                ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80');

            return (
              <div
                key={`${item.id}-${index}`}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setActiveModalVideo(item)}
                className="min-w-[270px] sm:min-w-[290px] max-w-[300px] aspect-9/16 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative group cursor-pointer flex flex-col justify-between"
              >
                {/* 1. Cover Image or Muted Video Preview */}
                <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                  {isYouTube && ytId && isHovered ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${ytId}&playsinline=1`}
                      title={item.title}
                      allow="autoplay; encrypted-media"
                      className="w-full h-full object-cover scale-150 pointer-events-none transition-opacity duration-300"
                    />
                  ) : (
                    <img
                      src={displayThumb}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />
                </div>

                {/* 2. Top Header: Platform Badge & Linked Project Pill */}
                <div className="relative z-10 p-3.5 flex items-start justify-between gap-2">
                  <div>
                    {isInstagram ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-sm">
                        <Video className="w-3.5 h-3.5" /> Reel
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-sm">
                        <Play className="w-3.5 h-3.5 fill-white" /> Shorts
                      </span>
                    )}
                  </div>

                  {item.project_name && item.project_url && (
                    <Link
                      href={item.project_url}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      title={`Visit ${item.project_name}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 hover:bg-primary text-secondary hover:text-white border border-gray-200 text-xs font-bold shadow-sm transition-colors duration-200 max-w-[55%]"
                    >
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.project_name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-70 shrink-0" />
                    </Link>
                  )}
                </div>

                {/* 3. Center Play Icon Button */}
                <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
                  {!(isYouTube && ytId && isHovered) && (
                    <div className="w-13 h-13 rounded-full bg-primary text-white flex items-center justify-center shadow-xl group-hover:scale-115 transition-all duration-300">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  )}
                  {isYouTube && ytId && isHovered && (
                    <div className="absolute bottom-16 right-3.5 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-semibold text-white flex items-center gap-1 shadow-sm">
                      <Volume2 className="w-3.5 h-3.5 text-primary" /> Muted Preview
                    </div>
                  )}
                </div>

                {/* 4. Bottom Video Info */}
                <div className="relative z-10 p-4 pt-8 bg-linear-to-t from-black/90 via-black/60 to-transparent space-y-1">
                  <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug drop-shadow-sm">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-200 text-xs line-clamp-2 leading-relaxed opacity-90">
                      {item.description}
                    </p>
                  )}
                  <div className="pt-1 flex items-center justify-between text-xs font-medium text-white/90">
                    <span className="flex items-center gap-1 text-primary-light text-[11px]">
                      <Play className="w-3 h-3 fill-current" /> Tap to watch
                    </span>
                    {item.project_name && (
                      <span className="text-gray-300 text-[10px] truncate max-w-[120px]">
                        {item.project_zone || ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          FULL PLAYBACK MODAL (NO DIRECT LINK)
          ======================================================== */}
      {activeModalVideo && (
        <div
          onClick={() => setActiveModalVideo(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-gray-200 animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 truncate">
                {activeModalVideo.platform === 'instagram' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-linear-to-r from-pink-500 to-purple-600 text-white">
                    Instagram Reel
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                    YouTube Shorts
                  </span>
                )}
                <h4 className="font-bold text-sm text-secondary truncate">
                  {activeModalVideo.title}
                </h4>
              </div>

              <button
                onClick={() => setActiveModalVideo(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative bg-black flex items-center justify-center aspect-9/16 max-h-[68vh] w-full mx-auto">
              {activeModalVideo.platform === 'youtube' ? (
                (() => {
                  const ytId = extractYouTubeId(activeModalVideo.video_url);
                  if (ytId) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
                        title={activeModalVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    );
                  }
                  return (
                    <div className="p-8 text-center text-gray-300">
                      <p>Unable to embed this YouTube video directly.</p>
                      <a
                        href={activeModalVideo.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold"
                      >
                        <ExternalLink className="w-4 h-4" /> Watch on YouTube
                      </a>
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const igCode = extractInstagramCode(activeModalVideo.video_url);
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      {igCode ? (
                        <iframe
                          src={`https://www.instagram.com/reel/${igCode}/embed/`}
                          title={activeModalVideo.title}
                          className="w-full h-full border-0 rounded-lg"
                          allowTransparency
                        />
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-200">
                            Watch this reel directly on Instagram.
                          </p>
                          <a
                            href={activeModalVideo.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:opacity-95"
                          >
                            <ExternalLink className="w-4 h-4" /> Watch Reel on Instagram
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>

            {/* Modal Footer (Clean without Direct Link) */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="truncate text-xs text-gray-600 text-center sm:text-left">
                {activeModalVideo.description || activeModalVideo.title}
              </div>

              {activeModalVideo.project_name && activeModalVideo.project_url && (
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={activeModalVideo.project_url}
                    onClick={() => setActiveModalVideo(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary-dark text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>View {activeModalVideo.project_name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
