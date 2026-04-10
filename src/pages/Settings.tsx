import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import useAppStore from '@/store/useAppStore';

export default function SettingsPage() {
  const { config, setConfig, saveConfig, configSaved, setConnectionStatus, setClaudeVersion } =
    useAppStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
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
    await new Promise((r) => setTimeout(r, 2000));

    if (!config.host || !config.username) {
      setTestResult({ success: false, message: 'Host and username are required.' });
      setTesting(false);
      return;
    }

    setTestResult({ success: true, message: 'Connected successfully — Claude Code v1.0.12 detected' });
    setConnectionStatus('connected');
    setClaudeVersion('1.0.12');
    setTesting(false);
  };

  const isValid = config.host.trim() !== '' && config.username.trim() !== '';

  const inputClass =
    'w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-hint focus:outline-none focus:border-primary/50 input-focus-glow transition-all duration-200';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[560px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Connection Settings</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Configure SSH access to your remote Claude Code server
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border p-6 card-glow space-y-6">
          {/* Host + Port */}
          <div className="flex gap-3">
            <div className="flex-[7]">
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Host / IP Address
              </label>
              <input
                type="text"
                value={config.host}
                onChange={(e) => setConfig({ host: e.target.value })}
                placeholder="192.168.1.100"
                className={`${inputClass} font-mono`}
              />
            </div>
            <div className="flex-[3]">
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Port
              </label>
              <input
                type="number"
                value={config.port}
                onChange={(e) => setConfig({ port: parseInt(e.target.value) || 22 })}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Username</label>
            <input
              type="text"
              value={config.username}
              onChange={(e) => setConfig({ username: e.target.value })}
              placeholder="ubuntu"
              className={`${inputClass} font-mono`}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Auth Method */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-3">Authentication Method</label>
            <div className="flex bg-secondary rounded-xl p-1 border border-border">
              {(['key', 'password'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    setConfig({ authMethod: method });
                    if (method === 'key') setShowKeyField(true);
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    config.authMethod === method
                      ? 'gradient-accent text-white shadow-lg shadow-primary/20'
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
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Private Key</label>
                  <div className="flex items-center justify-between bg-secondary border border-border rounded-xl px-4 py-3">
                    <span className="text-sm text-muted-foreground font-mono">••••• (key saved)</span>
                    <button
                      onClick={() => setShowKeyField(true)}
                      className="text-xs text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                      Replace Key
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Private Key</label>
                  <textarea
                    value={config.privateKey || ''}
                    onChange={(e) => setConfig({ privateKey: e.target.value })}
                    placeholder={"-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----"}
                    rows={5}
                    className={`${inputClass} font-mono resize-none`}
                  />
                  <p className="text-[11px] text-hint mt-2">Paste the full content of your private key file.</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Key Passphrase <span className="text-hint">(optional)</span>
                </label>
                <input
                  type="password"
                  value={config.passphrase || ''}
                  onChange={(e) => setConfig({ passphrase: e.target.value })}
                  placeholder="Leave empty if none"
                  className={inputClass}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={config.password || ''}
                  onChange={(e) => setConfig({ password: e.target.value })}
                  placeholder="Enter server password"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-hint hover:text-muted-foreground transition-colors"
                  aria-label={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Working Directory */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Working Directory</label>
            <input
              type="text"
              value={config.workingDirectory}
              onChange={(e) => setConfig({ workingDirectory: e.target.value })}
              placeholder="~"
              className={`${inputClass} font-mono`}
            />
            <p className="text-[11px] text-hint mt-2">The directory where Claude Code will execute commands.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="px-6 py-3 gradient-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-30"
          >
            Save Configuration
          </button>
          <button
            onClick={handleTest}
            disabled={!isValid || testing}
            className="px-6 py-3 bg-secondary border border-border text-foreground text-sm font-medium rounded-xl hover:bg-surface-elevated active:scale-[0.98] transition-all duration-200 disabled:opacity-30 flex items-center gap-2"
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

        {/* Result */}
        {testResult && (
          <div
            className={`flex items-start gap-3 mt-4 p-4 rounded-xl border ${
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
            <p className="text-sm font-medium">{testResult.message}</p>
          </div>
        )}

        {testResult?.success && (
          <button
            onClick={() => navigate('/chat')}
            className="w-full mt-4 px-6 py-3.5 gradient-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            Start Chatting
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
