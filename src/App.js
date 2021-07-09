import './App.css';
import { useState } from 'react';

// Proxy to bypass CORS on localhost
const corsProxy = 'http://localhost:8080/';

// API endpoint
const wisdomApiUrl = 'dog-api.kinduff.com/api/facts';

const App = () => {
  // Local App State
  const [dogWisdom, setDogWisdom] = useState('↓ Press Button for Wisdom ↓');
  const [loading, setLoading] = useState(false);

  // Called on button press
  const getWisdom = () => {
    // only do anything if we're not already loading
    if (!loading) {
      // show user we're loading
      setDogWisdom('...');
      setLoading(true);

      // Fetch from API and update state
      fetch(corsProxy + wisdomApiUrl)
        .then((response) => response.json())
        .then((data) => setDogWisdom(data.facts[0]))
        .then(() => setLoading(false));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{dogWisdom}</p>
        <button onClick={getWisdom} disabled={loading}>
          Load Wisdom
        </button>
      </header>
    </div>
  );
};

export default App;
