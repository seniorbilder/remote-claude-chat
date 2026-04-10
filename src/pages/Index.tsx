import { Navigate } from 'react-router-dom';
import useAppStore from '@/store/useAppStore';

export default function Index() {
  const configSaved = useAppStore((s) => s.configSaved);
  return <Navigate to={configSaved ? '/chat' : '/settings'} replace />;
}
