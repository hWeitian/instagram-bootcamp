import React from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  update,
  onValue,
  get,
  remove,
} from "firebase/database";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import { database, storage } from "./firebase";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./App.css";
import ChatMessage from "./Component/ChatMessage";
import SubmitPost from "./Component/SubmitPost";
import Post from "./Component/Post";
import Header from "./Component/Header";
import MessageBox from "./Component/MessageBox";
import Login from "./Component/Login";
import PostList from "./Component/PostList";
import Home from "./Home";
import AuthForm from "./Component/AuthForm";
import { generateImageName, getCurrentDate, findPost, findUser } from "./utils";
import { Container, Grid } from "@mui/material";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_POSTS_KEY = "posts";
const DB_USERS_KEY = "users";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      input: "",
      fileInput: "",
      imageUrl: "",
      posts: [],
      previewLink: "",
      // displayModal: false,
      currentPage: "Home",
      userUid: "",
      displayName: "",
      profilePic: "",
    };
  }

  componentDidMount() {
    // Create reference to messages database
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });

    // Create reference to posts database
    const postsRef = ref(database, DB_POSTS_KEY);
    // Track changes to post database and update state
    onValue(postsRef, (data) => {
      const newData = data.val();
      const newPosts = [];
      for (const property in newData) {
        newPosts.push({
          postKey: newData[property].postKey,
          caption: newData[property].caption,
          imageLink: newData[property].imageLink,
          date: newData[property].date,
          likes: newData[property].likes,
          userUid: newData[property].userUid,
          userName: newData[property].userName,
          usersLiked: newData[property].usersLiked,
          profilePic: newData[property].profilePic,
        });
      }
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: newPosts,
      }));
    });

    //Track user's login status
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        console.log(`${user.email} - ${user.displayName}`);

        this.setState({
          userUid: user.uid,
          displayName: user.displayName,
          profilePic: user.photoURL,
        });
      } else {
        console.log("User signed out");
        this.setState({
          userUid: "",
          displayName: "",
          profilePic: "",
        });
      }
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (data) => {
    const currentTime = getCurrentDate();

    const chat = {
      text: data,
      timestamp: currentTime,
    };

    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, chat);
  };

  handleFileInput = (event) => {
    this.setState(
      {
        fileInput: event.target.files[0],
        // Create a preview of the file before uploading it onto database
        previewLink: URL.createObjectURL(event.target.files[0]),
      },
      () => {
        // Reset the event target so that user can upload the same image twice
        // This callback function will run after setSate is completed
        event.target.value = null;
      }
    );
  };

  handleUpload = (captionText) => {
    const fileName = generateImageName(this.state.fileInput.name);

    const storageRef = sRef(storage, `images/${fileName}`);

    //Reset the preview link
    this.setState((prevState) => ({
      previewLink: "",
      imageUrl: "",
      fileInput: "",
    }));

    const currentDate = getCurrentDate();

    uploadBytes(storageRef, this.state.fileInput)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((url) => {
        const postListRef = ref(database, DB_POSTS_KEY);
        const newPostRef = push(postListRef);
        const newPostKey = newPostRef.key;

        const post = {
          imageLink: url,
          caption: captionText,
          date: currentDate,
          likes: 0,
          postKey: newPostKey,
          userUid: this.state.userUid,
          userName: this.state.displayName,
          profilePic: this.state.profilePic,
        };

        set(newPostRef, post);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addUserToDb = (userCredential, userName, profilePic) => {
    const usersListRef = ref(
      database,
      DB_USERS_KEY + "/" + userCredential.user.uid
    );
    //const newUserRef = push(usersListRef);

    const user = {
      userUid: userCredential.user.uid,
      userName: userName,
      postId: "",
      profilePicUrl: profilePic,
    };
    set(usersListRef, user);
  };

  handleLikes = (postKey, type) => {
    const userUid = this.state.userUid;

    // Get the selected post from the post array state
    const requiredPost = findPost(this.state.posts, postKey);

    // Get the database reference
    const postListRef = ref(database, DB_POSTS_KEY);

    // Update the number likes for the selected post
    // If usersLiked object exist in post
    if (requiredPost.usersLiked) {
      // If user already liked the post,
      // remove user Uid from usersLike and decrease likes count
      if (requiredPost.usersLiked[userUid]) {
        delete requiredPost.usersLiked[userUid];
        requiredPost.likes -= 1;
      } else {
        // If user has not liked the post,
        // add user Uid and increase likes count
        requiredPost.usersLiked[userUid] = true;
        requiredPost.likes += 1;
      }
    } else {
      // If usersLiked did not exist in requiredPost,
      // add the object into requiredPost and increase likes count
      requiredPost.usersLiked = { [userUid]: true };
      requiredPost.likes += 1;
    }

    // Initiate an update object with postKey as the key and the updated post as value
    const updates = {};
    updates[postKey] = requiredPost;

    update(postListRef, updates);
  };

  changePage = (page) => {
    this.setState({
      currentPage: page,
    });
  };

  // handleModalClose = () => {
  //   this.setState({
  //     displayModal: false,
  //   });
  // };

  // handleModalOpen = () => {
  //   this.setState({
  //     displayModal: true,
  //   });
  // };

  updateUserInfo = (name, url) => {
    this.setState({
      displayName: name,
      profilePic: url,
    });
  };

  handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out successful");
      })
      .catch((error) => {
        console.log(`${error.code} - ${error.message}`);
      });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <ChatMessage
        key={message.key}
        text={message.val.text}
        dateTimeStamp={message.val.timestamp}
      />
    ));
    let postItems = this.state.posts.map((post) => (
      <Grid
        item
        sx={{ marginBottom: "20px", width: "100%" }}
        key={post.postKey}
      >
        <Post
          imgSrc={`${post.imageLink}`}
          caption={post.caption}
          postDate={post.date}
          likes={post.likes}
          postKey={post.postKey}
          author={post.userName}
          handleLikes={this.handleLikes}
          hasLiked={post.usersLiked && post.usersLiked[this.state.userUid]}
          userUid={this.state.userUid}
          profilePic={post.profilePic}
        />
      </Grid>
    ));

    return (
      <>
        <div className="App">
          <BrowserRouter>
            <Home
              changePage={this.changePage}
              displayModal={this.handleModalOpen}
              isLoggedIn={this.state.userUid}
              handleSignOut={this.handleSignOut}
              displayName={this.state.displayName}
              profilePic={this.state.profilePic}
              currentPage={this.state.currentPage}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <PostList
                    postItems={postItems}
                    userUid={this.state.userUid}
                    fileInput={this.state.fileInput}
                    previewLink={this.state.previewLink}
                    handleFileInput={this.handleFileInput}
                    handleUpload={this.handleUpload}
                  />
                }
              />
              <Route
                path="/chat"
                element={
                  <MessageBox
                    messageList={messageListItems}
                    writeData={this.writeData}
                  />
                }
              />
              <Route
                path="/authform"
                element={<AuthForm updateUserInfo={this.updateUserInfo} />}
              />
            </Routes>
          </BrowserRouter>

          {/* {this.state.currentPage === "Chat" && (
            <Container maxWidth="sm" sx={{ marginTop: "100px" }}>
              <MessageBox
                messageList={messageListItems}
                writeData={this.writeData}
              />
            </Container>
          )}
          {this.state.currentPage === "Home" && (
            <>
              {this.state.userUid.length > 0 && (
                <Container maxWidth="sm" sx={{ marginTop: "100px" }}>
                  <SubmitPost
                    handleFileInput={this.handleFileInput}
                    handleUpload={this.handleUpload}
                    uploadedFile={this.state.fileInput}
                    previewLink={this.state.previewLink}
                  />
                </Container>
              )}
              <Container
                sx={{ marginTop: this.state.userUid ? "20px" : "80px" }}
              >
                <Grid
                  container
                  alignContent="center"
                  direction="column-reverse"
                  sx={{ marginTop: "20px" }}
                >
                  {postItems}
                </Grid>
              </Container>
            </>
          )} */}
        </div>
        {/* <Login
          open={this.state.displayModal}
          handleClose={this.handleModalClose}
          updateUserInfo={this.updateUserInfo}
          addUserToDb={this.addUserToDb}
        /> */}
      </>
    );
  }
}

export default App;
