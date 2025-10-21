'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePress } from '@/hooks/usePress';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function PressPage() {
  const { pressItems, loading, error } = usePress();
  const [activeTab, setActiveTab] = useState<'press_release' | 'news'>('press_release');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const filteredItems = pressItems.filter(item => 
    item.type === activeTab
  );

  const pressReleases = pressItems.filter(item => item.type === 'press_release');
  const news = pressItems.filter(item => item.type === 'news');

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-4">
            Press
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news and press releases from Gulshan Club.
          </p>
        </div>

        {/* Toggle System */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('press_release')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'press_release'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>📄</span>
                <span>Press Releases ({pressReleases.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'news'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>📰</span>
                <span>News ({news.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No {activeTab === 'press_release' ? 'press releases' : 'news'} found
              </h2>
              <p className="text-gray-400">
                No {activeTab === 'press_release' ? 'press releases' : 'news'} are available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredItems.map((item) => (
                <div key={item.id} className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        item.type === 'press_release' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      }`}>
                        {item.type === 'press_release' ? '📄 Press Release' : '📰 News'}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(item.publish_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-6 group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h2>

                    {item.image && (
                      <div className="mb-8 rounded-2xl overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.title}
                          width={300}
                          height={300}
                          className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {item.type === 'press_release' && item.content && (
                      <div className="prose prose-invert max-w-none mb-8">
                        <div 
                          className="text-gray-300 leading-relaxed text-lg"
                          dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }}
                        />
                      </div>
                    )}

                    {item.type === 'news' && item.news_link && (
                      <div className="mb-8">
                        <a 
                          href={item.news_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-xl"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Read Full Article
                        </a>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-6 text-sm text-gray-400 pt-6 border-t border-white/10">
                      {item.author_name && (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-white font-medium">{item.author_name}</span>
                        </span>
                      )}
                      {item.source && (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          <span className="text-white font-medium">{item.source}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
