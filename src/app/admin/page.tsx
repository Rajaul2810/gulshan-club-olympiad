'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { useClubs } from '@/hooks/useClubs';
import { useFixtures } from '@/hooks/useFixtures';
import { useMedia } from '@/hooks/useMedia';
import { useResults } from '@/hooks/useResults';


const AdminDashboard = () => {
  const { clubs, loading: clubsLoading } = useClubs();
  const { fixtures, loading: fixturesLoading } = useFixtures();
  const { media, loading: mediaLoading } = useMedia();
  const { results, loading: resultsLoading } = useResults();

  const stats = [
    {
      name: 'Total Clubs',
      value: clubsLoading ? '...' : clubs.length.toString(),
      icon: '🏢',
      color: 'from-blue-500 to-cyan-500',
      href: '/admin/clubs',
    },
    {
      name: 'Total Fixtures',
      value: fixturesLoading ? '...' : fixtures.length.toString(),
      icon: '📅',
      color: 'from-orange-500 to-pink-500',
      href: '/admin/fixtures',
    },
    {
      name: 'Match Results',
      value: resultsLoading ? '...' : results.length.toString(),
      icon: '🏆',
      color: 'from-green-500 to-emerald-500',
      href: '/admin/results',
    },
    {
      name: 'Media Items',
      value: mediaLoading ? '...' : media.length.toString(),
      icon: '📸',
      color: 'from-purple-500 to-pink-500',
      href: '/admin/media',
    },
  ];

  const recentActivities = [
    { action: 'New fixture added', detail: 'Football - Dhaka Club vs Gulshan Club', time: '2 hours ago' },
    { action: 'Media uploaded', detail: '12 new photos from Basketball match', time: '4 hours ago' },
    { action: 'Club registered', detail: 'Banani Club confirmed participation', time: '6 hours ago' },
    { action: 'Result updated', detail: 'Swimming - Final results published', time: '1 day ago' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to Olympiad 2025 Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{stat.icon}</span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/clubs"
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xl">
                ➕
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-orange-400 transition-colors">Add Club</p>
                <p className="text-gray-400 text-xs">Register new club</p>
              </div>
            </Link>

            <Link
              href="/admin/fixtures"
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                📅
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-orange-400 transition-colors">Add Fixture</p>
                <p className="text-gray-400 text-xs">Schedule new match</p>
              </div>
            </Link>

            <Link
              href="/admin/media"
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                📸
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-orange-400 transition-colors">Upload Media</p>
                <p className="text-gray-400 text-xs">Add photos/videos</p>
              </div>
            </Link>

            <Link
              href="/admin/results"
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xl">
                🏆
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-orange-400 transition-colors">Add Result</p>
                <p className="text-gray-400 text-xs">Update match result</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activities</h2>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.detail}</p>
                </div>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

