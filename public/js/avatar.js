const avatarUrl = "https://avatars.dicebear.com/api/bottts/";
const avatarUrlEnd = ".svg";
const session = require('express-session')

function getRandomAvatar(length) {
  let haystack =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let avatarCode = "";

  for (let i = 0; i < length; i++) {
    avatarCode += haystack.charAt(Math.floor(Math.random() * 62));
  }
  // return avatarCode;

  let generatedAvatar = avatarUrl + avatarCode + ".svg";

  console.log(generatedAvatar);
  return generatedAvatar;
}

var image = new Image();
image.src = req.session.avatarurl;

document
  .querySelector('#avatar-section')
  .appendChild(image)
  .addEventListener('submit', getRandomAvatar(8));

module.exports = getRandomAvatar;
