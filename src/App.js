// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
// import './assets/sass/style.scss'

// npm start

function App() {
  const [textInput, setTextInput] = useState('');

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  return (
    <div className="App">
      <div className="Box-container">
        <div className="Box-content">
          <p>Random Text
          </p>
          <p>Typed: {textInput}</p>
          <input
            type="text"
            value={textInput}
            onChange={handleInputChange}
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
}

export default App;
