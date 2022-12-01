import { useState, useEffect } from 'react';
import './App.css';
import basedeck from './data/data';
import Card from './components/Card';
import Hand from './components/Hand';
import Nav from './components/Nav';
// import * as fs from 'fs';

function App() {
  const shuffleDeck = (arr) => {
    // starting from the end of the array, let j be random index between 
    // 0 and i. Switch the elements at indeces i and j; iterete.
    for (let i = arr.length -1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const [deck] = useState(basedeck);
  const [draw] = useState(shuffleDeck(deck));
  // const [hand, setHand] = useState([]);
  const [shipStats, setShipStats] = useState({});

  // useEffect(() => {
  //   setHand(draw.slice(5));
  //   setDraw(prevDraw => prevDraw.slice(-5))
  // }, []);

  // console.log(draw.slice(-5))

  useEffect(() => {
    setShipStats({
      power: deck.reduce((acc, card) => acc + parseInt(card.power), 0),
      command: deck.reduce((acc, card) => acc + parseInt(card.command), 0),
      support: deck.reduce((acc, card) => acc + parseInt(card.support), 0),
      health: deck.reduce((acc, card) => acc + parseInt(card.health), 0),
    });
  }, [deck])

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      {/* <img src={icon} alt="icon" /> */}
      
      <Nav 
        power={shipStats.power}
        command={shipStats.command}
        support={shipStats.support}
        health={shipStats.health}
      />
      <Hand>
        {draw.map((card, idx) => <Card key={idx} card={card} />)}
      </Hand>
    </div>
  );
}

export default App;