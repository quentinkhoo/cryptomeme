import React, { useGlobal, useEffect } from "reactn";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  CardMedia,
  List,
  Card,
  AppBar,
  ListItemAvatar,
  Typography,
  Button,
  ListItem,
  Toolbar,
  Badge,
  Avatar,
  ListItemText,
  CardHeader,
  TextField,
} from "@material-ui/core";
import tempDP from "../../img/sadpepe.png";
import peperoni from "../../img/peperoni.png";
import Container from "@material-ui/core/Container";
import ipfs from "../../ipfs";
import Swal from "sweetalert2";

const styles = (theme) => ({
  root: {
    padding: "15px",
  },
  card: {
    width: "90%",
    paddingTop: "20px",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  displayButton: {
    fontSize: 9,
  },
});
const ProfilePage = (props) => {
  const { classes } = props;
  const [userNetwork] = useGlobal("userNetwork");
  const [pepeCoinNetwork] = useGlobal("pepeCoinNetwork");
  const [memeketPlaceNetwork] = useGlobal("memeketPlaceNetwork");
  const [web3] = useGlobal("web3");
  const [userData, setUserData] = React.useState();
  const [userId, setUserId] = React.useState(999);
  const [userWallet, setUserWallet] = React.useState(
    sessionStorage.getItem("account")
  );
  const [about, setAbout] = React.useState("about");
  const [displayName, setDisplayName] = React.useState("displayName");
  const [displayPictureHash, setDisplayPictureHash] = React.useState(
    "displayPictureHash"
  );
  const [website, setWebsite] = React.useState("website");
  const [peperonis, setPeperonis] = React.useState(0);

  useEffect(() => {
    populateUserData();
  }, [userNetwork, pepeCoinNetwork]);
  //------------Fetch User Properties-------------------------
  async function populateUserData() {
    var account = sessionStorage.getItem("account");
    if (account && userNetwork && pepeCoinNetwork) {
      var userId = await userNetwork.methods
        .userIds(account)
        .call({ from: account });
      var user = await userNetwork.methods
        .users(userId)
        .call({ from: account });
      setUserData(user);
      setUserId(user[0]);
      setUserWallet(user[1]);
      setAbout(user[2]);
      setDisplayPictureHash(user[3]);
      setDisplayName(user[4]);
      setWebsite(user[5]);
      var userPepeRonis = await pepeCoinNetwork.methods
        .balanceOf(userWallet)
        .call({ from: account });
      console.log("userPepeRonis", userPepeRonis);
      setPeperonis(userPepeRonis);
    } else {
      console.log("account: ", account);
      console.log("network: ", userNetwork);
      console.log("peperonis: ", userPepeRonis);
      // console.log("user network issue")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await memeketPlaceNetwork.methods
        .updateUserProfile(
          userWallet,
          about,
          displayPictureHash,
          displayName,
          website
        )
        .send({ from: userWallet });
      Swal.fire({
        title: "Update profile successful!",
        icon: "success",
        confirmButtonText: "Cool beans",
      }).then(function () {
        window.location.reload();
      });
    } catch (error) {
      let accounts = await web3.eth.getAccounts();
      if (accounts[0] != userWallet) {
        Swal.fire({
          title:
            "Something went terribly wrong. Did you switch your MetaMask account",
          imageUrl: require("../../img/policeApu.png"),
          confirmButtonText: "Sadkek",
        });
      }
    }
    // populateUserData();
  }

  function updateDisplayPicture(event) {
    event.preventDefault();
    var file = event.target.files[0];
    var reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      ipfs.files.add(Buffer(reader.result), (error, result) => {
        if (error) {
          return;
        }
        const hash = result[0].hash;
        setDisplayPictureHash(hash);
        return hash;
      });
    };
    console.log(displayPictureHash);
  }

  return (
    <Container>
      <div className={classes.root}>
        <Typography variant="h4" style={{ paddingBottom: "10px" }}>
          Profile
        </Typography>
        <Card elevation={2} className={classes.card}>
          <div style={{ width: "40%", float: "left", paddingLeft: "5%" }}>
            <Avatar
              src={`https://ipfs.io/ipfs/${displayPictureHash}`}
              className={classes.avatar}
            />
            <br />
            <Typography variant="h6">Current Tokens</Typography>
            <div style={{ width: "20%", float: "left" }}>
              <Avatar src={peperoni} />
            </div>
            <div style={{ paddingTop: "7px" }}>{peperonis} Peperonis</div>
          </div>
          <div
            style={{
              width: "60%",
              float: "right",
              paddingRight: "5%",
              paddingBottom: "20px",
            }}
          >
            <form className={classes.form} onSubmit={handleSubmit}>
              <Typography variant="h6">User ID</Typography>
              <TextField
                variant="outlined"
                disabled="true"
                value={userId}
                style={{ width: "100%", paddingBottom: "5px" }}
                required
              />
              <Typography variant="h6">User Wallet</Typography>
              <TextField
                variant="outlined"
                disabled="true"
                value={userWallet}
                style={{ width: "100%", paddingBottom: "5px" }}
                required
              />
              <Typography variant="h6">Display Name</Typography>
              <TextField
                variant="outlined"
                value={displayName}
                style={{ width: "100%", paddingBottom: "5px" }}
                onInput={(e) => setDisplayName(e.target.value)}
                required
              />
              <Typography variant="h6">Display Picture</Typography>
              <TextField
                variant="outlined"
                type="file"
                style={{ width: "100%", paddingBottom: "5px" }}
                onChange={(e) => updateDisplayPicture(e)}
              />
              <Typography variant="h6">About</Typography>
              <TextField
                variant="outlined"
                value={about}
                style={{ width: "100%", paddingBottom: "5px" }}
                onInput={(e) => setAbout(e.target.value)}
                required
              />
              <Typography variant="h6">Website</Typography>
              <TextField
                variant="outlined"
                value={website}
                style={{ width: "100%", paddingBottom: "5px" }}
                onInput={(e) => setWebsite(e.target.value)}
                required
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
              >
                update profile
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default withStyles(styles, { withTheme: true })(ProfilePage);
