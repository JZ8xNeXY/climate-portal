import { Header } from '@/components/Layout/Header';
import { ControlPanel } from '@/components/Layout/ControlPanel';
import { ComparisonView } from '@/components/Map/ComparisonView';
import { Legend } from '@/components/Layout/Legend';

export default function Home() {
  return (
    <main style={{ margin: 0, padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <ControlPanel />
      <ComparisonView />
      <Legend />
    </main>
  );
}
