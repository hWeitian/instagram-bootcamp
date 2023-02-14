import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
// import { ref as sRef } from "firebase/storage";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import Input from "./Component/Input";
import ChatMessage from "./Component/ChatMessage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Paper, Container } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_IMAGES_KEY = "images";

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
    };
    // Create a reference to the end of messages
    this.endMessageRef = React.createRef();
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
    this.scorllToTheEnd();
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (data) => {
    const currentTime = new Date().toLocaleDateString([], {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const chat = {
      text: data,
      timestamp: currentTime,
    };

    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, chat);
  };

  componentDidUpdate() {
    this.scorllToTheEnd();
  }

  // When user adds a message, the system will automatically scroll to the bottom(latest) message
  scorllToTheEnd = () => {
    this.endMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  handleFileInput = (event) => {
    console.log(event.target.files[0]);
    this.setState({
      fileInput: event.target.files[0],
    });
  };

  handleUpload = () => {
    const storageRef = sRef(
      storage,
      "images/dave-hoefler-lsoogGC_5dg-unsplash.jpg"
    );

    console.log(storageRef);

    uploadBytes(storageRef, this.state.fileInput).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);

        const imageListRef = ref(database, DB_IMAGES_KEY);
        const newImageRef = push(imageListRef);
        set(newImageRef, url);

        this.setState({
          imageUrl: url,
        });
      });
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
    return (
      // <ThemeProvider theme={darkTheme}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Container maxWidth="sm" sx={{ marginTop: "20px" }}>
            <Paper sx={{ borderRadius: "10px" }}>
              <Container
                sx={{ maxHeight: "400px", overflowY: "scroll" }}
                style={{ padding: "10px 0 10px 10px" }}
                className="scroll"
              >
                {messageListItems}
                {/* Empty div to store the reference point of end of messages */}
                <div ref={this.endMessageRef}></div>
              </Container>
              <Input handleSubmit={this.writeData} />
            </Paper>
          </Container>
          <input
            type="file"
            style={{ marginTop: "20px" }}
            onChange={this.handleFileInput}
          />
          <button onClick={this.handleUpload}>Upload</button>
          <img src={this.state.imageUrl} alt="test image" />
        </header>
      </div>
      // </ThemeProvider>
    );
  }
}

export default App;
