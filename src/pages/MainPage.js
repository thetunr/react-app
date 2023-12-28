import { useState, useEffect, useCallback } from 'react';
import './MainPage.css';
// https://github.com/dariusk/corpora/blob/master/data/words/common.json
import wordsData from '../assets/words.json';


const MainPage = () => {

  const [textInput, setTextInput] = useState('')

  const [randList, setRandList] = useState([])

  const [numWords, setNumWords] = useState(25)

  const getRandWord = () => {
    const words = wordsData["english"] || [];
    const word = words[Math.floor(Math.random() * words.length)];
    return word
  }

  const initRandList = useCallback(() => {
    const set = new Set();
    while (set.size < numWords) {
      const word = getRandWord();
      set.add(word)
    }
    const array = Array.from(set);
    setRandList(array);
  }, [numWords])

  const initRandListString = () => {
    const randListString = randList.join("  ")
    return randListString
  }

  const handleTextChange = (event) => {
    if ((event.target.value).endsWith("  ")) {
      setTextInput("")
    } else {
      setTextInput(event.target.value)
    }
    // console.log(event.target.value) // prints the attempted word
  }

  const handleRedoClick = () => {
    initRandList();
  }

  function RedoButton() {
    return (<button className="Redo-button" onClick={handleRedoClick}>redo</button>);
  }

  const handle10Click = () => {
    setNumWords(10);

  };
  function Button10() {
    return (<button className="Num-button" onClick={handle10Click}>10</button>);
  }

  const handle25Click = () => {
    setNumWords(25);
  };
  function Button25() {
    return (<button className="Num-button" onClick={handle25Click}>25</button>);
  }

  const handle50Click = () => {
    setNumWords(50);
  };
  function Button50() {
    return (<button className="Num-button" onClick={handle50Click}>50</button>);
  }

  useEffect(() => {
    initRandList();
  }, [initRandList]);

  return (
    <><h1 className='Title'>tupe!</h1>
      <div className="Box-container">
        <div className="Box-content">
          <p>{initRandListString()}</p>
          <Button10 />
          <Button25 />
          <Button50 />
          <input
            type="text"
            value={textInput}
            onChange={handleTextChange}
            placeholder=""
          /><RedoButton />
        </div>
      </div>

    </>

  )
}

export default MainPage