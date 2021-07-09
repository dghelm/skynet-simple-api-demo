import './App.css';
import { useState } from 'react';
import { SkynetClient, genKeyPairFromSeed } from 'skynet-js';

// Setup Skynet Client
const portal = true ? 'https://siasky.net' : undefined;
const client = new SkynetClient(portal);

// Setup Keys for Read/Write of Mutable Data
const { privateKey, publicKey } = genKeyPairFromSeed(
  'very secret seed not published in a web app'
);
const dataKey = 'latestWisdom';

// Proxy to bypass CORS on localhost
const corsProxy = 'http://localhost:8080/';

// API endpoint
const wisdomApiUrl = 'dog-api.kinduff.com/api/facts';

const App = () => {
  // Local App State
  const [dogWisdom, setDogWisdom] = useState('↓ Press Button for Wisdom ↓');
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(true);

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
        .then(() => {
          setLoading(false);
          setPublishing(false);
        });
    }
  };

  const publishWisdom = async () => {
    if (!publishing) {
      setLoading(true);
      setPublishing(true);

      // Make JSON object to publish
      const toPublish = {
        latestFact: dogWisdom,
        published: new Date(),
      };

      // Write to SkyDB
      await client.db.setJSON(privateKey, dataKey, toPublish);

      //// We could read from SkyDB in software
      // const { data } = await client.db.getJSON(publicKey, dataKey);

      // Or, get URL for usage outside of skynet-js (Skylink V2)
      const skylinkV2 = await client.registry.getEntryLink(publicKey, dataKey);
      const publishedWisdomUrl = await client.getSkylinkUrl(skylinkV2);

      console.log(publishedWisdomUrl);

      setLoading(false);
      setPublishing(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{dogWisdom}</p>
        <button onClick={getWisdom} disabled={loading}>
          Load Wisdom
        </button>
        <button
          onClick={publishWisdom}
          disabled={loading || publishing}
          style={{ marginTop: '10px' }}
        >
          Publish Wisdom
        </button>
      </header>
    </div>
  );
};

export default App;
