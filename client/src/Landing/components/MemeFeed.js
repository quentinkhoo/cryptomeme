import React, { useGlobal, useEffect } from "reactn";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  Avatar,
} from "@material-ui/core";
import {
  Button,
  Grid,
  Typography,
  TextField,
  Modal,
  Divider,
  IconButton,
} from "@material-ui/core";
// import logo from "../../img/goodjob_pepe.png";
import hurt from "../../img/sadpepe.png";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
// import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltOutlinedIcon from "@material-ui/icons/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import ThumbDownRoundedIcon from "@material-ui/icons/ThumbDownRounded";
import ipfs from "../../ipfs";
import FlagIcon from "@material-ui/icons/Flag";
import Swal from "sweetalert2";

const styles = (theme) => ({
  root: {
    width: "100%",
    // maxWidth: '80%',
    marginTop: "10px",
    // marginBottom:'1%',
    position: "relative",
    // display: 'flex',
    padding: theme.spacing(2),
    borderRadius: 16,
  },
  empty_root: {
    width: "100%",
    marginTop: "3%",
    position: "relative",
    padding: theme.spacing(2),
    borderRadius: 16,
  },
  media: {
    // width: 150,
    // height: 200,
    minWidth: "200px",
    maxWidth: "200px",
    boxShadow: "0 2px 8px 0 #c1c9d7, 0 -2px 8px 0 #cce1e9",
    flexShrink: "0",
    borderRadius: "12px",
    // backgroundColor: '#eeeeee'
  },
  empty_media: {
    minWidth: "30%",
    maxWidth: "30%",
    boxShadow: "0 2px 8px 0 #c1c9d7, 0 -2px 8px 0 #cce1e9",
    flexShrink: "0",
    borderRadius: "12px",
    height: "250px",
  },

  content: {
    padding: theme.spacing(0, 0, 0, 6),
    width: "100%",
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
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
  flagButton: {
    height: "50px",
    backgroundColor: "#DC143C",
    color: "whitesmoke",
    "&:hover": {
      backgroundColor: "#DC143C",
    },
  },
  progress: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  head: {
    display: "flex",
    flexFlow: "row nowrap",
    position: "relative",
    margin: "0 5px 5px",
    padding: "0px",
  },
  body: {
    display: "flex",
    position: "relative",
    margin: "0 5px 5px",
    marginTop: "8px",
  },
  avatar: {
    backgroundColor: "grey",
  },
});

const MemeFeed = (props) => {
  const { classes } = props;
  const [userNetwork] = useGlobal("userNetwork");
  const [memeketPlaceNetwork] = useGlobal("memeketPlaceNetwork");
  const [memeNetwork] = useGlobal("memeNetwork");
  const [web3] = useGlobal("web3");
  const [memes, setMemes] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openFlag, setOpenFlag] = React.useState(false);
  const [memeTitle, setMemeTitle] = React.useState("");
  const [memeDescription, setMemeDescription] = React.useState("");
  const [buffer, setBuffer] = React.useState("");
  const [userId, setUserId] = React.useState(null);
  const loggedIn = JSON.parse(sessionStorage.getItem("loggedIn"));
  const [memeOwners, setMemeOwners] = React.useState([]);
  const [memeDates, setMemeDates] = React.useState([]);
  const [likeStatus, setLikeStatus] = React.useState([]);
  const [userAddress, setUserAddress] = React.useState(
    sessionStorage.getItem("account")
  );

  useEffect(() => {
    console.log(memeNetwork);

    populateMeme();
  }, [memeNetwork, memeketPlaceNetwork, userNetwork]);

  useEffect(() => {
    setMemes(memes);
  }, [memes]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  async function populateMeme() {
    const acc = sessionStorage.getItem("account");
    setUserAddress(acc);
    let memeArray = [];
    let _memeOwners = [];
    let _memeDates = [];
    let likeStatus = [];

    try {
      if (memeNetwork && memeketPlaceNetwork && userNetwork) {
        //Retrieve meme feed by calling memes function
        const result = await memeNetwork.methods.numberOfMemes().call();
        for (var i = 0; i < result; i++) {
          const meme = await memeNetwork.methods.memes(i).call();
          console.log(memeIsApproved(meme));
          if (memeIsApproved(meme)) {
            memeArray = memeArray.concat(meme);

            //for every meme, retrieve the getStatus to see if user has liked this before
            await getStatus(meme.memeId);

            //retrieve the meme creator's address to get his userId
            const address = meme.memeOwner;
            const userId = await userNetwork.methods.userIds(address).call();

            //retrieve meme creator object
            const _memeOwner = await userNetwork.methods
              .users(userId)
              .call({ from: acc });

            _memeOwners = _memeOwners.concat(_memeOwner);

            console.log("original memedate", meme.memeDate);
            let _memeDate = new Date(meme.memeDate * 1000).toLocaleString();
            console.log("memedate", _memeDate);
            _memeDates = _memeDates.concat(_memeDate);

            setMemes(memeArray);
            setMemeDates(_memeDates);
            setMemeOwners(_memeOwners);
          }
        }
      } else {
        console.log("Null networks");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function mapMemeStatus(statusInt) {
    if (statusInt == 0) {
      return "Approved";
    } else if (statusInt == 1) {
      return "Rejected";
    } else if (statusInt == 2) {
      return "Pending";
    }
  }

  /**
   *
   * @param {*} meme
   */
  function memeIsApproved(meme) {
    if (mapMemeStatus(meme[10]) === "Approved") {
      return true;
    }
    return false;
  }

  async function checkMetaMaskAccount() {
    let accounts = await web3.eth.getAccounts();
    let currentAccount = sessionStorage.getItem("account");
    if (accounts[0] != currentAccount) {
      Swal.fire({
        title:
          "Something went terribly wrong. Did you switch your MetaMask account?",
        imageUrl: require("../../img/policeApu.png"),
        confirmButtonText: "Sadkek",
      });
    }
  }

  //----------------CREATE MEME-------------
  async function createMeme(memePath, memeTitle, memeDescription) {
    const acc = sessionStorage.getItem("account");
    const memeDate = Math.floor(new Date().getTime() / 1000);
    try {
      await memeketPlaceNetwork.methods
        .uploadMeme(acc, memeDate, memePath, memeTitle, memeDescription)
        .send({
          from: acc,
        });
      //updateMeme();
      handleClose("create");
      Swal.fire({
        title: "Creation successful! Please wait for your meme to be approved.",
        icon: "success",
        confirmButtonText: "Cool beans",
      });
    } catch (error) {
      handleClose("create");
      checkMetaMaskAccount();
    }
  }

  //----------Update the meme feed when meme is created-------
  //This is called by createMeme() function
  // async function updateMeme() {
  //   const acc = sessionStorage.getItem("account");
  //   var arr = memes;
  //   var arr_owner = memeOwners;

  //   const numOfMemes = await memeNetwork.methods
  //     .numberOfMemes()
  //     .call({ from: acc });
  //   const newMeme = await memeNetwork.methods
  //     .memes(numOfMemes - 1)
  //     .call({ from: acc });

  //   arr = arr.concat(newMeme);
  //   const address = newMeme.memeOwner;

  //   const userId = await userNetwork.methods
  //     .userIds(address)
  //     .call({ from: acc });

  //   const user = await userNetwork.methods.users(userId).call({ from: acc });

  //   // console.log(user);

  //   arr_owner = arr_owner.concat(user);
  //   setMemes(arr);
  //   setMemeOwners(arr_owner);
  // }

  //------------LIKE MEMES--------------
  async function likeMeme(memeId) {
    const acc = sessionStorage.getItem("account");
    var arr = memes;
    // console.log(memeId);
    try {
      await memeketPlaceNetwork.methods.likeMeme(memeId).send({ from: acc });

      const updateMeme = await memeNetwork.methods.memes(memeId).call();

      const state = arr.map((meme) => (meme[1] === memeId ? updateMeme : meme));
      await getStatus(memeId);
      setMemes(state);
    } catch (error) {
      checkMetaMaskAccount();
    }
  }

  //------------DISLIKE MEMES--------------
  async function dislikeMeme(memeId) {
    const acc = sessionStorage.getItem("account");
    var arr = memes;
    try {
      await memeketPlaceNetwork.methods.dislikeMeme(memeId).send({ from: acc });

      const updateMeme = await memeNetwork.methods.memes(memeId).call();

      const state = arr.map((meme) => (meme[1] === memeId ? updateMeme : meme));
      await getStatus(memeId);
      setMemes(state);
    } catch (error) {
      checkMetaMaskAccount();
    }
  }

  //-------------USER LIKE STATUS--------------------
  async function getStatus(memeId) {
    var status = likeStatus;
    // console.log(memeId);
    var ans;
    if (loggedIn) {
      const acc = sessionStorage.getItem("account");
      ans = await memeketPlaceNetwork.methods.getLikes(memeId, acc).call();
      status[memeId] = ans;
    }

    setLikeStatus(status);
  }

  //-------------FLAG MEME--------------------
  async function flagMeme(memeId) {
    const acc = sessionStorage.getItem("account");
    var arr = memes;
    // console.log(memeId);
    const isFlagged = await memeketPlaceNetwork.methods
      .getFlags(memeId, acc)
      .call();
    if (!isFlagged) {
      try {
        await memeketPlaceNetwork.methods.flagMeme(memeId).send({ from: acc });
        handleClose("flag");
        Swal.fire({
          title: "Flag successful!",
          icon: "success",
          confirmButtonText: "Cool beans",
        });
      } catch (error) {
        handleClose("flag");
        checkMetaMaskAccount();
      }
    } else {
      handleClose("flag");
      Swal.fire({
        title: "You have already flagged this meme!",
        icon: "error",
        confirmButtonText: "Cool beans",
      });
    }
  }

  //------------UPLOAD FILE--------------
  function captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    try {
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        ipfs.files.add(Buffer(reader.result), (error, result) => {
          if (error) {
            return;
          }
          const hash = result[0].hash;
          setBuffer(hash);
          return hash;
        });
      };
    } catch (error) {
      console.error(error);
    }
  }

  //------------SUBMIT FORM-------------------
  function handleSubmit(event) {
    event.preventDefault();
    createMeme(buffer, memeTitle, memeDescription);
  }

  const handleOpen = (type) => {
    console.log(type);
    if (type == "create") {
      setOpen(true);
    } else {
      setOpenFlag(true);
    }
  };

  const handleClose = (type) => {
    console.log(type);
    if (type === "create") {
      setOpen(false);
    } else {
      setOpenFlag(false);
    }
  };

  return (
    <div style={{ padding: "15px 15px 20px 15px" }}>
      <div>
        <Grid container direction="row">
          <Grid container item xs={6}>
            <Typography variant="h4">Feed</Typography>
          </Grid>
          {loggedIn && (
            <Grid container item xs={6} justify="flex-end">
              {/*-----------UPLOAD MEME MOAL----------------------------  */}
              <Button
                onClick={() => handleOpen("create")}
                variant="contained"
                style={{ marginTop: "8px" }}
                color="default"
                size="small"
                startIcon={<CloudUploadIcon />}
              >
                Create Meme
              </Button>

              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={() => handleClose("create")}
                className={classes.modal}
              >
                <Card className={classes.paper}>
                  <div>
                    <h2 id="simple-modal-title" style={{ position: "fixed" }}>
                      Meme Time
                    </h2>
                  </div>

                  <div>
                    <form
                      onSubmit={(e) => handleSubmit(e)}
                      style={{ paddingTop: "50px" }}
                    >
                      <TextField
                        id="memePath"
                        type="file"
                        variant="outlined"
                        style={{ width: "100%", paddingBottom: "10px" }}
                        onChange={captureFile}
                        required
                      />

                      <TextField
                        // id="memeTitle"
                        label="Insert a superb title for your Meme"
                        variant="outlined"
                        style={{ width: "100%", paddingBottom: "10px" }}
                        // inputRef={input => {
                        //   this.memeTitle = input;
                        // }}
                        value={memeTitle}
                        onChange={(e) => {
                          setMemeTitle(e.target.value);
                          // this.setState({ memeTitle: e.target.value });
                        }}
                        required
                      />
                      <TextField
                        // id="memeDescription"
                        label="Insert some description about your Meme"
                        variant="outlined"
                        style={{ width: "100%", paddingBottom: "10px" }}
                        multiline
                        // inputRef={input => {
                        //   this.memeDescription = input;
                        // }}
                        value={memeDescription}
                        onChange={(e) => {
                          setMemeDescription(e.target.value);
                          // this.setState({ memeDescription: e.target.value });
                        }}
                        required
                      />
                      <Button
                        type="submit"
                        className={classes.button}
                        fullWidth
                      >
                        What is life anyway?
                      </Button>
                    </form>
                  </div>
                </Card>
              </Modal>
            </Grid>
          )}
        </Grid>

        {memes && memes.length > 0 ? (
          memes.map((meme, key) => {
            return (
              /*------------- MEME CARDS ---------------------------*/
              <Card key={key} className={classes.root}>
                {memeOwners.length > 0 && memeOwners[key] ? (
                  <CardHeader
                    className={classes.head}
                    avatar={
                      <Avatar
                        aria-label="recipe"
                        className={classes.avatar}
                        src={`https://ipfs.io/ipfs/${memeOwners[key].displayPictureHash}`}
                      />
                    }
                    title={
                      memeOwners.length > 0 && memeOwners[key]
                        ? memeOwners[key].displayName
                        : ""
                    }
                    subheader={
                      memeDates.length > 0 && memeDates[key]
                        ? memeDates[key]
                        : ""
                    }
                    // title="User1231"
                  />
                ) : null}
                <div className={classes.body}>
                  <CardMedia
                    className={classes.media}
                    image={`https://ipfs.io/ipfs/${meme.memePath}`}
                    // image={logo}
                    title="Pepe"
                  />

                  <CardContent className={classes.content}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {meme.memeTitle}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="textSecondary"
                      component="p"
                      style={{ textAlign: "justify" }}
                    >
                      {meme.memeDescription}
                    </Typography>
                    <Divider className={classes.divider} light />

                    {/*------------------ LIKES/DISLIKE/FLAG SECTION------------------------ */}

                    <Grid container>
                      <Grid container item xs={8}>
                        {/*--------------------------- LIKE AND DISLIKE BUTTON--------------------- */}

                        <Grid container item xs={2}>
                          <IconButton
                            style={{ minWidth: "10px" }}
                            // startIcon={<ThumbUpAltOutlinedIcon />}
                            disabled={
                              loggedIn &&
                              memeOwners[key] &&
                              memeOwners[key].userWallet !== userAddress
                                ? false
                                : true
                            }
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              likeMeme(meme.memeId);
                            }}
                          >
                            {}
                            {likeStatus[meme.memeId] == 1 ? (
                              <ThumbUpAltRoundedIcon />
                            ) : (
                              <ThumbUpAltOutlinedIcon />
                            )}
                          </IconButton>
                          <Typography
                            variant="button"
                            color="primary"
                            component="p"
                            style={{ padding: "4px 5px" }}
                          >
                            {meme.memeLikes.toString()}
                          </Typography>
                        </Grid>
                        <Grid container item xs={2}>
                          <IconButton
                            style={{ minWidth: "10px" }}
                            disabled={
                              loggedIn &&
                              memeOwners[key] &&
                              memeOwners[key].userWallet !== userAddress
                                ? false
                                : true
                            }
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              dislikeMeme(meme.memeId);
                            }}
                          >
                            {likeStatus[meme.memeId] == 2 ? (
                              <ThumbDownRoundedIcon />
                            ) : (
                              <ThumbDownAltOutlinedIcon />
                            )}
                          </IconButton>

                          <Typography
                            variant="button"
                            color="primary"
                            component="p"
                            style={{ padding: "4px 5px" }}
                          >
                            {meme.memeDislikes.toString()}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/*--------------------------- FLAG BUTTON--------------------- */}
                      <Grid container item xs={4} justify="flex-end">
                        <IconButton
                          style={{ minWidth: "12px" }}
                          size="small"
                          disabled={
                            loggedIn &&
                            memeOwners[key] &&
                            memeOwners[key].userWallet !== userAddress
                              ? false
                              : true
                          }
                          onClick={() => handleOpen("flag")}
                        >
                          <FlagIcon color="secondary" />
                        </IconButton>
                        <Modal
                          aria-labelledby="simple-modal-title"
                          aria-describedby="simple-modal-description"
                          open={openFlag}
                          onClose={() => handleClose("flag")}
                          className={classes.modal}
                        >
                          <Card className={classes.paper}>
                            <div style={{ padding: "10px 5px 20px 5px" }}>
                              <Typography
                                variant="h4"
                                align="center"
                                style={{ fontWeight: "bold" }}
                              >
                                Hurt? We're here to help.
                              </Typography>
                            </div>

                            <CardContent>
                              <div
                                style={{
                                  width: "60%",
                                  float: "left",
                                  paddingRight: "10px",
                                }}
                              >
                                <div style={{ paddingBottom: "20px" }}>
                                  <Typography paragraph>
                                    We're truly sorry that this meme has hurt
                                    you.
                                  </Typography>
                                  <Typography paragraph>
                                    We are here to protecc our readers
                                  </Typography>
                                  <Typography paragraph>
                                    We shall reflect and do better
                                  </Typography>
                                  <Typography paragraph>
                                    Click button to flag post as{" "}
                                    {
                                      <b style={{ color: "red" }}>
                                        inappropriate
                                      </b>
                                    }
                                  </Typography>
                                </div>
                                <Button
                                  type="submit"
                                  color="secondary"
                                  className={classes.flagButton}
                                  onClick={(e) => {
                                    flagMeme(meme.memeId);
                                  }}
                                  fullWidth
                                >
                                  SAY NO TO TROLLS!
                                </Button>
                              </div>
                              <div style={{ width: "40%", float: "right" }}>
                                <CardMedia
                                  component="img"
                                  image={hurt}
                                  title="Join Pepe"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </Modal>
                      </Grid>
                    </Grid>
                  </CardContent>
                </div>
              </Card>
            );
          })
        ) : (
          <div>
            <p>Nothing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(MemeFeed);
