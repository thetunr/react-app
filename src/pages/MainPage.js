import { useState, useEffect, useCallback } from 'react';
import './MainPage.css';
// https://github.com/dariusk/corpora/blob/master/data/words/common.json
import wordsData from '../assets/words.json';


const MainPage = () => {

  const [textInput, setTextInput] = useState('')

  const [randList, setRandList] = useState([])

  // const [typedList, setTypedList] = useState([])

  const getRandWord = (language) => {
    const words = wordsData[language] || [];
    const word = words[Math.floor(Math.random() * words.length)];
    // console.log(word)
    return word
  }

  const initRandList = useCallback((language) => {
    const set = new Set();
    while (set.size < 25) {
      const word = getRandWord("english");
      set.add(word)
    }
    const array = Array.from(set);
    setRandList(array);
  }, [])

  const initRandListString = () => {
    const randListString = randList.join(" ")
    return randListString
  }

  const handleTextChange = (event) => {
    if ((event.target.value).endsWith(" ")) {
      setTextInput("")
    } else {
      setTextInput(event.target.value)
    }
    // console.log(event.target.value) // prints the attempted word
  }

  function handleRedoClick() {
    initRandList("english");
  }

  function RedoButton() {
    return (<button className="Redo-button" onClick={handleRedoClick}>redo</button>);
  }

  useEffect(() => {
    initRandList("english");
  }, [initRandList]);

  return (
    <><h1 className='Title'>tupe!</h1>
      <div className="Box-container">

        <div className="Box-content">
          <p>{initRandListString()}</p>
          <input
            type="text"
            value={textInput}
            onChange={handleTextChange}
            placeholder=""
          />
        </div> <RedoButton />
      </div>

    </>

  )
}

export default MainPage