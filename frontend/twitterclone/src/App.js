import './App.css';
import Body from './components/Body';
import {Toaster} from "react-hot-toast"
import React from 'react';

function App() {
  return (
    <div className="App">
      <Body/>
      <Toaster/>
    </div>
  );
}

export default App;
