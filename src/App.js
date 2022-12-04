import { useState, useEffect } from 'react';
import './App.css';
import basedeck from './data/data';
import Card from './components/Card';
import Hand from './components/Hand';
import Nav from './components/Nav';
import Systems from './components/Systems';

function App() {
  const HANDSIZE = 4;

  const shuffleDeck = (arr) => {
    // starting from the end of the array, let j be random index between 
    // 0 and i. Switch the elements at indeces i and j; iterete.
    // console.log("shuffle");
    for (let i = arr.length -1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const drawCards = () => {
    setHand(draw.slice(0, HANDSIZE));
    setDraw(prevDraw => {
      // console.log(prevDraw, hand);
      return prevDraw.slice(HANDSIZE-prevDraw.length)
    }); 
    if (hand.length > 0) { 
      setHand(prevHand => prevHand.map(card => {
        return {...card, selected:false}
      }))
      setDiscard(prevDiscard => [...hand, ...prevDiscard]);
    }    
    // console.log("clicked");
  }

  const handleClick = (id) => {
    setHand(prevHand => prevHand.map(card => {
      return card.id === id && card.type !== 'system' ?
        {...card, selected:!card.selected} :
        card
      }
    ));
    // setHandSelect(prevSelect => [...prevSelect, prevSelect[idx]=!prevSelect[idx]]);
  }
  
  const [deck] = useState(basedeck.map(card => {
    return {
      ...card,
      selected:false, 
    }
  }));
  // const [draw, setDraw] = useState(shuffleDeck(deck));
  const [draw, setDraw] = useState(deck);
  const [hand, setHand] = useState([]);
  // const [handSelect, setHandSelect] = useState(new Array(HANDSIZE).fill(false));
  const [discard, setDiscard] = useState([]);
  const [shipStats, setShipStats] = useState({});
  const [curPower] = useState(0);
  const [curCommand, setCurCommand] = useState(0);
  const [curSupport, setCurSupport] = useState(0);

  useEffect(() => {
    setDraw(shuffleDeck(deck));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // console.log("SH")
      setDraw(prevDraw => [...prevDraw, ...shuffleDeck(discard)]);
      setDiscard([]);
    }
  }, [draw, discard]);

  useEffect(() => {
    setCurSupport(shipStats.support + hand.reduce((acc, card) => card.selected ? 
      parseInt(card.actSup) + acc : 0 + acc, 0));
    setCurCommand(shipStats.command + hand.reduce((acc, card) => card.selected ? 
      parseInt(card.actCom) + acc : 0 + acc, 0));
  }, [hand, shipStats]);

  return (
    <div className="App">      
      <Nav 
        power={shipStats.power}
        command={shipStats.command}
        support={shipStats.support}
        curPower={curPower}
        curCommand={curCommand}
        curSupport={curSupport}
        health={shipStats.health}
      />
      {/* <Hand>
        {draw.length > 0 && draw.map((card, idx) => <Card key={idx} card={card} />)}
      </Hand> */}
      <Hand>
        {hand.length > 0 && hand.map((card, idx) => 
          <Card 
            key={idx} 
            card={card} 
            selected={card.selected}
            handleClick={() => handleClick(card.id)}
          />
        )}
      </Hand>
      {/* <Hand>
        {discard.length > 0 && discard.map((card, idx) => <Card key={idx} card={card} />)}
      </Hand> */}
      <button onClick={drawCards}>Draw</button>
      <Systems />
    </div>
  );
}

export default App;