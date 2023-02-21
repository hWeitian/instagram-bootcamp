import React from "react";
import Login from "./Login";
import { AppBar, Container, Toolbar, Typography, Button } from "@mui/material";

class Header extends React.Component {
  handleClick = (page) => {
    this.props.changePage(page);
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
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Typography variant="h5">Rocketgram</Typography>
              <div>
                <Typography>{this.props.displayName}</Typography>
                <Button
                  sx={{ color: "#fFFFFF" }}
                  onClick={() => this.handleClick("chat")}
                >
                  Chat
                </Button>
                <Button
                  sx={{ color: "#fFFFFF" }}
                  onClick={() => this.handleClick("home")}
                >
                  Home
                </Button>

                <Button
                  sx={{ color: "#fFFFFF" }}
                  variant="contained"
                  onClick={() =>
                    this.props.isLoggedIn
                      ? this.props.handleSignOut()
                      : this.props.displayModal()
                  }
                >
                  {this.props.isLoggedIn ? "Sign Out" : "Login / Singup"}
                </Button>
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </>
    );
  }
}

export default Header;
