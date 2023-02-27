import React from "react";
import ChatMessage from "./ChatMessage";
import SubmitPost from "./SubmitPost";
import Post from "./Post";
import Header from "./Header";
import MessageBox from "./MessageBox";
import Login from "./Login";
import { Container, Grid } from "@mui/material";

class PostList extends React.Component {
  render() {
    return (
      <>
        {this.props.userUid.length > 0 && (
          <Container maxWidth="sm" sx={{ marginTop: "0px" }}>
            <SubmitPost
              handleFileInput={this.props.handleFileInput}
              handleUpload={this.props.handleUpload}
              uploadedFile={this.props.fileInput}
              previewLink={this.props.previewLink}
            />
          </Container>
        )}
        <Container sx={{ marginTop: this.props.userUid ? "20px" : "80px" }}>
          <Grid
            container
            alignContent="center"
            direction="column-reverse"
            sx={{ marginTop: "20px" }}
          >
            {this.props.postItems}
          </Grid>
        </Container>
      </>
    );
  }
}

export default PostList;
