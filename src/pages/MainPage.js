import { useState, useEffect, useCallback } from 'react';
import './MainPage.css';
// https://github.com/dariusk/corpora/blob/master/data/words/common.json
import wordsData from '../assets/words.json';


const MainPage = () => {

  const [textInput, setTextInput] = useState('')

  const [wordList, setWordList] = useState([])

  const [numWords, setNumWords] = useState(25)

  const [wpm, setWPM] = useState(0)

  const [accuracy, setAccuracy] = useState(0)

  const [index, setIndex] = useState(0)

  const [seconds, setSeconds] = useState(0.0);

  const initWordList = useCallback(() => {
    const words = wordsData["english"] || [];
    const set = new Set();
    while (set.size < numWords) {
      const word = words[Math.floor(Math.random() * words.length)];
      set.add(word);
    }
    const goodList = Array.from(set).map(elem => ({ word: elem, typed: "", correct: -1 }));
    setWordList(goodList);

    // print initial list
    // let wordList = goodList.map(elem => elem.word + " ");
    // console.log(wordList);
  }, [numWords]);

  // TODO: not the most optimal solution
  function countCorrectness(s1, s2) {
    const chars1 = s1.split('');
    const chars2 = (s2 + "                     ").substring(0, s1.length).split('');
    const checker = (acc, cv, i) => {
      if (cv === chars2[i]) { return acc + 1 } else { return acc }
    }
    return chars1.reduce(checker, 0);
  }

  const handleTextChange = (event) => {
    if (event.target.value.endsWith(" ")) {
      setTextInput("");
      if (index < numWords) {
        const typed = event.target.value;
        const typedWord = typed.substring(0, typed.length - 1);
        const currWord = wordList[index].word;
        if (typedWord === currWord) {
          wordList.splice(index, 1, { word: currWord, typed: typedWord, correct: currWord.length });
        }
        else {
          const numCorrect = countCorrectness(currWord, typedWord);
          wordList.splice(index, 1, { word: currWord, typed: typedWord, correct: numCorrect });
        }
        setIndex(index + 1);
      }
      if (index === numWords - 1) { // determines if the typing is over
        // TODO: rethink how to compute accuracy, might be right now, using ratio
        const totalChars = wordList
          .reduce(((acc, cv) => { return acc + cv.word.length }), 0.0);
        const correctRatio = wordList
          .reduce(((acc, cv) => {
            return acc + (cv.word.length * cv.correct) / (Math.max(cv.typed.length, cv.word.length))
          }), 0.0);
        setAccuracy(Math.round(100 * correctRatio / totalChars));
        // TODO: add code to update wpm
        // https://medium.com/how-to-react/simple-way-to-create-a-stopwatch-in-react-js-bcc0e08e041e


      }
    } else {
      setTextInput(event.target.value)
    }
  }

  const handleRedoClick = () => {
    initWordList();
    setIndex(0);
    setTextInput("");
    setSeconds(0);
  }
  function RedoButton() {
    return (<button className="Redo-button" onClick={() => handleRedoClick()}>redo</button>);
  }

  const handleClick = (num) => {
    setNumWords(num);
    setIndex(0);
    if (num !== numWords) {
      setTextInput("");
    }
  };
  function NumButton({ num }) {
    if (num === numWords) {
      return (<button style={{ textDecoration: 'underline', fontWeight: 600 }} className="Num-button" onClick={() => handleClick(num)}> {num}</button >);
    }
    else {
      return (<button className="Num-button" onClick={() => handleClick(num)}> {num}</button >);
    }
  }

  function colorText(i) {
    if (index < numWords && i.word === wordList[index].word) {
      return <span key={i.word} style={{ color: "orchid", wordSpacing: 2 }}>{i.word} </span>
    }
    else {
      const unattempted = i.correct === -1;
      const correctAns = i.correct === i.word.length;
      const wordColor = (unattempted && "black") || (correctAns && "green") || "red";
      return <span key={i.word} style={{ color: wordColor, wordSpacing: 2 }}>{i.word} </span>
    }
  }





  // TODO: make run once
  useEffect(() => {
    initWordList();
  }, [initWordList]);

  // TODO: ruining the timeline of other functions
  // TODO: doesn't reset time when redo click
  useEffect(() => {
    if (seconds > 0.0) {
      (index !== wordList.length) && setTimeout(() => setSeconds(seconds + .1), 100);
    }
    else {
      (seconds > 0.0 || ((index > 0) || (textInput !== ""))) && setTimeout(() => setSeconds(seconds + .1), 100);
    }
  },);



  return (
    <>
      <h1 className='Title'>tupe!</h1>
      <div className="Box-container">
        <div className="Box-content">
          <div>
            {
              wordList.map(i => colorText(i))
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
          />
          <RedoButton />
        </div>
        <div className="Results-content">wpm: {wpm} / acc: {accuracy} / time: {seconds}</div>
      </div>
    </>
  )
}

export default MainPage