import React, { useState } from "react";
import { Link,} from "react-router-dom";
import "./NavigationBar.css";
import { GiRocketThruster } from "react-icons/gi";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { NavLink } from "react-router-dom";

import Button from "./Button";
import { useWeb3 } from "../providers/web3";
import { useAccount, useNetwork} from "../web3/hooks";

function NavigationBar() {

  const {connect,isLoading,isWeb3Loaded}=useWeb3()
  const {account}=useAccount()
  const {network}=useNetwork()

  
 
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>        
      <IconContext.Provider value={{ color: "red" }}>
            <nav className="navbar">
          <div className="navbar-container container">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
              
              <GiRocketThruster className="navbar-icon" />
              NFT MarketPlace
            </Link>
            <div className="menu-icon" onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  MarketPlace
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Create Nft
                </NavLink>
              </li>
              <li className="nav-item" id="account">
                    <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}>
                  Profile
                </NavLink>
             </li>

             <div className="text-white self-center mr-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-black-100 text-white-800">
                    <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-indigo-500" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx={4} cy={4} r={4} />
                    </svg>
                    {network.data}
                  </span>
                </div>
          
             
             {
               isLoading ?
               <Button
                onClick={connect}>
                Loading...
               </Button> : 
               isWeb3Loaded ?
               account.data ?
               <Button
               onClick={connect}>
                 {`0x${account.data[2]}${account.data[3]}${account.data[4]}....${account.data.slice(-4)}` }
              </Button> :
               <Button
                onClick={connect}>
               Connect
               </Button> :
               <Button
               onClick={() => window.open("https://metamask.io/download.html", "_blank")}>
                Install Metamask
             </Button>
              
             }       
            </ul>
          </div>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default NavigationBar;











