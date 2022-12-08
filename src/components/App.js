import { useState, useEffect } from 'react';

// css
import '../css/App.css';
import 'tippy.js/dist/tippy.css';

// data
import basedeck from '../data/data';

// utilties
import {shuffleDeck, handleClick} from '../libs/utilities'

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

  const combat = (p1, p2) => {
    let h1 = p1.health;
    let h2 = p2.health;
    let s1 = p1.shield;
    let s2 = p2.shield;
    const p1Hit = Math.min(Math.max(1,3-p1.targeting+p2.evasion),5);
    const p2Hit = Math.min(Math.max(1, 3-p2.targeting+p1.evasion),5);

    while (h1 > 0 && h2 > 0) {
      h2 -= p1.hd.reduce((acc, hit) => 
        Math.ceil(Math.random()*6) > p1Hit ? hit + acc : 0 + acc, 0);
      h1 -= p1.hd.reduce((acc, hit) => 
        Math.ceil(Math.random()*6) > p2Hit ? hit + acc : 0 + acc, 0);
      // sum([i if ciel(rand()*6) > p1_hit else 0 for i in p1.hd])
      // h2 -= 1
      h1 += Math.max(s1-p2.shieldPen, 0);
      h2 += Math.max(s2-p1.shieldPen, 0);
      s2 -= 1
      s1 -= 1
    };

    // console.log(h1, h2);

    if (h1 >= h2) return 1;
    else return 0;
  };

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
  // const [draw, setDraw] = useState(shuffleDeck(deck));
  const [draw, setDraw] = useState(deck);
  const [hand, setHand] = useState([]);
  // const [handSelect, setHandSelect] = useState(new Array(HANDSIZE).fill(false));
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
  const [simCombat] = useState(0);
  /*
    END DEFINE STATE
  */

  // callCombat(combatStats, dummyStats, 100)

  // console.log(simulateCombat(combatStats, dummyStats, 10))

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

  // useEffect(() => {
    
  // }, [hand, systems]);

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
    // callCombat(combatStats, dummyStats, 100);
    // setSimCombat(callCombat(combatStats, dummyStats, 100));
  }, [hand, systems, shipStats, dummyStats, simCombat]);

  

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
        <h3>{simCombat}</h3>
        <div style={{display:"flex"}}>
        <Stats 
          title="Player"
          shields={combatStats.shield}
          targeting={combatStats.targeting}
          evasion={combatStats.evasion}
          initiative={combatStats.initiative}
          />
        <Stats 
          title="Enemy"
          shields={dummyStats.shield}
          targeting={dummyStats.targeting}
          evasion={dummyStats.evasion}
          initiative={dummyStats.initiative}
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