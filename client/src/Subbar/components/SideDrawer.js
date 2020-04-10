import React, { useGlobal } from "react";
import "./SideDrawer.css";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  title: {
    color: "#434343",
    paddingTop: 10
  }
});

const sideDrawer = props => {
  //const [global] = useGlobal();
  //console.log(global.web3);
  const { classes } = props;
  let drawerClasses = "side-drawer";
  if (props.show) {
    drawerClasses = "side-drawer open";
  }
  var loggedIn = JSON.parse(sessionStorage.getItem("loggedIn"));
  var isAdmin = JSON.parse(sessionStorage.getItem("isAdmin"));
  return (
    <nav className={drawerClasses}>
      <ul>
        <Typography
          variant="h5"
          className={classes.title}
          component={Link}
          to="/"
        >
          Home
        </Typography>
        {loggedIn && (
          <Typography
            variant="h5"
            className={classes.title}
            component={Link}
            to="/leaderboard"
          >
            Leader Board
          </Typography>
        )}
        {loggedIn && (
          <Typography
            variant="h5"
            className={classes.title}
            component={Link}
            to="/feed"
          >
            Feed
          </Typography>
        )}
        {loggedIn && (
          <Typography
            variant="h5"
            className={classes.title}
            component={Link}
            to="/profile"
          >
            Profile
          </Typography>
        )}
        {loggedIn && (
          <Typography
            variant="h5"
            className={classes.title}
            component={Link}
            to="/following"
          >
            Following
          </Typography>
        )}
        {isAdmin && (
          <Typography
            variant="h5"
            className={classes.title}
            component={Link}
            to="/admin"
          >
            Admin
          </Typography>
        )}
      </ul>
    </nav>
  );
};

export default withStyles(styles, { withTheme: true })(sideDrawer);
