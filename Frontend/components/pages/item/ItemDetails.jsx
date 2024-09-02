"use client";
import Tabs from "./Tabs";
import { allItems } from "@/data/item";
import Image from "next/image";
import Link from "next/link";
import Timer from "./Timer";

//core
import { useCallback, useEffect, useRef, useState } from "react";

//function
import { findOwners } from "@/actions/axios/user.axios";
import { Token_Info_Func } from "@/actions/axios/nft.axios";
import ImgAudVideo from "@/components/common/imgvdo";
import Config from "@/Config/config";
import { address_showing, isEmpty } from "@/actions/common";

//npm
import { useSelector } from "react-redux";

//models
import BidModal from "@/components/modals/BidModal";
import BuyModal from "@/components/modals/BuyModal";
import PlaceOrder from "@/components/modals/PlaceOrder";
import ReportModal from "@/components/modals/ReportModal";
import ShareModal from "@/components/modals/ShareModal";
import CancelBid from "@/components/modals/CancelBid";
import AcceptBid from "@/components/modals/AcceptBid";
import Cancel from '@/components/modals/cancel'

export default function ItemDetails({ params }) {
  const Contract = params?.details[0];
  const Owner = params?.details[1];
  const Id = params?.details[2];
  const item = {};
  //Model Buttons Ref
  const bidnow = useRef(null);
  const buynow = useRef(null);
  const cancel = useRef(null);
  const onsale = useRef(null);
  const accept = useRef(null);
  const cancelbid = useRef(null);
  const share = useRef(null);
  const report = useRef(null);

  const userDate = useSelector((state) => state.LoginReducer.User.payload);
  const [TabName, SetTabName] = useState("All");
  const [Tokens, SetTokens] = useState({
    All: {
      loader: true,
      page: 1,
      list: [],
      owner: {},
      myBid: {},
      highbid: {},
      myowner: {},
    },
  });
  const [Tokens_Detail, SetTokens_Detail] = useState({});
  const [Explores, SetExplore] = useState([]);
  const [InfoDetail, SetInfoDetail] = useState({});
  const [OpenPopup, SetOpenPopup] = useState("");
  const [SendDet, SetSendDet] = useState({});
  const [BtnData, SetBtnData] = useState("start");
  const { accountAddress } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );
  var [moreprops, setMoreprops] = useState("");
  const [text, setText] = useState("");
  var LikeForwardRef = useRef();
  const [LikedTokenList, setLikedTokenList] = useState([]);
  const [likedisable, SetLikeDisable] = useState(true);
  const [btn, setbtn] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [LoaderTab, setLoaderTab] = useState(false);

  console.log("Tokens_Detail-->", Tokens_Detail,Tokens["All"]?.owner?.PutOnSaleType ,"Tokens_Detail?.ContractType",Tokens_Detail?.ContractType,"Tokens[TabName]?.myowner?.WalletAddress",Tokens[TabName]?.myowner,"Tokens[TabName]",Tokens[TabName]);
  console.log("Tokens_Detail-->", Tokens_Detail);
  useEffect(() => {
    setLoader(true);
    findOwner();
  }, [accountAddress, Contract, Owner, Id]);
  useEffect(() => {
    if (typeof Tokens[TabName] == "undefined") {
      Tokens[TabName] = { page: 1, list: [], loader: false };
      SetTokens(Tokens);
      Explore(1, TabName);
    } else setLoaderTab(false);
  }, [TabName, Contract, Owner, Id, accountAddress]);
  const findOwner = async () => {
    var Resp = await findOwners({
      NFTCreator: Owner,
      ContractAddress: Contract,
      NFTId: Id,
    });

    if (Resp.success === "success") {
      // console.log("come ah");
      Explore();
    }
    //  else if (state?.data && Resp.success === "error") {
    //   if (state?.data?.metadata?.animation_url) {
    //     var Response = await axios.get(state.data.metadata.animation_url)
    //     state.data.type = (Response.headers['content-type']).includes('image') ? "image" : (Response.headers['content-type']).includes('video') ? "video" : "audio"
    //   }
    //   SetInfoDetail(state.data);
    //   setLoader(false);
    // }
    else {
      Explore();
    }
  };
  let renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Auction Completed!</span>;
    } else {
      return (
        <>
          <div className="d-flex justify-content-center">
            <div className="equal_divs_time">
              <p className="dayy">{formatTime(days)} </p>
              <p className="dayss">Days </p>
            </div>
            <div className="equal_divs_time">
              <p className="dayy">:</p>
            </div>
            <div className=" equal_divs_time">
              <p className="dayy">{formatTime(hours)}</p>
              <p className="dayss">Hours </p>
            </div>
            <div className="equal_divs_time">
              <p className="dayy">:</p>
            </div>
            <div className=" equal_divs_time">
              <p className="dayy">{formatTime(minutes)}</p>
              <p className="dayss">Minutes</p>
            </div>
            <div className="equal_divs_time">
              <p className="dayy">:</p>
            </div>
            <div className=" equal_divs_time">
              <p className="dayy"> {formatTime(seconds)}</p>
              <p className="dayss">Seconds</p>
            </div>
          </div>
        </>
      );
    }
  };

  let formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  useEffect(() => {
    if (OpenPopup == "Bid") bidnow.current.click();
    if (OpenPopup == "createorder") onsale.current.click();
    if (OpenPopup == "Buy") buynow.current.click();
    if (OpenPopup == "CancelBid") cancelbid.current.click();
    if (OpenPopup == "Cancel") cancel.current.click();
    if (OpenPopup == "Accept") accept.current.click();
    if (OpenPopup == "Share") share.current.click();
    if (OpenPopup == "Report") report.current.click();
    closePop();
  }, [OpenPopup]);
  console.log("OpenPopup-->", OpenPopup);
  const POPUPACTION = useCallback(
    async (text, data, item) => {
      setbtn(true);
      console.log("Buy is Calling", text, data, item);
      if (accountAddress) {
        // var datas = await switchnetwork(Network)

        // if (datas.status == true) {
        // dispatch(datas.data)
        // dispatch(datas.currency)
        if (data == "Accept") {
          // (async () => {
            // let Statu = await ContractCall.GetApproveStatus(
            //   Tokens_Detail.ContractType == 721 ||
            //     Tokens_Detail.ContractType == "721"
            //     ? "Single"
            //     : "Multiple",
            //   Tokens_Detail.ContractAddress
            // );
            // if (Statu == false || Statu == "error") {
            //   toast.warn("Need To Approve");
            //   SetBtnData("open");
            //   SetOpenPopup(data);
            //   SetSendDet(item);
            // } else {
              SetBtnData("error");
              SetOpenPopup(data);
              SetSendDet(item);
            // }
          // })();
        } else {
          setText(text);
          SetOpenPopup(data);
          SetSendDet(item);
        }
        // } else {
        //   toast.error(data.msg)
        // }
      } else {
        if (data === "Share") {
          setText(text);
          SetOpenPopup(data);
          SetSendDet(item);
        } else
          toast.error(" log in to connect to the wallet ", {
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
          });
      }
    },

    [OpenPopup, accountAddress, Tokens_Detail.ContractAddress]
  );
  console.log("Tokens-->", Tokens);
  const Explore = async (data, tab) => {
    var page = data ? data : Tokens[TabName]?.page;
    var SendDATA = {
      TabName: tab ? tab : TabName,
      limit: 4,
      Owner: Owner,
      page: page ?? 1,
      from: "info",
      Contract: Contract,
      Id: Id.toString(),
      MyAdd: accountAddress,
    };
    console.log("Account Address Checing", SendDATA, accountAddress);
    let Resp = await Token_Info_Func(SendDATA);
    console.log(
      "Owners List",
      // JSON.stringify(
        Resp.token.data[0].Current_Owner
      // )
    );
    let cur_owner = JSON.stringify(Resp.token.data[0].Current_Owner);
    // Resp.token.data[0].Current_Owner = JSON.parse(Resp.token.data[0].Current_Owner)
    if (Resp?.token?.success == "success" && JSON.parse(cur_owner).length > 0) {
      console.log("TOKENDATA", Resp.token.data[0]);
      if (TabName == "All") {
        SetTokens_Detail({
          ...Resp.token.data[0],
          Current_Owner: JSON.parse(cur_owner),
        });
        SetExplore(Resp.Explore.data);
        setMoreprops(Resp.token.data[0].NFTProperties?.length);
        // tabChange("bid")
      }
      SetTokens({
        ...Tokens,
        ...{
          [TabName]: {
            list:
              SendDATA.page == 1
                ? [
                    ...(TabName == "owner"
                      ? Resp.token.data[0].tokenowners_list
                      : TabName == "bid"
                      ? Resp.Bid.data
                      : []),
                  ]
                : [
                    ...Tokens[TabName].list,
                    ...(TabName == "owner"
                      ? SendDATA.page == 1
                        ? Resp.token.data[0].tokenowners_list
                        : [
                            Tokens[TabName],
                            ...Resp.token.data[0].tokenowners_list,
                          ]
                      : TabName == "bid"
                      ? SendDATA.page == 1
                        ? Resp.Bid.data
                        : [Tokens[TabName], ...Resp.Bid.data]
                      : []),
                  ],
            loader:
              Resp.token.Count ==
              Tokens[TabName]?.list?.length + Resp.token.data.length
                ? false
                : true,
            page: Tokens[TabName].page,
            owner:
              TabName == "All" ? JSON.parse(cur_owner)[0] : Tokens["All"].owner,
            myowner:
              TabName == "All"
                ? Resp.token.data[0].myowner?.[0]
                : Tokens["All"].myowner,
            myBid: Resp?.myBid?.data?.pop(),
            highbid: Resp?.highBid?.data[0],
          },
        },
      });
    } else {
      SetTokens({ [TabName]: { loader: true, page: 1, list: [] } });
    }
    setTimeout(() => {
      setLoaderTab(false);
      setLoader(false);
    }, 2000);
  };
  const tabChange = (newValue) => {
    setLoaderTab(true);
    SetTabName(newValue);
  };

  const closePop = () => {
    SetOpenPopup("");
    setbtn(false);
  };
  const LikeAction = async () => {
    if (accountAddress) {
      if (likedisable) {
        SetLikeDisable(false);
        var check = await LikeForwardRef.current.hitLike(Tokens_Detail);
        toast.success("you " + check + "d this token", {
          autoClose: 500,
          closeButton: true,
          closeOnClick: true,
        });
        if (check == "like") {
          // Tokens_Detail?.likecount

          SetTokens_Detail({
            ...Tokens_Detail,
            ...{ likecount: Tokens_Detail.likecount + 1 },
          });
        } else if (check == "unlike") {
          SetTokens_Detail({
            ...Tokens_Detail,
            ...{ likecount: Tokens_Detail.likecount - 1 },
          });
        }
        SetLikeDisable(true);
      }
    } else
      toast.error("Connect Wallet", {
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
      });
  };

  function LikeList(data) {
    setLikedTokenList(data);
  }

  var Seemore = () => {
    setMoreprops(Tokens_Detail?.NFTProperties?.length);
  };

  return (
    <>
      <section className="relative pt-12 pb-24 lg:py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <Image
            width={1920}
            height={789}
            src="/img/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          {/* Item */}
          <div className="md:flex md:flex-wrap">
            {/* Image */}
            <figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2">
              {!isEmpty(InfoDetail) ? (
                InfoDetail?.CompressedFile?.includes(".mp3") ? (
                  <ImgAudVideo
                    file={`${Config.IMG_URL}/nft/${InfoDetail?.NFTCreator}/Compressed/NFT/${InfoDetail?.CompressedFile}`}
                    origFile={`${Config.IMG_URL}/nft/${InfoDetail?.NFTCreator}/Original/NFT/${InfoDetail?.NFTOrginalImage}`}
                    thumb={`${Config.IMG_URL}/nft/${InfoDetail.NFTCreator}/Compressed/NFT_THUMB/${InfoDetail?.CompressedThumbFile}`}
                    type={
                      InfoDetail?.CompressedFile
                        ? InfoDetail?.CompressedFile?.includes(".webp") ||
                          InfoDetail?.CompressedFile?.includes(".png")
                          ? "image"
                          : InfoDetail?.CompressedFile.includes(".webm")
                          ? "video"
                          : "audio"
                        : InfoDetail?.CompressedFile
                    }
                    width={540}
                    height={670}
                    data_bs_toggle="modal"
                    data_bs_target="#imageModal"
                  />
                ) : (
                  <iframe
                    style={{
                      background: "url(" + InfoDetail?.Image + ")",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100% 100%",
                      maxHeight: 288,
                      minHeight: 288,
                      minWidth: "100%",
                      maxWidth: "100%",
                      borderRadius: 15,
                    }}
                    width={540}
                    height={670}
                    title="Iframe Example"
                    id="myiFrame"
                  ></iframe>
                )
              ) : (
                <ImgAudVideo
                  file={`${Config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Original/NFT/${Tokens_Detail?.NFTOrginalImage}`}
                  type={
                    Tokens_Detail.CompressedFile
                      ? Tokens_Detail.CompressedFile?.includes(".webp") ||
                        Tokens_Detail.CompressedFile?.includes(".png")
                        ? "image"
                        : Tokens_Detail.CompressedFile.includes(".webm")
                        ? "video"
                        : "audio"
                      : Tokens_Detail.CompressedFile
                  }
                  thumb={`${Config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/NFT_THUMB/${Tokens_Detail.CompressedThumbFile}`}
                  from="info"
                  origFile={`${Config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Original/NFT/${Tokens_Detail.OriginalFile}`}
                  width={540}
                  height={670}
                  data_bs_toggle="modal"
                  data_bs_target="#imageModal"
                />
              )}
              {/* <Image
                width={540}
                height={670}
                src={"/img/products/item_single_large.jpg"}
                alt="item"
                className="cursor-pointer rounded-2.5xl w-[100%]"
                data-bs-toggle="modal"
                data-bs-target="#imageModal"
              /> */}

              {/* Modal */}
              <div
                className="modal fade"
                id="imageModal"
                tabIndex="-1"
                aria-hidden="true"
              >
                <div className="modal-dialog !my-0 flex h-full items-center justify-center p-4">
                  {!isEmpty(InfoDetail) ? (
                    InfoDetail?.CompressedFile?.includes(".mp3") ? (
                      <ImgAudVideo
                        file={`${Config.IMG_URL}/nft/${InfoDetail?.NFTCreator}/Compressed/NFT/${InfoDetail?.CompressedFile}`}
                        origFile={`${Config.IMG_URL}/nft/${InfoDetail?.NFTCreator}/Original/NFT/${InfoDetail?.NFTOrginalImage}`}
                        thumb={`${Config.IMG_URL}/nft/${InfoDetail.NFTCreator}/Compressed/NFT_THUMB/${InfoDetail?.CompressedThumbFile}`}
                        type={
                          InfoDetail?.CompressedFile
                            ? InfoDetail?.CompressedFile?.includes(".webp") ||
                              InfoDetail?.CompressedFile?.includes(".png")
                              ? "image"
                              : InfoDetail?.CompressedFile.includes(".webm")
                              ? "video"
                              : "audio"
                            : InfoDetail?.CompressedFile
                        }
                        width={787}
                        height={984}
                      />
                    ) : (
                      <iframe
                        style={{
                          background: "url(" + InfoDetail?.Image + ")",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "100% 100%",
                          maxHeight: 288,
                          minHeight: 288,
                          minWidth: "100%",
                          maxWidth: "100%",
                          borderRadius: 15,
                        }}
                        width={787}
                        height={984}
                        title="Iframe Example"
                        id="myiFrame"
                      ></iframe>
                    )
                  ) : (
                    <ImgAudVideo
                      file={`${Config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Original/NFT/${Tokens_Detail?.NFTOrginalImage}`}
                      type={
                        Tokens_Detail.CompressedFile
                          ? Tokens_Detail.CompressedFile?.includes(".webp") ||
                            Tokens_Detail.CompressedFile?.includes(".png")
                            ? "image"
                            : Tokens_Detail.CompressedFile.includes(".webm")
                            ? "video"
                            : "audio"
                          : Tokens_Detail.CompressedFile
                      }
                      thumb={`${Config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/NFT_THUMB/${Tokens_Detail.CompressedThumbFile}`}
                      from="info"
                      origFile={`${Config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Original/NFT/${Tokens_Detail.OriginalFile}`}
                      width={787}
                      height={984}
                    />
                  )}
                  {/* <Image
                    width={787}
                    height={984}
                    src="/img/products/item_single_full.jpg"
                    alt="item"
                  /> */}
                </div>

                <button
                  type="button"
                  className="btn-close absolute top-6 right-6"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="h-6 w-6 fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                  </svg>
                </button>
              </div>
              {/* end modal */}
            </figure>

            {/* Details */}
            <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
              {/* Collection / Likes / Actions */}
              <div className="mb-3 flex">
                {/* Collection */}
                <div className="flex items-center text-sm font-bold text-accent">
                  {/* <Link
                    href={`/collections`}
                    className="mr-2 text-sm font-bold text-accent"
                  > */}
                  {!isEmpty(InfoDetail) ? (
                    <>{InfoDetail?.NFTName}</>
                  ) : (
                    <>{Tokens_Detail?.NFTName}</>
                  )}
                  {/* </Link> */}
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green dark:border-jacarta-600"
                    data-tippy-content="Verified Collection"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="h-[.875rem] w-[.875rem] fill-white"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                    </svg>
                  </span>
                </div>

                {/* Likes / Actions */}
                <div className="ml-auto flex space-x-2">
                  <div className="flex items-center space-x-1 rounded-xl border border-jacarta-100 bg-white py-2 px-4 dark:border-jacarta-600 dark:bg-jacarta-700">
                    <span
                      className="js-likes relative cursor-pointer before:absolute before:h-4 before:w-4 before:bg-[url('../img/heart-fill.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-0"
                      data-tippy-content="Favorite"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-4 w-4 fill-jacarta-500 hover:fill-red dark:fill-jacarta-200 dark:hover:fill-red"
                      >
                        <path fill="none" d="M0 0H24V24H0z"></path>
                        <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z"></path>
                      </svg>
                    </span>
                    <span className="text-sm dark:text-jacarta-200">188</span>
                  </div>

                  {/* Actions */}
                  <div className="dropdown rounded-xl border border-jacarta-100 bg-white hover:bg-jacarta-100 dark:border-jacarta-600 dark:bg-jacarta-700 dark:hover:bg-jacarta-600">
                    <a
                      href="#"
                      className="dropdown-toggle inline-flex h-10 w-10 items-center justify-center text-sm"
                      role="button"
                      id="collectionActions"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <svg
                        width="16"
                        height="4"
                        viewBox="0 0 16 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-jacarta-500 dark:fill-jacarta-200"
                      >
                        <circle cx="2" cy="2" r="2"></circle>
                        <circle cx="8" cy="2" r="2"></circle>
                        <circle cx="14" cy="2" r="2"></circle>
                      </svg>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-end z-10 hidden min-w-[200px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl dark:bg-jacarta-800"
                      aria-labelledby="collectionActions"
                    >
                      <button className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600">
                        Refresh Metadata
                      </button>
                      <button
                        onClick={() => SetOpenPopup("Share")}
                        className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => SetOpenPopup("Report")}
                        className="block w-full rounded-xl px-5 py-2 text-left font-display text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="mb-4 font-display text-4xl font-semibold text-jacarta-700 dark:text-white">
                {!isEmpty(InfoDetail) ? (
                  InfoDetail?.NFTName?.length > 15 ? (
                    <>{InfoDetail?.NFTName.slice(0, 15)}...</>
                  ) : (
                    InfoDetail?.NFTName
                  )
                ) : Tokens_Detail?.NFTName?.length > 15 ? (
                  <>{Tokens_Detail?.NFTName.slice(0, 15)}...</>
                ) : (
                  Tokens_Detail?.NFTName
                )}
              </h1>

              <div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
                {!isEmpty(Tokens[TabName]?.highbid) && (
                  <div className="flex items-center">
                    <span className="-ml-1" data-tippy-content="ETH">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0"
                        y="0"
                        viewBox="0 0 1920 1920"
                        // xml:space="preserve"
                        className="mr-1 h-4 w-4"
                      >
                        <path
                          fill="#8A92B2"
                          d="M959.8 80.7L420.1 976.3 959.8 731z"
                        ></path>
                        <path
                          fill="#62688F"
                          d="M959.8 731L420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z"
                        ></path>
                        <path
                          fill="#454A75"
                          d="M959.8 1295.4l539.8-319.1L959.8 731z"
                        ></path>
                        <path
                          fill="#8A92B2"
                          d="M420.1 1078.7l539.7 760.6v-441.7z"
                        ></path>
                        <path
                          fill="#62688F"
                          d="M959.8 1397.6v441.7l540.1-760.6z"
                        ></path>
                      </svg>
                    </span>

                    <span className="text-sm font-medium tracking-tight text-green">
                      {Tokens[TabName]?.highbid?.TokenBidAmt}{" "}
                      {Tokens[TabName]?.highbid?.CoinName}
                    </span>

                    <span className="ms-3 text-sm text-jacarta-400 dark:text-jacarta-300">
                      Highest bid
                    </span>
                  </div>
                )}
                <span className="text-sm text-jacarta-400 dark:text-jacarta-300">
                  {InfoDetail?.NFTBalance
                    ? InfoDetail?.NFTBalance
                    : Tokens[TabName]?.owner?.NFTBalance}
                  /
                  {isEmpty(InfoDetail)
                    ? Tokens_Detail?.NFTQuantity
                    : InfoDetail?.NFTQuantity}{" "}
                  available
                </span>
              </div>

              <p className="mb-10 dark:text-jacarta-300">
                {isEmpty(InfoDetail)
                  ? Tokens_Detail?.NFTDescription
                  : InfoDetail?.NFTDescription}
              </p>

              {/* Creator / Owner */}
              <div className="mb-8 flex flex-wrap">
                <div className="mr-8 mb-4 flex">
                  <figure className="mr-4 shrink-0">
                    <Link
                      href={`/user/${Tokens_Detail?.Creator_CustomUrl}`}
                      className="relative block"
                    >
                      {/* {console.log('!isEmpty(Tokens_Detail) && userDate?.Creator_Profile !== ""-->',!isEmpty(Tokens_Detail) , userDate?.Creator_Profile !== "",`${Config.IMG_URL}/user/${Tokens_Detail?.Creator_WalletAddress}/profile/${Tokens_Detail?.Creator_Profile}`)} */}
                      <Image
                        width={48}
                        height={48}
                        src={
                          !isEmpty(Tokens_Detail) &&
                          Tokens_Detail?.Creator_Profile !== ""
                            ? `${Config.IMG_URL}/user/${Tokens_Detail?.Creator_WalletAddress}/profile/${Tokens_Detail?.Creator_Profile}`
                            : "/img/avatars/avatar_7.jpg"
                        }
                        alt="Creator"
                        className="rounded-2lg"
                        loading="lazy"
                      />
                      <div
                        className="absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green dark:border-jacarta-600"
                        data-tippy-content="Verified Collection"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="h-[.875rem] w-[.875rem] fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      </div>
                    </Link>
                  </figure>
                  <div className="flex flex-col justify-center">
                    <span className="block text-sm text-jacarta-400 dark:text-white">
                      Creator{" "}
                      <strong>{Tokens_Detail?.NFTRoyalty}% royalties</strong>
                    </span>
                    <Link
                      href={`/user/${Tokens_Detail?.Creator_CustomUrl}`}
                      className="block text-accent"
                    >
                      <span className="text-sm font-bold">
                        @{Tokens_Detail?.Creator_DisplayName ? Tokens_Detail?.Creator_DisplayName : address_showing(Tokens_Detail?.Creator_WalletAddress) }
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="mb-4 flex">
                  <figure className="mr-4 shrink-0">
                    <Link
                      href={`/user/${Tokens[TabName]?.owner?.CustomUrl}`}
                      className="relative block"
                    >
                      <Image
                        width={48}
                        height={48}
                        src={
                          Tokens[TabName]?.owner?.Profile &&
                          Tokens[TabName]?.owner?.Profile != ""
                            ? `${Config.IMG_URL}/user/${Tokens[TabName]?.owner?.WalletAddress}/profile/${Tokens[TabName]?.owner?.Profile}`
                            : "/img/avatars/avatar_1.jpg"
                        }
                        alt="avatar 1"
                        className="rounded-2lg"
                        loading="lazy"
                      />
                      <div
                        className="absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green dark:border-jacarta-600"
                        data-tippy-content="Verified Collection"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="h-[.875rem] w-[.875rem] fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                        </svg>
                      </div>
                    </Link>
                  </figure>
                  <div className="flex flex-col justify-center">
                    <span className="block text-sm text-jacarta-400 dark:text-white">
                      Owned by
                    </span>
                    <Link href={`/user/6`} className="block text-accent">
                      <span className="text-sm font-bold">
                        @{Tokens[TabName]?.owner?.DisplayName}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bid */}
              <div className="rounded-2lg border border-jacarta-100 bg-white p-8 dark:border-jacarta-600 dark:bg-jacarta-700">
                <div className="mb-8 sm:flex sm:flex-wrap">
                  {/* Highest bid */}

                  {/* <div className="sm:w-1/2 sm:pr-4 lg:pr-8 justify-center">
                    {!isEmpty(Tokens[TabName]?.highbid) ? (
                      <>
                        <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="text-sm text-jacarta-400 dark:text-jacarta-300">
                            Highest bid by{" "}
                          </span>
                          <Link
                            href={`/user/${Tokens[TabName]?.highbid?.CustomUrl}`}
                            className="text-sm font-bold text-accent"
                          >
                            {Tokens[TabName]?.highbid?.WalletAddress}
                          </Link>
                        </div>
                        <div className="mt-3 flex">
                          <figure className="mr-4 shrink-0">
                            <Link
                              href={`/user/${Tokens[TabName]?.highbid?.CustomUrl}`}
                              className="relative block"
                            >
                              <Image
                                width={48}
                                height={48}
                                src={
                                  isEmpty(Tokens[TabName]?.highbid?.Profile)
                                    ? "/img/avatars/avatar_4.jpg"
                                    : `${Config.IMG_URL}/user/${Tokens[TabName]?.highbid?.WalletAddress}/profile/${Tokens[TabName]?.highbid?.Profile}`
                                }
                                alt="avatar"
                                className="rounded-2lg"
                                loading="lazy"
                              />
                            </Link>
                          </figure>
                          <div>
                            <div className="flex items-center whitespace-nowrap">
                              <span className="-ml-1" data-tippy-content="ETH">
                                <svg
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  x="0"
                                  y="0"
                                  viewBox="0 0 1920 1920"
                                  className="h-5 w-5"
                                >
                                  <path
                                    fill="#8A92B2"
                                    d="M959.8 80.7L420.1 976.3 959.8 731z"
                                  ></path>
                                  <path
                                    fill="#62688F"
                                    d="M959.8 731L420.1 976.3l539.7 319.1zm539.8 245.3L959.8 80.7V731z"
                                  ></path>
                                  <path
                                    fill="#454A75"
                                    d="M959.8 1295.4l539.8-319.1L959.8 731z"
                                  ></path>
                                  <path
                                    fill="#8A92B2"
                                    d="M420.1 1078.7l539.7 760.6v-441.7z"
                                  ></path>
                                  <path
                                    fill="#62688F"
                                    d="M959.8 1397.6v441.7l540.1-760.6z"
                                  ></path>
                                </svg>
                              </span>
                              <span className="text-lg font-medium leading-tight tracking-tight text-green">
                                {Tokens[TabName]?.highbid?.TokenBidAmt}{" "}
                                {Tokens[TabName]?.highbid?.CoinName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="justify-center items-center">
                          No Bids Yet
                        </span>
                      </>
                    )}
                  </div> */}

                  {/* Countdown */}
                  {Tokens["All"]?.owner?.PutOnSaleType === "TimedAuction" && (
                    <div
                      className={`mt-4 dark:border-jacarta-600 sm:mt-0 sm:w-1/2 sm:border-l sm:border-jacarta-100 sm:pl-4 lg:pl-8 justify-center`}
                    >
                      <span className="js-countdown-ends-label text-sm text-jacarta-400 dark:text-jacarta-300">
                        {new Date(Tokens["All"]?.owner?.ClockTime) >
                        Date.now() ? (
                          <span>
                            Auction Yet to Start{" "}
                            {Math.ceil(
                              (new Date(
                                Tokens["All"]?.owner.ClockTime
                              ).getTime() -
                                new Date(Date.now()).getTime()) /
                                (1000 * 3600 * 24)
                            )}{" "}
                            Days..!
                          </span>
                        ) : new Date(Tokens["All"]?.owner?.EndClockTime) >
                          Date.now() ? (
                          <span>Auction ends in</span>
                        ) : (
                          <span>Auction Ended</span>
                        )}
                      </span>
                      {!(
                        new Date(Tokens["All"]?.owner?.ClockTime) > Date.now()
                      ) && (
                        <Timer endTime={Tokens["All"]?.owner?.EndClockTime} />
                      )}
                    </div>
                  )}
                </div>

                <div class="card-body">
                  <div className="button try">
                    {isEmpty(InfoDetail) &&
                      (Tokens_Detail?.ContractType?.toString() === "721" ? (
                        Tokens[TabName]?.myowner?.WalletAddress ==
                        accountAddress ?
                         (
                          Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "FixedPrice" ? (
                            <button
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume mb-2 transition-all hover:bg-accent-dark"
                              disabled={btn}
                              onClick={() =>
                                POPUPACTION(
                                  "dummy",
                                  "Cancel",
                                  Tokens[TabName]?.myowner
                                )
                              }
                            >
                              Cancel Now
                            </button>
                          ) : Tokens[TabName]?.myowner?.PutOnSaleType ==
                              "NotForSale" ||
                            Tokens[TabName]?.myowner?.PutOnSaleType ==
                              "UnlimitedAuction" ||
                            (Tokens[TabName]?.myowner?.PutOnSaleType ==
                              "TimedAuction" &&
                              new Date(
                                Tokens[TabName]?.myowner.EndClockTime
                              ).getTime() < Date.now()) ? (
                            <button
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              disabled={btn}
                              onClick={() => {
                                POPUPACTION(
                                  "dummy",
                                  "createorder",
                                  Tokens[TabName]?.myowner
                                );
                              }}
                            >
                              Put on Sale
                            </button>
                          ) : Tokens[TabName]?.myowner?.PutOnSaleType ==
                              "TimedAuction" &&
                            new Date(Tokens[TabName]?.myowner?.ClockTime) >
                              Date.now() ? (
                            <a href="#" className="tf-button">
                              {/* new Date(Tokens[TabName]?.myowner?.EndClockTime).getTime() > Date.now() */}
                              Auction Not Started Yet
                            </a>
                          ) : (
                            new Date(
                              Tokens[TabName]?.myowner?.EndClockTime
                            ).getTime() > Date.now() && (
                              <a href="#" className="tf-button text-center">
                                Auction is Live Now
                              </a>
                            )
                          )
                        ) : (
                          Tokens[TabName]?.owner &&
                          Tokens[TabName]?.owner?.WalletAddress !=
                            accountAddress &&
                          (Tokens[TabName]?.owner?.PutOnSaleType ==
                          "FixedPrice" ?
                           (
                            <button
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              disabled={btn}
                              onClick={() =>
                                POPUPACTION(
                                  "dummy",
                                  "Buy",
                                  Tokens[TabName]?.owner
                                )
                              }
                            >
                              Buy Now
                            </button>
                          ) :
                           (
                            Tokens[TabName]?.myBid?.WalletAddress ==
                              accountAddress && (
                              <button
                                className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                                disabled={btn}
                                onClick={() =>
                                  POPUPACTION(
                                    "dummy",
                                    "CancelBid",
                                    Tokens[TabName]?.myBid
                                  )
                                }
                              >
                                {console.log(
                                  "biiiddds",
                                  Tokens[TabName],
                                  Tokens[TabName]?.myBid
                                )}
                                Cancel Bid
                              </button>
                            )
                          )
                        )
                        )
                      ) : 
                      Tokens[TabName]?.myowner?.WalletAddress ==
                        Tokens[TabName]?.owner?.WalletAddress ? 
                        (
                        <>
                          {Tokens[TabName]?.myowner?.PutOnSaleType ==
                            "FixedPrice" && 
                            (
                            <button
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all mb-2 hover:bg-accent-dark"
                              disabled={btn}
                              onClick={() =>
                                POPUPACTION(
                                  "dummy",
                                  "Cancel",
                                  Tokens[TabName]?.myowner
                                )
                              }
                            >
                              Cancel Now
                            </button>
                          )
                          }
                          {Tokens[TabName]?.myBid?.WalletAddress ==
                          accountAddress ? 
                          (
                            <button
                              disabled={btn}
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              onClick={() =>
                                POPUPACTION(
                                  "dummy",
                                  "Bid",
                                  Tokens[TabName]?.myBid
                                )
                              }
                            >
                              Edit Bid
                            </button>
                          ) 
                          : 
                          (
                            Tokens[TabName]?.myowner?.WalletAddress !=
                              Tokens[TabName]?.owner?.WalletAddress && (
                              <button
                                disabled={btn}
                                className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                                onClick={() => POPUPACTION("dummy", "Bid", {})}
                              >
                                Bid Now
                              </button>
                            )
                          )
                          }
                        </>
                      ) 
                      : 
                      Tokens[TabName]?.owner?.PutOnSaleType ===
                        "FixedPrice" ? 
                        (
                        <button
                          className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                          disabled={btn}
                          onClick={() =>
                            POPUPACTION("dummy", "Buy", Tokens[TabName].owner)
                          }
                        >
                          Buy Now
                        </button>
                      ) 
                      :
                       (
                        Tokens[TabName]?.myBid?.WalletAddress ==
                          accountAddress && 
                          (
                          <button
                            className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                            disabled={btn}
                            onClick={() =>
                              POPUPACTION(
                                "dummy",
                                "CancelBid",
                                Tokens[TabName]?.myBid
                              )
                            }
                          >
                            Cancel Bid
                          </button>
                        )
                      )
                      )
                      }

                    {/* {isEmpty(InfoDetail) &&
                      (Tokens_Detail?.ContractType?.toString() === "721" ? (
                        Tokens[TabName]?.myowner?.WalletAddress ==
                        accountAddress ? (
                          Tokens[TabName]?.myowner?.PutOnSaleType ==
                            "FixedPrice" && (
                            <button
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              disabled={btn}
                              onClick={() =>
                                POPUPACTION(
                                  "Change Price",
                                  "createorder",
                                  Tokens[TabName]?.myowner
                                )
                              }
                            >
                              Change Price
                            </button>
                          )
                        ) : (
                          Tokens[TabName]?.owner?.WalletAddress !=
                            accountAddress &&
                          (Tokens[TabName]?.owner?.PutOnSaleType ==
                            "TimedAuction" &&
                          new Date(
                            Tokens[TabName].owner.EndClockTime
                          )?.getTime() < Date.now() ? (
                            <a href="#" className="tf-button">
                              Auction End
                            </a>
                          ) : Tokens[TabName]?.highbid?.WalletAddress !=
                              accountAddress &&
                            Tokens[TabName]?.owner?.WalletAddress ==
                              accountAddress ? (
                            <button
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              onClick={() =>
                                POPUPACTION(
                                  "dummy",
                                  "Accept",
                                  Tokens[TabName]?.highbid
                                )
                              }
                            >
                              Accept
                            </button>
                          ) : Tokens[TabName]?.myBid?.WalletAddress ==
                            accountAddress ? (
                            <button
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              disabled={btn}
                              onClick={() =>
                                POPUPACTION(
                                  "dummy",
                                  "Bid",
                                  Tokens[TabName]?.myBid
                                )
                              }
                            >
                              Edit Bid
                            </button>
                          ) : new Date(Tokens["All"]?.owner?.EndClockTime) >
                              Date.now() &&
                            new Date(Tokens["All"]?.owner?.ClockTime) >
                              Date.now() ? (
                            <button className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark">
                              Not Started Yet
                            </button>
                          ) : (
                            <button
                              disabled={btn}
                              className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              onClick={() => POPUPACTION("dummy", "Bid", {})}
                            >
                              Bid Now
                            </button>
                          ))
                        )
                      ) : Tokens[TabName]?.myowner?.WalletAddress ==
                        Tokens[TabName]?.owner?.WalletAddress ? (
                        Tokens[TabName]?.owner?.PutOnSaleType ==
                        "FixedPrice" ? (
                          <button
                            className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                            disabled={btn}
                            onClick={() =>
                              POPUPACTION(
                                "Change Price",
                                "createorder",
                                Tokens[TabName]?.myowner
                              )
                            }
                          >
                            Change Price
                          </button>
                        ) : (
                          <button
                            className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                            disabled={btn}
                            onClick={() => {
                              POPUPACTION(
                                "dummy",
                                "createorder",
                                Tokens[TabName]?.myowner
                              );
                            }}
                          >
                            Put on Sale
                          </button>
                        )
                      ) : Tokens[TabName]?.owner?.WalletAddress !=
                          accountAddress &&
                        Tokens[TabName]?.highbid?.WalletAddress !=
                          accountAddress &&
                        Tokens[TabName]?.owner?.WalletAddress ==
                          accountAddress ? (
                        <button
                          className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                          disabled={btn}
                          onClick={() =>
                            POPUPACTION(
                              "dummy",
                              "Accept",
                              Tokens[TabName]?.highbid
                            )
                          }
                        >
                          Accept
                        </button>
                      ) : Tokens[TabName]?.myBid?.WalletAddress ==
                        accountAddress ? (
                        <button
                          className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                          disabled={btn}
                          onClick={() =>
                            POPUPACTION("dummy", "Bid", Tokens[TabName]?.myBid)
                          }
                        >
                          Edit Bid
                        </button>
                      ) :
                       (
                        <button
                          className="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                          disabled={btn}
                          onClick={() => POPUPACTION("dummy", "Bid", {})}
                        >
                          Bid Now{" "}
                        </button>
                      ))} */}
                  </div>
                </div>
 
                {/* Button Sections */}
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#placeBidModal"
                  className="hidden"
                  ref={bidnow}
                >
                  Place Bid
                </a>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#reportModal"
                  className="hidden"
                  ref={report}
                >
                  Report
                </a>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#ShareModal"
                  className="hidden"
                  ref={share}
                >
                  Share
                </a>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#Acceptbidmodel"
                  className="hidden"
                  ref={accept}
                >
                  Accept
                </a>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#buyNowModal"
                  className="hidden"
                  ref={buynow}
                >
                  Buy now
                </a>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#LowerModal"
                  className="hidden"
                  ref={onsale}
                >
                  onsale
                </a>
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#cancel"
                  className="hidden"
                  ref={cancel}
                >
                  cancel
                </a>

              </div>
              {/* end bid */}
            </div>
            {/* end details */}
          </div>
          <AcceptBid 
          closePop={closePop}
          owner={Tokens[TabName]?.myowner}
          bidder={SendDet}
          OpenPopup={OpenPopup}
          bid={SendDet}
          approvestatus={BtnData}
          item={{
            NFTId: Tokens_Detail.NFTId,
            NFTName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            NFTRoyalty: Tokens_Detail.NFTRoyalty,
            NFTCreator: Tokens_Detail.NFTCreator,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            Category: Tokens_Detail.Category,
          }}
          />

          <Cancel 
          OpenPopup={OpenPopup}
          closePop={closePop}
          owner={Tokens[TabName]?.myowner}
          item={{
            NFTId: Tokens_Detail.NFTId,
            NFTName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            NFTRoyalty: Tokens_Detail.NFTRoyalty,
            NFTCreator: Tokens_Detail.NFTCreator,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            Category: Tokens_Detail.Category,
          }}
          />

          <BidModal
            closePop={closePop}
            owner={Tokens[TabName]?.owner}
            bidder={!isEmpty(SendDet) ? SendDet : Tokens[TabName]?.myBid}
            bid={Tokens[TabName]?.highbid}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
            }}
          />
          <BuyModal
            closePop={closePop}
            owner={SendDet}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
              currentOwner : Tokens_Detail.Current_Owner?.[0]
            }}
          />
          <PlaceOrder
          closePop={closePop}
            text={text}
            owner={SendDet}
            file={`${Config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/NFT/${Tokens_Detail.CompressedFile}`}
            type={
              Tokens_Detail.CompressedFile
                ? Tokens_Detail.CompressedFile?.includes(".webp")
                  ? "image"
                  : Tokens_Detail.CompressedFile.includes(".webm")
                  ? "video"
                  : "audio"
                : Tokens_Detail.CompressedFile
            }
            thumb={Tokens_Detail.CompressedThumbFile}
            item={{
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              OriginalImage: Tokens_Detail.NFTOrginalImage,
              CompressedFile: Tokens_Detail.CompressedFile,
              CompressedThumbFile: Tokens_Detail.CompressedThumbFile,
              OriginalFile: Tokens_Detail.NFTOrginalImageIpfs,
              NFTCreator: Tokens_Detail.NFTCreator,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTQuantity: Tokens_Detail.NFTQuantity,
              Category: Tokens_Detail.Category,
              NFTPrice: Tokens[TabName]?.myowner?.NFTPrice,
              CoinName: Tokens[TabName]?.myowner?.CoinName,
              PutOnSaleType: "FixedPrice",
              PutOnSale: true,
              NFTId : Tokens_Detail.NFTId
            }}
          />
          <ReportModal
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
            }}
          />
          <ShareModal
            title={`${Tokens_Detail.NFTName}  NFT`}
            url={`${Config.FRONT_URL}/info/${Tokens_Detail.CollectionNetwork}/${Tokens_Detail.ContractAddress}/${SendDet.NFTOwner}/${Tokens_Detail.NFTId}`}
            quote={`${Tokens_Detail.NFTName} NFT`}
          />
          <CancelBid
            bidder={SendDet}
            owner={Tokens[TabName]?.owner}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
            }}
          />
          {/* Tabs */}
          {console.log('Tokens["bid"]?.list-->',Tokens["bid"]?.list)}
          <Tabs offers={
            (Tokens["bid"]?.list?.length > 0 ||  Tokens["bid"]?.list?.filter((val)=> val.WalletAddress != Tokens[TabName]?.owner?.NFTOwner).length > 0 )?
            Tokens["bid"]?.list?.filter((val)=> val.WalletAddress != Tokens[TabName]?.owner?.NFTOwner)
            :
            Tokens["bid"]?.list
           }
           properties={
            Tokens_Detail?.NFTProperties
           } 
           NFTId={isEmpty(InfoDetail) ? Tokens_Detail?.NFTId : InfoDetail?.NFTId}
           POPUPACTION={(data1,data2,data3)=>POPUPACTION(data1,data2,data3)}
           />
          {/* end tabs */}
        </div>
      </section>
    </>
  );
}
