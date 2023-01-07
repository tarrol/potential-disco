const avatarUrl = "https://avatars.dicebear.com/api/bottts/";

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

module.exports = getRandomAvatar;