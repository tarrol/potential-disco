const avatarUrl = "https://avatars.dicebear.com/api/bottts/";
let generatedAvatar;

function getRandomAvatar(length) {
  let haystack =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let avatarCode = "";

  for (let i = 0; i < length; i++) {
    avatarCode += haystack.charAt(Math.floor(Math.random() * 62));
  }
  // return avatarCode;

  generatedAvatar = avatarUrl + avatarCode + ".svg";

  console.log(generatedAvatar);
  return generatedAvatar;
}

fetch("/api/users/me", {
  method: "GET",
  //  credentials: 'include' // include the cookies in the request
})
  .then((response) => {
    console.log(response);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  })
  .then((userData) => {
    console.log(userData);
    // Create an image element using the userData.avatar URL
    const avatarImg = document.createElement("img");
    const win = document.querySelector("#wins");
    const currentName = document.getElementById("current-username");
    avatarImg.src = userData.avatar;
    avatarImg.classList.add("avatar-icon");
    win.textContent = userData.win_count;
    currentName.textContent = userData.username;

    // Append the image to the body of the document
    document.querySelector("#avatar-section").appendChild(avatarImg);
  })
  .catch((error) => {
    console.error(error);
  });

// const editAvatarHandler = async function (event) {
//   event.preventDefault();

//   getRandomAvatar(8);

//   await fetch("/api/users/me", {
//     method: "PUT",
//     body: JSON.stringify({
//       avatar: generatedAvatar,
//     }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data));

//   document.location.reload();
// };

const editAvatarHandler = async function (event) {
  event.preventDefault();

  let generatedAvatar = getRandomAvatar(8);
  console.log(generatedAvatar, "generated avatar");

  const response = await fetch("/api/users/avatar/:id", {
    method: "PUT",
    body: JSON.stringify({
      avatar: generatedAvatar,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("avatar updated");
    document.location.reload();
  } else {
    console.log("avatar update failed");
  }
};

const button = document.querySelector("div > button");
button.addEventListener("click", editAvatarHandler);

// module.exports = getRandomAvatar;
