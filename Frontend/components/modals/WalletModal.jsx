/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect } from "react";

export default function WalletModal() {
  const closeModal = () => {
    const modal = document?.getElementById("walletModal");
    const walletModalBackdrop = document?.getElementById("walletModalBackdrop");
    modal.style.display = "none";
    walletModalBackdrop.style.display = "none";
  };
  useEffect(() => {
    document.addEventListener("click", function (event) {
      var walletModal = document.querySelector(".walletModal");
      var modalContent = document.querySelector(".modal-content");

      // Check if the click occurred outside of modal-content but inside walletModal
      if (
        !modalContent.contains(event.target) &&
        walletModal.contains(event.target)
      ) {
        // Click occurred outside of modal-content but inside walletModal
        // Your code to handle this scenario goes here
        closeModal();
      }
    });
  }, []);

  return (
    <>
      <div
        className=" fade show place-content-center walletModal fixed top-0 left-0 z-50 h-[100%] w-[100%] overflow-y-auto overflow-x-hidden outline-0"
        id="walletModal"
        style={{ display: "none", overflow: "visible" }}
      >
        <div className="modal-dialog max-w-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="walletModalLabel">
                Connect your wallet
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  closeModal();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-6 w-6 fill-jacarta-700 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                </svg>
              </button>
            </div>
            <div className="modal-body p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0"
                y="0"
                viewBox="0 0 318.6 318.6"
                className="mb-4 inline-block h-8 w-8"
              >
                <path
                  fill="#e2761b"
                  stroke="#e2761b"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M274.1 35.5l-99.5 73.9L193 65.8z"
                ></path>
                <path
                  fill="#e4761b"
                  stroke="#e4761b"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z"
                ></path>
                <path
                  className="st1"
                  d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5zm111.3 0l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5l33.9 16.5-4.7-39.3z"
                ></path>
                <path
                  d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3zm-105 0l31.5 14.9-.2-9.3 2.5-22.1z"
                  fill="#d7c1b3"
                  stroke="#d7c1b3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M138.8 193.5l-28.2-8.3 19.9-9.1zm40.9 0l8.3-17.4 20 9.1z"
                  fill="#233447"
                  stroke="#233447"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M106.8 247.4l4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"
                  fill="#cd6116"
                  stroke="#cd6116"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M87.8 162.1l23.6 46-.8-22.9zm120.3 23.1l-1 22.9 23.7-46zm-64-20.6l-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0l-2.7 18 1.2 45 6.7-34.1z"
                  fill="#e4751f"
                  stroke="#e4751f"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#f6851b"
                  stroke="#f6851b"
                  d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z"
                ></path>
                <path
                  fill="#c0ad9e"
                  stroke="#c0ad9e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"
                ></path>
                <path
                  fill="#161616"
                  stroke="#161616"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M177.9 230.9l-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"
                ></path>
                <path
                  d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"
                  fill="#763d16"
                  stroke="#763d16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  fill="#f6851b"
                  stroke="#f6851b"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z"
                ></path>
              </svg>
              <div className="text-center dark:text-white">
                You don't have MetaMask in your browser, please download it from{" "}
                <a
                  href="https://metamask.io/"
                  className="text-accent"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  MetaMask
                </a>
              </div>
            </div>
            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                >
                  Get Metamask
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="walletModalBackdrop"
        onClick={() => {
          closeModal();
        }}
        className="modal-backdrop fade show"
        style={{ display: "none" }}
      ></div>
    </>
  );
}
