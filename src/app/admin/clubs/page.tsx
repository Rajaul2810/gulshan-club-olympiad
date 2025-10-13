'use client';

import { useState, useRef, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';
import { useClubs } from '@/hooks/useClubs';
import { uploadFile } from '@/lib/supabase/client';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from '@/components/ui/ErrorMessage';

const AdminClubsPage = () => {
  const { clubs, loading, error, addClub, deleteClub } = useClubs();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('File size must be less than 5MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const contactPerson = formData.get('contactPerson') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    try {
      if (!logoFile) {
        throw new Error('Please upload a club logo');
      }

      // Upload logo
      const timestamp = Date.now();
      const fileName = `${timestamp}-${logoFile.name.replace(/\s/g, '-')}`;
      const { url, error: uploadError } = await uploadFile(
        'club-logos',
        fileName,
        logoFile
      );

      if (uploadError || !url) {
        throw new Error(uploadError?.message || 'Failed to upload logo');
      }

      // Create slug from name
      const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

      // Add club to database
      const { error: addError } = await addClub({
        name,
        logo: url,
        slug,
        contact_person: contactPerson || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        status: 'active',
      });

      if (addError) {
        throw new Error(addError);
      }

      setSubmitSuccess('Club added successfully!');
      setTimeout(() => {
        setIsAddModalOpen(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add club');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    setDeleteLoading(id);
    const { error: delError } = await deleteClub(id);

    if (delError) {
      alert(`Failed to delete: ${delError}`);
    }
    setDeleteLoading(null);
  };

  const resetForm = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeClubs = clubs.filter((c) => c.status === 'active').length;
  const pendingClubs = clubs.filter((c) => c.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Clubs Management</h1>
            <p className="text-gray-400">Manage participating clubs for Olympiad 2025</p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Club
          </button>
        </div>

        {/* Global Error */}
        {error && <ErrorMessage message={error} />}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Clubs</p>
            <p className="text-3xl font-bold text-white">
              {loading ? '...' : clubs.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-green-400">
              {loading ? '...' : activeClubs}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">
              {loading ? '...' : pendingClubs}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Clubs Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
              >
                {deleteLoading === club.id && <LoadingOverlay message="Deleting..." />}

                {/* Club Logo */}
                <div className="mb-4 bg-white rounded-xl p-4 flex items-center justify-center h-32">
                  <Image
                    src={club.logo}
                    alt={club.name}
                    width={120}
                    height={120}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>

                {/* Club Name */}
                <h3 className="text-white font-bold text-lg mb-4 text-center line-clamp-2 min-h-[3.5rem]">
                  {club.name}
                </h3>

                {/* Status Badge */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    club.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    club.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(club.id, club.name)}
                    disabled={deleteLoading === club.id}
                    className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading === club.id ? <LoadingSpinner size="sm" /> : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredClubs.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl">
            <p className="text-gray-400 text-lg">No clubs found</p>
          </div>
        )}

        {/* Add Club Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">Add New Club</h2>
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

                <div>
                  <label className="block text-white font-medium mb-2">Club Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                    placeholder="Enter club name"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Club Logo *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={submitLoading}
                    className="hidden"
                  />
                  <div
                    onClick={() => !submitLoading && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
                  >
                    {logoPreview ? (
                      <div className="relative">
                        <Image
                          src={logoPreview}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="mx-auto max-h-40 object-contain"
                        />
                        <p className="text-white text-sm mt-2">Click to change</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-white font-medium mb-1">Click to upload logo</p>
                        <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                    placeholder="Contact person name"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                    placeholder="club@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Address</label>
                  <textarea
                    name="address"
                    rows={3}
                    disabled={submitLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all resize-none disabled:opacity-50"
                    placeholder="Club address"
                  ></textarea>
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitLoading && <LoadingSpinner size="sm" />}
                    {submitLoading ? 'Adding...' : 'Add Club'}
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

export default AdminClubsPage;
