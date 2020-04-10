import React, { useGlobal, useEffect } from "reactn";
import { Button, Modal, Card, TextField, CardMedia } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";

const styles = (theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2, 4, 3),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    height: "50px",
    backgroundColor: "#6aa84fff",
    color: "whitesmoke",
    "&:hover": {
      backgroundColor: "#6aa84fff",
    },
  },
});

const Login = (props) => {
  const { classes } = props;
  const [userNetwork] = useGlobal("userNetwork");
  const [memeketPlaceNetwork] = useGlobal("memeketPlaceNetwork");
  const [web3] = useGlobal("web3");
  const [open, setOpen] = React.useState(false);
  const [eWallet, setEwallet] = React.useState("");

  const handleOpen = () => {
    try {
      web3.eth.getAccounts().then((result) => {
        setEwallet(result[0]);
        setOpen(true);
      });
    } catch (error) {
      Swal.fire({
        title: "No MetaMask detected. You will need MetaMask to login",
        icon: "warning",
        confirmButtonText: "What's this MetaMask you speak of?",
        showCancelButton: true,
      }).then((result) => {
        if (result.value) {
          window.open("https://metamask.io/download.html", "_blank");
        }
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleLogin(event) {
    event.preventDefault();
    //Check user exists

    let userExists = await userNetwork.methods
      .checkUserExists(eWallet)
      .call({ from: eWallet });

    if (userExists) {
      //Check user is activated
      let userIsActivated = await userNetwork.methods
        .checkUserIsActive(eWallet)
        .call({ from: eWallet });
      //Check user is admin
      let userIsAdmin = await userNetwork.methods
        .checkUserIsAdmin(eWallet)
        .call({ from: eWallet });
      if (userIsActivated || userIsAdmin) {
        try {
          await web3.eth.personal.sign(
            `Sign to confirm your login using metamask with the account ${eWallet}`,
            eWallet
          );
          sessionStorage.setItem("loggedIn", true);
          sessionStorage.setItem("account", eWallet);
          if (userIsAdmin) {
            sessionStorage.setItem("isAdmin", true);
          }
          handleClose();
          Swal.fire({
            title: "Login successful!",
            icon: "success",
            confirmButtonText: "Cool beans",
          });
          window.location.reload();
        } catch (error) {
          handleClose();
          Swal.fire({
            title: "No MetaMask detected. You will need to login with MetaMask",
            icon: "warning",
            confirmButtonText: "What's this MetaMask you speak of?",
            showCancelButton: true,
          });
        }
      } else {
        handleClose();
        Swal.fire({
          confirmButtonText: "LET ME IN",
          text:
            "Your account is not activated. Please wait while our friendly admins activte it",
          imageUrl: require("../../img/Let_Me_In.jpg"),
        });
      }
    } else {
      handleClose();
      Swal.fire({
        confirmButtonText: "LET ME IN",
        text: "Your account does not exist. Please register first",
        imageUrl: require("../../img/Let_Me_In.jpg"),
      });
    }
  }
  return (
    <div>
      <Button onClick={handleOpen}>Login</Button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        className={classes.modal}
      >
        <Card className={classes.paper}>
          <div>
            <h2
              id="simple-modal-title"
              style={{ position: "absolute", padding: "28px" }}
            >
              Login
            </h2>
            <CardMedia
              component="img"
              className={classes.media}
              image={require("../../img/loginpepe.png")}
              title="Welcome Pepe"
              style={{ float: "left", maxWidth: "30%", height: "auto" }}
            />
          </div>

          <div>
            <form className={classes.root} onSubmit={handleLogin}>
              <TextField
                label="Ewallet"
                variant="outlined"
                style={{ width: "100%", paddingBottom: "10px" }}
                onInput={(e) => setEwallet(e.target.value)}
                defaultValue={eWallet}
                disabled="true"
                required
              />
              <Button type="submit" className={classes.button} fullWidth>
                Be Nice Man
              </Button>
            </form>
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Login);
