import { create } from 'zustand';

export type AuthMethod = 'key' | 'password';
export type ConnectionStatus = 'not_configured' | 'connected' | 'disconnected' | 'connecting' | 'error';

export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  authMethod: AuthMethod;
  privateKey?: string;
  passphrase?: string;
  password?: string;
  workingDirectory: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AppState {
  // Config
  config: SSHConfig;
  configSaved: boolean;
  setConfig: (config: Partial<SSHConfig>) => void;
  saveConfig: () => void;

  // Connection
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  claudeVersion: string | null;
  setClaudeVersion: (v: string | null) => void;

  // Chat
  messages: ChatMessage[];
  isThinking: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  appendToLastAssistant: (content: string) => void;
  setIsThinking: (v: boolean) => void;
  clearMessages: () => void;

  // Mobile sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

const useAppStore = create<AppState>((set) => ({
  config: {
    host: '',
    port: 22,
    username: '',
    authMethod: 'key',
    privateKey: '',
    passphrase: '',
    password: '',
    workingDirectory: '~',
  },
  configSaved: false,
  setConfig: (partial) => set((s) => ({ config: { ...s.config, ...partial } })),
  saveConfig: () => set({ configSaved: true }),

  connectionStatus: 'not_configured',
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  claudeVersion: null,
  setClaudeVersion: (claudeVersion) => set({ claudeVersion }),

  messages: [],
  isThinking: false,
  addMessage: (msg) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...msg, id: crypto.randomUUID(), timestamp: new Date() },
      ],
    })),
  appendToLastAssistant: (content) =>
    set((s) => {
      const msgs = [...s.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, content: last.content + content };
      }
      return { messages: msgs };
    }),
  setIsThinking: (isThinking) => set({ isThinking }),
  clearMessages: () => set({ messages: [] }),

  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));

export default useAppStore;
