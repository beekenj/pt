import { useState, useEffect } from 'react';
import './App.css';
import basedeck from './data/data';
import Card from './components/Card';
import Hand from './components/Hand';
import Nav from './components/Nav';

function App() {
  const HANDSIZE = 4;

  const shuffleDeck = (arr) => {
    // starting from the end of the array, let j be random index between 
    // 0 and i. Switch the elements at indeces i and j; iterete.
    for (let i = arr.length -1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const drawCards = () => {
    // console.log("clicked");
    setHand(draw.slice(0, HANDSIZE));
    setDraw(prevDraw => prevDraw.slice(HANDSIZE-prevDraw.length)); 
    if (hand.length > 0) {      
      setDiscard(prevDiscard => [...hand, ...prevDiscard]);
    }    
  }
  
  const [deck] = useState(basedeck);
  const [draw, setDraw] = useState(shuffleDeck(deck));
  // const [draw, setDraw] = useState(deck);
  const [hand, setHand] = useState([]);
  const [discard, setDiscard] = useState([]);
  const [shipStats, setShipStats] = useState({});

  useEffect(() => {
    setShipStats({
      power: deck.reduce((acc, card) => acc + parseInt(card.power), 0),
      command: deck.reduce((acc, card) => acc + parseInt(card.command), 0),
      support: deck.reduce((acc, card) => acc + parseInt(card.support), 0),
      health: deck.reduce((acc, card) => acc + parseInt(card.health), 0),
    });
  }, [deck]);

  useEffect(() => {
    if (draw.length < HANDSIZE) {
      setDraw(prevDraw => [...prevDraw, ...shuffleDeck(discard)]);
      setDiscard([]);
    }
  }, [draw, discard]);

  return (
    <div className="App">      
      <Nav 
        power={shipStats.power}
        command={shipStats.command}
        support={shipStats.support}
        health={shipStats.health}
      />
      {/* <Hand>
        {draw.length > 0 && draw.map((card, idx) => <Card key={idx} card={card} />)}
      </Hand> */}
      <Hand>
        {hand.length > 0 && hand.map((card, idx) => <Card key={idx} card={card} />)}
      </Hand>
      {/* <Hand>
        {discard.length > 0 && discard.map((card, idx) => <Card key={idx} card={card} />)}
      </Hand> */}
      <button onClick={drawCards}>Draw</button>
    </div>
  );
}

export default App;