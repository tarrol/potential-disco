function generateHash(length) {
  var haystack =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    output = "";
  for (var i = 0; i < length; i++) {
    output += haystack.charAt(Math.floor(Math.random() * haystack.length));
  }
  return output;
}

module.exports = generateHash;
