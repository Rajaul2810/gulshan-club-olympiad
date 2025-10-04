'use client';

import React, { useState } from 'react';

const mediaTypes = [
  {
    id: 'photos',
    name: 'Photos',
    icon: '📸',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20',
    borderColor: 'border-pink-400/30',
    glowColor: 'shadow-pink-500/20',
    description: 'Capture the moments and memories from Olympiad 2025',
    count: '500+',
    items: [
      { id: 1, title: 'Opening Ceremony Highlights', category: 'Ceremony', views: '2.5K' },
      { id: 2, title: 'Athletics Competition Moments', category: 'Sports', views: '1.8K' },
      { id: 3, title: 'Team Celebrations', category: 'Celebration', views: '3.2K' },
      { id: 4, title: 'Award Ceremony Photos', category: 'Awards', views: '2.1K' },
      { id: 5, title: 'Behind the Scenes', category: 'BTS', views: '1.5K' },
      { id: 6, title: 'Venue and Facilities', category: 'Venue', views: '980' }
    ]
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: '🎥',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20',
    borderColor: 'border-blue-400/30',
    glowColor: 'shadow-blue-500/20',
    description: 'Watch the thrilling action and highlights from all competitions',
    count: '150+',
    items: [
      { id: 1, title: 'Olympiad 2025 Trailer', category: 'Trailer', duration: '2:30', views: '15.2K' },
      { id: 2, title: 'Football Championship Final', category: 'Sports', duration: '45:20', views: '8.7K' },
      { id: 3, title: 'Swimming Records Broken', category: 'Records', duration: '12:15', views: '6.3K' },
      { id: 4, title: 'Opening Ceremony Full Video', category: 'Ceremony', duration: '1:25:30', views: '12.8K' },
      { id: 5, title: 'Best Moments Compilation', category: 'Highlights', duration: '8:45', views: '9.1K' },
      { id: 6, title: 'Closing Ceremony', category: 'Ceremony', duration: '1:15:20', views: '7.4K' }
    ]
  },
  {
    id: 'news',
    name: 'News',
    icon: '📰',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20',
    borderColor: 'border-green-400/30',
    glowColor: 'shadow-green-500/20',
    description: 'Stay updated with the latest news and updates from Olympiad 2025',
    count: '75+',
    items: [
      { id: 1, title: 'Olympiad 2025 Kicks Off with Grand Opening', category: 'Event', date: 'Dec 15, 2024', author: 'Sports Desk' },
      { id: 2, title: 'New Records Set in Swimming Competition', category: 'Achievement', date: 'Dec 16, 2024', author: 'Swimming Reporter' },
      { id: 3, title: 'Football Teams Battle for Championship', category: 'Sports', date: 'Dec 17, 2024', author: 'Football Correspondent' },
      { id: 4, title: 'Arm Wrestling Champions Crowned', category: 'Results', date: 'Dec 18, 2024', author: 'Competition Desk' },
      { id: 5, title: 'Community Spirit Shines at Olympiad', category: 'Community', date: 'Dec 19, 2024', author: 'Community Reporter' },
      { id: 6, title: 'Final Day Preparations Underway', category: 'Updates', date: 'Dec 20, 2024', author: 'Event Coordinator' }
    ]
  }
];

const MediaPage = () => {
  const [activeTab, setActiveTab] = useState('photos');

  return (
    <div className="min-h-screen bg-neutral-900">
      <main className="">
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {mediaTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === type.id
                      ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span className="text-xl">{type.icon}</span>
                  <span>{type.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {type.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {mediaTypes.map((type) => (
              activeTab === type.id && (
                <div key={type.id} className="animate-fade-in">
                  {/* Section Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                      {type.name} Gallery
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                      {type.description}
                    </p>
                  </div>

                  {/* Media Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {type.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Card Background Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                        
                        {/* Main Card */}
                        <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                          
                          {/* Media Icon/Preview */}
                          <div className="mb-4">
                            <div className="w-full h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 border border-white/20">
                              <span className="text-4xl text-white drop-shadow-lg">
                                {type.icon}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-3">
                            {/* Title */}
                            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-orange-300 transition-colors duration-300">
                              {item.title}
                            </h3>

                            {/* Category */}
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                                {item.category}
                              </span>
                            </div>

                            {/* Additional Info */}
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              {type.id === 'videos' ? (
                                <>
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {'duration' in item ? item.duration : ''}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {'views' in item ? item.views : ''}
                                  </span>
                                </>
                              ) : type.id === 'news' ? (
                                <>
                                  <span>{'date' in item ? item.date : ''}</span>
                                  <span>by {'author' in item ? item.author : ''}</span>
                                </>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  {'views' in item ? item.views : ''}
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <button className="w-full mt-4 py-3 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105">
                              {type.id === 'photos' ? 'View Photos' : type.id === 'videos' ? 'Watch Video' : 'Read Article'}
                            </button>
                          </div>

                          {/* Decorative Elements */}
                          <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  <div className="text-center mt-12">
                    <button className="px-8 py-3 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Load More {type.name}
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default MediaPage;