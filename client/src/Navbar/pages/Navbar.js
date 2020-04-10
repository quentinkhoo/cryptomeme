import React, { useGlobal, useEffect } from "reactn";
import Login from "../components/Login.js";
import Register from "../components/Register.js";
import Logout from "../components/Logout.js";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  CardMedia,
  List,
  Card,
  AppBar,
  ListItemAvatar,
  ListItem,
  Toolbar,
  Badge,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import tempDP from "../../img/sadpepe.png";

const styles = (theme) => ({
  appBar: {
    position: "fixed",
    height: 70,
    backgroundColor: "#ffffffff",
  },
  grow: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "transparent",
    width: 100,
    paddingTop: 4,
  },
  title: {
    color: "#434343",
    paddingTop: 10,
  },
  profileName: {
    color: "#434343",
  },
});

const Navbar = (props) => {
  const { classes } = props;
  var loggedIn = JSON.parse(sessionStorage.getItem("loggedIn"));
  const [userNetwork] = useGlobal("userNetwork");
  const [pepeCoinNetwork] = useGlobal("pepeCoinNetwork");
  const [memeketPlaceNetwork] = useGlobal("memeketPlaceNetwork");
  const [web3] = useGlobal("web3");
  const [user, setUser] = React.useState(null);
  const [displayPictureHash, setDisplayPictureHash] = React.useState(
    "displayPictureHash"
  );
  const [displayName, setDisplayName] = React.useState("displayName");

  useEffect(() => {
    console.log(userNetwork);
    getUserData();
  }, [userNetwork]);

  async function getUserData() {
    var account = sessionStorage.getItem("account");
    console.log(account);
    if (userNetwork && account) {
      var userId = await userNetwork.methods
        .userIds(account)
        .call({ from: account });
      const user = await userNetwork.methods
        .users(userId)
        .call({ from: account });
      console.log(user.displayPictureHash);
      setUser(user);
      setDisplayName(user[4]);
      setDisplayPictureHash(user[3]);
    } else {
      console.log("null networks");
    }
  }

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Card elevation={0} className={classes.card} component={Link} to="/">
            <CardMedia
              component="img"
              className={classes.media}
              image={require("../../img/HappyPepe.png")}
              title="Logo"
              style={{ maxWidth: "70%", height: "auto" }}
            />
          </Card>
          <Typography
            variant="h6"
            className={classes.title}
            component={Link}
            to="/"
          >
            Cryptomeme
          </Typography>
          <div className={classes.grow} />
          {!loggedIn && <Login />}
          {!loggedIn && <Register />}
          {loggedIn && (
            <List className={classes.list} component={Link} to="/profile">
              <ListItem button>
                <ListItemAvatar>
                  {user !== null ? (
                    <Avatar
                      src={`https://ipfs.io/ipfs/${user.displayPictureHash}`}
                    />
                  ) : (
                    <Avatar />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={displayName}
                  className={classes.profileName}
                />
              </ListItem>
            </List>
          )}
          {loggedIn && <Logout />}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Navbar);
