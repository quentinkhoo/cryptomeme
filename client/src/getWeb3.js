import Web3 from "web3";
import Swal from "sweetalert2";
import SadPepe from "./img/sadpepe.png";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        Swal.fire({
          title:
            "No MetaMask detected. Sadly you will need MetaMask to enjoy these memes :(",
          imageUrl: SadPepe,
          confirmButtonText: "What's this MetaMask you speak of?",
          showCancelButton: true,
        }).then((result) => {
          if (result.value) {
            window.open("https://metamask.io/download.html", "_blank");
          }
        });
        resolve(web3);
      }
    });
  });

export default getWeb3;
