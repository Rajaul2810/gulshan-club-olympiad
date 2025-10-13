'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMedia } from '@/hooks/useMedia';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const MediaPage = () => {
  const { media, loading } = useMedia();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Filter media by type
  const photos = media.filter((m) => m.type === 'photo');
  const videos = media.filter((m) => m.type === 'video');

  // Helper to extract YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match?.[1] || null;
  };

  const mediaTypes = [
    {
      id: 'photos',
      name: 'Photos',
      icon: '📸',
      color: 'from-pink-400 to-rose-500',
      description: 'Capture the moments and memories from Olympiad 2025',
      count: photos.length,
    },
    {
      id: 'videos',
      name: 'Videos',
      icon: '🎥',
      color: 'from-blue-400 to-cyan-500',
      description: 'Watch the thrilling action and highlights from all competitions',
      count: videos.length,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-neutral-900 via-purple-900 to-neutral-800 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-tr from-pink-500 to-purple-500 opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-15 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Media Gallery
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Relive the excitement through our collection of photos and videos from Olympiad 2025
            </p>
          </div>
        </section>

        {/* Media Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            {/* Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {mediaTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id as 'photos' | 'videos')}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === type.id
                      ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span className="text-xl">{type.icon}</span>
                  <span>{type.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {loading ? '...' : type.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Photos Tab */}
            {!loading && activeTab === 'photos' && (
              <div className="animate-fade-in">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                    Photos Gallery
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Capture the moments and memories from Olympiad 2025
                  </p>
                </div>

                {/* Photos Grid */}
                {photos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="relative group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Card Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500 opacity-20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        
                        {/* Main Card */}
                        <div className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                          {/* Image */}
                          <div className="aspect-video relative bg-neutral-800">
                            <Image
                              src={photo.url}
                              alt={photo.title}
                              fill
                              className="object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">
                              {photo.title}
                            </h3>
                            
                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                                {photo.sport}
                              </span>
                            </div>

                            {/* Description */}
                            {photo.description && (
                              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                {photo.description}
                              </p>
                            )}

                            {/* Date */}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(photo.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl">
                    <p className="text-gray-400 text-lg">No photos available yet</p>
                    <p className="text-gray-500 text-sm mt-2">Photos will be added soon</p>
                  </div>
                )}
              </div>
            )}

            {/* Videos Tab */}
            {!loading && activeTab === 'videos' && (
              <div className="animate-fade-in">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                    Videos Gallery
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Watch the thrilling action and highlights from all competitions
                  </p>
                </div>

                {/* Videos Grid */}
                {videos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => {
                      const videoId = video.youtube_url ? getYouTubeVideoId(video.youtube_url) : null;

                      return (
                        <div
                          key={video.id}
                          className="relative group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Card Background Glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                          
                          {/* Main Card */}
                          <div className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                            {/* Video Embed or Thumbnail */}
                            <div className="aspect-video relative bg-neutral-800">
                              {videoId ? (
                                <button
                                  onClick={() => setSelectedVideo(video.id)}
                                  className="w-full h-full relative"
                                >
                                  <Image
                                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                    alt={video.title}
                                    fill
                                    className="object-cover"
                                  />
                                  {/* Play Button Overlay */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
                                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                </button>
                              ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                  No video available
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">
                                {video.title}
                              </h3>
                              
                              {/* Category Badge */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                                  {video.sport}
                                </span>
                              </div>

                              {/* Description */}
                              {video.description && (
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                  {video.description}
                                </p>
                              )}

                              {/* Date */}
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(video.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl">
                    <p className="text-gray-400 text-lg">No videos available yet</p>
                    <p className="text-gray-500 text-sm mt-2">Videos will be added soon</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 sm:bg-black/70 backdrop-blur-sm sm:backdrop-blur">
          <div className="
            w-full max-w-lg
            sm:max-w-xl 
            md:max-w-2xl 
            lg:max-w-3xl 
            xl:max-w-4xl
            mx-auto
            bg-transparent
          ">
            {/* Close Button */}
            <div className="flex justify-end mb-2 sm:mb-4">
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-white hover:bg-white/20 p-2 sm:p-3 rounded-full transition-colors bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className="relative bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              {(() => {
                const video = videos.find((v) => v.id === selectedVideo);
                const videoId = video?.youtube_url ? getYouTubeVideoId(video.youtube_url) : null;

                return videoId ? (
                  <>
                    {/* YouTube Embed */}
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={video?.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>

                    {/* Video Info */}
                    <div className="p-4 sm:p-6 border-t border-white/10">
                      <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">{video?.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                        <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          {video?.sport}
                        </span>
                        <span className="text-gray-400 text-xs sm:text-sm">
                          {video?.created_at && new Date(video.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {video?.description && (
                        <p className="text-gray-300 text-sm sm:text-base">{video.description}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="aspect-video flex items-center justify-center">
                    <p className="text-gray-400">Video not available</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
