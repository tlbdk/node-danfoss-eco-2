import React, { Component } from 'react'

const danfossService = '10020000-2749-0001-0000-00805f9b042f'
const characteristic = '1002000f-2749-0001-0000-00805f9b042f'

class Devices extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'not connected to any device',
      connectedDevice: null
    }
    this.onClickRequestDevices = this.onClickRequestDevices.bind(this)
  }
  onClickRequestDevices() {
    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true
      })
      .then(device => {
        device.gatt.connect()
        this.setState({ status: `Connecting to ${device.name}` })
      })
      .then(server => {
        if (!server) {
          this.setState({ status: 'unable to connect' })
          throw Error('unable to connect')
        }
        this.setState({ status: `Fetching service ${danfossService}` })
        return server.getPrimaryService(danfossService)
      })
      .then(service => {
        console.log(service)
        this.setState({ status: `Get characteristic ${characteristic}` })
        service.getCharacteristic(characteristic)
      })
      .then(characteristic => {
        // Read value
        return characteristic.readValue()
      })
      .then(value => {
        this.setState({ status: `value is ${value.getUint8(0)}` })
        console.log(`Characteristic value is ${value.getUint8(0)}`)
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    return (
      <div>
        Request devices <br />
        <button onClick={this.onClickRequestDevices}>Request devices</button>
        <br />
        <div>Connection status: {this.state.status}</div>
      </div>
    )
  }
}

export default Devices
