import { useState, useEffect, useCallback } from 'react';
import './WebMain.css';
import './MobileMain.css';
// https://github.com/dariusk/corpora/blob/master/data/words/common.json
import wordsData from '../assets/words.json';

const WebMain = () => {

  const [title, setTitle] = useState('tupe!');

  const [textInput, setTextInput] = useState('');

  const [wordList, setWordList] = useState([]);

  const [numWords, setNumWords] = useState(25);

  const [wpm, setWPM] = useState(0);

  const [accuracy, setAccuracy] = useState(0)

  const [index, setIndex] = useState(0);

  const [typingStatus, setTypingStatus] = useState("start");
  const [seconds, setSeconds] = useState(0);

  const initWordList = useCallback(() => {
    const words = wordsData["english"] || [];
    const set = new Set();
    while (set.size < numWords) {
      const word = words[Math.floor(Math.random() * words.length)];
      set.add(word);
    }
    const goodList = Array.from(set).map(elem => ({ word: elem, typed: "", correct: -1 })); // record of word, type, and whether typed is correct or not
    setWordList(goodList);
  }, [numWords]);

  // run once on init
  useEffect(() => {
    initWordList();
  }, [initWordList]);

  function countCorrectness(s1, s2) {
    const chars1 = s1.split('');
    const chars2 = s2.padEnd(s1.length).split('');
    return chars1.reduce((acc, cv, i) => acc + (cv === chars2[i] ? 1 : 0), 0);
  }

  const typingComplete = () => {
    if (typingStatus !== "complete") {
      setTypingStatus("complete"); // typing is over so stop counting time
      const totalChars = wordList
        .reduce(((acc, cv) => { return acc + cv.word.length }), 0.0); // computes total number of characters in the prompt
      const correctChars = wordList
        .reduce(((acc, cv) => {
          return acc + (cv.word.length * cv.correct) / (Math.max(cv.typed.length, cv.word.length))
        }), 0.0); // computes ratio of characters correct of the longer (of typed OR of prompt)
      setAccuracy(Math.round(100 * correctChars / totalChars));
      setWPM(((correctChars / totalChars) * numWords / (seconds / 60)).toFixed(1))
    }
  }

  const handleTextChange = (event) => {
    index === 0 && setTypingStatus("typing"); // if first character, start timer    
    const typed = event.target.value; // typed holds string in text input (including space)
    const correctWord = wordList[index].word;

    // if input is space
    if (typed[typed.length - 1] === " ") {
      setTextInput(""); // reset typed word to nothing
      const typedWord = typed.substring(0, typed.length - 1); // removes space at the end of typed
      const numCorrect = typedWord === correctWord ? correctWord.length : countCorrectness(correctWord, typedWord);
      wordList.splice(index, 1, { word: correctWord, typed: typedWord, correct: numCorrect });

      if (index === numWords - 1) {
        typingComplete();
      }
      else {
        setIndex(index + 1); // increment index as we are iterating through wordList unless it is the last word
      }
    } else {
      if (index === numWords - 1 && typed === correctWord) { // if last word and correctly typed
        wordList.splice(index, 1, { word: correctWord, typed: typed, correct: correctWord.length });
        typingComplete();
      }
      setTextInput(event.target.value);
    }
  }

  const handleRedoClick = useCallback(() => {
    initWordList();
    setIndex(0);
    setTextInput("");
    setTypingStatus("start");
    setSeconds(0);
  }, [initWordList]);

  const handleNumButtonClick = (num) => {
    setTextInput("");
    if (num !== numWords) {
      setNumWords(num);
      setTypingStatus("start");
      setSeconds(0);
      setIndex(0);
    }
  };

  const handleEsc = useCallback((event) => {
    if (event.key === 'Escape') {
      handleRedoClick();
    }
  }, [handleRedoClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [handleEsc]);

  function colorText(i) {
    let wordColor;

    if (i.word === wordList[index].word && typingStatus !== "complete") {
      if (!i.word.startsWith(textInput)) {
        wordColor = "#D92673";
      } else {
        wordColor = "orchid";
      }
    }
    else if (i.correct === i.typed.length) {
      wordColor = "green";
    }
    else {
      if (i.correct === -1 && typingStatus !== "complete") {
        wordColor = "black"
      }
      else {
        wordColor = "red";
      }
    }
    return <span key={i.word} style={{ color: wordColor, wordSpacing: 2 }}>{i.word} </span>;
  }

  useEffect(() => {
    let intervalId;
    if (typingStatus === "typing") {
      // incrementing by 0.01 every 10 miliseconds
      intervalId = setInterval(() => setSeconds(seconds + 0.01), 10);
    }
    return () => clearInterval(intervalId);
  }, [typingStatus, seconds]);

  return (
    <div className='app-screen'>
      <span
        className='title'
        onMouseEnter={() => setTitle('type!')}
        onMouseLeave={() => setTitle('tupe!')}
      >
        {title}
      </span>
      <div className="container-box">
        <div className="content-box">
          {/* first row */}
          <div className="word-list-box">
            {
              wordList.map(i => colorText(i))
            }
          </div>
          <div className="wpm-acc-box wpm-box">
            <span className='wpm-acc-label'>WPM</span>
            <span className='wpm-acc-value'>{wpm}</span>
          </div>
          <div className="wpm-acc-box acc-box">
            <span className='wpm-acc-label'>ACC</span>
            <span className='wpm-acc-value'>{accuracy}</span>
          </div>
          {/* second row */}
          <input
            autoFocus
            type="text"
            value={textInput}
            onInput={handleTextChange}
            placeholder=""
          />
          <button className="redo-button" onClick={() => handleRedoClick()}>redo</button>
          <div className="num-button-container">
            <button className={`num-button ${numWords === 10 ? 'selected-num' : ''}`} onClick={() => handleNumButtonClick(10)}> {10}</button >
            <button className={`num-button ${numWords === 25 ? 'selected-num' : ''}`} onClick={() => handleNumButtonClick(25)}> {25}</button >
            <button className={`num-button ${numWords === 50 ? 'selected-num' : ''}`} onClick={() => handleNumButtonClick(50)}> {50}</button >
          </div>
        </div>
        <div className='below-box'>
          <div className='esc-guide '>
            <span className='grey-rounded-box-text'>esc</span>
            <span style={{ color: '#A6A6A6' }}> to redo</span>
          </div>
          <div className='themes-button' onClick={() => console.log('themes not implemented yet')}>
            <span className='grey-rounded-box-text'>themes</span>
          </div>
        </div>


      </div>
      <div className='footer'>
        <span>Inspired by </span>
        <a href="https://typings.gg" target="_blank" rel="noopener noreferrer">typings.gg</a>
      </div>
    </div>
  )
}

export default WebMain