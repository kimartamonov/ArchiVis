import './App.css';
import { useUIStore } from './stores/uiStore';
import { ConnectionScreen } from './ui/screens/ConnectionScreen';
import { GlobalGraphView } from './ui/screens/GlobalGraph';

function App() {
  const activeScreen = useUIStore((s) => s.activeScreen);

  switch (activeScreen) {
    case 'connection':
      return <ConnectionScreen />;
    case 'graph':
      return <GlobalGraphView />;
    case 'impact':
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Impact Analyzer</h1>
          <p>Coming in M2-05</p>
        </div>
      );
    default:
      return <ConnectionScreen />;
  }
}

export default App;
