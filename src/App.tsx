import './App.css';
import { useUIStore } from './stores/uiStore';
import { ConnectionScreen } from './ui/screens/ConnectionScreen';

function App() {
  const activeScreen = useUIStore((s) => s.activeScreen);

  switch (activeScreen) {
    case 'connection':
      return <ConnectionScreen />;
    case 'graph':
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Global Graph View</h1>
          <p>Coming in M1-08</p>
        </div>
      );
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
