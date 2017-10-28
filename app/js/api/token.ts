export default {
  save: (token) => document.cookie = "token=" + token + ";secure",
  delete: () => document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
};
