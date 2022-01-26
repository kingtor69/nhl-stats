import React, { useState } from 'react';
import './App.css';
import './startbootstrap-grayscale-gh-pages/css/styles.css';
// that doesn't actually work the way I was hoping
// check out `https://react-bootstrap.github.io/getting-started/introduction/`
import Navbar from './Navbar';
import UserBlock from './UserBlock';
import NhlStats from './NhlStats';

function App() {
  const [UserBlockPage, setUserBlockPage] = useState(false)
  return (
    <div className="App">
      <Navbar />
      { UserBlockPage 
        ? <UserBlock />
        : <NhlStats />
      }
    </div>
  );
}

export default App;
