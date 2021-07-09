import './App.css';
import { useState } from 'react';

const corsProxy = 'http://localhost:8080/';
const wisdomApiUrl = 'dog-api.kinduff.com/api/facts';

const App = () => {
  const [dogWisdom, setDogWisdom] = useState('Loading dog wisdom...');
  const [loading, setLoading] = useState(true);

  const getWisdom = () => {
    if (!loading) {
      setDogWisdom('...');
      setLoading(true);
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
          Renew Wisdom
        </button>
      </header>
    </div>
  );
};

export default App;
