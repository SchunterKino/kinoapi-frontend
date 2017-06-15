var connectedCallback
var disconnectedCallback
var messageCallbacks = []
module.exports = {
  connect: () => {

  },
  onConnected: (callback) => {
    connectedCallback = callback
  },
  onMessage: (callback) => {
    messageCallbacks.push(callback)
  },
  onDisconnected: (callback) => {
    disconnectedCallback = callback
  },
  sendMessage: (message) => {
    
  }
}
