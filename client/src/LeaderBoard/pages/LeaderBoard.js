import React, { useGlobal, useEffect } from "reactn";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import Rankings from "../components/Rankings";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const styles = (theme) => ({
  appBar: {
    backgroundColor: "transparent",
  },
});
const LeaderBoardPage = (props) => {
  const { classes } = props;
  const [userNetwork] = useGlobal("userNetwork");
  const [pepeCoinNetwork] = useGlobal("pepeCoinNetwork");
  const [memeketPlaceNetwork] = useGlobal("memeketPlaceNetwork");
  const [web3] = useGlobal("web3");
  const [userData, setUserData] = React.useState();
  const [peopleParent, setPeopleParent] = React.useState([]);
  const [userWallet, setUserWallet] = React.useState(
    sessionStorage.getItem("account")
  );
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    fetchData();
  }, []);
  //------------Fetch User Properties-------------------------

  // Function for populate data : it's called to modify rows / disobidentrows states
  async function fetchData() {
    // fetch the data from contracts to have current users status
    const usersArray = [];
    async function fetchDataInside(usersArray) {
      // Use try / catch to prevent error when network is not loaded (when you go directly to admin page in dev mode) -> Thus global constatns are not set

      try {
        // Check networks are up to date
        console.log("this is userNetwork: ", value);
        console.log("this is web3: ", web3);

        // Get number of accounts to iter on it (could be improve but impossible to return array from solidity)
        const result = await web3.eth.getAccounts();
        const numOfElements = await userNetwork.methods
          .getNumberUsers()
          .call({ from: result[0] });

        // Maybe there is a proper way however i do not find how to return dynamic array in solidity
        for (let i = 0; i < numOfElements; i++) {
          // Current user
          const elem = await userNetwork.methods
            .users(i)
            .call({ from: result[0] });

          const pepeCoinsNb = await pepeCoinNetwork.methods
            .balanceOf(elem.userWallet)
            .call();
          // If user is disobedient : bad guy
          usersArray.push(
            createDataPepe(pepeCoinsNb, elem.userId, elem.displayName)
          );
        }
        // If user is clean : good guy
      } catch (e) {
        console.log("Error in the process");
      }
    }

    // Do something with the results : await for fetch and update state
    await fetchDataInside(usersArray);
    setPeopleParent(usersArray);
  }

  function createDataPepe(pepeCoins, uid, displayName) {
    return { pepeCoins, uid, displayName };
  }

  async function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div style={{ paddingRight: "20px" }}>
      <AppBar position="static" className={classes.appBar} elevation={0}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          TabIndicatorProps={{ style: { background: "black" } }}
        >
          <Tab label="Leader Board" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <Rankings value={0} index={0} peopleParent={peopleParent} />
    </div>
  );
};
export default withStyles(styles, { withTheme: true })(LeaderBoardPage);
