'use client';

import { useState, useRef, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';
import { sportsCategories } from '@/components/SportsCategory';
import { useMedia } from '@/hooks/useMedia';
import { uploadFile } from '@/lib/supabase/client';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from '@/components/ui/ErrorMessage';

const AdminMediaPage = () => {
  const { media, loading, error, addMedia, deleteMedia } = useMedia();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  
  // Form states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter media by type
  const photos = media.filter((m) => m.type === 'photo');
  const videos = media.filter((m) => m.type === 'video');

  // Helper to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match?.[1] || null;
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setSubmitError('Please select a valid image file');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setSubmitError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const sport = formData.get('sport') as string;
    const description = formData.get('description') as string;
    const tagsInput = formData.get('tags') as string;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : null;

    try {
      if (!title || !sport) {
        throw new Error('Please fill in all required fields');
      }

      let mediaUrl = '';
      let youtubeUrl = null;

      if (mediaType === 'photo') {
        // Handle photo upload
        if (!imageFile) {
          throw new Error('Please select an image to upload');
        }

        const timestamp = Date.now();
        const fileName = `${timestamp}-${imageFile.name.replace(/\s/g, '-')}`;
        const { url, error: uploadError } = await uploadFile(
          'media-photos',
          fileName,
          imageFile
        );

        if (uploadError || !url) {
          throw new Error(uploadError?.message || 'Failed to upload image');
        }

        mediaUrl = url;
      } else {
        // Handle video (YouTube URL)
        const videoUrl = formData.get('youtubeUrl') as string;
        
        if (!videoUrl) {
          throw new Error('Please enter a YouTube URL');
        }

        const videoId = extractYouTubeId(videoUrl);
        if (!videoId) {
          throw new Error('Invalid YouTube URL. Please use a valid YouTube video link');
        }

        youtubeUrl = videoUrl;
        // Use YouTube thumbnail as the media URL
        mediaUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      // Add media to database
      const { error: addError } = await addMedia({
        title,
        type: mediaType,
        sport,
        url: mediaUrl,
        youtube_url: youtubeUrl,
        description: description || null,
        tags: tags,
      });

      if (addError) {
        throw new Error(addError);
      }

      setSubmitSuccess(`${mediaType === 'photo' ? 'Photo' : 'Video'} added successfully!`);
      setTimeout(() => {
        setIsAddModalOpen(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add media');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string, url: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeleteLoading(id);
    const { error: delError } = await deleteMedia(id, url);

    if (delError) {
      alert(`Failed to delete: ${delError}`);
    }
    setDeleteLoading(null);
  };

  // Reset form
  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setMediaType('photo');
    setSubmitError(null);
    setSubmitSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Media Management</h1>
            <p className="text-gray-400">Manage photos and videos for Olympiad 2025</p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Media
          </button>
        </div>

        {/* Global Error */}
        {error && <ErrorMessage message={error} />}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Media</p>
            <p className="text-3xl font-bold text-white">
              {loading ? '...' : media.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Photos</p>
            <p className="text-3xl font-bold text-purple-400">
              {loading ? '...' : photos.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Videos</p>
            <p className="text-3xl font-bold text-pink-400">
              {loading ? '...' : videos.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'photos'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📸 Photos ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎥 Videos ({videos.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Photos Grid */}
        {!loading && activeTab === 'photos' && (
          photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
                >
                  {deleteLoading === photo.id && <LoadingOverlay message="Deleting..." />}

                  {/* Image Preview */}
                  <div className="relative aspect-video bg-neutral-800">
                    <Image
                      src={photo.url}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <span className="text-white text-xs">📸 Photo</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-2 line-clamp-1">{photo.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{photo.sport}</p>
                    {photo.description && (
                      <p className="text-gray-500 text-xs mb-2 line-clamp-2">{photo.description}</p>
                    )}
                    <p className="text-gray-500 text-xs mb-4">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(photo.id, photo.url, photo.title)}
                        disabled={deleteLoading === photo.id}
                        className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
                      >
                        {deleteLoading === photo.id ? <LoadingSpinner size="sm" /> : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <p className="text-gray-400 text-lg">No photos available</p>
              <p className="text-gray-500 text-sm mt-2">Upload your first photo to get started</p>
            </div>
          )
        )}

        {/* Videos Grid */}
        {!loading && activeTab === 'videos' && (
          videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => {
                const videoId = video.youtube_url ? extractYouTubeId(video.youtube_url) : null;
                const thumbnailUrl = videoId 
                  ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                  : video.url;

                return (
                  <div
                    key={video.id}
                    className="relative bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
                  >
                    {deleteLoading === video.id && <LoadingOverlay message="Deleting..." />}

                    {/* Video Thumbnail */}
                    <a
                      href={video.youtube_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-video bg-neutral-800 cursor-pointer block"
                    >
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
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <span className="text-white text-xs">🎥 YouTube</span>
                      </div>
                    </a>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-2 line-clamp-1">{video.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{video.sport}</p>
                      {video.description && (
                        <p className="text-gray-500 text-xs mb-2 line-clamp-2">{video.description}</p>
                      )}
                      <p className="text-gray-500 text-xs mb-4">
                        {new Date(video.created_at).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(video.id, video.url, video.title)}
                          disabled={deleteLoading === video.id}
                          className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
                        >
                          {deleteLoading === video.id ? <LoadingSpinner size="sm" /> : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <p className="text-gray-400 text-lg">No videos available</p>
              <p className="text-gray-500 text-sm mt-2">Add your first YouTube video to get started</p>
            </div>
          )
        )}

        {/* Add Media Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">Upload Media</h2>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  disabled={submitLoading}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {submitError && <ErrorMessage message={submitError} />}
                {submitSuccess && <SuccessMessage message={submitSuccess} />}

                {/* Media Type Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">Media Type *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setMediaType('photo')}
                      disabled={submitLoading}
                      className={`p-4 bg-white/10 border-2 rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 ${
                        mediaType === 'photo' 
                          ? 'border-purple-500 bg-purple-500/20' 
                          : 'border-white/20'
                      }`}
                    >
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-white font-medium">Photo</p>
                      <p className="text-gray-400 text-xs">Upload image file</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      disabled={submitLoading}
                      className={`p-4 bg-white/10 border-2 rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 ${
                        mediaType === 'video' 
                          ? 'border-purple-500 bg-purple-500/20' 
                          : 'border-white/20'
                      }`}
                    >
                      <div className="text-4xl mb-2">🎥</div>
                      <p className="text-white font-medium">Video</p>
                      <p className="text-gray-400 text-xs">YouTube link</p>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all disabled:opacity-50"
                    placeholder="Enter media title"
                  />
                </div>

                {/* Sport Category */}
                <div>
                  <label className="block text-white font-medium mb-2">Sport Category *</label>
                  <select 
                    name="sport"
                    required
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-all disabled:opacity-50"
                  >
                    <option value="">Select sport category</option>
                    <option value="General" className="bg-neutral-900">General / Ceremony</option>
                    {sportsCategories.map((sport, index) => (
                      <option key={index} value={sport.name} className="bg-neutral-900">
                        {sport.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload (for photos) - Only show when Photo is selected */}
                {mediaType === 'photo' && (
                  <div>
                    <label className="block text-white font-medium mb-2">Upload Photo *</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={submitLoading}
                      className="hidden"
                    />
                    <div
                      onClick={() => !submitLoading && fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="mx-auto max-h-40 object-contain rounded-lg"
                          />
                          <p className="text-white text-sm mt-2">Click to change</p>
                        </div>
                      ) : (
                        <>
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-white font-medium mb-1">Click to upload photo</p>
                          <p className="text-gray-400 text-sm">PNG, JPG, WEBP up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* YouTube URL (for videos) - Only show when Video is selected */}
                {mediaType === 'video' && (
                  <div>
                    <label className="block text-white font-medium mb-2">YouTube URL *</label>
                    <input
                      type="url"
                      name="youtubeUrl"
                      required={mediaType === 'video'}
                      disabled={submitLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all disabled:opacity-50"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-gray-400 text-xs mt-2">
                      💡 Paste the full YouTube video URL
                    </p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all resize-none disabled:opacity-50"
                    placeholder="Add a description (optional)"
                  ></textarea>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all disabled:opacity-50"
                    placeholder="e.g., highlights, final, opening (comma separated)"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    disabled={submitLoading}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitLoading && <LoadingSpinner size="sm" />}
                    {submitLoading ? 'Uploading...' : 'Upload Media'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMediaPage;
