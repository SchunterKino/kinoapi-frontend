import apiConnection from './apiconnection'

var openedCallback;
var closedCallback;
module.exports = {
  open: () => {

  },
  close : () => {

  },
  onOpened: (callback) => {
    openedCallback = callback
  },
  onClosed: (callback) => {
    closedCallback = callback
  }
}
