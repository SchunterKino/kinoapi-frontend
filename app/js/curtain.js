import apiConnection from './apiconnection'
apiConnection.onApiMessage((msg) => {
  // TODO call openedCallback/closedCallback if applicable
})

var openedCallback;
var closedCallback;
module.exports = {
  open: () => {
    // TODO apiConnection.send("...")
  },
  close: () => {
    // TODO apiConnection.send("...")
  },
  onOpened: (callback) => {
    openedCallback = callback
  },
  onClosed: (callback) => {
    closedCallback = callback
  }
}
