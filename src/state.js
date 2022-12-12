// data
import basedeck from './data/data';
import enemies from './data/enemies';

// utilties
import { shuffleDeck } from './libs/utilities';
import { calcCombat } from './libs/combat';

const allEnemies = enemies.map(enemy => {
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
});
  
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
    actions: [
      {id:0, name:'Backward1', img:'backward1.png', pow:1, selected:false}, 
      {id:1, name:'Attack', img:'combat.png', pow:1, selected:false}, 
      {id:2, name:'Forward1', img:'forward1.png', pow:1, selected:false}, 
    ],
    shipStats: {},
    legal: true,
    firstDraw: true,
    playTooltip: "",
    combatStats: {},
    enemyStats: allEnemies[Math.floor(Math.random()*allEnemies.length)],
    playerHitChance: 0,
    enemyHitChance: 0,
    combatResults: "",
    fadeProp: {fade:'fade-out'},
    actionMenu: false,
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
        },
        actionMenu: true,
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
    case 'setActions':
    return {
        ...state,
        actions: state.actions.map(elem => {
        return elem.id === action.id ?
            {...elem, selected:true} :
            {...elem, selected:false}
        }),
        actionMenu: false,
        deckCycle: {
          ...state.deckCycle,
          hand: state.deckCycle.hand.map(elem => {
              return {...elem, selected:false}
          }),            
        },
    };
    case 'setShipStats':
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
    return {
        ...state, 
        legal: state.combatStats.power >= 0 && 
            state.combatStats.command >= 0 && 
            state.combatStats.support >= 0,
    };
    case 'setFirstDraw':
    return {...state, firstDraw: false};
    case 'setPlayTooltip':
    return {...state, playTooltip: action.text}
    case 'setCombatStats':
    return {
        ...state,
        combatStats: {
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
        }
    };
    case 'setPlayerHitChance':
    return {...state, playerHitChance:calcCombat(state.combatStats, state.enemyStats)};
    case 'setEnemyHitChance':
    return {...state, enemyHitChance:calcCombat(state.enemyStats, state.combatStats)};
    case 'setCombatResults':
    return {...state, combatResults:action.text};
    case 'setFadeProp':
    return {...state, fadeProp:{fade:action.fade}};
    default:
    return state;
}
};

export { initState, reducer };