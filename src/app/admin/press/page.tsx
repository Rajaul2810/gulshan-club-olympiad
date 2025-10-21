'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { usePress } from '@/hooks/usePress';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Database } from '@/lib/supabase/database.types';
import { uploadFile } from '@/lib/supabase/client';

type Press = Database['public']['Tables']['press']['Row'];

interface PressFormData {
  type: 'press_release' | 'news';
  title: string;
  image: string;
  content: string;
  author_name: string;
  source: string;
  news_link: string;
  publish_date: string;
}

interface ImageUploadState {
  file: File | null;
  preview: string | null;
  uploading: boolean;
}

export default function AdminPressPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { 
    pressItems, 
    loading, 
    error, 
    addPressItem, 
    updatePressItem, 
    deletePressItem 
  } = usePress();
  
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState<PressFormData>({
    type: 'press_release',
    title: '',
    image: '',
    content: '',
    author_name: '',
    source: '',
    news_link: '',
    publish_date: new Date().toISOString().split('T')[0]
  });

  const [imageUpload, setImageUpload] = useState<ImageUploadState>({
    file: null,
    preview: null,
    uploading: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (authLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <ErrorMessage message="Please log in to access this page." />;

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      setImageUpload({
        file,
        preview: URL.createObjectURL(file),
        uploading: false
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageUpload.file) return null;

    setImageUpload(prev => ({ ...prev, uploading: true }));

    try {
      const timestamp = Date.now();
      const fileName = `press-${timestamp}-${imageUpload.file.name.replace(/\s/g, '-')}`;
      
      const { url, error: uploadError } = await uploadFile(
        'media-photos',
        fileName,
        imageUpload.file
      );

      if (uploadError || !url) {
        throw new Error(uploadError?.message || 'Failed to upload image');
      }

      return url;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setImageUpload(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Upload image if a new file is selected
    let imageUrl = formData.image;
    if (imageUpload.file) {
      const uploadedUrl = await handleImageUpload();
      if (!uploadedUrl) return; // Upload failed
      imageUrl = uploadedUrl;
    }
    
    const submitData = {
      type: formData.type,
      title: formData.title,
      image: imageUrl || undefined,
      content: formData.type === 'press_release' ? formData.content : undefined,
      author_name: formData.author_name || undefined,
      source: formData.source || undefined,
      news_link: formData.type === 'news' ? formData.news_link : undefined,
      publish_date: formData.publish_date
    };

    if (editingItem) {
      const result = await updatePressItem(editingItem, submitData);
      if (result.error) {
        alert('Failed to update press item: ' + result.error);
        return;
      }
    } else {
      const result = await addPressItem(submitData);
      if (result.error) {
        alert('Failed to add press item: ' + result.error);
        return;
      }
    }

    setShowForm(false);
    setEditingItem(null);
    setFormData({
      type: 'press_release',
      title: '',
      image: '',
      content: '',
      author_name: '',
      source: '',
      news_link: '',
      publish_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (item: Press) => {
    setEditingItem(item.id);
    setFormData({
      type: item.type,
      title: item.title,
      image: item.image || '',
      content: item.content || '',
      author_name: item.author_name || '',
      source: item.source || '',
      news_link: item.news_link || '',
      publish_date: item.publish_date.split('T')[0]
    });
    setImageUpload({
      file: null,
      preview: null,
      uploading: false
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this press item?')) {
      const result = await deletePressItem(id);
      if (result.error) {
        alert('Failed to delete press item: ' + result.error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      type: 'press_release',
      title: '',
      image: '',
      content: '',
      author_name: '',
      source: '',
      news_link: '',
      publish_date: new Date().toISOString().split('T')[0]
    });
    setImageUpload({
      file: null,
      preview: null,
      uploading: false
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Press Management</h1>
          <p className="text-gray-400">Manage press releases and news articles</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="group relative bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Press Item
            </div>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingItem ? 'Edit Press Item' : 'Add Press Item'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'press_release' | 'news'})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  >
                    <option className='bg-neutral-900' value="press_release">📰 Press Release</option>
                    <option className='bg-neutral-900' value="news">📰 News Article</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter press item title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image
                  </label>
                  
                  {/* Image Upload Area */}
                  <div className="space-y-4">
                    {/* File Input */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-orange-500/50 hover:bg-white/5 transition-all group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      
                      {imageUpload.uploading ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-300">Uploading image...</p>
                        </div>
                      ) : imageUpload.preview ? (
                        <div className="space-y-3">
                          <Image
                            src={imageUpload.preview}
                            alt="Preview"
                            width={200}
                            height={120}
                            className="mx-auto rounded-lg object-cover"
                          />
                          <p className="text-green-400 text-sm">Image selected. Click to change.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-12 h-12 text-gray-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-gray-300 group-hover:text-white transition-colors">
                              Click to upload image
                            </p>
                            <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Current Image Display (for editing) */}
                    {formData.image && !imageUpload.preview && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Current image:</p>
                        <div className="relative">
                          <Image
                            src={formData.image}
                            alt="Current image"
                            width={200}
                            height={120}
                            className="rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, image: ''})}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {formData.type === 'press_release' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={6}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      placeholder="Enter press release content..."
                      required
                    />
                  </div>
                )}

                {formData.type === 'news' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      News Link *
                    </label>
                    <input
                      type="url"
                      value={formData.news_link}
                      onChange={(e) => setFormData({...formData, news_link: e.target.value})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="https://example.com/news-article"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={formData.author_name}
                      onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Source
                    </label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="News source"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Publish Date *
                  </label>
                  <input
                    type="date"
                    value={formData.publish_date}
                    onChange={(e) => setFormData({...formData, publish_date: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    {editingItem ? 'Update Press Item' : 'Add Press Item'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {pressItems.map((item) => (
            <div key={item.id} className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.type === 'press_release' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      }`}>
                        {item.type === 'press_release' ? '📰 Press Release' : '📰 News'}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(item.publish_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h3>
                    
                    {item.image && (
                      <div className="mb-4 rounded-xl overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={item.title}
                          width={800}
                          height={192}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {item.content && (
                      <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    )}
                    
                    {item.news_link && (
                      <a 
                        href={item.news_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-pink-400 transition-colors font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Read Full Article
                      </a>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-4 pt-4 border-t border-white/10">
                      {item.author_name && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {item.author_name}
                        </span>
                      )}
                      {item.source && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          {item.source}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 hover:text-yellow-300 transition-all"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 hover:text-red-300 transition-all"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pressItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-bold text-white mb-2">No Press Items Yet</h3>
              <p className="text-gray-400 mb-6">Start by adding your first press release or news article.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Add First Press Item
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
