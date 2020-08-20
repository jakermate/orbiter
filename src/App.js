import React, { useState, useEffect, useCallback } from 'react'
import logo from './logo.svg'
import './App.css'
import Simulator from './components/Simulator'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import NotWideEnough from './NotWideEnough'
import About from './components/About'
function App() {
  const titleSpring = useSpring({ from: { opacity: 0, transform: 'translateX(2000px)' }, to: { opacity: 1, transform: 'translateX(0px)' } })
  const [width, setWidth] = useState(999)

  const onResize = useCallback(event => {
    setWidth(window.innerWidth)
  },[])
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  },[onResize])
  useEffect(()=>{
    console.log('width changed')
  },[width])
  
  const [about, toggleAbout] = useState(false)
  function handleToggleAbout(e) {
    console.log('toggling about')
    toggleAbout(!about)
    return false
  }
  return (
    <div className="App">
      {
          window.innerWidth < 1000 &&
          <NotWideEnough width={width}></NotWideEnough>

        }
      <nav className="navbar navbar-dark text-light" style={{background:'#222'}}>
        <a href="/" className="navbar-brand"><i className="fas fa-globe-americas mr-3"></i>ORBITER</a>
        <ul class="navbar-nav flex-row ">
          <li class="nav-item">
            <a class="nav-link px-2" href="#" onClick={e => handleToggleAbout(e)}>About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link px-2" href="https://www.github.com/jakermate/orbiter">Github</a>
          </li>
          <li class="nav-item">
            <a class="nav-link px-2" href="https://www.jakemiller.io">Jakernet</a>
          </li>

        </ul>
        <animated.div class="container" style={titleSpring}>
          {/* <Title className="">ORBITER</Title> */}

        </animated.div>
      </nav>
      <div className="container-fluid position-relative">
        {
          about &&
          <About></About>
        }
        
        <Simulator></Simulator>
      </div>

    </div>
  );
}

const Title = styled.h1`
  letter-spacing:50px;
  margin: 10px auto;
  color: white;
  font-weight: 400;
`
export default App;
