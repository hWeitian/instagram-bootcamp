import React from "react";
import { Container, Paper } from "@mui/material";
import Input from "./Input";

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    // Create a reference to the end of messages
    this.endMessageRef = React.createRef();
  }

  // When user adds a message, the system will automatically scroll to the bottom(latest) message
  scorllToTheEnd = () => {
    this.endMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  handleClick = () => {
    this.props.changePage("chat");
  };

  componentDidMount() {
    this.scorllToTheEnd();
  }

  componentDidUpdate() {
    this.scorllToTheEnd();
  }

  render() {
    return (
      <>
        <Container maxWidth="sm" sx={{ marginTop: "20px" }}>
          <Paper sx={{ borderRadius: "10px" }}>
            <Container
              sx={{ maxHeight: "400px", overflowY: "scroll" }}
              style={{ padding: "10px 0 10px 10px" }}
              className="scroll"
            >
              {this.props.messageList}
              <div ref={this.endMessageRef}></div>
            </Container>
            <Input handleSubmit={this.props.writeData} />
          </Paper>
        </Container>
      </>
    );
  }
}

export default MessageBox;
