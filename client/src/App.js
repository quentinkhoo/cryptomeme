import React, { Component, setGlobal } from "reactn";
import Swal from "sweetalert2";
import Meme from "./contracts/Meme.json";
import User from "./contracts/User.json";
import PepeCoin from "./contracts/PepeCoin.json";
import MemeketPlace from "./contracts/MemeketPlace.json";
import contract from '@truffle/contract'
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

      const memeNetwork = contract(Meme)
      memeNetwork.setProvider(this.state.web3.currentProvider)
      memeNetwork.deployed()
      .then(instance1 =>{
        this.setGlobal({ memeNetwork: instance1 });
        console.log(instance1);
      })


      // Get User instance and all the Memes
      const userNetwork = contract(User)
      userNetwork.setProvider(this.state.web3.currentProvider)
      userNetwork.deployed()
      .then(instance2 =>{
        this.setGlobal({ userNetwork: instance2 });
        console.log(instance2);
      })

      // Get PepeCoin instance and all the Memes

      const pepeCoinNetwork = contract(PepeCoin)
      pepeCoinNetwork.setProvider(this.state.web3.currentProvider)
      pepeCoinNetwork.deployed()
      .then(instance3 =>{
        this.setGlobal({ pepeCoinNetwork: instance3 });
        console.log(instance3);
      })

      //Get Memeketplace instance
      const memeketPlaceNetwork = contract(MemeketPlace)
      memeketPlaceNetwork.setProvider(this.state.web3.currentProvider)
      memeketPlaceNetwork.deployed()
      .then(instance4 =>{
        this.setGlobal({ memeketPlaceNetwork: instance4 });
        console.log(instance4);
      })
      

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
