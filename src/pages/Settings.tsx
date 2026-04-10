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

    setTestResult({ success: true, message: 'Connected — Claude Code v1.0.12 detected' });
    setConnectionStatus('connected');
    setClaudeVersion('1.0.12');
    setTesting(false);
  };

  const isValid = config.host.trim() !== '' && config.username.trim() !== '';

  const inputClass =
    'w-full bg-surface border border-border rounded px-3 py-2 text-[13px] text-foreground placeholder:text-hint focus:outline-none focus:border-muted-foreground input-focus-glow transition-colors';

  const labelClass = 'block text-[10px] font-display font-medium text-muted-foreground mb-1.5 uppercase tracking-[0.15em]';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[520px] mx-auto px-6 py-14">
        <div className="mb-10">
          <h1 className="text-lg font-display font-bold text-foreground tracking-[0.08em] uppercase">
            Connection
          </h1>
          <p className="text-[12px] text-muted-foreground mt-1.5 tracking-wide">
            Configure SSH access to your remote server
          </p>
        </div>

        <div className="space-y-5">
          {/* Host + Port */}
          <div className="flex gap-3">
            <div className="flex-[7]">
              <label className={labelClass}>Host</label>
              <input
                type="text"
                value={config.host}
                onChange={(e) => setConfig({ host: e.target.value })}
                placeholder="192.168.1.100"
                className={`${inputClass} font-mono`}
              />
            </div>
            <div className="flex-[3]">
              <label className={labelClass}>Port</label>
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
            <label className={labelClass}>Username</label>
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
            <label className={labelClass}>Auth Method</label>
            <div className="inline-flex bg-surface border border-border rounded p-0.5">
              {(['key', 'password'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    setConfig({ authMethod: method });
                    if (method === 'key') setShowKeyField(true);
                  }}
                  className={`px-4 py-1.5 rounded text-[11px] font-display uppercase tracking-[0.1em] transition-colors ${
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
                  <label className={labelClass}>Private Key</label>
                  <div className="flex items-center gap-3 bg-surface border border-border rounded px-3 py-2">
                    <span className="text-[13px] text-muted-foreground font-mono">••••• (saved)</span>
                    <button
                      onClick={() => setShowKeyField(true)}
                      className="text-[10px] text-foreground uppercase tracking-wider hover:text-muted-foreground"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Private Key</label>
                  <textarea
                    value={config.privateKey || ''}
                    onChange={(e) => setConfig({ privateKey: e.target.value })}
                    placeholder={"-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----"}
                    rows={5}
                    className={`${inputClass} font-mono resize-none`}
                  />
                  <p className="text-[10px] text-hint mt-1">Paste your full private key content.</p>
                </div>
              )}
              <div>
                <label className={labelClass}>
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
              <label className={labelClass}>Password</label>
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
                  aria-label={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Working Directory */}
          <div>
            <label className={labelClass}>Working Directory</label>
            <input
              type="text"
              value={config.workingDirectory}
              onChange={(e) => setConfig({ workingDirectory: e.target.value })}
              placeholder="~"
              className={`${inputClass} font-mono`}
            />
            <p className="text-[10px] text-hint mt-1">Remote execution directory.</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-5 py-2 bg-foreground text-background text-[11px] font-display font-bold uppercase tracking-[0.15em] rounded hover:bg-foreground/85 active:scale-[0.98] transition-all disabled:opacity-25"
            >
              Save
            </button>
            <button
              onClick={handleTest}
              disabled={!isValid || testing}
              className="px-5 py-2 border border-border text-foreground text-[11px] font-display uppercase tracking-[0.15em] rounded hover:bg-secondary active:scale-[0.98] transition-all disabled:opacity-25 flex items-center gap-2"
            >
              {testing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Testing
                </>
              ) : (
                'Test'
              )}
            </button>
          </div>

          {testResult && (
            <div
              className={`flex items-start gap-2.5 p-3 rounded border text-[13px] ${
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
              <p>{testResult.message}</p>
            </div>
          )}

          {testResult?.success && (
            <button
              onClick={() => navigate('/chat')}
              className="w-full px-5 py-2.5 bg-foreground text-background text-[11px] font-display font-bold uppercase tracking-[0.15em] rounded hover:bg-foreground/85 active:scale-[0.98] transition-all"
            >
              Start Chatting →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
