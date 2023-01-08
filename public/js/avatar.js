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

fetch('/api/users/me', {
  method: 'GET',
//  credentials: 'include' // include the cookies in the request
})
  .then(response => {
    // console.log(response);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  })
  .then(userData => {
    console.log(userData);
    // Create an image element using the userData.avatar URL
    const avatarImg = document.createElement('img');
    const win = document.querySelector('#wins');
    avatarImg.src = userData.avatar;
    win.textContent = userData.winCount;

    // Append the image to the body of the document
    document.querySelector('#avatar-section').appendChild(avatarImg);
  })
  .catch(error => {
    console.error(error);
  });

// var image = new Image();
// image.src = ;

// document
//   .querySelector('#avatar-section')
//   .appendChild(image)
//   .addEventListener('submit', getRandomAvatar(8));

module.exports = getRandomAvatar;