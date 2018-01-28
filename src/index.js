import React from 'react'
import ReactDOM from 'react-dom'
import RequestDevices from './requestDevices'

const Index = () => (
  <div>
    <RequestDevices />
  </div>
)

ReactDOM.render(<Index />, document.getElementById('container'))
