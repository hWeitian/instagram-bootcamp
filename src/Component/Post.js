import React from "react";
import {
  Card,
  CardMedia,
  Typography,
  CardContent,
  Button,
  CardActions,
  CardHeader,
  Avatar,
  IconButton,
  Grid,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postKey: this.props.postKey,
      liked: false,
    };
  }

  handleLikesClick = () => {
    if (this.state.liked) {
      this.props.handleLikes(this.props.postKey, "decrease");
      this.setState({
        liked: false,
      });
    } else {
      this.props.handleLikes(this.props.postKey, "increase");
      this.setState({
        liked: true,
      });
    }
  };

  render() {
    return (
      <>
        <Card sx={{ maxWidth: 450, margin: "auto" }}>
          <CardHeader
            title="Weitian"
            subheader={this.props.postDate}
            avatar={
              <Avatar
                sx={{
                  bgcolor: "#0d47a1",
                  width: 30,
                  height: 30,
                  fontSize: "0.8125rem",
                }}
                aria-label="recipe"
              >
                WT
              </Avatar>
            }
            sx={{ textAlign: "left" }}
          />
          <CardMedia
            sx={{ height: 400, backgroundSize: "cover" }}
            image={this.props.imgSrc}
          />
          <CardContent style={{ textAlign: "left" }}>
            <Typography variant="body2" color="#000000">
              {this.props.caption}
            </Typography>
          </CardContent>
          <Grid container alignItems="center">
            <Grid item>
              <CardActions sx={{ paddingRight: 0 }}>
                <IconButton
                  aria-label="add to favorites"
                  onClick={this.handleLikesClick}
                >
                  <FavoriteIcon
                    style={{ color: this.state.liked ? "#ff2f40" : "#CCCCCC" }}
                  />
                </IconButton>
              </CardActions>
            </Grid>
            <Grid item>
              <CardContent style={{ padding: 0 }}>
                <Typography variant="body2">
                  {this.props.likes <= 0
                    ? null
                    : `${this.props.likes} ${
                        this.props.likes === 1 ? "Like" : "Likes"
                      }`}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </>
    );
  }
}

export default Post;
