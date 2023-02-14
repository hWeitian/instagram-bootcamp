import React from "react";
import { Paper, Grid, Typography, Avatar } from "@mui/material";

class ChatMessage extends React.Component {
  render() {
    return (
      <>
        <Grid container justifyContent="space-between" gap={1}>
          <Grid item sx={{ marginRight: "0px", width: "91%" }}>
            <Paper
              elevation={1}
              sx={{
                marginBottom: "10px",
                backgroundColor: "#F2F2F2",
                borderRadius: "10px",
              }}
            >
              <Grid container p={2} justifyContent="space-between">
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ textAlign: "left" }}>
                    {this.props.text}
                  </Typography>
                </Grid>
                <Grid item xs={12} p={0}>
                  <Typography
                    variant="caption"
                    component="p"
                    sx={{ color: "#999999", textAlign: "right" }}
                  >
                    {this.props.dateTimeStamp}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item style={{ margin: "auto 0 10px 0", width: "7%" }}>
            <Avatar
              sx={{
                bgcolor: "#0d47a1",
                width: 30,
                height: 30,
                fontSize: "0.8125rem",
              }}
            >
              WT
            </Avatar>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default ChatMessage;
