import React, { useState } from 'react';
import { 
  Bug, 
  Shield, 
  AlertTriangle, 
  Zap, 
  Target, 
  Key, 
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { AuthMethod, BannedIP } from '../types/auth';

interface SecurityPanelProps {
  onSimulateSecurityTest: (testType: string) => void;
  authMethod: AuthMethod;
  bannedIPs: BannedIP[];
  onUnbanIP: (ip: string) => void;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({
  onSimulateSecurityTest,
  authMethod,
  bannedIPs,
  onUnbanIP
}) => {
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});

  const securityTests = [
    {
      id: 'brute_force',
      name: 'Brute Force Attack',
      description: 'Simulates multiple failed login attempts to test rate limiting',
      icon: Target,
      color: 'text-red-400',
      severity: 'High'
    },
    {
      id: 'csrf',
      name: 'CSRF Attack',
      description: 'Cross-Site Request Forgery attack simulation',
      icon: Shield,
      color: 'text-orange-400',
      severity: 'Medium'
    },
    {
      id: 'xss',
      name: 'XSS Attack',
      description: 'Cross-Site Scripting attack simulation',
      icon: Bug,
      color: 'text-yellow-400',
      severity: 'High'
    },
    {
      id: 'token_theft',
      name: 'Token Theft',
      description: 'Simulates token/cookie theft scenarios',
      icon: Key,
      color: 'text-purple-400',
      severity: 'Critical'
    },
    {
      id: 'session_hijacking',
      name: 'Session Hijacking',
      description: 'Tests session management security',
      icon: Unlock,
      color: 'text-pink-400',
      severity: 'High'
    }
  ];

  const runSecurityTest = (testType: string) => {
    onSimulateSecurityTest(testType);
    setTestResults(prev => ({
      ...prev,
      [testType]: `Test executed at ${new Date().toLocaleTimeString()}`
    }));
  };

  const getAuthMethodVulnerabilities = () => {
    switch (authMethod) {
      case 'session':
        return [
          'Session fixation attacks',
          'Cookie theft via XSS',
          'CSRF attacks without proper tokens',
          'Session hijacking over unsecured connections'
        ];
      case 'jwt':
        return [
          'Token stored in localStorage vulnerable to XSS',
          'No server-side invalidation',
          'Weak signature algorithms',
          'Token leakage via URL or logs'
        ];
      case 'url_token':
        return [
          'Token visible in URL (highly insecure)',
          'Token logged in server access logs',
          'Token shared via copy-paste',
          'Token visible in browser history'
        ];
    }
  };

  const activeBans = bannedIPs.filter(ip => ip.expiresAt > new Date());

  return (
    <div className="space-y-6">
      {/* Auth Method Vulnerabilities */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span>Current Auth Method Vulnerabilities</span>
        </h3>
        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300">
              Method: {authMethod.toUpperCase().replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${
              authMethod === 'session' ? 'bg-green-900 text-green-300' :
              authMethod === 'jwt' ? 'bg-yellow-900 text-yellow-300' :
              'bg-red-900 text-red-300'
            }`}>
              {authMethod === 'session' ? 'Secure' : 
               authMethod === 'jwt' ? 'Moderate' : 'Insecure'}
            </span>
          </div>
          <ul className="space-y-2">
            {getAuthMethodVulnerabilities().map((vuln, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2" />
                <span className="text-sm text-slate-300">{vuln}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Security Tests */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <span>Security Tests</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityTests.map((test) => {
            const Icon = test.icon;
            return (
              <div key={test.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${test.color}`} />
                    <span className="font-medium text-white">{test.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    test.severity === 'Critical' ? 'bg-red-900 text-red-300' :
                    test.severity === 'High' ? 'bg-orange-900 text-orange-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {test.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">{test.description}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => runSecurityTest(test.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Run Test
                  </button>
                  {testResults[test.id] && (
                    <span className="text-xs text-green-400">
                      {testResults[test.id]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banned IPs */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-red-400" />
          <span>Banned IP Addresses</span>
        </h3>
        {activeBans.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No active IP bans</p>
        ) : (
          <div className="space-y-3">
            {activeBans.map((ban, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{ban.ip}</span>
                    <span className="px-2 py-1 bg-red-900 text-red-300 rounded text-xs">
                      {ban.attempts} attempts
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    <span>Banned: {ban.bannedAt.toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span>Expires: {ban.expiresAt.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Reason: {ban.reason}
                  </div>
                </div>
                <button
                  onClick={() => onUnbanIP(ban.ip)}
                  className="ml-4 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                >
                  Unban
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Recommendations */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Lock className="w-5 h-5 text-green-400" />
          <span>Security Recommendations</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
            <div>
              <p className="text-sm text-white font-medium">Use HTTPS in production</p>
              <p className="text-xs text-slate-400">Always encrypt data in transit</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
            <div>
              <p className="text-sm text-white font-medium">Implement proper CSRF protection</p>
              <p className="text-xs text-slate-400">Use anti-CSRF tokens for state-changing operations</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
            <div>
              <p className="text-sm text-white font-medium">Set secure cookie flags</p>
              <p className="text-xs text-slate-400">HttpOnly, Secure, SameSite attributes</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
            <div>
              <p className="text-sm text-white font-medium">Implement rate limiting</p>
              <p className="text-xs text-slate-400">Protect against brute force attacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};