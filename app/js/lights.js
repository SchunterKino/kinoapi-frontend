import apiConnection from './apiconnection'

module.exports = {
  setLightLevel: (level) => {
    apiConnection.send(JSON.stringify({
      msg_type: 'lights',
      action: 'set_lights',
      level: level
    }))
  }
}
