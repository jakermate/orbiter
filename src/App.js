import React from 'react';
import logo from './logo.svg';
import './App.css';
import Simulator from './components/Simulator'
import styled from 'styled-components'
import {useEffect} from 'react'

function App() {

  // fetch github
  useEffect(()=>{

  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <Title>ORBITER</Title>
        <p><strong>Acheive a stable orbit.</strong> </p>
      </header>
      <Simulator></Simulator>
    </div>
  );
}

const Title = styled.h2`
  letter-spacing: 4px;
  margin: 10px auto;
`
export default App;
