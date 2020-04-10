import * as React from "react";
import { useGlobal, useEffect } from "reactn";
import {
  Button,
  Modal,
  Card,
  TextField,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

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
    padding: theme.spacing(4, 8, 4),
    minWidth: "70%",
    minHeight: "50%",
  },
  button: {
    height: "50px",
    backgroundColor: "#6aa84fff",
    color: "whitesmoke",
    "&:hover": {
      backgroundColor: "#6aa84fff",
    },
  },
  media: {
    maxHeight: "160px",
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
});

const EditMemes = (props) => {
  const { classes, modalState, handleClose, memeInfo, rows, stopFlags } = props;
  const [userNetwork] = useGlobal("userNetwork");
  const [memeNetwork] = useGlobal("memeNetwork");
  const [memeketPlaceNetwork] = useGlobal("memeketPlaceNetwork");
  const [web3] = useGlobal("web3");

  async function handleActivate(meme) {
    // Set sender
    let result = await web3.eth.getAccounts();
    // Approve meme of memeId
    const newDate = Math.floor(new Date().getTime() / 1000);
    await memeNetwork.methods
      .approveMeme(meme.memeId, newDate)
      .send({ from: result[0] });

    // Close Modal
    handleClose();
  }

  async function handleDeactivate(meme) {
    // Reject Meme
    let result = await web3.eth.getAccounts();
    // Reject meme of memeId
    const newDate = Math.floor(new Date().getTime() / 1000);
    await memeNetwork.methods
      .rejectMeme(meme.memeId, newDate)
      .send({ from: result[0] });

    // Close Modal
    handleClose();
  }

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalState}
        onClose={handleClose}
        className={classes.modal}
      >
        <Card className={classes.paper}>
          <div style={{ position: "static", minHeight: "65px" }}>
            <div style={{ width: "75%", float: "left" }}>
              <Typography variant="h4" gutterBottom>
                Meme Title: {memeInfo.memeTitle}
              </Typography>
            </div>
            <div style={{ width: "25%", float: "right" }}>
              {memeInfo.memeStatus === "Approved" &&
                memeInfo.memeFlags > stopFlags && (
                  <Button
                    disabled
                    fullWidth
                    style={{ backgroundColor: "#57bb8aff", color: "white" }}
                  >
                    {memeInfo.memeStatus}
                  </Button>
                )}
              {(memeInfo.memeStatus === "Pending" ||
                memeInfo.memeStatus === "Rejected" ||
                memeInfo.memeFlags <= stopFlags) && (
                <Button
                  disabled
                  fullWidth
                  style={{ backgroundColor: "#cca677ff", color: "white" }}
                >
                  {memeInfo.memeStatus}
                </Button>
              )}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Typography variant="p" gutterBottom>
              Meme ID: {memeInfo.memeId}
            </Typography>
            <br />
            <Typography variant="p" gutterBottom>
              Meme Path: {memeInfo.memePath}
            </Typography>
          </div>
          {(memeInfo.memeStatus === "Rejected" ||
            memeInfo.memeStatus === "Pending") && (
            <div
              style={{
                position: "relative",
                height: "220px",
                paddingTop: "10px",
              }}
            >
              <div style={{ width: "45%", float: "left" }}>
                <CardMedia
                  component="img"
                  className={classes.media}
                  image={require("../../img/pepeTopSecret.jpg")}
                />
                <Button
                  fullWidth
                  style={{ backgroundColor: "#5d4037ff", color: "white" }}
                  onClick={() => handleActivate(memeInfo)}
                >
                  Approve Meme
                </Button>
              </div>
            </div>
          )}
          {(memeInfo.memeFlags > stopFlags ||
            memeInfo.memeStatus === "Approved") && (
            <div
              style={{
                position: "relative",
                height: "220px",
                paddingTop: "10px",
              }}
            >
              <CardMedia
                component="img"
                className={classes.media}
                image={require("../../img/pepeDeactivateMeme.png")}
                style={{ paddingLeft: "25%" }}
              />
              <Button
                fullWidth
                style={{ backgroundColor: "#ffd966ff" }}
                onClick={() => handleDeactivate(memeInfo)}
              >
                Deactivate Meme
              </Button>
            </div>
          )}
        </Card>
      </Modal>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(EditMemes);
