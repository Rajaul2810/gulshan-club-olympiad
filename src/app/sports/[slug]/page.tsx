"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { sportsCategories, sportNameToSlug } from "@/components/SportsCategory";
import { useFixtures } from "@/hooks/useFixtures";
import { useMedia } from "@/hooks/useMedia";
import { useResults } from "@/hooks/useResults";
// import { useClubs } from "@/hooks/useClubs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const SportDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState<"fixtures" | "media" | "results">("fixtures");
  const [mediaView, setMediaView] = useState<"photos" | "videos">("photos");

  // Download function for images
  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Fetch real data from Supabase
  const { fixtures, loading: fixturesLoading } = useFixtures();
  const { media, loading: mediaLoading } = useMedia();
  const { results, loading: resultsLoading } = useResults();
  // const { clubs } = useClubs();

  // Find the sport from slug
  const sport = useMemo(() => {
    return sportsCategories.find((s) => sportNameToSlug(s.name) === slug);
  }, [slug]);

  // Filter data by sport name
  const sportFixtures = useMemo(() => {
    if (!sport) return [];
    return fixtures.filter((f) => f.sport === sport.name);
  }, [fixtures, sport]);

  const sportMedia = useMemo(() => {
    if (!sport) return { photos: [], videos: [] };
    const filtered = media.filter((m) => m.sport === sport.name);
    return {
      photos: filtered.filter((m) => m.type === 'photo'),
      videos: filtered.filter((m) => m.type === 'video'),
    };
  }, [media, sport]);

  const sportResults = useMemo(() => {
    if (!sport) return [];
    return results.filter((r) => r.sport === sport.name);
  }, [results, sport]);

  // Helper to get team name
  // const getTeamName = (teamId: string) => {
  //   const team = clubs.find((c) => c.id === teamId);
  //   return team?.name || 'Unknown Team';
  // };

  // Helper to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match?.[1] || '';
  };

  if (!sport) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sport Not Found</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 right-10 w-32 h-32 bg-gradient-to-tr ${sport.color} opacity-20 rounded-full blur-3xl`}></div>
          <div className={`absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br ${sport.color} opacity-15 rounded-full blur-3xl`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Sport Icon */}
            <div className={`text-8xl sm:text-9xl bg-gradient-to-br ${sport.color} bg-clip-text`}>
              {sport.icon}
            </div>

            {/* Sport Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${sport.genderColor}`}>
                  {sport.gender}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">Olympiad 2025</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
                {sport.name}
              </h1>
              
              <div className={`w-24 h-1 bg-gradient-to-r ${sport.color} rounded-full mb-6 mx-auto md:mx-0`}></div>
              
              <p className="text-xl text-gray-300 max-w-2xl">
                View fixtures, results, photos, and videos from this exciting sport category.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("fixtures")}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "fixtures"
                  ? `text-orange-400 border-b-2 border-orange-400`
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📅 Fixtures ({sportFixtures.length})
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "media"
                  ? "text-orange-400 border-b-2 border-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              📸 Media ({sportMedia.photos.length + sportMedia.videos.length})
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "results"
                  ? "text-orange-400 border-b-2 border-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              🏆 Results ({sportResults.length})
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Fixtures Tab */}
          {activeTab === "fixtures" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Fixture Images
                </h2>
                <p className="text-gray-300">
                  Official fixture images and schedules for {sport.name}
                </p>
              </div>

              {fixturesLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : sportFixtures.length > 0 ? (
                <div className="grid grid-cols-1">
                  {sportFixtures.map((fixture) => (
                    <div
                      key={fixture.id}
                      className="relative group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300"
                    >
                      <div className="relative bg-neutral-800 w-full h-[500px] m-2">
                        <Image
                          src={fixture.fixture_image}
                          alt={`${fixture.sport} fixture`}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                         */}
                        {/* Download Button */}
                        <button
                          onClick={() => downloadImage(fixture.fixture_image, `${fixture.sport}_fixture_${fixture.id}.jpg`)}
                          className="absolute top-4 right-4 bg-pink-500 flex items-center gap-2 cursor-pointer hover:bg-pink-600 text-white p-2 rounded-md opacity-100 transition-all duration-300 backdrop-blur-sm"
                          title="Download image"
                        >
                          <p className="text-white font-medium">Download</p>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-2xl">
                  <p className="text-gray-400 text-lg">No fixture images available yet</p>
                  <p className="text-gray-500 text-sm mt-2">Fixture images will be uploaded soon</p>
                </div>
              )}
            </div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Photos & Videos
                </h2>
                <p className="text-gray-300">
                  Capture the best moments from the matches
                </p>
              </div>

              {/* Media Type Toggle */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setMediaView("photos")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    mediaView === "photos"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  📸 Photos ({sportMedia.photos.length})
                </button>
                <button
                  onClick={() => setMediaView("videos")}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    mediaView === "videos"
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  🎥 Videos ({sportMedia.videos.length})
                </button>
              </div>

              {mediaLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <>
                  {/* Photos Grid */}
                  {mediaView === "photos" && (
                    sportMedia.photos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {sportMedia.photos.map((photo: any) => (
                          <div
                            key={photo.id}
                            className="relative group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300"
                          >
                            <div className="aspect-video relative bg-neutral-800">
                              <Image
                                src={photo.url}
                                alt={photo.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              
                              {/* Download Button for Photos */}
                              <button
                                onClick={() => downloadImage(photo.url, `${photo.title || 'photo'}_${photo.id}.jpg`)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                title="Download photo"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="p-4">
                              <p className="text-white font-medium">{photo.title}</p>
                              {photo.description && (
                                <p className="text-gray-400 text-sm mt-1">{photo.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white/5 rounded-2xl">
                        <p className="text-gray-400 text-lg">No photos available yet</p>
                        <p className="text-gray-500 text-sm mt-2">Photos will be added soon</p>
                      </div>
                    )
                  )}

                  {/* Videos Grid */}
                  {mediaView === "videos" && (
                    sportMedia.videos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {sportMedia.videos.map((video: any) => {
                          const videoId = getYouTubeVideoId(video.youtube_url || '');
                          const thumbnailUrl = videoId 
                            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                            : '/images/video-placeholder.jpg';

                          return (
                            <a
                              key={video.id}
                              href={video.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 cursor-pointer"
                            >
                              <div className="aspect-video relative bg-neutral-800">
                                <Image
                                  src={thumbnailUrl}
                                  alt={video.title}
                                  fill
                                  className="object-cover"
                                />
                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
                                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <p className="text-white font-medium">{video.title}</p>
                                {video.description && (
                                  <p className="text-gray-400 text-sm mt-1">{video.description}</p>
                                )}
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white/5 rounded-2xl">
                        <p className="text-gray-400 text-lg">No videos available yet</p>
                        <p className="text-gray-500 text-sm mt-2">Videos will be added soon</p>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Match Results
                </h2>
                <p className="text-gray-300">
                  Recent match outcomes and winners
                </p>
              </div>

              {resultsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : sportResults.length > 0 ? (
                <div className="grid gap-6">
                  {sportResults.map((result) => {
                    const winnerName = result.winner?.name || 'Unknown';
                    const loserName = result.loser?.name || 'Unknown';

                    return (
                      <div
                        key={result.id}
                        className="relative group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            {/* Winner */}
                            <div className="flex items-center gap-3">
                              <span className="text-yellow-400 text-2xl">🏆</span>
                              <div className="flex items-center gap-2">
                                {result.winner?.logo && (
                                  <Image
                                    width={100}
                                    height={100}
                                    src={result.winner.logo} 
                                    alt={result.winner.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                )}
                                <div>
                                  <p className="text-white font-semibold text-lg">{winnerName}</p>
                                  <p className="text-yellow-400 text-sm">Winner</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-gray-400 text-xl">vs</div>
                            
                            {/* Loser */}
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400 text-2xl">😔</span>
                              <div className="flex items-center gap-2">
                                {result.loser?.logo && (
                                  <Image
                                    width={100}
                                    height={100}
                                    src={result.loser.logo} 
                                    alt={result.loser.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                )}
                                <div>
                                  <p className="text-gray-300 font-semibold text-lg">{loserName}</p>
                                  <p className="text-gray-400 text-sm">Loser</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-gray-400 text-sm">
                              {new Date(result.created_at).toLocaleDateString()}
                            </div>
                            {result.notes && (
                              <p className="text-gray-400 text-xs italic mt-1">
                                {result.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-2xl">
                  <p className="text-gray-400 text-lg">No results available yet</p>
                  <p className="text-gray-500 text-sm mt-2">Results will be posted after matches are completed</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SportDetailPage;
