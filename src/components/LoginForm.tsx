import React, { useState } from 'react';
import { Lock, Mail, Shield, AlertTriangle, Key, Link } from 'lucide-react';
import { AuthMethod } from '../types/auth';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  authMethod: AuthMethod;
  onAuthMethodChange: (method: AuthMethod) => void;
  isIPBanned: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  authMethod,
  onAuthMethodChange,
  isIPBanned
}) => {
  const [email, setEmail] = useState('demo@kauth.dev');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Invalid credentials or IP banned');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const authMethodIcons = {
    session: <Shield className="w-4 h-4" />,
    jwt: <Key className="w-4 h-4" />,
    url_token: <Link className="w-4 h-4" />
  };

  const authMethodDescriptions = {
    session: 'Server-side sessions with secure cookies',
    jwt: 'JSON Web Tokens stored in localStorage',
    url_token: 'Token passed via URL parameters (insecure for demo)'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">KAuth</h1>
          <p className="text-slate-300 mt-2">Authentication Learning Platform</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 shadow-xl border border-slate-700">
          {/* Auth Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Authentication Method
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(authMethodIcons).map(([method, icon]) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => onAuthMethodChange(method as AuthMethod)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    authMethod === method
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {icon}
                  <div className="flex-1 text-left">
                    <div className="font-medium capitalize">{method.replace('_', ' ')}</div>
                    <div className="text-xs opacity-75">
                      {authMethodDescriptions[method]}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mb-4 p-3 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500">Demo Credentials</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <div>Email: demo@kauth.dev</div>
              <div>Password: password123</div>
            </div>
          </div>

          {/* IP Ban Warning */}
          {isIPBanned && (
            <div className="mb-4 p-3 bg-red-900 rounded-lg border border-red-700">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">IP Address Banned</span>
              </div>
              <div className="text-xs text-red-300 mt-1">
                Too many failed attempts. Wait 30 minutes or use admin panel to unban.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900 p-2 rounded-lg border border-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isIPBanned}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Security Testing Hints
            </button>
            {showHint && (
              <div className="mt-2 text-xs text-slate-400 bg-slate-700 p-2 rounded">
                Try wrong credentials 3 times to trigger IP ban. Use different auth methods to see how they work.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};