import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  LogOut, 
  Activity, 
  AlertTriangle, 
  Key, 
  Monitor,
  Bug,
  Settings,
  Lock
} from 'lucide-react';
import { User as UserType, AuthMethod } from '../types/auth';
import { SecurityPanel } from './SecurityPanel';
import { LogsPanel } from './LogsPanel';
import { TokenViewer } from './TokenViewer';

interface DashboardProps {
  user: UserType;
  authMethod: AuthMethod;
  onLogout: () => void;
  onSimulateSecurityTest: (testType: string) => void;
  authLogs: any[];
  bannedIPs: any[];
  onClearLogs: () => void;
  onUnbanIP: (ip: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  authMethod,
  onLogout,
  onSimulateSecurityTest,
  authLogs,
  bannedIPs,
  onClearLogs,
  onUnbanIP
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'logs' | 'tokens'>('overview');

  const getAuthMethodDisplay = () => {
    switch (authMethod) {
      case 'session':
        return { name: 'Session Cookie', icon: Shield, color: 'text-green-400' };
      case 'jwt':
        return { name: 'JWT Token', icon: Key, color: 'text-blue-400' };
      case 'url_token':
        return { name: 'URL Token', icon: AlertTriangle, color: 'text-yellow-400' };
    }
  };

  const authDisplay = getAuthMethodDisplay();
  const AuthIcon = authDisplay.icon;

  const recentLogs = authLogs.slice(0, 5);
  const activeBans = bannedIPs.filter(ip => ip.expiresAt > new Date()).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Monitor },
    { id: 'security', label: 'Security Tests', icon: Bug },
    { id: 'logs', label: 'Audit Logs', icon: Activity },
    { id: 'tokens', label: 'Token Viewer', icon: Key }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">KAuth Dashboard</h1>
                <p className="text-xs text-slate-400">Authentication Learning Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AuthIcon className={`w-4 h-4 ${authDisplay.color}`} />
                <span className="text-sm text-slate-300">{authDisplay.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{user.email}</span>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Events</p>
                    <p className="text-2xl font-bold text-white">{authLogs.length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active Bans</p>
                    <p className="text-2xl font-bold text-white">{activeBans}</p>
                  </div>
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Auth Method</p>
                    <p className="text-2xl font-bold text-white">{authDisplay.name}</p>
                  </div>
                  <AuthIcon className={`w-8 h-8 ${authDisplay.color}`} />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="text-white capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Account Created</p>
                  <p className="text-white">{user.createdAt.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Last Login</p>
                  <p className="text-white">{user.lastLogin?.toLocaleString() || 'Never'}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === 'login_success' ? 'bg-green-400' :
                      log.type === 'login_failed' ? 'bg-red-400' :
                      log.type === 'logout' ? 'bg-yellow-400' :
                      'bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white">{log.type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-xs text-slate-400">{log.timestamp.toLocaleString()}</p>
                    </div>
                    <div className="text-xs text-slate-400">
                      {log.authMethod}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <SecurityPanel
            onSimulateSecurityTest={onSimulateSecurityTest}
            authMethod={authMethod}
            bannedIPs={bannedIPs}
            onUnbanIP={onUnbanIP}
          />
        )}

        {activeTab === 'logs' && (
          <LogsPanel
            authLogs={authLogs}
            onClearLogs={onClearLogs}
          />
        )}

        {activeTab === 'tokens' && (
          <TokenViewer authMethod={authMethod} />
        )}
      </main>
    </div>
  );
};