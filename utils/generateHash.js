function generateHash(length) {
  let haystack =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    output = "";
  for (let i = 0; i < length; i++) {
    output += haystack.charAt(Math.floor(Math.random() * haystack.length));
  }
  return output;
}

module.exports = generateHash;
