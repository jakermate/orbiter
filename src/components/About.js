import React from 'react'
import {useSpring, animated} from 'react-spring'
export default function About(props) {
    const aboutPageStyle = {
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        background:'black',
        zIndex:99
    }
    const aboutSpring = useSpring({from:{transform:'translateY(200px)',opacity:0},to:{transform:'translateY(0)',opacity:1}})
    return (
        <animated.div style={{...aboutPageStyle, ...aboutSpring}}>
            <h1 className="display-4">
                About
            </h1>
        </animated.div>
    )
}
