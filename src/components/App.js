import { useState, useEffect, useReducer } from 'react';

// css
import '../css/App.css';
import 'tippy.js/dist/tippy.css';

// data
import basedeck from '../data/data';
import enemies from '../data/enemies';

// utilties
import { shuffleDeck, handleClick, drawCards } from '../libs/utilities';
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

const initState = {
  deckComplete: basedeck.map(card => {
    return {
      ...card,
      selected:false, 
    }
  }),
  deckCycle: {
    draw:shuffleDeck(basedeck.map(card => {
      return {
        ...card,
        selected:false, 
      }
    })),
    hand:[],
    discard:[],
  },
  systems: [
    {id:0, name:'Shields', img:'g13879.png', pow:1, selected:false}, 
    {id:1, name:'Scanners', img:'sensors.png', pow:1, selected:false}, 
    {id:2, name:'ECM', img:'ecm.png', pow:1, selected:false}, 
    {id:3, name:'Engine', img:'foot.png', pow:1, selected:false}, 
    {id:4, name:'Navigation', img:'nav.png', pow:1, selected:false},
  ],
  shipStats: {},
  legal: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setDeckCycleDraw':
      return {
        ...state,
        deckCycle: {
          draw:action.draw,
          hand:action.hand,
          discard:action.discard,
        },
    };
    case 'setDeckCycleClick':
      return {
        ...state,
        deckCycle: {
          ...state.deckCycle,
          hand: state.deckCycle.hand.map(elem => {
            return elem.id === action.id && elem.type !== 'system' && elem.pow !== 0 ?
              {...elem, selected:!elem.selected} :
              elem
          }),            
        }
    };
    case 'setSystems':
      return {
        ...state,
        systems: state.systems.map(elem => {
          return elem.id === action.id && elem.type !== 'system' && elem.pow !== 0 ?
            {...elem, selected:!elem.selected} :
            elem
        }),
    };
    case 'setShipStats':
      // console.log(state.deckComplete.reduce((acc, card) => acc + parseInt(card.power), 0))
      return {
        ...state,
        shipStats: {
          power: state.deckComplete.reduce((acc, card) => acc + parseInt(card.power), 0),
          command: state.deckComplete.reduce((acc, card) => acc + parseInt(card.command), 0),
          support: state.deckComplete.reduce((acc, card) => acc + parseInt(card.support), 0),
          health: state.deckComplete.reduce((acc, card) => acc + parseInt(card.armor), 0),
        },
    };
    case 'setLegal':
      return {...state, legal:action.power >= 0 && action.command >= 0 && action.support >= 0}
        // stats.combatStats.power >= 0 && 
        // stats.combatStats.command >= 0 &&
        // stats.combatStats.support >= 0
    default:
      return state;
  }
}

function App() {
  const HANDSIZE = 5;  

  const [state, dispatch] = useReducer(reducer, initState);
  console.log(state.shipStats)
  
  /*
    DEFINE STATE
  */
  // const [legal, setLegal] = useState(true);
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
 console.log(combatStats)
 
  // Set max stats when deck changes
  useEffect(() => {
    dispatch({type:'setShipStats'});
  }, [state.deckComplete, allEnemies]);

  // Initialize hit chances
  useEffect(() => {
    setPlayerHitChance(calcCombat(combatStats, enemyStats));
    setEnemyHitChance(calcCombat(enemyStats, combatStats));
  }, [combatStats, enemyStats]);

  // Set all stats
  useEffect(() => {
    setCombatStats({
      support: state.deckCycle.hand.length > 0 ? 
        state.shipStats.support + 
        state.deckCycle.hand.reduce((acc, card) => card.selected ? 
        parseInt(card.actSup) + acc : 0 + acc, 0) : 
        state.shipStats.support,
      command: state.deckCycle.hand.length > 0 ? 
        state.shipStats.command + 
        state.deckCycle.hand.reduce((acc, card) => card.selected ? 
        parseInt(card.actCom) + acc : 0 + acc, 0) :
        state.shipStats.command,
      power: state.shipStats.power + 
        state.systems.reduce((acc, sys) => sys.selected ? 
        -1 + acc : 0 + acc, 0),
      hd:[1,1],
      targeting: (state.deckCycle.hand.reduce((acc, card) => 
      card.selected ? parseInt(card.targeting) + acc : 0 + acc, 0)) + 
      (state.systems[1].selected ? state.systems[1].pow : 0),
      evasion: (state.deckCycle.hand.reduce((acc, card) => 
      card.selected ? parseInt(card.evasion) + acc : 0 + acc, 0)) + 
      (state.systems[2].selected ? state.systems[2].pow : 0),
      shield: state.systems[0].selected ? state.systems[0].pow : 0,
      shieldPen:0,
      initiative: (state.systems[3].selected ? state.systems[3].pow : 0),
      armor:1,
    });    
  }, [state.deckCycle, state.systems, state.shipStats]);

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
    dispatch({
      type:'setLegal', 
      power:combatStats.power, 
      command:combatStats.command, 
      support:combatStats.support
    });
  }, [combatStats, firstDraw]);

  // jsx
  return (
    <div className="App">      
      <Nav 
        // draw={0}
        draw={state.deckCycle.draw.length}
        discard={state.deckCycle.discard.length}
        // discard={0}
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
            {state.systems.map((sys, idx) => 
              <div key={idx}>
                  <SystemIcon 
                    name={sys.name} 
                    img={sys.img} 
                    selected={sys.selected} 
                    handleClick={() => handleClick(sys.id, dispatch, 'setSystems')}
                  />
              </div>
            )}
          </Systems>}
          <br/>
        <Hand>
          {state.deckCycle.hand.length > 0 && state.deckCycle.hand.map((card, idx) => 
            <Card 
              key={idx} 
              card={card} 
              selected={card.selected}
              handleClick={() => handleClick(card.id, dispatch, 'setDeckCycleClick')}
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
            {state.systems.map((sys, idx) => 
              <div key={idx}>
                  <SystemIcon 
                    name={sys.name} 
                    img={sys.img} 
                    selected={sys.selected} 
                    handleClick={() => handleClick(sys.id, dispatch, 'setSystems')}
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
              drawCards(HANDSIZE, state.deckCycle, dispatch, 'setDeckCycleDraw', state.legal);
            }}
            legal={state.legal}
            firstDraw={firstDraw}
          />  
        </div>
      </div>
    </div>
  );
}

export default App;