import './App.css';
import { useUIStore } from './stores/uiStore';
import { ConnectionScreen } from './ui/screens/ConnectionScreen';
import { GlobalGraphView } from './ui/screens/GlobalGraph';
import { ImpactAnalyzerScreen } from './ui/screens/ImpactAnalyzer';

function App() {
  const activeScreen = useUIStore((s) => s.activeScreen);

  switch (activeScreen) {
    case 'connection':
      return <ConnectionScreen />;
    case 'graph':
      return <GlobalGraphView />;
    case 'impact':
      return <ImpactAnalyzerScreen />;
    default:
      return <ConnectionScreen />;
  }
}

export default App;
