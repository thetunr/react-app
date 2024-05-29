import { useState, useEffect, useCallback } from 'react';
import './MainPage.css';
// https://github.com/dariusk/corpora/blob/master/data/words/common.json
import wordsData from '../assets/words.json';


const MainPage = () => {

  const [textInput, setTextInput] = useState('')

  const [isAttempting, setIsAttempting] = useState(false)

  const [wordList, setWordList] = useState([])

  const [numWords, setNumWords] = useState(25)

  const [wpm, setWPM] = useState(0)

  const [accuracy, setAccuracy] = useState(0)

  const [index, setIndex] = useState(0)

  const [seconds, setSeconds] = useState(0);

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
    if (index === 0) {
      setIsAttempting(true); // if first word, start timer
    }
    if (event.target.value.includes(" ")) {
      setTextInput(""); // reset typed word to nothing
      if (index < numWords) { // when completed word is not last word
        const typed = event.target.value; // typed holds typed word
        const typedWord = typed.substring(0, typed.length - 1); // removes space at the end of typed word
        const currWord = wordList[index].word; // gets corresponding word
        if (typedWord === currWord) { // if equal
          wordList.splice(index, 1, { word: currWord, typed: typedWord, correct: currWord.length }); // correct set to word length
        }
        else { // if not equal
          const numCorrect = countCorrectness(currWord, typedWord);
          wordList.splice(index, 1, { word: currWord, typed: typedWord, correct: numCorrect }); // correct set to correct number of characters
        }
        setIndex(index + 1); // iterate through wordList
      }
      if (index === numWords - 1) { // determines if the typing is over
        setIsAttempting(false); // typing is over so we stop the time
        // TODO: might be good right now, using ratio
        const totalChars = wordList
          .reduce(((acc, cv) => { return acc + cv.word.length }), 0.0); // computes total number of characters in the prompt
        const correctChars = wordList
          .reduce(((acc, cv) => {
            return acc + (cv.word.length * cv.correct) / (Math.max(cv.typed.length, cv.word.length))
          }), 0.0); // computes ratio of characters correct of typed or of prompt
        setAccuracy(Math.round(100 * correctChars / totalChars));
        // TODO: add code to update wpm
        // https://medium.com/how-to-react/simple-way-to-create-a-stopwatch-in-react-js-bcc0e08e041e
        console.log(correctChars);
        console.log(Math.round(100 * correctChars / totalChars));
        console.log(numWords);
        console.log(seconds);
        setWPM(((correctChars / totalChars) * numWords / (seconds / 60)).toFixed(1))
      }
    } else {
      setTextInput(event.target.value)
    }
  }

  const handleRedoClick = () => {
    initWordList();
    setIndex(0);
    setTextInput("");
    setIsAttempting(false);
    setSeconds(0);
  }

  function RedoButton() {
    return (<button className="Redo-button" onClick={() => handleRedoClick()}>redo</button>);
  }

  const handleClick = (num) => {
    setTextInput("");
    if (num !== numWords) {
      setNumWords(num);
      setIsAttempting(false);
      setSeconds(0);
      setIndex(0);
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

  useEffect(() => {
    let intervalId;
    if (isAttempting) {
      // incrementing by 0.3 every 300 miliseconds
      intervalId = setInterval(() => setSeconds(seconds + 0.25), 250);
    }
    return () => clearInterval(intervalId);
  }, [isAttempting, seconds]);

  return (
    <>
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
        <div className="Results-content">wpm: {wpm} / acc: {accuracy}</div>
        <span>{seconds}</span>
      </div>
    </>
  )
}

export default MainPage