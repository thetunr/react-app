import { useState, useEffect, useCallback } from 'react';
import './MainPage.css';
// https://github.com/dariusk/corpora/blob/master/data/words/common.json
import wordsData from '../assets/words.json';


const MainPage = () => {

  const [textInput, setTextInput] = useState('')

  const [randList, setRandList] = useState([])

  const [numWords, setNumWords] = useState(25)

  const [totalTyped, setTotalTyped] = useState(0)

  const [accuracy, setAccuracy] = useState(0)


  const [index, setIndex] = useState(0)

  const initRandList = useCallback(() => {
    const words = wordsData["english"] || [];
    const set = new Set();
    while (set.size < numWords) {
      const word = words[Math.floor(Math.random() * words.length)];
      set.add(word);
    }
    const goodList = Array.from(set).map(elem => ({ word: elem, incorrect: -1 }));
    setRandList(goodList);

    // print initial list
    // let wordList = goodList.map(elem => elem.word + " ");
    // console.log(wordList);
  }, [numWords]);

  // TODO: not the most optimal solution
  function countInc(s1, s2) {
    const chars1 = s1.split('');
    const chars2 = (s2 + "_________________").substring(0, s1.length).split('');
    const checker = (acc, cv, i) => {
      if (cv === chars2[i]) { return acc - 1 } else { return acc }
    }
    return chars1.reduce(checker, s1.length) + Math.max(s2.length - s1.length, 0);
  }

  const handleTextChange = (event) => {
    if (event.target.value.endsWith(" ")) {
      setTextInput("");
      if (index < numWords) {
        const typed = event.target.value;
        const typedWord = typed.substring(0, typed.length - 1);
        const currWord = randList[index].word;
        if (typedWord === currWord) {
          // console.log("true " + randList[index].word + " " + typedWord);
          randList.splice(index, 1, { word: currWord, incorrect: 0 });
        }
        else {
          // console.log("false " + randList[index].word + " " + typedWord);
          const inc = countInc(currWord, typedWord);
          randList.splice(index, 1, { word: currWord, incorrect: inc });
        }
        setTotalTyped(totalTyped + typedWord.length);
        setIndex(index + 1);
      }
      // this if statement is misplaced MAYBE
      if (index === numWords - 1) {
        // TODO: rethink how to compute accuracy, this is def wrong
        const corrOfTyped = totalTyped - randList
          .reduce(((acc, cv) => { return acc + cv.incorrect }), 0.0);
        setAccuracy(Math.round(100 * corrOfTyped / totalTyped));
        console.log(accuracy);
        // TODO: add code to update wpm
      }
    } else {
      setTextInput(event.target.value)
    }
  }

  const handleRedoClick = () => {
    initRandList();
    setIndex(0);
    setTextInput("");
  }
  function RedoButton() {
    return (<button className="Redo-button" onClick={handleRedoClick}>redo</button>);
  }

  const handleClick = (num) => {
    setNumWords(num);
    setIndex(0);
    if (num !== numWords) {
      setTextInput("");
    }
  };
  function NumButton({ num }) {
    return (<button className="Num-button" onClick={() => handleClick(num)}> {num}</button >);
  }

  // TODO: make run once
  useEffect(() => {
    initRandList();
  }, [initRandList]);


  function colorText(i) {
    if (index < numWords && i.word === randList[index].word) {
      return <span key={i.word} style={{ color: "orchid", wordSpacing: 2 }}>{i.word} </span>
    }
    else {
      if (i.incorrect === -1) {
        return <span key={i.word} style={{ color: "black", wordSpacing: 2 }}>{i.word} </span>
      }
      else if (i.incorrect === 0) {
        return <span key={i.word} style={{ color: "green", wordSpacing: 2 }}>{i.word} </span>
      }
      else if (i.incorrect > 0) {
        return <span key={i.word} style={{ color: "red", wordSpacing: 2 }}>{i.word} </span>
      }
    }
  }

  return (
    <><h1 className='Title'>tupe!</h1>
      <div className="Box-container">
        <div className="Box-content">
          <div>
            {
              randList.map(i => colorText(i))
            }
          </div>
          <NumButton num={10} />
          <NumButton num={25} />
          <NumButton num={50} />
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