import React, { Component } from 'react'

class Devices extends Component {
  onClickRequestDevices() {
    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true
      })
      .then(device => {
        console.log(device)
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    return (
      <div>
        <button onClick={this.onClickRequestDevices}>Request devices</button>
      </div>
    )
  }
}

export default Devices
