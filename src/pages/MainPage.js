import { useState, useEffect } from 'react';
import './MainPage.css';
// https://github.com/dariusk/corpora/blob/master/data/words/common.json
import wordsData from '../assets/words.json';

const MainPage = () => {

  const [textInput, setTextInput] = useState('');

  const [wordList, setWordList] = useState([]);

  const [numWords, setNumWords] = useState(10);

  const [wpm, setWPM] = useState(0);

  const [accuracy, setAccuracy] = useState(0)

  const [index, setIndex] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // TODO: make run once without repeating code
  useEffect(() => {
    const words = wordsData["english"] || [];
    const set = new Set();
    while (set.size < numWords) {
      const word = words[Math.floor(Math.random() * words.length)];
      set.add(word);
    }
    const goodList = Array.from(set).map(elem => ({ word: elem, typed: "", correct: -1 })); // record of word, type, and whether typed is correct or not
    setWordList(goodList);
  }, [numWords]);

  function initWordList() {
    const words = wordsData["english"] || [];
    const set = new Set();
    while (set.size < numWords) {
      const word = words[Math.floor(Math.random() * words.length)];
      set.add(word);
    }
    const goodList = Array.from(set).map(elem => ({ word: elem, typed: "", correct: -1 })); // record of word, type, and whether typed is correct or not
    setWordList(goodList);
  };

  // TODO: not the most optimal solution
  function countCorrectness(s1, s2) {
    const chars1 = s1.split('');
    const chars2 = (s2 + "                     ").substring(0, s1.length).split('');
    const checker = (acc, cv, i) => {
      if (cv === chars2[i]) { return acc + 1 } else { return acc }
    }
    return chars1.reduce(checker, 0);
  }

  function typingComplete() {
    setIsRunning(false); // typing is over so we stop the time
    // TODO: might be good right now, using ratio
    const totalChars = wordList
      .reduce(((acc, cv) => { return acc + cv.word.length }), 0.0); // computes total number of characters in the prompt
    const correctChars = wordList
      .reduce(((acc, cv) => {
        return acc + (cv.word.length * cv.correct) / (Math.max(cv.typed.length, cv.word.length))
      }), 0.0); // computes ratio of characters correct of typed or of prompt
    setAccuracy(Math.round(100 * correctChars / totalChars));
    // https://medium.com/how-to-react/simple-way-to-create-a-stopwatch-in-react-js-bcc0e08e041e
    setWPM(((correctChars / totalChars) * numWords / (seconds / 60)).toFixed(1))
  }

  const handleTextChange = (event) => {
    index === 0 && setIsRunning(true); // if first character, start timer    
    const typed = event.target.value; // typed holds string in text input (including space)
    const correctWord = wordList[index].word;

    // if input is space
    if (typed[typed.length - 1] === " ") {
      setTextInput(""); // reset typed word to nothing
      const typedWord = typed.substring(0, typed.length - 1); // removes space at the end of typed
      if (index < numWords - 1) { // when completed word is not last word

        const numCorrect = typedWord === correctWord ? correctWord.length : countCorrectness(correctWord, typedWord);
        wordList.splice(index, 1, { word: correctWord, typed: typedWord, correct: numCorrect });
        setIndex(index + 1); // increment index as we are iterating through wordList
      }
      if (index === numWords - 1) { // determines if the typing is over
        typingComplete();
      }
    } else {
      if (index === numWords - 1 && typed === correctWord) { // if last word and correctly typed
        wordList.splice(index, 1, { word: correctWord, typed: typed, correct: correctWord.length });
        typingComplete();
      }
      setTextInput(event.target.value);
    }
  }

  function handleRedoClick() {
    initWordList();
    setIndex(0);
    setTextInput("");
    setIsRunning(false);
    setSeconds(0);
  };



  function handleNumButtonClick(num) {
    setTextInput("");
    if (num !== numWords) {
      setNumWords(num);
      setIsRunning(false);
      setSeconds(0);
      setIndex(0);
    }
  };

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



  // TODO: fix
  // useEffect(() => {
  //   const handleEsc = (event) => {
  //     if (event.key === 'Escape') {
  //       handleRedoClick();
  //     }
  //   };
  //   window.addEventListener('keydown', handleEsc);

  //   return () => {
  //     window.removeEventListener('keydown', handleEsc);
  //   };
  // }, [handleRedoClick]);


  useEffect(() => {
    let intervalId;
    if (isRunning) {
      // incrementing by 0.01 every 10 miliseconds
      intervalId = setInterval(() => setSeconds(seconds + 0.01), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, seconds]);

  return (
    <div className="box-container">
      <div className="box-content">
        <div>
          {
            wordList.map(i => colorText(i))
          }
        </div>
        <button className={`num-button ${numWords === 10 ? 'selected-num' : ''}`} onClick={() => handleNumButtonClick(10)}> {10}</button >
        <button className={`num-button ${numWords === 25 ? 'selected-num' : ''}`} onClick={() => handleNumButtonClick(25)}> {25}</button >
        <button className={`num-button ${numWords === 50 ? 'selected-num' : ''}`} onClick={() => handleNumButtonClick(50)}> {50}</button >
        <input
          autoFocus
          type="text"
          value={textInput}
          onInput={handleTextChange}
          placeholder=""
        />
        <button className="redo-button" onClick={() => handleRedoClick()}>redo</button>

      </div>
      <div className="results-content">wpm: {wpm} / acc: {accuracy}%</div>
      <span>{seconds}</span>
    </div >
  )
}

export default MainPage