import React from "react";
import { TextField, Button, IconButton, Grid, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { grey } from "@mui/material/colors";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
    };
  }

  handleChange = (event) => {
    const data = event.target.value;
    this.setState({
      input: data,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.handleSubmit(event.target[0].value);
    this.setState({
      input: "",
    });
  };

  render() {
    return (
      <>
        <Paper
          sx={{
            padding: "15px",
            // backgroundColor: "#F1F1F1",
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
                  value={this.state.input}
                  sx={{ width: "100%" }}
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
