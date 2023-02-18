import React from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  update,
  onValue,
} from "firebase/database";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import Input from "./Component/Input";
import ChatMessage from "./Component/ChatMessage";
import SubmitPost from "./Component/SubmitPost";
import Post from "./Component/Post";
import Header from "./Component/Header";
import MessageBox from "./Component/MessageBox";
import { generateImageName, getCurrentDate, findPost } from "./utils";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Paper, Container, Grid } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_POSTS_KEY = "posts";

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
      currentPage: "home",
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    const postsRef = ref(database, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });

    onValue(postsRef, (data) => {
      const newData = data.val();

      const newPosts = [];
      for (const property in newData) {
        newPosts.push({
          key: newData[property].key,
          caption: newData[property].caption,
          imageLink: newData[property].imageLink,
          date: newData[property].date,
          likes: newData[property].likes,
        });
      }
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: newPosts,
      }));
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
    // if (this.state.fileInput) {
    //   localStorage.clear();
    //   console.log("removed");
    //   // URL.revokeObjectURL(this.state.fileInput);
    // }

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
          key: newPostKey,
        };

        set(newPostRef, post);

        // this.setState({
        //   imageUrl: "",
        //   fileInput: "",
        // });
      });
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
          handleLikes={this.handleLikes}
        />
      </Grid>
    ));
    return (
      // <ThemeProvider theme={darkTheme}>
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <Header changePage={this.changePage} />
          {this.state.currentPage === "chat" && (
            <MessageBox
              messageList={messageListItems}
              writeData={this.writeData}
            />
          )}

          {this.state.currentPage === "home" && (
            <>
              <Container sx={{ marginTop: "100px" }} maxWidth="sm">
                <SubmitPost
                  handleFileInput={this.handleFileInput}
                  handleUpload={this.handleUpload}
                  uploadedFile={this.state.fileInput}
                  previewLink={this.state.previewLink}
                />
              </Container>
              <Container>
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
        </header>
      </div>
      // </ThemeProvider>
    );
  }
}

export default App;
