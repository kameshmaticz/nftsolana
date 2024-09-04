/* eslint-disable react/no-unescaped-entities */
import dummyimg from "@/public/img/login.jpg";
import Image from "next/image";
import Select from "react-select";

//NPM
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { useRouter } from "next/navigation"

//FUNCTION
import Config from "@/Config/config";
import ImgAudVideo from "../common/imgvdo";
import { CreateOrder } from "@/actions/axios/nft.axios";
import { toast } from "react-toastify";
import { NumANdDotOnly, isEmpty } from "@/actions/common";
import solanacontract from '@/utlis/hooks/solanaContractHook'
import { useRef } from "react";
const collcections = [
  {
    id: 1,
    name: "Cake",
  },
  {
    id: 2,
    name: "Sol",
  },
];
const startingdate = [
  { value: "List Immediately", label: "List Immediately" },
  { value: "Scheduled Listing", label: "Scheduled Listing" },
];
const enddate = [
  { value: "1 day", label: "1 day" },
  { value: "2 days", label: "2 days" },
  { value: "Scheduled Listing", label: "Scheduled Listing" },
];
export default function PlaceOrder({
  text,
  owner,
  types,
  closePop,
  file,
  type,
  thumb,
  item,
  onhide,
}) {
  const initialTokenValue = {
    ClockTime: "",
    EndClockTime: "",
  };
  const {push} = useRouter()
  const [NFTFormValue, setNFTFormValue] = useState(initialTokenValue);
  const {  accountAddress } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );

  const closeref = useRef()
  const [once, setOnce] = useState(true);
 
  const [BtnData, SetBtnData] = useState("start");
 
  const { currency } = useSelector((state) => state.LoginReducer);
  const ContractCall = solanacontract() 
 
  const { payload } = useSelector((state) => state.LoginReducer.User);

  const [FormValue, SetFormValue] = useState({...item,"CoinName" : "SOL"});

  console.log("itemssss",item,FormValue)
  const [ValidateError, SetValidateError] = useState({});
  useEffect(() => {
    // if (!FormValue?.CoinName) {
      SetFormValue({
        ...FormValue,
        ...{
          ["CoinName"]:
              "Sol" ,
        },
      });
    // }

    SetFormValue({ ...FormValue, ...{ ["EmailId"]: payload?.EmailId } });
  }, []);

  useEffect(()=>{
    SetFormValue({
      ...FormValue,
      ...item,
      ...{
        ["CoinName"]:
            "Sol" ,
      }
    })
  },[item])

  useEffect(()=>{
    console.log("currentCurrency",currency[0])
    setNFTFormValue({
      ...FormValue,
      ["CoinName"] : currency?.[0]?.value
    })
  },[currency])

  const TokenApproveCall = async () => {
    SetTokenBtn("process");
    const id = toast.loading("Approve Processing");
    const cont = await ContractCall.SetApproveStatus(
      FormValue.ContractType == 721 || FormValue.ContractType == "721"
        ? "Single"
        : "Multiple",
      FormValue.ContractAddress
    );
    toast.update(id, {
      render: cont ? "Approved Successfully" : "Approved Failed",
      type: cont ? "success" : "error",
      isLoading: false,
      autoClose: 1000,
      closeButton: true,
      closeOnClick: true,
    });
    if (cont.status) {
      SetTokenBtn("done");
      SetBtnData("process");
    } else SetTokenBtn("try");
  };

  const onSelectChange = (e, data) => {
    SetBtnData("start");
    const id = "CoinName";
    const { label, value } = e;
    SetFormValue({ ...FormValue, ...{ [id]: value } });
  };

  const YouWillGet = useMemo(() => {
    return 0; //ContractCall.price_calculation(FormValue.NFTPrice);
  }, [FormValue?.NFTPrice]);

  const onChange = (e) => {
    const { files, value, id } = e.target;
    console.log("price@123", value);
    SetBtnData("start");
    SetFormValue({ ...FormValue, ...{ [id]: NumANdDotOnly(value) } });
  };

  const FormSubmit = async () => {
    console.log("hehehehehe");
    SetBtnData("start");
    const id = toast.loading("Validating Form");
    var Error = Validation(FormValue);
    console.log("hdfhgdhsh", FormValue, owner, Error);
    SetBtnData("process");
    if (isEmpty(Error)) {
      let Respc = await ContractCall.Contract_Base_Validation();
      if (!Respc) {
        let Statu = await ContractCall.nftDelegateApprove(
          accountAddress,
          item.NFTId
        );
        console.log("Statu",Statu)
        if (Statu?.status == true) {
          toast.update(id, {
            render: "Ready To Place Order",
            type: "success",
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
          });
          ListCall(Statu)
        } else {
          toast.update(id, {
            render: "Something issue Please try agian",
            type: "error",
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
          });
        }
      } else {
        SetBtnData("error");
        SetValidateError(Respc);
      }
    } else {
      toast.update(id, {
        render: "Check Fields",
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
      });
      SetBtnData("error");
      SetValidateError(Error);
    }
  };
  const closemodal = () => SetBtnData("start");

  const Validation = (data) => {
    let ValidateError = {};
    const {
      NFTPrice,
      CoinName,
      PutOnSaleType,
      ClockTime,
      EndClockTime,
      NFTQuantity,
      ContractType,
    } = data;
    console.log(
      "errrorrrr",
      ContractType,
      ContractType === "1155" || ContractType === 1155,
      NFTQuantity,
      owner?.NFTBalance,
      Number(NFTQuantity) > Number(item?.NFTBalance)
    );
    if (
      (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
      isEmpty(NFTPrice)
    )
      ValidateError.NFTPrice = "Token Price Required";
    if (
      (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
      !CoinName
    )
      ValidateError.CoinName = "CoinName Required";
    if (PutOnSaleType == "TimedAuction" && !ClockTime)
      ValidateError.ClockTime = "ClockTime Required";
    if (PutOnSaleType == "TimedAuction" && !EndClockTime)
      ValidateError.EndClockTime = "EndClockTime Required";
    if (PutOnSaleType == "TimedAuction") {
      if (
        ClockTime > EndClockTime ||
        ClockTime.toString() == EndClockTime.toString()
      ) {
        ValidateError.EndClockTime = "Time Auction should not be same";
      }

      if (new Date(ClockTime) > new Date(EndClockTime)) {
        ValidateError.EndClockTime = "Please Enter valid End Time";
      }
    }
    return ValidateError;
  };

  const onChangeTab = (e, newValue) => {
    SetBtnData("start");
    SetFormValue({
      ...FormValue,
      ...{ ["PutOnSaleType"]: newValue, ["FixedPrice"]: "", ["CoinName"]: "" },
    });
  };

  const onSlectDate = (data, up) => {
    SetBtnData("start");
    setdropdown(false);
    setdropdown1(false);
    if (up == "RightAfterClick") {
      var date = new Date().setMinutes(20);
    } else if (up == "one" || up == "two") {
      var date = new Date().setDate(
        up == "one"
          ? 1 + new Date().getDate()
          : up == "two"
          ? 2 + new Date().getDate()
          : 0
      );
    } else setModal(data);

    var formvalue = {
      ...FormValue,
      ...{ [data]: moment(date).format("YYYY-MM-DD HH:mm:ss") },
    };
    SetFormValue(formvalue);
  };

  const setClockValue = (data, date) => {
    console.log("DDATE,Data", data, date);
    SetFormValue({
      ...FormValue,
      ...{ [data]: new Date(date) },
      // moment(date).format("YYYY-MM-DD HH:mm:ss") },
    });
  };
  const startingdate = [
    { value: "List Immediately", label: "List Immediately" },
    { value: "Scheduled Listing", label: "Scheduled Listing" },
  ];
  const enddate = [
    { value: "1 day", label: "1 day" },
    { value: "2 days", label: "2 days" },
    { value: "Scheduled Listing", label: "Scheduled Listing" },
  ];
  async function ListCall(data) {
    const id = toast.loading("Listing Processing");
    // SetMintbtn("process");
    if (FormValue.PutOnSaleType == "FixedPrice") {
      var error = await ContractCall.Contract_Base_Validation();
      console.log("====================================");
      console.log(error, FormValue);
      console.log("====================================");
      if (error)
        toast.update(id, {
          render: error,
          type: "error",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
        });
      else {
        // const cont = await ContractCall.place_order_721_1155(
        //   owner.NFTId,
        //   web3.utils.toWei(FormValue.NFTPrice?.toString()),
        //   FormValue.ContractAddress,
        //   Number(FormValue.ContractType),
        //   "data"
        // );
        console.log("contdata", data);

        if (data) {
          let _data = FormValue;
          _data.NFTOwner = payload.WalletAddress;
          _data.HashValue = data.hash;
          _data.delegate = data.delegateSecKey
          _data.NFTId = owner.NFTId;
          _data.activity = "PutOnSale";
          _data.NFTBalance = owner?.NFTBalance;
          _data.click = `${Config.FRONT_URL}/info/${FormValue.CollectionNetwork}/${FormValue.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`;
          console.log("_datattatataa", _data);
          _data.EmailId = payload?.EmailId;
          BackCall(id, _data);
        } else {
          console.log("json fil");
          toast.update(id, {
            render: "Transaction Failed",
            type: "error",
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
          });
          console.log("ewjewkljelwjrkwejkrweklr");
          SetMintbtn("try");
        }
      }
    } else {
      let _data = FormValue;
      _data.NFTOwner = payload.WalletAddress;
      _data.HashValue = "";
      _data.NFTId = owner.NFTId;
      _data.activity = "PutOnSale";
      _data.click = `${Config.FRONT_URL}/info/${FormValue.CollectionNetwork}/${FormValue.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`;
      console.log("_datattatataa", _data);
      _data.EmailId = payload?.EmailId;
      BackCall(id, _data);
    }
  }

  var validStart = function (current) {
    var yesterday = moment().subtract(1, "day");
    //return current.isAfter(new Date())&&current.isBefore(new Date(EndClocktime));
    return current.isAfter(yesterday);
  };
  var validEnd = function (current) {
    return current.isAfter(
      FormValue.ClockTime ? new Date(FormValue.ClockTime) : undefined
    );
  };
  const CloseModal = () => {
    SetOpenPopup("");
  };

  const DateSelection = (e, data) => {
    console.log(
      "datttteeeee",
      moment(new Date()).format("YYYY-MM-DD h:mm:ss a")
    );
    SetBtnData("start");
    if (data == "start") {
      if (e.value == "List Immediately")
        SetFormValue({
          ...FormValue,
          ...{
            ["ClockTime"]: new Date(),
          },
        });
      else if (e.value == "Scheduled Listing") SetOpenPopup("ClockTime");
    } else {
      if (e.value == "1 day") {
        console.log(
          "dateeeee",
          new Date(
            new Date(FormValue.ClockTime).setDate(
              new Date(FormValue.ClockTime).getDate() + 1
            )
          )
        );
        if (FormValue.ClockTime === "") {
          SetFormValue({
            ...FormValue,
            ...{
              ["EndClockTime"]:
                // moment(
                new Date(new Date().setDate(new Date().getDate() + 1)),
              // ).format("YYYY-MM-DD h:mm:ss a"),
            },
          });
        } else {
          SetFormValue({
            ...FormValue,
            ...{
              ["EndClockTime"]:
                //  moment(
                new Date(
                  new Date(FormValue.ClockTime).setDate(
                    new Date(FormValue.ClockTime).getDate() + 1
                  )
                ),
              // ).format("YYYY-MM-DD h:mm:ss a"),
            },
          });
        }
      } else if (e.value == "2 days") {
        if (FormValue.ClockTime === "") {
          SetFormValue({
            ...FormValue,
            ...{
              ["EndClockTime"]:
                //  moment(
                new Date(new Date().setDate(new Date().getDate() + 2)),
              // ).format("YYYY-MM-DD h:mm:ss a"),
            },
          });
        } else {
          SetFormValue({
            ...FormValue,
            ...{
              ["EndClockTime"]:
                // moment(
                new Date(
                  new Date(FormValue.ClockTime).setDate(
                    new Date(FormValue.ClockTime).getDate() + 2
                  )
                ),
              // ).format("YYYY-MM-DD h:mm:ss a"),
            },
          });
        }
      } else if (e.value == "Scheduled Listing") SetOpenPopup("EndClockTime");
    }
  };

  const BackCall = async (id, _data) => {
    let Resp = await CreateOrder(_data);

    if (Resp.success == "success") {
      toast.update(id, {
        render: "The NFT is successfully listed for sale ",
        type: Resp.success,
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
      });
      closeref.current.click()
      push("/user/" + payload.CustomUrl, { state: { Tab: "owned" } });
    } else {
      console.log("dsahgdhasgjgdjasd");
      toast.update(id, {
        render: "Transaction Failed",
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
      });
      SetMintbtn("try");
    }
  };

  useEffect(() => {
    // BalanceCheck();
  }, [item, owner]);  

  async function BalanceCheck() {
    SetMintbtn("process");
    if (once) {
      // let id = toast.loading("Checking balance....")
      let Nftbalance = await ContractCall.Current_NFT_Balance(owner, item);
      console.log(
        "ownneerrsnftbusdasdynowbalittemmm",
        Nftbalance,
        owner?.NFTBalance,
        item.ContractType,
        owner?.NFTOwner
      );

      if (
        (Number(Nftbalance) !== Number(owner?.NFTBalance) &&
          item?.ContractType === "1155") ||
        (Nftbalance.toLowerCase() != owner?.NFTOwner.toLowerCase() &&
          item?.ContractType === "721")
      ) {
        toast.warning("You won't buy at this moment please refresh you data");
        setTimeout(() => {
          push("/");
        }, 1000);
      }
    }
    SetMintbtn("start");
    return () => {
      setOnce(false);
    };
  }

  // const DateSelection = (e, data) => {
  //   // console.log('datttteeeee',e.value,data,e.value == "Scheduled Listing")
  //   if (data == "start") {
  //     if (e.value == "List Immediately")
  //       setNFTFormValue({
  //         ...NFTFormValue,
  //         ...{
  //           ["ClockTime"]: moment(new Date()).format("YYYY-MM-DD h:mm:ss a"),
  //         },
  //       });
  //     else if (e.value == "Scheduled Listing") SetOpenPopup("ClockTime");
  //   } else {
  //     if (e.value == "1 day") {

  //       if (NFTFormValue.ClockTime === "") {
  //         setNFTFormValue({
  //           ...NFTFormValue,
  //           ...{
  //             ["EndClockTime"]: moment(
  //               new Date(new Date().setDate(new Date().getDate() + 1))
  //             ).format("YYYY-MM-DD h:mm:ss a"),
  //           },
  //         });
  //       }
  //       else {
  //         setNFTFormValue({
  //           ...NFTFormValue,
  //           ...{
  //             ["EndClockTime"]: moment(
  //               new Date(new Date(NFTFormValue.ClockTime).setDate(new Date(NFTFormValue.ClockTime).getDate() + 1))
  //             ).format("YYYY-MM-DD h:mm:ss a"),
  //           },
  //         });
  //       }
  //     } else if (e.value == "2 days") {

  //       console.log("NFTCOINNAME", NFTFormValue.CoinName)

  //       if (NFTFormValue.ClockTime === "") {
  //         setNFTFormValue({
  //           ...NFTFormValue,
  //           ...{
  //             ["EndClockTime"]: moment(
  //               new Date(new Date().setDate(new Date().getDate() + 2))
  //             ).format("YYYY-MM-DD h:mm:ss a"),
  //           },
  //         });
  //       }
  //       else {
  //         setNFTFormValue({
  //           ...NFTFormValue,
  //           ...{
  //             ["EndClockTime"]: moment(
  //               new Date(new Date(NFTFormValue.ClockTime).setDate(new Date(NFTFormValue.ClockTime).getDate() + 2))
  //             ).format("YYYY-MM-DD h:mm:ss a"),
  //           },
  //         });
  //       }
  //     }
  //     else if (e.value == "Scheduled Listing") SetOpenPopup("EndClockTime");
  //   }
  // };
  return (
    <div>
      <div
        className="modal fade place-content-center"
        id="LowerModal"
        tabIndex="-1"
        aria-labelledby="placeBidLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog max-w-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
                {text == "Change Price" ? <>Change Price</> : <> Put on Sale</>}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={closeref}
                // onClick={() => closePop()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-6 w-6 fill-jacarta-700 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="modal-body p-6">
              <div className="mb-[20px]">
                <ImgAudVideo
                  file={`${Config.IMG_URL}/nft/${item?.NFTCreator}/Compressed/NFT/${item?.CompressedFile}`}
                  type={
                    item?.CompressedFile
                      ? item?.CompressedFile?.includes(".webp") ||
                        item?.CompressedFile?.includes(".png")
                        ? "image"
                        : item?.CompressedFile.includes(".webm")
                        ? "video"
                        : "audio"
                      : item?.CompressedFile
                  }
                  thumb={`${Config.IMG_URL}/nft/${item?.NFTCreator}/Compressed/NFT_THUMB/${item?.CompressedThumbFile}`}
                  from="info"
                  origFile={`${Config.IMG_URL}/nft/${item?.NFTCreator}/Original/NFT/${item?.OriginalImage}`}
                  className="w-[100%] h-[180px] object-cover rounded-[10px]"
                />
                {/* <Image src={dummyimg} className="w-[100%] h-[180px] object-cover rounded-[10px]" alt="solana" /> */}
              </div>
              <div className="grid grid-cols-2 gap-3 flex-row flex-wrap flex max-[1070px]:grid-cols-1 mb-4">
                <div
                  className={`border p-[20px] rounded-[10px] hover:cursor-pointer ${
                    FormValue?.PutOnSaleType === "FixedPrice" && "bg-accent"
                  }`}
                  onClick={() =>
                    SetFormValue({
                      ...FormValue,
                      ...{
                        ["PutOnSaleType"]: "FixedPrice",
                      },
                    })
                  }
                >
                  <div
                    className={`dark:text-jacarta-300 text-center ${
                      FormValue?.PutOnSaleType === "FixedPrice" && "!text-white"
                    }`}
                  >
                    Fixed Price
                  </div>
                </div>
                {/* todo */}
                {/* <div
                  className={`border p-[20px] rounded-[10px] hover:cursor-pointer ${
                    !(FormValue?.PutOnSaleType === "FixedPrice") && "bg-accent"
                  }`}
                  onClick={() =>
                    SetFormValue({
                      ...FormValue,
                      ...{
                        ["PutOnSaleType"]: "TimedAuction",
                        ["CoinName"]: currency?.filter(
                          (item) => item?.address != Config.DEADADDRESS
                        )[0]?.label,
                      },
                    })
                  }
                >
                  <p
                    className={`dark:text-jacarta-300 text-center ${
                      !(FormValue?.PutOnSaleType === "FixedPrice") &&
                      "!text-white"
                    }`}
                  >
                    Timed Auction
                  </div>
                </div> */}
              </div>
              {FormValue?.PutOnSaleType === "FixedPrice" ? (
                <div className="mb-4">
                  <div className="mb-3">
                    <label
                      htmlFor="item-name"
                      className="mb-2 block font-display text-jacarta-700 dark:text-white"
                    >
                      Fixed Price (Max 7 digit)
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="text"
                        id="NFTPrice"
                        onChange={onChange}
                        value={FormValue?.NFTPrice}
                        className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
                        placeholder=""
                        required
                        max={7}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <label htmlFor="currency" className="sr-only">
                          Currency
                        </label>
                        <select
                          id="currency"
                          name="currency"
                          className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                          onChange={(e) => {
                            console.log("e",e.target.value)
                            SetBtnData("start");
                            SetFormValue({
                              ...FormValue,
                              ...{ ["CoinName"]: e.target.value },
                            });
                          }}
                        >
                          {currency?.map((val) => (
                            <option value={val.value}>{val.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="dark:text-jacarta-300">Service Fees {String(0)}%</div>
                  <div className="dark:text-jacarta-300">You will receive ETH</div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="mb-3">
                    <label
                      htmlFor="item-name"
                      className="mb-2 block font-display text-jacarta-700 dark:text-white"
                    >
                      Minimum Bid (Max 7 digit)
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="text"
                        id="NFTPrice"
                        onChange={onChange}
                        value={FormValue?.NFTPrice}
                        className="w-full rounded-lg border-jacarta-100 py-3 hover:ring-2 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300"
                        placeholder=""
                        required
                        max={7}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <label htmlFor="currency" className="sr-only">
                          Currency
                        </label>
                        <select
                          id="currency"
                          name="currency"
                          className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                          onChange={(e) => {
                            SetBtnData("start");
                            SetFormValue({
                              ...FormValue,
                              ...{ ["CoinName"]: e.target.value },
                            });
                          }}
                        >
                          {currency?.filter(s=>s.label !== Config.COIN_NAME && s.label !== "BNB").map((val) => (
                            <option value={val.value}>{val.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-row flex-wrap flex max-[1070px]:grid-cols-1 mb-4">
                      <div>
                        <label
                          // htmlFor="item-name"
                          className="mb-2 block font-display text-jacarta-700 dark:text-white"
                        >
                          Starting Date
                        </label>
                        <Select
                          options={startingdate}
                          value={{
                            value:FormValue?.ClockTime && moment(FormValue?.ClockTime).format("YYYY-MM-DD h:mm:ss a"),
                            label: FormValue?.ClockTime &&  moment(FormValue.ClockTime).format("YYYY-MM-DD h:mm:ss a"),
                          }}
                          onChange={(e) =>
                            DateSelection(e, "start")
                          }
                          classNamePrefix="react-select"
                          isSearchable={false}
                        />
                      </div>
                      <div>
                        <label
                          // htmlFor="item-name"
                          className="mb-2 block font-display text-jacarta-700 dark:text-white"
                        >
                          Ending Date
                        </label>
                        <Select
                          value={{
                            value:
                              FormValue?.EndClockTime && moment(FormValue?.EndClockTime).format("YYYY-MM-DD h:mm:ss a"),
                            label:
                            FormValue?.EndClockTime && moment(FormValue?.EndClockTime).format("YYYY-MM-DD h:mm:ss a"),
                          }}
                          onChange={(e) =>
                            DateSelection(e, "end")
                          }
                          options={enddate}
                          classNamePrefix="react-select"
                          isSearchable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div></div>
            </div>
            {/* end body */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
              <button
                 type="button"
                  className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                onClick={BtnData == "start" ? FormSubmit : null}
              >
                {(BtnData == "start" || BtnData == "error") && text == "Change Price" ? <>Change Price</> : <>  Put on Sale</>}
                {/* {BtnData == "error" && "Put on Sale"} */}
                {BtnData == " process" && " processing"}
                {BtnData == "done" && "Done"}
              </button>
              <button  type="button"
                  className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark" onClick={closePop}>
                Cancel
              </button>
                {/* <button
                  type="button"
                  className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                >
                  Put on Sale
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
