/**
 * Function to remove file extension from image file name using split method
 * @param {string} str Full image file name with file type extension
 * @returns {string} Image file name without extension
 */
export const generateImageName = (str) => {
  const strSplit = str.split(".");
  return strSplit[0];
};

export const getCurrentDate = () => {
  return new Date().toLocaleDateString([], {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const findPost = (postArr, postKey) => {
  let requiredPost = {};

  postArr.forEach((post) => {
    if (post.key === postKey) {
      requiredPost = post;
    }
  });

  return requiredPost;
};

export const findUser = (userObj, uid) => {
  for (const property in userObj) {
    if (userObj[property].userUid === uid) {
      return userObj[property];
    }
  }
};

export const setErrorMessage = (errorCode) => {
  let errorMsg = "Sorry, ";
  switch (errorCode) {
    case "auth/wrong-password":
      errorMsg += "wrong Password, please try again";
      break;
    case "auth/user-not-found":
      errorMsg = "unable to find user, please sign up a new account";
      break;
    default:
      errorMsg = "";
  }
  return errorMsg;
};
