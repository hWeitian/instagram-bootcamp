import React from "react";
import { Modal, Box, Typography, TextField, Button, Grid } from "@mui/material";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setErrorMessage } from "../utils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isloginAuth: true,
      email: "",
      password: "",
      name: "",
      errorMessage: "",
    };
  }

  changeAuthType = () => {
    this.setState((prevState) => ({
      isloginAuth: !prevState.isloginAuth,
    }));
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.isloginAuth) {
      createUserWithEmailAndPassword(
        auth,
        this.state.email,
        this.state.password
      )
        .then((userCredential) => {
          // Account created
          // Add user to Firebase Realtime Database
          const userKeyInDb = this.props.addUserToDb(
            userCredential,
            this.state.name
          );
          // Update display name on Firebase Auth
          updateProfile(auth.currentUser, {
            displayName: this.state.name,
          });
          this.props.handleClose();
          return userKeyInDb;
        })
        .then((userKeyInDb) => {
          // updateProfile function is asynchronous
          // Used set state to display user's name immediately after creating an account
          this.props.updateDisplayName(this.state.name, userKeyInDb);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`${errorCode} - ${errorMessage}`);
        });
    } else {
      signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
          // Signed in
          this.props.handleClose();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`${errorCode} - ${errorMessage}`);
          const errorMsg = setErrorMessage(error.code);
          this.setState({
            errorMessage: errorMsg,
          });
        });
    }
  };

  render() {
    return (
      <>
        <Modal
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              Rocketgram
            </Typography>
            <form onSubmit={this.handleSubmit}>
              <Grid container justifyContent="center">
                {!this.state.isloginAuth && (
                  <Grid item xs={12}>
                    <TextField
                      label="Display Name"
                      variant="outlined"
                      size="small"
                      name="name"
                      fullWidth
                      required
                      onChange={this.handleChange}
                      sx={{ marginBottom: "15px" }}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    size="small"
                    name="email"
                    type="email"
                    fullWidth
                    required
                    onChange={this.handleChange}
                    sx={{ marginBottom: "15px" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    variant="outlined"
                    size="small"
                    name="password"
                    type="password"
                    required
                    fullWidth
                    onChange={this.handleChange}
                    sx={{
                      marginBottom:
                        this.state.errorMessage.length > 0 ? "10px" : "15px",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" type="submit" fullWidth>
                    {this.state.isloginAuth ? "Log in" : "Sign up"}
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  sx={{ textAlign: "center", marginTop: "20px" }}
                  variant="body2"
                >
                  {this.state.isloginAuth ? (
                    <>
                      Don't have an account?{" "}
                      <Button onClick={this.changeAuthType}>Sign up</Button>
                    </>
                  ) : (
                    <>
                      Have an account?{" "}
                      <Button onClick={this.changeAuthType}>Log in</Button>
                    </>
                  )}
                </Typography>
              </Grid>
              {this.state.errorMessage ? (
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#f44336",
                    }}
                    variant="body2"
                  >
                    {this.state.errorMessage}
                  </Typography>
                </Grid>
              ) : null}
            </Grid>
          </Box>
        </Modal>
      </>
    );
  }
}

export default Login;
