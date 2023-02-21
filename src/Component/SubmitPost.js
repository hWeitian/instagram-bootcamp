import React from "react";
import { TextField, Button, IconButton, Grid, Paper, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { grey } from "@mui/material/colors";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

class SubmitPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: "",
      inputValidity: true,
      error: "",
      previewLink: "",
    };
  }

  inputValidation = (input) => {
    if (this.props.uploadedFile === "") {
      this.setState({
        error: "Please upload a photo",
      });
      return false;
    } else if (this.state.caption.length > 280) {
      this.setState({
        error: "You have hit the maximum number of characters",
      });
      return false;
    } else {
      this.setState({
        error: "",
      });
      return true;
    }
  };

  handleChange = (event) => {
    const data = event.target.value;
    this.setState({
      caption: data,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.inputValidation(this.props.uploadedFile)) {
      this.props.handleUpload(this.state.caption);
      this.setState({
        caption: "",
        inputValidity: true,
      });
    } else {
      this.setState({
        inputValidity: false,
      });
      return null;
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      this.handleSubmit(event);
    }
  };

  render() {
    return (
      <>
        <ThemeProvider theme={darkTheme}>
          <form onSubmit={this.handleSubmit}>
            <Grid container justifyContent="space-between">
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: "1px white dotted",
                    minHeight: "100px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <Grid container>
                    {this.props.previewLink && (
                      <Grid item xs={12}>
                        <img
                          src={this.props.previewLink}
                          alt="preview"
                          height="200px"
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" size="small">
                        {this.props.previewLink
                          ? "Click to Reupload Image"
                          : "Click to Upload Image"}
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={this.props.handleFileInput}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-basic"
                  label="Write a caption"
                  variant="standard"
                  required
                  multiline
                  size="small"
                  onChange={this.handleChange}
                  value={this.state.caption}
                  sx={{ width: "100%" }}
                  error={!this.state.inputValidity}
                  helperText={
                    !this.state.inputValidity ? this.state.error : null
                  }
                  onKeyDown={this.handleKeyDown}
                />
              </Grid>
              <Grid item xs={12} sx={{ marginTop: "10px" }}>
                <Button type="submit" variant="contained">
                  Share
                </Button>
              </Grid>
            </Grid>
          </form>
        </ThemeProvider>
      </>
    );
  }
}

export default SubmitPost;
