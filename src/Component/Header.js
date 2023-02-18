import React from "react";
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
              </div>
            </Toolbar>
          </Container>
        </AppBar>
      </>
    );
  }
}

export default Header;
