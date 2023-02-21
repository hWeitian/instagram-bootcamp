import React from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  update,
  onValue,
  get,
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
import { generateImageName, getCurrentDate, findPost, findUser } from "./utils";
import { Container, Grid } from "@mui/material";

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
      displayModal: false,
      currentPage: "home",
      userUid: "",
      displayName: "",
      userKey: "",
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

      // Get details of user who made the post
      // const userUid = newData[property].userUid;
      const userRef = ref(database, DB_USERS_KEY);

      get(userRef).then((snapshot) => {
        for (const property in newData) {
          const uid = newData[property].userUid;
          const user = findUser(snapshot.val(), uid);
          newPosts.push({
            key: newData[property].postKey,
            caption: newData[property].caption,
            imageLink: newData[property].imageLink,
            date: newData[property].date,
            likes: newData[property].likes,
            userUid: newData[property].userUid,
            userName: user.userName,
          });
        }
        this.setState((state) => ({
          // Store message key so we can use it as a key in our list items when rendering messages
          posts: newPosts,
        }));
      });
    });

    //Track user's login status
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        console.log(`${user.email} - ${user.displayName}`);

        this.setState({
          userUid: user.uid,
          displayName: user.displayName,
        });
      } else {
        console.log("User signed out");
        this.setState({
          userUid: "",
          displayName: "",
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
        };

        set(newPostRef, post);

        // this.setState({
        //   imageUrl: "",
        //   fileInput: "",
        // });
      });
  };

  addUserToDb = (userCredential, userName) => {
    const usersListRef = ref(database, DB_USERS_KEY);
    const newUserRef = push(usersListRef);

    const user = {
      userUid: userCredential.user.uid,
      userName: userName,
      postId: "",
      userKey: newUserRef.key,
    };
    set(newUserRef, user);

    return newUserRef.key;
  };

  handleLikes = (postKey, type) => {
    // Get the database reference
    const postListRef = ref(database, DB_POSTS_KEY);

    // Get the selected post from the post array state
    const requiredPost = findPost(this.state.posts, postKey);

    // Update the number likes for the selected post
    if (type === "increase") {
      requiredPost.likes += 1;
    } else {
      requiredPost.likes -= 1;
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

  handleModalClose = () => {
    this.setState({
      displayModal: false,
    });
  };

  handleModalOpen = () => {
    this.setState({
      displayModal: true,
    });
  };

  updateDisplayName = (name, key) => {
    this.setState({
      displayName: name,
      userKey: key,
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
      <Grid item sx={{ marginBottom: "20px", width: "100%" }} key={post.key}>
        <Post
          imgSrc={`${post.imageLink}`}
          caption={post.caption}
          postDate={post.date}
          likes={post.likes}
          postKey={post.key}
          author={post.userName}
          handleLikes={this.handleLikes}
        />
      </Grid>
    ));
    return (
      <>
        <div className="App">
          <Header
            changePage={this.changePage}
            displayModal={this.handleModalOpen}
            isLoggedIn={this.state.userUid}
            handleSignOut={this.handleSignOut}
            displayName={this.state.displayName}
          />
          {this.state.currentPage === "chat" && (
            <MessageBox
              messageList={messageListItems}
              writeData={this.writeData}
            />
          )}
          {this.state.currentPage === "home" && (
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
          )}
        </div>
        <Login
          open={this.state.displayModal}
          handleClose={this.handleModalClose}
          updateDisplayName={this.updateDisplayName}
          addUserToDb={this.addUserToDb}
        />
      </>
    );
  }
}

export default App;
