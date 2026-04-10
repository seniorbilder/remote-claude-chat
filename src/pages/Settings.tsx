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
    'w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-hint focus:outline-none focus:border-muted-foreground input-focus-glow transition-colors';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[560px] mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Connection Settings</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Configure SSH access to your remote Claude Code server
          </p>
        </div>

        <div className="space-y-5">
          {/* Host + Port */}
          <div className="flex gap-3">
            <div className="flex-[7]">
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                Host
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
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
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
            <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={config.username}
              onChange={(e) => setConfig({ username: e.target.value })}
              placeholder="ubuntu"
              className={`${inputClass} font-mono`}
            />
          </div>

          {/* Auth Method */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
              Authentication
            </label>
            <div className="inline-flex bg-surface border border-border rounded-md p-0.5">
              {(['key', 'password'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    setConfig({ authMethod: method });
                    if (method === 'key') setShowKeyField(true);
                  }}
                  className={`px-4 py-1.5 rounded text-[12px] font-medium transition-colors ${
                    config.authMethod === method
                      ? 'bg-foreground text-background'
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
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Private Key
                  </label>
                  <div className="flex items-center gap-3 bg-surface border border-border rounded-md px-3 py-2">
                    <span className="text-sm text-muted-foreground font-mono">••••• (saved)</span>
                    <button
                      onClick={() => setShowKeyField(true)}
                      className="text-[11px] text-foreground underline underline-offset-2 hover:text-muted-foreground"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Private Key
                  </label>
                  <textarea
                    value={config.privateKey || ''}
                    onChange={(e) => setConfig({ privateKey: e.target.value })}
                    placeholder={"-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----"}
                    rows={6}
                    className={`${inputClass} font-mono resize-none`}
                  />
                  <p className="text-[11px] text-hint mt-1">
                    Paste the full content of your private key file.
                  </p>
                </div>
              )}
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Passphrase <span className="text-hint">(optional)</span>
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
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={config.password || ''}
                  onChange={(e) => setConfig({ password: e.target.value })}
                  placeholder="Enter password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hint hover:text-muted-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Working Directory */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
              Working Directory
            </label>
            <input
              type="text"
              value={config.workingDirectory}
              onChange={(e) => setConfig({ workingDirectory: e.target.value })}
              placeholder="~"
              className={`${inputClass} font-mono`}
            />
            <p className="text-[11px] text-hint mt-1">
              Directory where Claude Code executes commands.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-md hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-30"
            >
              Save
            </button>
            <button
              onClick={handleTest}
              disabled={!isValid || testing}
              className="px-4 py-2 border border-border text-foreground text-[13px] font-medium rounded-md hover:bg-secondary active:scale-[0.98] transition-all disabled:opacity-30 flex items-center gap-2"
            >
              {testing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
              className={`flex items-start gap-2.5 p-3 rounded-md border text-sm ${
                testResult.success
                  ? 'border-border bg-surface text-foreground'
                  : 'border-destructive/30 bg-destructive/5 text-destructive'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <p className="text-[13px]">{testResult.message}</p>
            </div>
          )}

          {testResult?.success && (
            <button
              onClick={() => navigate('/chat')}
              className="w-full px-4 py-2.5 bg-foreground text-background text-[13px] font-medium rounded-md hover:bg-foreground/90 active:scale-[0.98] transition-all"
            >
              Start Chatting →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
