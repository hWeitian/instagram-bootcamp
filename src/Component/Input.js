import React from "react";
import { TextField, Button } from "@mui/material";

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
        <form onSubmit={this.handleSubmit}>
          <TextField
            id="outlined-basic"
            label="Enter Message"
            variant="outlined"
            required
            size="small"
            onChange={this.handleChange}
            value={this.state.input}
          />
          <Button variant="contained" type="submit">
            Send
          </Button>
        </form>
      </>
    );
  }
}

export default Input;
