import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import Simulator from './components/Simulator'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import About from './components/About'
function App() {
  const titleSpring = useSpring({ from: { opacity: 0, transform: 'translateX(2000px)' }, to: { opacity: 1, transform: 'translateX(0px)' } })
  // fetch github
  useEffect(() => {

  }, [])
  const [about, toggleAbout] = useState(false)
  function handleToggleAbout(e) {
    console.log('toggling about')
    toggleAbout(!about)
    return false
  }
  return (
    <div className="App">
      <nav className="navbar navbar-dark text-light">
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
