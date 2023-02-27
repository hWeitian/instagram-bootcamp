import React from "react";
import Login from "./Login";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Grid,
  Tooltip,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";

const settings = ["Logout"];

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // anchorElNav: null,
      anchorElUser: null,
    };
  }

  handleClick = (page) => {
    console.log(page);
    if (page === "Logout") {
      this.props.handleSignOut();
    } else {
      this.props.changePage(page);
    }
  };

  handleOpenUserMenu = (event) => {
    if (this.state.anchorElUser === null) {
      this.setState({
        anchorElUser: event.currentTarget,
      });
    }
  };

  handleCloseUserMenu = (page) => {
    if (typeof page === "string") {
      this.handleClick(page);
    }

    this.setState({
      anchorElUser: null,
    });
  };

  render() {
    return (
      <>
        <AppBar
          position="fixed"
          style={{
            backgroundColor: "#000000",
            boxShadow: "0px 0px 0px 0px",
          }}
        >
          <Container maxWidth="lg">
            <Toolbar>
              <Grid container justifyContent="space-between">
                <Grid item xs={4}>
                  <Typography variant="h5">Rocketgram</Typography>
                </Grid>
                <Grid item xs={8} md={4}>
                  <Grid container justifyContent="flex-end">
                    {this.props.isLoggedIn ? (
                      <>
                        <Grid item xs={3}>
                          <Button
                            sx={{ color: "#fFFFFF" }}
                            onClick={() =>
                              this.handleClick(
                                this.props.currentPage === "Home"
                                  ? "Chat"
                                  : "Home"
                              )
                            }
                          >
                            <Link
                              to={
                                this.props.currentPage === "Home" ? "Chat" : "/"
                              }
                              style={{
                                textDecoration: "none",
                                color: "#FFFFFF",
                              }}
                            >
                              {this.props.currentPage === "Home"
                                ? "Chat"
                                : "Home"}
                            </Link>
                          </Button>
                        </Grid>
                        <Grid item sx={{ margin: "auto 0" }} xs={4}>
                          <Grid container>
                            <Grid item sx={{ margin: "auto" }}>
                              <Typography>{this.props.displayName}</Typography>
                            </Grid>
                            <Grid item>
                              <Tooltip title="Open settings">
                                <IconButton
                                  onClick={this.handleOpenUserMenu}
                                  sx={{ p: 0 }}
                                  style={{
                                    pointerEvents:
                                      this.state.anchorElUser !== null &&
                                      "none",
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: "#0d47a1",
                                      width: 30,
                                      height: 30,
                                      fontSize: "0.8125rem",
                                    }}
                                    src={this.props.profilePic}
                                    alt="profile picture"
                                  />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                          <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={this.state.anchorElUser}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            open={Boolean(this.state.anchorElUser)}
                            onClose={this.handleCloseUserMenu}
                          >
                            {settings.map((setting) => (
                              <MenuItem
                                key={setting}
                                onClick={() =>
                                  this.handleCloseUserMenu(setting)
                                }
                              >
                                <Typography textAlign="center">
                                  {setting}
                                </Typography>
                              </MenuItem>
                            ))}
                          </Menu>
                        </Grid>
                      </>
                    ) : (
                      <Link to={"authform"} style={{ textDecoration: "none" }}>
                        <Button
                          sx={{ color: "#fFFFFF" }}
                          variant="contained"
                          // onClick={this.props.displayModal}
                        >
                          Login / Singup
                        </Button>
                      </Link>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>
          </Container>
        </AppBar>
      </>
    );
  }
}

export default Header;
