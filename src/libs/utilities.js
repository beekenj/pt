function shuffleDeck(arr) {
    // starting from the end of the array, let j be random index between 
    // 0 and i. Switch the elements at indeces i and j; iterete.
    for (let i = arr.length -1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

function handleClick(id, setState) {
    setState(prev => prev.map(elem => {
      return elem.id === id && elem.type !== 'system' && elem.pow !== 0 ?
        {...elem, selected:!elem.selected} :
        elem
      }
    ));
  };

export {shuffleDeck, handleClick};