'use client';

import { useState, FormEvent, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useFixtures } from '@/hooks/useFixtures';
import { sportsCategories } from '@/components/SportsCategory';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from '@/components/ui/ErrorMessage';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';

const AdminFixturesPage = () => {
  const { fixtures, loading, error, addFixture, deleteFixture } = useFixtures();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group fixtures by sport
  const fixturesBySport = fixtures.reduce((acc, fixture) => {
    if (!acc[fixture.sport]) {
      acc[fixture.sport] = [];
    }
    acc[fixture.sport].push(fixture);
    return acc;
  }, {} as Record<string, typeof fixtures>);

  const handleFileUpload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `fixture-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fixture-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('fixture-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      if (!selectedSport || !selectedFile) {
        throw new Error('Please select a sport and upload an image');
      }

      // Upload image first
      const imageUrl = await handleFileUpload(selectedFile);

      // Add fixture with image URL
      const { error: addError } = await addFixture({
        sport: selectedSport,
        fixture_image: imageUrl,
      });

      if (addError) {
        throw new Error(addError);
      }

      setSubmitSuccess('Fixture image uploaded successfully!');
      setTimeout(() => {
        setIsAddModalOpen(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to upload fixture');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string, sport: string) => {
    if (!confirm(`Are you sure you want to delete this ${sport} fixture image?`)) return;

    setDeleteLoading(id);
    const { error: delError } = await deleteFixture(id);

    if (delError) {
      alert(`Failed to delete: ${delError}`);
    }
    setDeleteLoading(null);
  };

  const resetForm = () => {
    setSelectedSport('');
    setSelectedFile(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Fixtures Management</h1>
            <p className="text-gray-400">Upload fixture images for each sport category</p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Fixture Image
          </button>
        </div>

        {/* Global Error */}
        {error && <ErrorMessage message={error} />}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Fixtures</p>
            <p className="text-3xl font-bold text-white">
              {loading ? '...' : fixtures.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Sports Categories</p>
            <p className="text-3xl font-bold text-blue-400">
              {loading ? '...' : Object.keys(fixturesBySport).length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Latest Upload</p>
            <p className="text-lg font-bold text-green-400">
              {loading ? '...' : fixtures.length > 0 ? new Date(fixtures[0].created_at).toLocaleDateString() : 'None'}
            </p>
          </div>
        </div>

        {/* Sport Categories */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Sports Categories</h3>
          <div className="flex flex-wrap gap-4">
            {Object.keys(fixturesBySport).map((sport) => (
              <div key={sport} className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-white font-medium">{sport}</span>
                <span className="text-gray-400 text-sm ml-2">({fixturesBySport[sport].length} images)</span>
              </div>
            ))}
            {Object.keys(fixturesBySport).length === 0 && (
              <p className="text-gray-400">No fixture images uploaded yet</p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Fixtures Images Grid */}
        {!loading && (
          <div className="space-y-6">
            {Object.entries(fixturesBySport).map(([sport, sportFixtures]) => (
              <div key={sport} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  {sportsCategories.find(s => s.name === sport)?.icon || '🏆'} {sport}
                  <span className="text-gray-400 text-sm font-normal">({sportFixtures.length} images)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sportFixtures.map((fixture) => (
                    <div
                      key={fixture.id}
                      className="relative bg-white/10 rounded-xl overflow-hidden border border-white/20 hover:border-white/30 transition-all group"
                    >
                      {deleteLoading === fixture.id && <LoadingOverlay message="Deleting..." />}
                      
                      <div className="aspect-video overflow-hidden">
                        <Image
                          width={100}
                          height={100}
                          src={fixture.fixture_image}
                          alt={`${fixture.sport} fixture`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="p-4">
                        <p className="text-white font-medium mb-2">{fixture.sport}</p>
                        <p className="text-gray-400 text-xs">
                          Uploaded: {new Date(fixture.created_at).toLocaleDateString()}
                        </p>
                        
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={() => handleDelete(fixture.id, fixture.sport)}
                            disabled={deleteLoading === fixture.id}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
                          >
                            {deleteLoading === fixture.id ? <LoadingSpinner size="sm" /> : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && fixtures.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl">
            <p className="text-gray-400 text-lg">No fixture images uploaded yet</p>
            <p className="text-gray-500 text-sm mt-2">Upload your first fixture image to get started</p>
          </div>
        )}

        {/* Add Fixture Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">Upload Fixture Image</h2>
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

                {/* Sport Category */}
                <div>
                  <label className="block text-white font-medium mb-2">Sport Category *</label>
                  <select 
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    required
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                  >
                    <option value="">Select sport</option>
                    {sportsCategories.map((sport, index) => (
                      <option key={index} value={sport.name} className="bg-neutral-900">
                        {sport.icon} {sport.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-white font-medium mb-2">Fixture Image *</label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={submitLoading}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-white font-medium">{selectedFile.name}</p>
                        <p className="text-gray-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <p className="text-white font-medium">Click to upload image</p>
                        <p className="text-gray-400 text-sm">PNG, JPG, JPEG up to 10MB</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={submitLoading}
                          className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors disabled:opacity-50"
                        >
                          Choose File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                {selectedFile && (
                  <div>
                    <label className="block text-white font-medium mb-2">Preview</label>
                    <div className="aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/20">
                      <Image
                        width={100}
                        height={100}
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-300 text-sm">
                      Upload a fixture image for the selected sport category. This will be displayed on the public fixtures page.
                    </p>
                  </div>
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
                    disabled={submitLoading || !selectedSport || !selectedFile}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading && <LoadingSpinner size="sm" />}
                    {submitLoading ? (uploading ? 'Uploading...' : 'Adding...') : 'Upload Image'}
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

export default AdminFixturesPage;
