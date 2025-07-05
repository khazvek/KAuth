import React, { useState } from 'react';
import { 
  Activity, 
  Filter, 
  Trash2, 
  Download, 
  Search,
  Calendar,
  User,
  Shield
} from 'lucide-react';
import { AuthLog } from '../types/auth';

interface LogsPanelProps {
  authLogs: AuthLog[];
  onClearLogs: () => void;
}

export const LogsPanel: React.FC<LogsPanelProps> = ({
  authLogs,
  onClearLogs
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'type'>('timestamp');

  const logTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'login_success', label: 'Login Success' },
    { value: 'login_failed', label: 'Login Failed' },
    { value: 'logout', label: 'Logout' },
    { value: 'token_created', label: 'Token Created' },
    { value: 'token_expired', label: 'Token Expired' },
    { value: 'ip_banned', label: 'IP Banned' },
    { value: 'csrf_attempt', label: 'CSRF Attempt' },
    { value: 'xss_attempt', label: 'XSS Attempt' }
  ];

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'login_success':
        return 'bg-green-900 text-green-300';
      case 'login_failed':
        return 'bg-red-900 text-red-300';
      case 'logout':
        return 'bg-yellow-900 text-yellow-300';
      case 'token_created':
        return 'bg-blue-900 text-blue-300';
      case 'token_expired':
        return 'bg-purple-900 text-purple-300';
      case 'ip_banned':
        return 'bg-red-900 text-red-300';
      case 'csrf_attempt':
      case 'xss_attempt':
        return 'bg-orange-900 text-orange-300';
      default:
        return 'bg-slate-900 text-slate-300';
    }
  };

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'login_success':
      case 'login_failed':
        return <User className="w-4 h-4" />;
      case 'logout':
        return <User className="w-4 h-4" />;
      case 'ip_banned':
      case 'csrf_attempt':
      case 'xss_attempt':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const filteredLogs = authLogs
    .filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || log.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        return a.type.localeCompare(b.type);
      }
    });

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Email', 'IP Address', 'Auth Method', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.type,
        log.email || '',
        log.ipAddress,
        log.authMethod,
        log.details || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kauth-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {logTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'timestamp' | 'type')}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="timestamp">Sort by Time</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={exportLogs}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onClearLogs}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-sm text-slate-400">Success</span>
          </div>
          <p className="text-xl font-bold text-white">
            {authLogs.filter(log => log.type === 'login_success').length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-sm text-slate-400">Failed</span>
          </div>
          <p className="text-xl font-bold text-white">
            {authLogs.filter(log => log.type === 'login_failed').length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full" />
            <span className="text-sm text-slate-400">Security</span>
          </div>
          <p className="text-xl font-bold text-white">
            {authLogs.filter(log => log.type.includes('attempt') || log.type === 'ip_banned').length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-sm text-slate-400">Total</span>
          </div>
          <p className="text-xl font-bold text-white">{authLogs.length}</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Authentication Logs</span>
            <span className="text-sm text-slate-400">({filteredLogs.length})</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Event</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">IP Address</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Method</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No logs found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getLogTypeIcon(log.type)}
                        <span className={`px-2 py-1 rounded text-xs ${getLogTypeColor(log.type)}`}>
                          {log.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {log.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">
                      {log.ipAddress}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-600 text-slate-300 rounded text-xs">
                        {log.authMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {log.timestamp.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {log.details || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};