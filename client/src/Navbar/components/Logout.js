import React, { useState } from 'react';
import { Button, Modal, Card, TextField, CardMedia } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2, 4, 3)
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  button: {
    height: "50px",
    backgroundColor: "#57bb8aff",
    color: "whitesmoke",
    "&:hover": {
      backgroundColor: "#57bb8aff"
    }
  }
});

const Logout = props => {
  const { classes } = props;
  const [open, setOpen] = React.useState(false);
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  function handleSubmit(event) {
    event.preventDefault();
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("account");
    sessionStorage.removeItem("isAdmin");
    handleClose();
    window.location.replace("/");

  }
  return (
    <div>
      <Button onClick={handleOpen}>Logout</Button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        className={classes.modal}
      >
        <Card className={classes.paper}>
          <div style={{ paddingLeft: "30%" }}>
            <CardMedia
              component="img"
              className={classes.media}
              image={require("../../img/byepepe.png")}
              title="Bye Pepe"
              style={{ maxWidth: "70%", height: "auto" }}
            />
          </div>
          <div>
            <form className={classes.root} onSubmit={handleSubmit}>
              <Button type="submit" className={classes.button} fullWidth>
                We Will Miss You (logout)
              </Button>
            </form>
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Logout);
