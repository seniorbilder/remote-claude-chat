import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import useAppStore from '@/store/useAppStore';

export default function SettingsPage() {
  const { config, setConfig, saveConfig, configSaved, setConnectionStatus, setClaudeVersion } =
    useAppStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [keySaved, setKeySaved] = useState(configSaved && config.authMethod === 'key');
  const [showKeyField, setShowKeyField] = useState(!keySaved);

  const handleSave = () => {
    saveConfig();
    setKeySaved(config.authMethod === 'key' && !!config.privateKey);
    setShowKeyField(false);
    setTestResult(null);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    // Simulate connection test
    await new Promise((r) => setTimeout(r, 2000));

    if (!config.host || !config.username) {
      setTestResult({ success: false, message: 'Host and username are required.' });
      setTesting(false);
      return;
    }

    // Simulated success
    setTestResult({
      success: true,
      message: '✓ Connected successfully! Claude Code v1.0.12 detected',
    });
    setConnectionStatus('connected');
    setClaudeVersion('1.0.12');
    setTesting(false);
  };

  const handleSaveAndTest = () => {
    handleSave();
    handleTest().then(() => {
      // If test was successful, navigate to chat after a moment
    });
  };

  const isValid = config.host.trim() !== '' && config.username.trim() !== '';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[600px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-foreground">Connection Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure SSH access to your remote Claude Code server
          </p>
        </div>

        <div className="space-y-6">
          {/* Host + Port */}
          <div className="flex gap-3">
            <div className="flex-[7]">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                Host / IP Address
              </label>
              <input
                type="text"
                value={config.host}
                onChange={(e) => setConfig({ host: e.target.value })}
                placeholder="192.168.1.100 or myserver.example.com"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-hint focus:outline-none focus:border-primary input-focus-glow transition-all font-mono"
              />
            </div>
            <div className="flex-[3]">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                Port
              </label>
              <input
                type="number"
                value={config.port}
                onChange={(e) => setConfig({ port: parseInt(e.target.value) || 22 })}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary input-focus-glow transition-all font-mono"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              value={config.username}
              onChange={(e) => setConfig({ username: e.target.value })}
              placeholder="ubuntu"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-hint focus:outline-none focus:border-primary input-focus-glow transition-all font-mono"
            />
          </div>

          {/* Auth Method */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Authentication Method
            </label>
            <div className="inline-flex bg-surface border border-border rounded-lg p-1">
              {(['key', 'password'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    setConfig({ authMethod: method });
                    if (method === 'key') setShowKeyField(true);
                  }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    config.authMethod === method
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {method === 'key' ? 'SSH Key' : 'Password'}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Fields */}
          {config.authMethod === 'key' ? (
            <div className="space-y-4">
              {keySaved && !showKeyField ? (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Private Key
                  </label>
                  <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">••••• (key saved)</span>
                    <button
                      onClick={() => setShowKeyField(true)}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      Replace Key
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Private Key
                  </label>
                  <textarea
                    value={config.privateKey || ''}
                    onChange={(e) => setConfig({ privateKey: e.target.value })}
                    placeholder={"-----BEGIN OPENSSH PRIVATE KEY-----\n...paste your full private key here...\n-----END OPENSSH PRIVATE KEY-----"}
                    rows={7}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-hint focus:outline-none focus:border-primary input-focus-glow transition-all font-mono resize-none"
                  />
                  <p className="text-xs text-hint mt-1.5">
                    Paste the full content of your private key file. You can export this from Termius (Keychain → select key → Export).
                  </p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                  Key Passphrase <span className="text-hint">(optional)</span>
                </label>
                <input
                  type="password"
                  value={config.passphrase || ''}
                  onChange={(e) => setConfig({ passphrase: e.target.value })}
                  placeholder="Leave empty if key has no passphrase"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-hint focus:outline-none focus:border-primary input-focus-glow transition-all"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={config.password || ''}
                  onChange={(e) => setConfig({ password: e.target.value })}
                  placeholder="Enter server password"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-hint focus:outline-none focus:border-primary input-focus-glow transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hint hover:text-muted-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Working Directory */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
              Working Directory
            </label>
            <input
              type="text"
              value={config.workingDirectory}
              onChange={(e) => setConfig({ workingDirectory: e.target.value })}
              placeholder="~"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-hint focus:outline-none focus:border-primary input-focus-glow transition-all font-mono"
            />
            <p className="text-xs text-hint mt-1.5">
              The directory on the remote server where Claude Code will execute commands from.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:scale-100"
            >
              Save Configuration
            </button>
            <button
              onClick={handleTest}
              disabled={!isValid || testing}
              className="px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-surface-elevated hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:scale-100 flex items-center gap-2"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                testResult.success
                  ? 'bg-success/5 border-success/20 text-success'
                  : 'bg-destructive/5 border-destructive/20 text-destructive'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
              )}
              <p className="text-sm">{testResult.message}</p>
            </div>
          )}

          {testResult?.success && (
            <button
              onClick={() => navigate('/chat')}
              className="w-full px-5 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Start Chatting →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
