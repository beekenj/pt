import { useState, useEffect } from 'react';
import './App.css';
import basedeck from './data/data';
import Card from './components/Card';
import Hand from './components/Hand';
import Nav from './components/Nav';
// import * as fs from 'fs';

function App() {
  const [deck, setDeck] = useState(basedeck);
  const [power, setPower] = useState(0);
  const [command, setCommand] = useState(0);
  const [support, setSupport] = useState(0);
  const [health, setHealth] = useState(0);

  const shuffleDeck = (arr) => {
    // starting from the end of the array, let j be random index between 
    // 0 and i. Switch the elements at indeces i and j; iterete.
    for (let i = arr.length -1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    setDeck(prevDeck => shuffleDeck(prevDeck));
  }, []);

  useEffect(() => {
    setPower(deck.reduce((acc, card) => acc + parseInt(card.power), 0));
    setCommand(deck.reduce((acc, card) => acc + parseInt(card.command), 0));
    setSupport(deck.reduce((acc, card) => acc + parseInt(card.support), 0));
    setHealth(deck.reduce((acc, card) => acc + parseInt(card.health), 0));
  }, [deck])

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      {/* <img src={icon} alt="icon" /> */}
      
      <Nav 
        power={power}
        command={command}
        support={support}
        health={health}
      />
      <Hand>
        {deck.map((card, idx) => <Card key={idx} card={card} />)}
      </Hand>
    </div>
  );
}

export default App;