'use client';

import { useState, FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useFixtures } from '@/hooks/useFixtures';
import { useClubs } from '@/hooks/useClubs';
import { sportsCategories } from '@/components/SportsCategory';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ErrorMessage, SuccessMessage } from '@/components/ui/ErrorMessage';

const AdminFixturesPage = () => {
  const { fixtures, loading, error, addFixture, deleteFixture } = useFixtures();
  const { clubs, loading: clubsLoading } = useClubs();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const filteredFixtures = fixtures.filter((fixture) => {
    if (filterStatus === 'all') return true;
    return fixture.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-300';
      case 'ongoing':
        return 'bg-green-500/20 text-green-300';
      case 'completed':
        return 'bg-gray-500/20 text-gray-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const formData = new FormData(e.currentTarget);
    const sport = formData.get('sport') as string;
    const team1Id = formData.get('team1') as string;
    const team2Id = formData.get('team2') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const venue = formData.get('venue') as string;
    const notes = formData.get('notes') as string;

    try {
      if (!sport || !team1Id || !team2Id || !date || !time || !venue) {
        throw new Error('Please fill in all required fields');
      }

      if (team1Id === team2Id) {
        throw new Error('Team 1 and Team 2 cannot be the same');
      }

      const { error: addError } = await addFixture({
        sport,
        team1_id: team1Id,
        team2_id: team2Id,
        date,
        time,
        venue,
        status: 'scheduled',
        notes: notes || null,
      });

      if (addError) {
        throw new Error(addError);
      }

      setSubmitSuccess('Fixture added successfully!');
      setTimeout(() => {
        setIsAddModalOpen(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add fixture');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string, sport: string) => {
    if (!confirm(`Are you sure you want to delete this ${sport} fixture?`)) return;

    setDeleteLoading(id);
    const { error: delError } = await deleteFixture(id);

    if (delError) {
      alert(`Failed to delete: ${delError}`);
    }
    setDeleteLoading(null);
  };

  const resetForm = () => {
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const scheduledCount = fixtures.filter(f => f.status === 'scheduled').length;
  const ongoingCount = fixtures.filter(f => f.status === 'ongoing').length;
  const completedCount = fixtures.filter(f => f.status === 'completed').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Fixtures Management</h1>
            <p className="text-gray-400">Schedule and manage match fixtures</p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading || clubsLoading || clubs.length < 2}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Fixture
          </button>
        </div>

        {/* Global Error */}
        {error && <ErrorMessage message={error} />}

        {clubs.length < 2 && !clubsLoading && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              ℹ️ You need at least 2 clubs to create fixtures. Please add clubs first.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Fixtures</p>
            <p className="text-3xl font-bold text-white">
              {loading ? '...' : fixtures.length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Scheduled</p>
            <p className="text-3xl font-bold text-blue-400">
              {loading ? '...' : scheduledCount}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Ongoing</p>
            <p className="text-3xl font-bold text-green-400">
              {loading ? '...' : ongoingCount}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-400">
              {loading ? '...' : completedCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('scheduled')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'scheduled'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setFilterStatus('ongoing')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'ongoing'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'completed'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Fixtures List */}
        {!loading && (
          <div className="space-y-4">
            {filteredFixtures.map((fixture) => {
              // console.log(fixture);
              // // eslint-disable-next-line @typescript-eslint/no-explicit-any
              // const team1Name = (fixture as any).team1?.[0]?.name || 'Unknown Team';
              // // eslint-disable-next-line @typescript-eslint/no-explicit-any
              // const team2Name = (fixture as any).team2?.[0]?.name || 'Unknown Team';

              return (
                <div
                  key={fixture.id}
                  className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                >
                  {deleteLoading === fixture.id && <LoadingOverlay message="Deleting..." />}

                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Date & Sport */}
                    <div className="lg:w-48">
                      <p className="text-orange-400 font-bold text-lg mb-1">
                        {new Date(fixture.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-400 text-sm">{fixture.time}</p>
                      <p className="text-white text-sm mt-2">{fixture.sport}</p>
                    </div>

                    {/* Teams */}
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <div className="text-center flex-1">
                        <p className="text-white font-bold text-lg">{fixture.team1?.name}</p>
                      </div>
                      <div className="text-2xl font-bold text-gray-500">VS</div>
                      <div className="text-center flex-1">
                        <p className="text-white font-bold text-lg">{fixture.team2?.name}</p>
                      </div>
                    </div>

                    {/* Venue & Status */}
                    <div className="lg:w-56 text-center lg:text-right space-y-2">
                      <p className="text-gray-400 text-sm">📍 {fixture.venue}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(fixture.status)}`}>
                        {fixture.status.charAt(0).toUpperCase() + fixture.status.slice(1)}
                      </span>
                      
                      {/* Actions */}
                      <div className="flex gap-2 justify-center lg:justify-end mt-2">
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
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFixtures.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-2xl">
            <p className="text-gray-400 text-lg">No fixtures found</p>
            <p className="text-gray-500 text-sm mt-2">Add your first fixture to get started</p>
          </div>
        )}

        {/* Add Fixture Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">Add New Fixture</h2>
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

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Sport Category */}
                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Sport Category *</label>
                    <select 
                      name="sport"
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

                  {/* Team 1 */}
                  <div>
                    <label className="block text-white font-medium mb-2">Team 1 *</label>
                    <select 
                      name="team1"
                      required
                      disabled={submitLoading || clubsLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                    >
                      <option value="">Select club</option>
                      {clubs.map((club) => (
                        <option key={club.id} value={club.id} className="bg-neutral-900">
                          {club.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Team 2 */}
                  <div>
                    <label className="block text-white font-medium mb-2">Team 2 *</label>
                    <select 
                      name="team2"
                      required
                      disabled={submitLoading || clubsLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                    >
                      <option value="">Select club</option>
                      {clubs.map((club) => (
                        <option key={club.id} value={club.id} className="bg-neutral-900">
                          {club.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-white font-medium mb-2">Match Date *</label>
                    <input
                      type="date"
                      name="date"
                      required
                      disabled={submitLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-white font-medium mb-2">Match Time *</label>
                    <input
                      type="time"
                      name="time"
                      required
                      disabled={submitLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Venue */}
                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Venue *</label>
                    <input
                      type="text"
                      name="venue"
                      required
                      disabled={submitLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all disabled:opacity-50"
                      placeholder="e.g., Gulshan Youth Club"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      rows={3}
                      disabled={submitLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all resize-none disabled:opacity-50"
                      placeholder="Any special notes or instructions"
                    ></textarea>
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
                    disabled={submitLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitLoading && <LoadingSpinner size="sm" />}
                    {submitLoading ? 'Adding...' : 'Add Fixture'}
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
