import { useState, useEffect } from 'react';
import './App.css';
import basedeck from './data/data';
import Card from './components/Card';
import Hand from './components/Hand';
import Nav from './components/Nav';
// import * as fs from 'fs';

function App() {
  const [deck] = useState(basedeck);
  const [power, setPower] = useState(0);
  const [command, setCommand] = useState(0);
  const [support, setSupport] = useState(0);

  // console.log(power)

  // const fs = require('fs');
  // const { parse } = require("csv-parse");

  // const card1 = {
  //   icon: 'g7112.png',
  //   name: 'Interceptor',
  // }

  // deck.map
  useEffect(() => {
    setPower(deck.reduce((acc, card) => acc + parseInt(card.power), 0));
    setCommand(deck.reduce((acc, card) => acc + parseInt(card.command), 0));
    setSupport(deck.reduce((acc, card) => acc + parseInt(card.support), 0));
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
      />
      <Hand>
        {deck.map((card, idx) => <Card key={idx} card={card} />)}
      </Hand>
    </div>
  );
}

export default App;