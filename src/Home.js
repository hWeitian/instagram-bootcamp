import React from "react";
import Header from "./Component/Header";
import { Outlet } from "react-router-dom";
import { Container, Grid } from "@mui/material";

class Home extends React.Component {
  render() {
    return (
      <>
        <Header
          changePage={this.props.changePage}
          displayModal={this.props.displayModal}
          isLoggedIn={this.props.isLoggedIn}
          handleSignOut={this.props.handleSignOut}
          displayName={this.props.displayName}
          profilePic={this.props.profilePic}
          currentPage={this.props.currentPage}
        />
        <Container maxWidth="sm" sx={{ marginTop: "100px" }}>
          <Outlet />
        </Container>
      </>
    );
  }
}

export default Home;
