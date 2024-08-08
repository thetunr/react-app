import './App.css';
import { useState } from 'react';
import MainPage from './pages/MainPage';

function App() {

  const [title, setTitle] = useState('tupe!');

  return (
    <div className="App">
      <span
        className='title'
        onMouseEnter={() => setTitle('type!')}
        onMouseLeave={() => setTitle('tupe!')}
      >
        {title}
      </span>
      <MainPage />
    </div>
  );
}

export default App;
