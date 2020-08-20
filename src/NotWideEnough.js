import React from "react"

export default function NotWideEnough(props) {
  return (
    <div
      id="GetWiderWindow"
      className="d-flex flex-column text-white lead justify-content-center align-items-center"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        background: "#222",
        zIndex: 999,
      }}
    >
      <p>Your Browser Window Is Not Wide Enough To Run This Simulation</p>
      <p>Required: <span className="font-weight-bold">{window.innerWidth}</span>px<span className="font-weight-bold"> / </span><span className="font-weight-bold">1000</span>px</p>

    </div>
  )
}
