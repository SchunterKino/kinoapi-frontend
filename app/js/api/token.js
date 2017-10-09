module.exports = {
  save: (token) => document.cookie = 'token=' + msg.token + ';secure',
  delete: () => document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
