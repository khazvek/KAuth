import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Code
} from 'lucide-react';
import { AuthMethod } from '../types/auth';

interface TokenViewerProps {
  authMethod: AuthMethod;
}

export const TokenViewer: React.FC<TokenViewerProps> = ({ authMethod }) => {
  const [showTokens, setShowTokens] = useState(false);
  const [currentToken, setCurrentToken] = useState<string>('');
  const [decodedJWT, setDecodedJWT] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    loadCurrentAuth();
  }, [authMethod]);

  const loadCurrentAuth = () => {
    switch (authMethod) {
      case 'session':
        const session = localStorage.getItem('kauth_session');
        if (session) {
          setSessionData(JSON.parse(session));
        }
        break;
      
      case 'jwt':
        const jwt = localStorage.getItem('kauth_jwt');
        if (jwt) {
          setCurrentToken(jwt);
          try {
            const payload = JSON.parse(atob(jwt.split('.')[1]));
            setDecodedJWT(payload);
          } catch (error) {
            console.error('Failed to decode JWT:', error);
          }
        }
        break;
      
      case 'url_token':
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
          setCurrentToken(token);
        }
        break;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const isTokenExpired = (exp: number) => {
    return exp * 1000 < Date.now();
  };

  const getTokenExpirationTime = (exp: number) => {
    return new Date(exp * 1000);
  };

  const getStorageInfo = () => {
    const localStorage = window.localStorage;
    const sessionStorage = window.sessionStorage;
    const cookies = document.cookie;
    
    return {
      localStorage: {
        length: localStorage.length,
        keys: Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
      },
      sessionStorage: {
        length: sessionStorage.length,
        keys: Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.key(i))
      },
      cookies: cookies.split(';').filter(c => c.trim().length > 0)
    };
  };

  const storageInfo = getStorageInfo();

  return (
    <div className="space-y-6">
      {/* Current Authentication */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-400" />
            <span>Current Authentication</span>
          </h3>
          <button
            onClick={() => setShowTokens(!showTokens)}
            className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            {showTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showTokens ? 'Hide' : 'Show'} Tokens</span>
          </button>
        </div>

        {/* Method Info */}
        <div className="mb-4 p-3 bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Authentication Method</span>
            <span className="text-white font-medium">{authMethod.toUpperCase().replace('_', ' ')}</span>
          </div>
        </div>

        {/* Session Cookie */}
        {authMethod === 'session' && sessionData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Session Status</span>
              <span className={`px-2 py-1 rounded text-xs ${
                new Date(sessionData.expiresAt) > new Date() 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {new Date(sessionData.expiresAt) > new Date() ? 'Active' : 'Expired'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Expires At</span>
              <span className="text-white text-sm">
                {new Date(sessionData.expiresAt).toLocaleString()}
              </span>
            </div>
            {showTokens && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Session Data</span>
                  <button
                    onClick={() => copyToClipboard(formatJSON(sessionData))}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-xs">Copy</span>
                  </button>
                </div>
                <pre className="bg-slate-900 p-3 rounded text-xs text-slate-300 overflow-x-auto">
                  {formatJSON(sessionData)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* JWT Token */}
        {authMethod === 'jwt' && currentToken && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Token Status</span>
              <span className={`px-2 py-1 rounded text-xs ${
                decodedJWT && !isTokenExpired(decodedJWT.exp) 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {decodedJWT && !isTokenExpired(decodedJWT.exp) ? 'Valid' : 'Expired'}
              </span>
            </div>
            {decodedJWT && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Issued At</span>
                  <span className="text-white text-sm">
                    {new Date(decodedJWT.iat * 1000).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Expires At</span>
                  <span className="text-white text-sm">
                    {getTokenExpirationTime(decodedJWT.exp).toLocaleString()}
                  </span>
                </div>
              </>
            )}
            {showTokens && (
              <>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">JWT Token</span>
                    <button
                      onClick={() => copyToClipboard(currentToken)}
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-xs">Copy</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 p-3 rounded text-xs text-slate-300 overflow-x-auto break-all">
                    {currentToken}
                  </pre>
                </div>
                {decodedJWT && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Decoded Payload</span>
                      <button
                        onClick={() => copyToClipboard(formatJSON(decodedJWT))}
                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-xs">Copy</span>
                      </button>
                    </div>
                    <pre className="bg-slate-900 p-3 rounded text-xs text-slate-300 overflow-x-auto">
                      {formatJSON(decodedJWT)}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* URL Token */}
        {authMethod === 'url_token' && currentToken && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Warning: URL tokens are highly insecure!</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Token Status</span>
              <span className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded text-xs">
                Active (Insecure)
              </span>
            </div>
            {showTokens && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">URL Token</span>
                  <button
                    onClick={() => copyToClipboard(currentToken)}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-xs">Copy</span>
                  </button>
                </div>
                <pre className="bg-slate-900 p-3 rounded text-xs text-slate-300 overflow-x-auto">
                  {currentToken}
                </pre>
                <div className="mt-2 text-xs text-yellow-400">
                  <p>• Visible in browser history</p>
                  <p>• Logged in server access logs</p>
                  <p>• Shared when copy-pasting URLs</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Storage Overview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Code className="w-5 h-5 text-green-400" />
          <span>Browser Storage</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Local Storage */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Local Storage</span>
            </h4>
            <div className="text-sm text-slate-300 space-y-1">
              <div>Items: {storageInfo.localStorage.length}</div>
              {storageInfo.localStorage.keys.map((key, index) => (
                <div key={index} className="text-xs text-slate-400 truncate">
                  {key}
                </div>
              ))}
            </div>
          </div>

          {/* Session Storage */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Session Storage</span>
            </h4>
            <div className="text-sm text-slate-300 space-y-1">
              <div>Items: {storageInfo.sessionStorage.length}</div>
              {storageInfo.sessionStorage.keys.map((key, index) => (
                <div key={index} className="text-xs text-slate-400 truncate">
                  {key}
                </div>
              ))}
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>Cookies</span>
            </h4>
            <div className="text-sm text-slate-300 space-y-1">
              <div>Count: {storageInfo.cookies.length}</div>
              {storageInfo.cookies.map((cookie, index) => (
                <div key={index} className="text-xs text-slate-400 truncate">
                  {cookie.split('=')[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Analysis */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span>Security Analysis</span>
        </h3>
        
        <div className="space-y-4">
          {authMethod === 'session' && (
            <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Session Cookie (Secure)</span>
              </div>
              <ul className="text-sm text-green-300 space-y-1">
                <li>• Server-side session management</li>
                <li>• Can be configured with HttpOnly flag</li>
                <li>• Automatic expiration handling</li>
                <li>• Server can invalidate sessions</li>
              </ul>
            </div>
          )}
          
          {authMethod === 'jwt' && (
            <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-medium">JWT Token (Moderate Risk)</span>
              </div>
              <ul className="text-sm text-yellow-300 space-y-1">
                <li>• Stored in localStorage (vulnerable to XSS)</li>
                <li>• No server-side invalidation</li>
                <li>• Contains user data in payload</li>
                <li>• Expires automatically</li>
              </ul>
            </div>
          )}
          
          {authMethod === 'url_token' && (
            <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-medium">URL Token (High Risk)</span>
              </div>
              <ul className="text-sm text-red-300 space-y-1">
                <li>• Visible in browser history</li>
                <li>• Logged in server access logs</li>
                <li>• Shared when copy-pasting URLs</li>
                <li>• Exposed in referrer headers</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};