import { useState, useEffect } from 'react';

// css
import '../css/App.css';
import 'tippy.js/dist/tippy.css';

// data
import basedeck from '../data/data';
import enemies from '../data/enemies';

// utilties
import { shuffleDeck, handleClick, clickHand, drawCards } from '../libs/utilities';
import { calcCombat, combatAnimation } from '../libs/combat';

// Components
import Card from './Card';
import Hand from './Hand';
import Nav from './Nav';
import Systems from './Systems';
import PlayButton from './PlayButton';
import SystemIcon from './SystemIcon';
import Stats from './Stats';
import CombatSymbol from './CombatSymbol';

function App() {
  const HANDSIZE = 5;  

  /*
    DEFINE STATE
  */
  const [deckComplete] = useState(basedeck.map(card => {
    return {
      ...card,
      selected:false, 
    }
  }));
  const [deckCycle, setDeckCycle] = useState({
    draw:deckComplete,
    hand:[],
    discard:[],
  });
  const [systems, setSystems] = useState([
    {id:0, name:'Shields', img:'g13879.png', pow:1, selected:false}, 
    {id:1, name:'Scanners', img:'sensors.png', pow:1, selected:false}, 
    {id:2, name:'ECM', img:'ecm.png', pow:1, selected:false}, 
    {id:3, name:'Engine', img:'foot.png', pow:1, selected:false}, 
    {id:4, name:'Navigation', img:'nav.png', pow:1, selected:false},
  ]);
  const [shipStats, setShipStats] = useState({});
  const [legal, setLegal] = useState(true);
  const [firstDraw, setFirstDraw] = useState(true);
  const [playTooltip, setPlayTootip] = useState("");
  const [combatStats, setCombatStats] = useState({});
  const [allEnemies] = useState(enemies.map(enemy => {
    return {
      ...enemy,
      id: +enemy.id,
      difficulty: +enemy.difficulty,
      targeting: +enemy.targeting,
      evasion: +enemy.evasion,
      shield: +enemy.shield,
      shieldPen: +enemy.shieldPen,
      initiative: +enemy.initiative,
      armor: +enemy.armor,
      name: enemy.name,
      hd: enemy.hd.split(",").map(elem => +elem),
    }
  }));
  const [enemyStats] = useState(allEnemies[Math.floor(Math.random()*allEnemies.length)]);
  const [playerHitChance, setPlayerHitChance] = useState(0);
  const [enemyHitChance, setEnemyHitChance] = useState(0);
  const [combatResults, setCombatResults] = useState("");
  const [fadeProp, setFadeProp] = useState({
    fade:'fade-out',
  });
  const [abilityMenu] = useState(true);
  /*
    END DEFINE STATE
  */

  // console.log("render");


  // Initial deck shuffle 
  useEffect(() => {
    // setDraw(shuffleDeck(deck));
    setDeckCycle(prevDeck => {
      return {
        ...prevDeck,
        draw:shuffleDeck(prevDeck.draw),
    }});
  }, []);

  // Set max stats when deck changes
  useEffect(() => {
    setShipStats({
      power: deckComplete.reduce((acc, card) => acc + parseInt(card.power), 0),
      command: deckComplete.reduce((acc, card) => acc + parseInt(card.command), 0),
      support: deckComplete.reduce((acc, card) => acc + parseInt(card.support), 0),
      health: deckComplete.reduce((acc, card) => acc + parseInt(card.health), 0),
    });
  }, [deckComplete, allEnemies]);

  // Initialize hit chances
  useEffect(() => {
    setPlayerHitChance(calcCombat(combatStats, enemyStats));
    setEnemyHitChance(calcCombat(enemyStats, combatStats));
  }, [combatStats, enemyStats]);

  // Set all stats
  useEffect(() => {
    setCombatStats({
      support: deckCycle.hand.length > 0 ? 
        shipStats.support + 
        deckCycle.hand.reduce((acc, card) => card.selected ? 
        parseInt(card.actSup) + acc : 0 + acc, 0) : 
        0,
      command: deckCycle.hand.length > 0 ? 
        shipStats.command + 
        deckCycle.hand.reduce((acc, card) => card.selected ? 
        parseInt(card.actCom) + acc : 0 + acc, 0) :
        0,
      power: deckCycle.hand.length > 0 ? 
        shipStats.power + 
        systems.reduce((acc, sys) => sys.selected ? 
        -1 + acc : 0 + acc, 0) : 
        0,
      hd:[1,1],
      targeting: (deckCycle.hand.reduce((acc, card) => 
      card.selected ? parseInt(card.targeting) + acc : 0 + acc, 0)) + 
      (systems[1].selected ? systems[1].pow : 0),
      evasion: (deckCycle.hand.reduce((acc, card) => 
      card.selected ? parseInt(card.evasion) + acc : 0 + acc, 0)) + 
      (systems[2].selected ? systems[2].pow : 0),
      shield: systems[0].selected ? systems[0].pow : 0,
      shieldPen:0,
      initiative: (systems[3].selected ? systems[3].pow : 0),
      armor:1,
    });    
  }, [deckCycle, systems, shipStats]);

  // Setup draw button
  useEffect(() => {
    if (firstDraw) {
      setPlayTootip("Draw Cards!");
    } else if (combatStats.power < 0) {
      setPlayTootip("Insufficient Power!");
    } else if (combatStats.command < 0) {
      setPlayTootip("Insufficient Command!");      
    } else if (combatStats.support < 0) {
      setPlayTootip("Insufficient Support!");      
    } else {
      setPlayTootip("Play Cards!");      
    }
    setLegal(
      combatStats.power >= 0 && 
      combatStats.command >= 0 &&
      combatStats.support >= 0
    );
  }, [combatStats, firstDraw]);

  // jsx
  return (
    <div className="App">      
      <Nav 
        draw={deckCycle.draw.length}
        discard={deckCycle.discard.length}
        curPower={combatStats.power}
        curCommand={combatStats.command}
        curSupport={combatStats.support}
        health={combatStats.armor}
      />
      <main style={{marginTop:"80px"}}>
        <div style={{display:"flex", alignItems:"center"}}>
        <Stats 
          title="Player"
          stats={combatStats}
          hitChance={playerHitChance}
        />
        <CombatSymbol fadeProp={fadeProp}/>
        <Stats 
          title={enemyStats.name}
          stats={enemyStats}
          hitChance={enemyHitChance}
        />
        </div>
        <h2>
          {combatResults}
        </h2>
      </main>
      
      <div style={{
        position:"fixed", 
        // margin: "20px",
        width:"100%",
        bottom:"0", 
        right:"0",
        left:"0",
      }}>   
      {abilityMenu && <Systems>
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
          </Systems>}
          <br/>
        <Hand>
          {deckCycle.hand.length > 0 && deckCycle.hand.map((card, idx) => 
            <Card 
              key={idx} 
              card={card} 
              selected={card.selected}
              handleClick={() => clickHand(card.id, setDeckCycle)}
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
          <button style={{
            color:"black", 
            cursor:"pointer", 
          }} className="button" onClick={() => {
              combatAnimation(combatStats, enemyStats, setCombatResults, setFadeProp);
            }
          }>
              Roll
          </button>
          <PlayButton
            playTooltip={playTooltip}
            clickPlay={() => {
              setFirstDraw(false);
              drawCards(HANDSIZE, deckCycle, setDeckCycle, legal);
            }}
            legal={legal}
            firstDraw={firstDraw}
          />  
        </div>
      </div>
    </div>
  );
}

export default App;