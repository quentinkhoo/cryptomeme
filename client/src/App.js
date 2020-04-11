import React, { Component, setGlobal } from "reactn";
import Swal from "sweetalert2";
import Meme from "./contracts/Meme.json";
import User from "./contracts/User.json";
import PepeCoin from "./contracts/PepeCoin.json";
import MemeketPlace from "./contracts/MemeketPlace.json";
import getWeb3 from "./getWeb3";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import LandingPage from "./Landing/pages/LandingPage.js";
import ProfilePage from "./Profile/pages/Profile.js";
import Navbar from "./Navbar/pages/Navbar.js";
import AdminPage from "./Admin/pages/Admin.js";
import LeaderBoardPage from "./LeaderBoard/pages/LeaderBoard.js";
import SideDrawer from "./Subbar/components/SideDrawer";

setGlobal({
  web3: null,
  userNetwork: null,
  memeNetwork: null,
  memeketPlaceNetwork: null,
});

const isLoggedIn = JSON.parse(sessionStorage.getItem("loggedIn"));

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn === true ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testValue: 12345,
      web3: null,
      account: "",
      memeketPlaceNetwork: null,
      pepeCoinNetwork: null,
      deployedMemeketPlaceNetworkData: null,
      memeNetwork: null,
      userNetwork: null,
    };
  }

  async componentDidMount() {
    try {
      console.log("Called");
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      this.setState({ web3: web3 });
      this.setGlobal({ web3: web3 });

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });

      // Get the Contract instances.
      const networkId = await web3.eth.net.getId();
      // const networkId = localStorage.getItem("networkId")

      // Get Meme instance and all the Memes
      const deployedMemeNetworkData = Meme.networks[networkId];

      if (deployedMemeNetworkData) {
        const memeNetwork = new web3.eth.Contract(
          Meme.abi,
          deployedMemeNetworkData.address
        );
        this.setGlobal({ memeNetwork: memeNetwork });
      }

      // Get User instance and all the Memes
      const deployedUserNetworkData = User.networks[networkId];

      if (deployedUserNetworkData) {
        const userNetwork = new web3.eth.Contract(
          User.abi,
          deployedUserNetworkData.address
        );
        this.setGlobal({ userNetwork: userNetwork });
        //this.setGlobal(userNetwork => userNetwork);
      }

      // Get PepeCoin instance and all the Memes
      const deployedPepeCoinNetworkData = PepeCoin.networks[networkId];

      if (deployedPepeCoinNetworkData) {
        const pepeCoinNetwork = new web3.eth.Contract(
          PepeCoin.abi,
          deployedPepeCoinNetworkData.address
        );
        this.setGlobal({ pepeCoinNetwork: pepeCoinNetwork });
        //this.setGlobal(userNetwork => userNetwork);
      }

      //Get Memeketplace instance
      const deployedMemeketPlaceNetworkData = MemeketPlace.networks[networkId];
      if (deployedMemeketPlaceNetworkData) {
        const memeketPlaceNetwork = new web3.eth.Contract(
          MemeketPlace.abi,
          deployedMemeketPlaceNetworkData.address
        );
        this.setGlobal({ memeketPlaceNetwork: memeketPlaceNetwork });
        //this.setGlobal(memeketPlaceNetwork => memeketPlaceNetwork);
      }

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  render() {
    return (
      <div
        style={{
          backgroundColor: "#9acdbaff",
          height: "100%",
          minHeight: "100vh",
        }}
      >
        <Router>
          <Navbar />
          <div style={{ paddingTop: "100px" }}>
            <div style={{ paddingLeft: "20px", width: "120px" }}>
              <SideDrawer />
            </div>
            <div style={{ paddingLeft: "200px", width: "100%" }}>
              <Route
                exact
                path="/"
                render={(routeProps) => <LandingPage {...routeProps} />}
              />
              <PrivateRoute
                exact
                path="/leaderBoard"
                component={LeaderBoardPage}
              />
              <PrivateRoute exact path="/profile" component={ProfilePage} />
              <PrivateRoute exact path="/admin" component={AdminPage} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
