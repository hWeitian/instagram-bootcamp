import React, { useEffect, useState } from "react";
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

function Post(props) {
  const [liked, setLiked] = useState(props.hasLiked);

  const handleLikesClick = () => {
    if (liked) {
      props.handleLikes(props.postKey, "decrease");
      setLiked(false);
    } else {
      props.handleLikes(props.postKey, "increase");
      setLiked(true);
    }
  };

  useEffect(() => {
    setLiked(props.hasLiked);
  }, [props.userUid]);

  return (
    <>
      <Card sx={{ maxWidth: 450, margin: "auto" }}>
        <CardHeader
          title={props.author}
          subheader={props.postDate}
          avatar={
            <Avatar
              sx={{
                bgcolor: "#0d47a1",
                width: 30,
                height: 30,
                fontSize: "0.8125rem",
              }}
              src={props.profilePic}
              alt="profile picture"
            />
          }
          sx={{ textAlign: "left" }}
        />
        <CardMedia
          sx={{ height: 400, backgroundSize: "cover" }}
          image={props.imgSrc}
        />
        <CardContent style={{ textAlign: "left" }}>
          <Typography variant="body2" color="#000000">
            {props.caption}
          </Typography>
        </CardContent>
        <Grid container alignItems="center">
          <Grid item>
            <CardActions sx={{ paddingRight: 0 }}>
              <IconButton
                aria-label="add to favorites"
                onClick={() => handleLikesClick()}
                style={{ pointerEvents: props.userUid.length <= 0 && "none" }}
              >
                <FavoriteIcon
                  style={{ color: liked ? "#ff2f40" : "#CCCCCC" }}
                />
              </IconButton>
            </CardActions>
          </Grid>
          <Grid item>
            <CardContent style={{ padding: 0 }}>
              <Typography variant="body2">
                {props.likes <= 0
                  ? null
                  : `${props.likes} ${props.likes === 1 ? "Like" : "Likes"}`}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

// class Post extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       liked: this.props.hasLiked,
//     };
//   }

//   handleLikesClick = () => {
//     if (this.state.liked) {
//       this.props.handleLikes(this.props.postKey);
//       this.setState({
//         liked: false,
//       });
//     } else {
//       this.props.handleLikes(this.props.postKey);
//       this.setState({
//         liked: true,
//       });
//     }
//   };

//   render() {
//     console.log(this.props.hasLiked);
//     console.log(this.state.liked);
//     return (
//       <>
//         <Card sx={{ maxWidth: 450, margin: "auto" }}>
//           <CardHeader
//             title={this.props.author}
//             subheader={this.props.postDate}
//             avatar={
//               <Avatar
//                 sx={{
//                   bgcolor: "#0d47a1",
//                   width: 30,
//                   height: 30,
//                   fontSize: "0.8125rem",
//                 }}
//                 aria-label="recipe"
//               >
//                 WT
//               </Avatar>
//             }
//             sx={{ textAlign: "left" }}
//           />
//           <CardMedia
//             sx={{ height: 400, backgroundSize: "cover" }}
//             image={this.props.imgSrc}
//           />
//           <CardContent style={{ textAlign: "left" }}>
//             <Typography variant="body2" color="#000000">
//               {this.props.caption}
//             </Typography>
//           </CardContent>
//           <Grid container alignItems="center">
//             <Grid item>
//               <CardActions sx={{ paddingRight: 0 }}>
//                 <IconButton
//                   aria-label="add to favorites"
//                   onClick={this.handleLikesClick}
//                 >
//                   <FavoriteIcon
//                     style={{ color: this.state.liked ? "#ff2f40" : "#CCCCCC" }}
//                   />
//                 </IconButton>
//               </CardActions>
//             </Grid>
//             <Grid item>
//               <CardContent style={{ padding: 0 }}>
//                 <Typography variant="body2">
//                   {this.props.likes <= 0
//                     ? null
//                     : `${this.props.likes} ${
//                         this.props.likes === 1 ? "Like" : "Likes"
//                       }`}
//                 </Typography>
//               </CardContent>
//             </Grid>
//           </Grid>
//         </Card>
//       </>
//     );
//   }
// }

export default Post;
