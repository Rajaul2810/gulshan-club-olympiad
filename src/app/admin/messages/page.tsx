'use client';

import React, { useState, useMemo } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Database } from '@/lib/supabase/database.types';

const MessagesPage = () => {
  const { messages, loading, updateMessageStatus, deleteMessage } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Database['public']['Tables']['messages']['Row'] | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and search messages
  const filteredMessages = useMemo(() => {
    let filtered = messages;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(msg => msg.status === filterStatus);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [messages, filterStatus, searchTerm]);

  const handleStatusChange = async (id: string, newStatus: 'read' | 'replied' | 'archived') => {
    await updateMessageStatus(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'read': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'replied': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return '🔴';
      case 'read': return '🔵';
      case 'replied': return '✅';
      case 'archived': return '📁';
      default: return '📧';
    }
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Messages Management
          </h1>
          <p className="text-xl text-gray-300">
            Manage contact form submissions and customer inquiries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-white mb-2">{messages.length}</div>
            <div className="text-gray-400 text-sm">Total Messages</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-red-400 mb-2">
              {messages.filter(m => m.status === 'unread').length}
            </div>
            <div className="text-gray-400 text-sm">Unread</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {messages.filter(m => m.status === 'replied').length}
            </div>
            <div className="text-gray-400 text-sm">Replied</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {messages.filter(m => m.status === 'read').length}
            </div>
            <div className="text-gray-400 text-sm">Read</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read' | 'replied' | 'archived')}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option className="bg-neutral-900" value="all">All Messages</option>
                <option className="bg-neutral-900" value="unread">Unread</option>
                <option className="bg-neutral-900" value="read">Read</option>
                <option className="bg-neutral-900" value="replied">Replied</option>
                <option className="bg-neutral-900" value="archived">Archived</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-2">Search Messages</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, subject..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredMessages.length > 0 ? (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-orange-400/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getStatusIcon(message.status)}</span>
                      <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{message.email}</p>
                      </div>
                      {message.phone && (
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white">{message.phone}</p>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Subject</p>
                      <p className="text-white font-medium">{message.subject}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Message</p>
                      <p className="text-gray-300 line-clamp-3">{message.message}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>Received: {new Date(message.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(message.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {/* Status Actions */}
                    <div className="flex gap-2">
                      {message.status === 'unread' && (
                        <button
                          onClick={() => handleStatusChange(message.id, 'read')}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                      {message.status === 'read' && (
                        <button
                          onClick={() => handleStatusChange(message.id, 'replied')}
                          className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                        >
                          Mark Replied
                        </button>
                      )}
                      {message.status !== 'archived' && (
                        <button
                          onClick={() => handleStatusChange(message.id, 'archived')}
                          className="px-3 py-1 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-lg text-sm hover:bg-gray-500/30 transition-colors"
                        >
                          Archive
                        </button>
                      )}
                    </div>

                    {/* View Full Message */}
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-lg text-sm hover:bg-orange-500/30 transition-colors"
                    >
                      View Full
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-2xl">
            <p className="text-gray-400 text-lg">No messages found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'Messages will appear here when users contact you'}
            </p>
          </div>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(selectedMessage.status)}</span>
                  <h4 className="text-xl font-semibold text-white">{selectedMessage.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white">{selectedMessage.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-400">Subject</p>
                  <p className="text-white font-medium">{selectedMessage.subject}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Message</p>
                  <div className="bg-white/5 rounded-xl p-4 mt-2">
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Received: {new Date(selectedMessage.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{new Date(selectedMessage.created_at).toLocaleTimeString()}</span>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  {selectedMessage.status === 'unread' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedMessage.id, 'read');
                        setSelectedMessage({...selectedMessage, status: 'read'});
                      }}
                      className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  {selectedMessage.status === 'read' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedMessage.id, 'replied');
                        setSelectedMessage({...selectedMessage, status: 'replied'});
                      }}
                      className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      Mark as Replied
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleStatusChange(selectedMessage.id, 'archived');
                      setSelectedMessage(null);
                    }}
                    className="px-4 py-2 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-colors"
                  >
                    Archive
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default MessagesPage;
