import { useState, useEffect } from 'react';

// css
import '../css/App.css';
import 'tippy.js/dist/tippy.css';

// data
import basedeck from '../data/data';

// utilties
import {shuffleDeck, handleClick} from '../libs/utilities';
import combat from '../libs/combat';

// Components
import Card from './Card';
import Hand from './Hand';
import Nav from './Nav';
import Systems from './Systems';
import PlayButton from './PlayButton';
import SystemIcon from './SystemIcon';
import Stats from './Stats';

function App() {
  const HANDSIZE = 5;

  const drawCards = () => {
    let inDraw = [...draw];
    let inHand = [...hand];
    let inDiscard = [...discard]
    if (!legal) return;
    if (HANDSIZE > deck.length) {
      console.log("handsize too high for deck!");
      return
    }
    if (firstDraw) {
      // console.log("case 1");
      setFirstDraw(false);

      // fill hand
      inHand = inDraw.slice(0, HANDSIZE);
      // remove hand from draw
      if (HANDSIZE === deck.length) inDraw = [];
      else inDraw = inDraw.slice(HANDSIZE-inDraw.length);

      setHand(inHand);
      setDraw(inDraw);
      // console.log(inDraw, inHand, inDiscard);
      return
    }
    if (draw.length > HANDSIZE) {
      // console.log("case 2");
      
      // discard hand
      inDiscard = [
        ...inHand.map(card => {
          return {...card, selected:false}
        }), 
        ...inDiscard
      ];
      // fill hand
      inHand = inDraw.slice(0, HANDSIZE);
      // remove hand from draw
      inDraw = inDraw.slice(HANDSIZE-inDraw.length);
    } else if (draw.length === HANDSIZE) {
      // console.log("case 3");

      // discard hand
      inDiscard = [
        ...inHand.map(card => {
          return {...card, selected:false}
        }), 
        ...inDiscard
      ];
      // fill hand
      inHand = inDraw.slice(0, HANDSIZE);
      // empty draw pile (edge case)
      inDraw = [];
    } else {
      // console.log("case 4");

      // discard hand
      inDiscard = [
        ...inHand.map(card => {
          return {...card, selected:false}
        }), 
        ...inDiscard
      ];
      // shuffle discard, place under remaining hand
      inDraw = [...inDraw, ...shuffleDeck(inDiscard)];
      inDiscard = [];
      // fill hand
      inHand = inDraw.slice(0, HANDSIZE);
      // remove hand from draw
      inDraw = inDraw.slice(HANDSIZE-inDraw.length);
    }
    setDraw(inDraw);
    setHand(inHand);
    setDiscard(inDiscard);
    // console.log(inDraw, inHand, inDiscard);
  };

  const calcCombat = (p1, p2) => {
    const p1Hit = Math.min(Math.max(1,3-p1.targeting+p2.evasion),5);
    // return Math.round((1-(p1Hit/6)));
    return Math.floor((1-(p1Hit/6))*100);
  }

  /*
    DEFINE STATE
  */
  const [deck] = useState(basedeck.map(card => {
    return {
      ...card,
      selected:false, 
    }
  }));
  const [systems, setSystems] = useState([
    {id:0, name:'Shields', img:'g13879.png', pow:1, selected:false}, 
    {id:1, name:'Scanners', img:'sensors.png', pow:1, selected:false}, 
    {id:2, name:'ECM', img:'ecm.png', pow:1, selected:false}, 
    {id:3, name:'Engine', img:'foot.png', pow:1, selected:false}, 
    {id:4, name:'Navigation', img:'nav.png', pow:1, selected:false},
  ]);
  const [draw, setDraw] = useState(deck);
  const [hand, setHand] = useState([]);
  const [discard, setDiscard] = useState([]);
  const [shipStats, setShipStats] = useState({});
  const [curPower, setCurPower] = useState(0);
  const [curCommand, setCurCommand] = useState(0);
  const [curSupport, setCurSupport] = useState(0);
  const [legal, setLegal] = useState(true);
  const [firstDraw, setFirstDraw] = useState(true);
  const [playTooltip, setPlayTootip] = useState("");
  const [combatStats, setCombatStats] = useState({});
  const [dummyStats] = useState({
    hd:[1,1],
    targeting:0,
    evasion:0,
    shield:0,
    shieldPen:0,
    initiative:0,
    health:1,
  });
  const [playerHitChance, setPlayerHitChance] = useState(0);
  const [enemyHitChance, setEnemyHitChance] = useState(0);
  /*
    END DEFINE STATE
  */

  // Initial deck shuffle 
  useEffect(() => {
    setDraw(shuffleDeck(deck));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set max stats when deck changes
  useEffect(() => {
    setShipStats({
      power: deck.reduce((acc, card) => acc + parseInt(card.power), 0),
      command: deck.reduce((acc, card) => acc + parseInt(card.command), 0),
      support: deck.reduce((acc, card) => acc + parseInt(card.support), 0),
      health: deck.reduce((acc, card) => acc + parseInt(card.health), 0),
    });
  }, [deck]);

  useEffect(() => {
    setPlayerHitChance(calcCombat(combatStats, dummyStats));
    setEnemyHitChance(calcCombat(dummyStats, combatStats));
  }, [combatStats, dummyStats]);

  // Set all stats
  useEffect(() => {
    setCurSupport(shipStats.support + hand.reduce((acc, card) => card.selected ? 
      parseInt(card.actSup) + acc : 0 + acc, 0));
    setCurCommand(shipStats.command + hand.reduce((acc, card) => card.selected ? 
      parseInt(card.actCom) + acc : 0 + acc, 0));
    setCurPower(shipStats.power + systems.reduce((acc, sys) => sys.selected ? 
      -1 + acc : 0 + acc, 0));
    setCombatStats({
      hd:[1,1],
      targeting: (hand.reduce((acc, card) => 
      card.selected ? parseInt(card.targeting) + acc : 0 + acc, 0)) + 
      (systems[1].selected ? systems[1].pow : 0),
      evasion: (hand.reduce((acc, card) => 
      card.selected ? parseInt(card.evasion) + acc : 0 + acc, 0)) + 
      (systems[2].selected ? systems[2].pow : 0),
      shield: systems[0].selected ? systems[0].pow : 0,
      shieldPen:0,
      initiative: (systems[3].selected ? systems[3].pow : 0),
      health:1,
    });
    
  }, [hand, systems, shipStats, dummyStats, playerHitChance]);
  
  

  // Setup draw button
  useEffect(() => {
    if (firstDraw) {
      setPlayTootip("Draw Cards!");
    } else if (curPower < 0) {
      setPlayTootip("Insufficient Power!");
    } else if (curCommand < 0) {
      setPlayTootip("Insufficient Command!");      
    } else if (curSupport < 0) {
      setPlayTootip("Insufficient Support!");      
    } else {
      setPlayTootip("Play Cards!");      
    }
    setLegal(
      curPower >= 0 && 
      curCommand >= 0 &&
      curSupport >= 0
    );
  }, [curCommand, curPower, curSupport, firstDraw]);



  // jsx
  return (
    <div className="App">      
      <Nav 
        draw={draw.length}
        discard={discard.length}
        curPower={curPower}
        curCommand={curCommand}
        curSupport={curSupport}
        health={shipStats.health}
      />
      <main style={{marginTop:"80px"}}>
        <h1>The action goes here!</h1>
        <div style={{display:"flex"}}>
        <Stats 
          title="Player"
          shields={combatStats.shield}
          targeting={combatStats.targeting}
          evasion={combatStats.evasion}
          initiative={combatStats.initiative}
          health={combatStats.health}
          hitChance={playerHitChance}
          />
        <Stats 
          title="Enemy"
          shields={dummyStats.shield}
          targeting={dummyStats.targeting}
          evasion={dummyStats.evasion}
          initiative={dummyStats.initiative}
          health={combatStats.health}
          hitChance={enemyHitChance}
        />
        </div>
      </main>
      <div style={{
        position:"fixed", 
        // margin: "20px",
        width:"100%",
        bottom:"0", 
        right:"0",
        left:"0",
      }}>      
        <Hand>
          {hand.length > 0 && hand.map((card, idx) => 
            <Card 
              key={idx} 
              card={card} 
              selected={card.selected}
              handleClick={() => handleClick(card.id, setHand)}
            />
          )}
        </Hand>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"flex-end",
          margin:"20px",
        }}>
          <Systems>
            {systems.map((sys, idx) => 
              <div key={idx}>
                  <SystemIcon 
                    name={sys.name} 
                    img={sys.img} 
                    selected={sys.selected} 
                    handleClick={() => handleClick(sys.id, setSystems)}
                  />
              </div>
            )}
          </Systems>
          <button style={{color:"black"}} onClick={() => 
            // console.log(simulateCombat(combatStats, dummyStats, 10))
            console.log(combat(combatStats, dummyStats) ? "Win!" : "Loss!")
          }>
              Roll
          </button>
          <PlayButton
            playTooltip={playTooltip}
            clickPlay={drawCards}
            legal={legal}
            firstDraw={firstDraw}
          />  
        </div>
      </div>
    </div>
  );
}

export default App;