import React from "react";
import { TextField, Button, IconButton, Grid, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { grey } from "@mui/material/colors";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      inputValidity: true,
    };
  }

  inputValidation = (input) => {
    if (input.length <= 0 || input === "\n") {
      this.setState({
        inputValidity: false,
      });
      return false;
    } else {
      this.setState({
        inputValidity: true,
      });
      return true;
    }
  };

  handleChange = (event) => {
    this.inputValidation(event.target.value);
    const data = event.target.value;
    this.setState({
      input: data,
    });
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      this.handleSubmit(event);
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.input.length <= 0 || this.state.input === "\n") {
      this.setState({
        inputValidity: false,
      });
      return null;
    } else {
      this.props.handleSubmit(this.state.input);
      this.setState({
        input: "",
        inputValidity: true,
      });
    }
  };

  render() {
    return (
      <>
        <Paper
          sx={{
            padding: "15px",
            borderTop: "solid 1px #CCCCCC",
            borderRadius: "10px",
          }}
        >
          <form onSubmit={this.handleSubmit}>
            <Grid container justifyContent="space-between">
              <Grid item xs={11}>
                <TextField
                  id="outlined-basic"
                  label="Enter Message"
                  variant="standard"
                  required
                  multiline
                  size="small"
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  value={this.state.input}
                  sx={{ width: "100%" }}
                  error={!this.state.inputValidity}
                  helperText={
                    !this.state.inputValidity
                      ? "Please fill in this field"
                      : null
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton type="submit">
                  <SendIcon sx={{ color: grey[900] }} />
                </IconButton>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </>
    );
  }
}

export default Input;
