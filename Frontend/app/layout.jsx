"use client";

import WalletModal from "@/components/modals/WalletModal";
import "../public/styles/style.css";
import "swiper/css";
// import "swiper/css/pagination";
import { MetaMaskProvider } from "metamask-react";
import "tippy.js/dist/tippy.css";
import "react-modal-video/css/modal-video.css";
import BuyModal from "@/components/modals/BuyModal";
import BidModal from "@/components/modals/BidModal";
import PropertiesModal from "@/components/modals/PropertiesModal";
import LevelsModal from "@/components/modals/LevelsModal";
import ModeChanger from "@/components/common/ModeChanger";
import CreateModal from "@/components/modals/CreateModal";
import ReportModal from "@/components/modals/ReportModal";
import CancelBid from "@/components/modals/CancelBid";
import ShareModal from "@/components/modals/ShareModal";
import ConnectWalletModal from "@/components/modals/ConnectWalletModal";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Walletproviders from "@/utlis/hooks/walletprovider";
if (typeof window !== "undefined") {
  // Import the script only on the client side
  import("bootstrap/dist/js/bootstrap.esm").then((module) => {
    // Module is imported, you can access any exported functionality if
  });
}

//Redux-provider
import StoreProvider from "@/utlis/redux/storeprovider";
import OnsaleandChangeprice from "@/components/modals/PlaceOrder";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        itemScope
        itemType="http://schema.org/WebPage"
        className={
          "overflow-x-hidden font-body text-jacarta-500 dark:bg-jacarta-900"
        }
      >
        
        <StoreProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* <Walletproviders> */}
        <ModeChanger />
        {/* <MetaMaskProvider> */}
        {children}
        {/* </MetaMaskProvider> */}
        <WalletModal />
        {/* <BuyModal />
        <BidModal /> */}
        <PropertiesModal />
        <LevelsModal />
        {/* <CreateModal /> */}
        {/* <ReportModal /> */}
        {/* <CancelModal /> */}
        {/* <ShareModal /> */}
        <ConnectWalletModal />
        <OnsaleandChangeprice />
        {/* <ToastContainer /> */}
        {/* </Walletproviders> */}
        </StoreProvider>
        
    
      </body>
    </html>
  );
}
