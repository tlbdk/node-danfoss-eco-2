let noble = require('noble')

// https://github.com/ojousima/node-red/blob/master/ruuvi-node/ruuvitag.js
// https://github.com/ruuvi/com.ruuvi.station/blob/fbb4fa4858e29d46d1ee3230a9299c80783faeee/app/src/main/java/com/ruuvi/station/model/RuuviTag.java

console.log(noble.state)

noble.on('stateChange', state => {
  console.log(`new state: ${state}`)
  noble.startScanning([], true, error => {
    if (error) {
      console.error(error)
    }
  })
})

noble.on('scanStart', function() {
  console.log('Scan started.')
})

noble.on('scanStop', function() {
  console.log('Scan stopped.')
})

noble.on('discover', function(peripheral) {
  let localName = peripheral.advertisement.localName
  let manufacturerData = peripheral.advertisement.manufacturerData

  if (localName === undefined && manufacturerData !== undefined) {
    let payload = Buffer.from(manufacturerData)
    //console.log(hex)
    let companyId = payload.readUInt16LE(0)
    switch (companyId) {
      case 0x0006: {
        // Microsoft
        break
      }
      case 0x00e0: {
        // Google
        break
      }
      case 0x0499: {
        // Ruuvi Innovations Ltd.
        console.log(JSON.stringify(parseRuuviTag(payload), null, 2))
        break
      }
      default: {
        let hex = payload.toString('hex')
        console.log(`Unknown companyId: ${companyId}`)
      }
    }
  }
  //console.log(`Device found: ${localName}`)
})

noble.on('servicesDiscovered', function(services) {
  //console.log('Services discovered: ' + JSON.stringify(services, null, 2))
})

function parseRuuviTag(payload) {
  let format = payload.readUInt8(2)
  switch (format) {
    case 3: {
      // Ruuvitag RAW format
      let humidity = payload.readUInt8(3) / 2

      let temperature = payload.readUInt8(4)
      temperature += payload.readUInt8(5) / 100
      if (temperature > 128) {
        // Ruuvi format, sign bit + value
        temperature = temperature - 128
        temperature = 0 - temperature
      }
      temperature = +temperature.toFixed(2)

      let pressureHi = payload.readUInt8(6)
      let pressureLo = payload.readUInt8(7)
      let pressure = pressureHi * 256 + 50000 + pressureLo;
      pressure /= 100.0;
      
      let accelerationX = payload.readUInt16LE(8) // milli-g
      if (accelerationX > 32767) {
        accelerationX -= 65536
      }

      let accelerationY = payload.readUInt16LE(10) // milli-g
      if (accelerationY > 32767) {
        accelerationY -= 65536
      }

      let accelerationZ = payload.readUInt16LE(12) // milli-g
      if (accelerationZ > 32767) {
        accelerationZ -= 65536
      }

      let batteryHi = payload.readUInt8(14);
      let batteryLo = payload.readUInt8(14);
      let batteryVoltage = (batteryHi * 256 + batteryLo) / 1000.0;
      
      return {
        humidity,
        temperature,
        accelerationX,
        accelerationY,
        accelerationZ,
        batteryVoltage,
        pressure
      }
    }
    default: {
      console.log(`Unknown format`)
    }
  }
}
