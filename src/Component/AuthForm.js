import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { auth, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";
import {
  setErrorMessage as generateErrorMessage,
  generateImageName,
} from "../utils";
import { useNavigate } from "react-router-dom";

function AuthForm(props) {
  const [isloginAuth, setIsloginAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [previewLink, setPreviewLink] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const changeAuthType = () => {
    setIsloginAuth(!isloginAuth);
  };

  const inputValidation = () => {
    if (profilePic === "") {
      setErrorMessage("Please upload a photo");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    if (!isloginAuth) {
      if (inputValidation()) {
        Promise.all([
          createUserWithEmailAndPassword(auth, email, password),
          uploadBytes(
            sRef(
              storage,
              `profilePics/${
                profilePic ? generateImageName(profilePic.name) : "dummy"
              }`
            ),
            profilePic
          ),
        ])
          .then((values) => {
            // Account created and profile pic uploaded on firebase storage
            //const userCredential = values[0];
            const snapshot = values[1];

            // getDownloadURL(snapshot.ref).then((url) => {
            //   // Update display name on Firebase Auth
            //   console.log(this.state.name);
            //   updateProfile(auth.currentUser, {
            //     displayName: this.state.name,
            //     photoURL: url,
            //   });
            // });
            return getDownloadURL(snapshot.ref);
          })
          .then((url) => {
            console.log(url);
            // Update display name on Firebase Auth
            updateProfile(auth.currentUser, {
              displayName: name,
              photoURL: url,
            });
            // updateProfile function is asynchronous
            // Used set state to display user's name immediately after creating an account
            props.updateUserInfo(name, url);
          })
          .then(() => {
            //props.handleClose();
            navigate("/");
            setIsloginAuth(true);
            setName("");
            setPassword("");
            setEmail("");
            setErrorMessage("");
            setPreviewLink("");
            setProfilePic("");
            setLoading(false);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode} - ${errorMessage}`);
            const errorMsg = generateErrorMessage(error.code);
            setErrorMessage(errorMsg);
            setPassword("");
            setLoading(false);
          });
      } else {
        setPassword("");
        setLoading(false);
        return;
      }
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          //props.handleClose();
          navigate("/");
          setIsloginAuth(true);
          setName("");
          setPassword("");
          setEmail("");
          setErrorMessage("");
          setPreviewLink("");
          setProfilePic("");
          setLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`${errorCode} - ${errorMessage}`);
          const errorMsg = generateErrorMessage(error.code);
          setErrorMessage(errorMsg);
          setEmail("");
          setPassword("");
          setLoading(false);
        });
    }
  };

  const handleProfilePicInput = (event) => {
    setProfilePic(event.target.files[0]);

    // Create a preview of the file before uploading it onto database
    setPreviewLink(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "15px",
          padding: "20px",
        }}
      >
        <Box>
          <Typography
            id="modal-modal-title"
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#000000",
            }}
          >
            Rocketgram
          </Typography>
          <form onSubmit={(event) => handleSubmit(event)}>
            <Grid container justifyContent="center">
              {!isloginAuth && (
                <Grid item xs={12}>
                  <TextField
                    label="Display Name"
                    variant="outlined"
                    size="small"
                    name="name"
                    value={name}
                    fullWidth
                    required
                    onChange={(event) => setName(event.target.value)}
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  sx={{
                    marginBottom: errorMessage.length > 0 ? "10px" : "15px",
                  }}
                />
              </Grid>
              {!isloginAuth && (
                <Grid
                  container
                  sx={{
                    backgroundColor: "#F2F4F6",
                    marginBottom: "15px",
                    padding: "15px",
                    alignContent: "center",
                    borderRadius: "4px",
                  }}
                >
                  <Grid item xs={4}>
                    <Avatar
                      src={previewLink ? previewLink : "/broken-image.jpg"}
                    />
                  </Grid>
                  <Grid item xs={8} sx={{ margin: "auto", textAlign: "right" }}>
                    <Button variant="outlined" size="small" component="label">
                      {previewLink
                        ? "Change Profile Pic"
                        : "Upload Profile Pic"}
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(event) => handleProfilePicInput(event)}
                      />
                    </Button>
                  </Grid>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : isloginAuth ? (
                    "Log in"
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
          <Grid container>
            <Grid item xs={12}>
              <Typography
                sx={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#000000",
                }}
                variant="body2"
              >
                {isloginAuth ? (
                  <>
                    Don't have an account?{" "}
                    <Button onClick={() => changeAuthType()}>Sign up</Button>
                  </>
                ) : (
                  <>
                    Have an account?{" "}
                    <Button onClick={() => changeAuthType()}>Log in</Button>
                  </>
                )}
              </Typography>
            </Grid>
            {errorMessage ? (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#f44336",
                  }}
                  variant="body2"
                >
                  {errorMessage}
                </Typography>
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

/*
class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isloginAuth: true,
      email: "",
      password: "",
      name: "",
      errorMessage: "",
      previewLink: "",
      profilePic: "",
      loading: false,
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

  inputValidation = () => {
    if (this.state.profilePic === "") {
      this.setState({
        errorMessage: "Please upload a photo",
      });
      return false;
    } else {
      this.setState({
        errorMessage: "",
      });
      return true;
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    if (!this.state.isloginAuth) {
      if (this.inputValidation()) {
        Promise.all([
          createUserWithEmailAndPassword(
            auth,
            this.state.email,
            this.state.password
          ),
          uploadBytes(
            sRef(
              storage,
              `profilePics/${
                this.state.profilePic
                  ? generateImageName(this.state.profilePic.name)
                  : "dummy"
              }`
            ),
            this.state.profilePic
          ),
        ])
          .then((values) => {
            // Account created and profile pic uploaded on firebase storage
            //const userCredential = values[0];
            const snapshot = values[1];

            // getDownloadURL(snapshot.ref).then((url) => {
            //   // Update display name on Firebase Auth
            //   console.log(this.state.name);
            //   updateProfile(auth.currentUser, {
            //     displayName: this.state.name,
            //     photoURL: url,
            //   });
            // });
            return getDownloadURL(snapshot.ref);
          })
          .then((url) => {
            console.log(url);
            // Update display name on Firebase Auth
            updateProfile(auth.currentUser, {
              displayName: this.state.name,
              photoURL: url,
            });
            // updateProfile function is asynchronous
            // Used set state to display user's name immediately after creating an account
            this.props.updateUserInfo(this.state.name, url);
          })
          .then(() => {
            this.props.handleClose();
            this.setState({
              isloginAuth: true,
              email: "",
              password: "",
              name: "",
              errorMessage: "",
              previewLink: "",
              profilePic: "",
              loading: false,
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`${errorCode} - ${errorMessage}`);
            const errorMsg = setErrorMessage(error.code);
            this.setState({
              errorMessage: errorMsg,
              password: "",
              loading: false,
            });
          });
      } else {
        this.setState({
          password: "",
          loading: false,
        });
        return;
      }
    } else {
      signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
          // Signed in
          this.props.handleClose();
          this.setState({
            isloginAuth: true,
            email: "",
            password: "",
            name: "",
            errorMessage: "",
            previewLink: "",
            profilePic: "",
            loading: false,
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`${errorCode} - ${errorMessage}`);
          const errorMsg = setErrorMessage(error.code);
          this.setState({
            errorMessage: errorMsg,
            password: "",
            email: "",
            loading: false,
          });
        });
    }
  };

  handleProfilePicInput = (event) => {
    this.setState(
      {
        profilePic: event.target.files[0],
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

  render() {
    return (
      <>
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "15px",
            padding: "20px",
          }}
        >
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: "700",
                marginBottom: "20px",
                color: "#000000",
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
                      value={this.state.name}
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
                    value={this.state.email}
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
                    value={this.state.password}
                    onChange={this.handleChange}
                    sx={{
                      marginBottom:
                        this.state.errorMessage.length > 0 ? "10px" : "15px",
                    }}
                  />
                </Grid>
                {!this.state.isloginAuth && (
                  <Grid
                    container
                    sx={{
                      backgroundColor: "#F2F4F6",
                      marginBottom: "15px",
                      padding: "15px",
                      alignContent: "center",
                      borderRadius: "4px",
                    }}
                  >
                    <Grid item xs={4}>
                      <Avatar
                        src={
                          this.state.previewLink
                            ? this.state.previewLink
                            : "/broken-image.jpg"
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={8}
                      sx={{ margin: "auto", textAlign: "right" }}
                    >
                      <Button variant="outlined" size="small" component="label">
                        {this.state.previewLink
                          ? "Change Profile Pic"
                          : "Upload Profile Pic"}
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={this.handleProfilePicInput}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={this.state.loading}
                  >
                    {this.state.loading ? (
                      <CircularProgress size={24} />
                    ) : this.state.isloginAuth ? (
                      "Log in"
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    textAlign: "center",
                    marginTop: "20px",
                    color: "#000000",
                  }}
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
        </Container>
      </>
    );
  }
}
*/

export default AuthForm;
