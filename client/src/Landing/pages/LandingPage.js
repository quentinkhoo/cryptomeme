import React, { useState, useEffect } from "react";
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import MemeFeed from '../components/MemeFeed.js'

const styles = theme => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
});

const LandingPage = props => {
  const { classes } = props;


  return (
    <Container fixed>
        <MemeFeed/>
    </Container>
  );
}


export default withStyles(styles, { withTheme: true })(LandingPage);

