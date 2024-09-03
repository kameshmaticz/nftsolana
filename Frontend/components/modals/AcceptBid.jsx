import { useEffect, useMemo, useState } from "react";

//FUNCTION
import { BidApprove } from "@/actions/axios/nft.axios";

//NPM
import { useDispatch, useSelector } from "react-redux";

export default function AcceptBid({
  bidder,
  closePop,
  bid,
  owner,
  item,
  approvestatus,
}) {
    const { currency } = useSelector((state) => state.LoginReducer);
    const { web3 } = useSelector(
      (state) => state.LoginReducer.AccountDetails
    );
    const { buyerFees, sellerFees } = useSelector(
      (state) => state.LoginReducer.ServiceFees
    );
    // const ContractCall = useContractProviderHook();
    const dispatch = useDispatch()
    const { payload } = useSelector((state) => state.LoginReducer.User);
    const [Btn, SetBtn] = useState("start");
    const [Error, SetError] = useState({});
    const [TokenQuantity, SetTokenQuantity] = useState("1");
    const [TokenBal, SetTokenBal] = useState(0);
    const [show6, setShow6] = useState(true);
    const [TokenBtn, SetTokenBtn] = useState("start");
    const[Nftbal,setNftbal]=useState()
    const [bidderDetail, setBidderDetail] = useState({})
    const handleClose6 = () => setShow6(false);
    const[Once,setOnce]= useState(true)
    const token_address =
      currency?.filter((item) => item.label == bidder?.CoinName)?.pop()
        ?.address ?? "0x7CAB80ce0E55F46378E493B584eE61aD68878f11";
    const [referredUser, setReferredUser] = useState({});
    const { Network } = useSelector(
      (state) => state.LoginReducer
    );

    // useEffect(() => {
    //   BalCal(token_address);
    // }, []);
  
    const BalCal = async (data) => {
      let TokenBal = await ContractCall.Token_Balance_Calculation(
        data ?? token_address,
        bidder?.TokenBidderAddress
      );
      console.log("====================================rdd");
      console.log(TokenBal);
      console.log("====================================");
      SetTokenBal(TokenBal);
    };
  
  
   
  
    const YouWillGet = useMemo(() => {
      return 0
    //   ContractCall.price_calculation(
    //     (bidder?.TokenBidAmt * TokenQuantity).toString()
    //   );
    }, [bidder?.TokenBidAmt, TokenQuantity]);
  
    const Validation = async () => {
      var Error = {};
      if (isEmpty(TokenQuantity))
        Error.TokenQuantity = "Must Select Atleast One Token";
      else if (Number(TokenQuantity) % 1 !== 0)
        Error.TokenQuantity = "Token Quantity Must Be Valid";
      if (await ContractCall.Contract_Base_Validation())
        Error.Wal = await ContractCall.Contract_Base_Validation();
      if (!isEmpty(TokenQuantity)) {
        console.log("cheackapprovecalla", token_address, TokenQuantity, bidder?.TokenBidAmt, bidder?.TokenBidderAddress, network[Network].tradeContract, web3.utils.fromWei("10100000000000000000"), TokenQuantity * bidder?.TokenBidAmt);
        if (
          TokenQuantity * bidder?.TokenBidAmt >
          Number(web3.utils.fromWei(
            String(
              (await ContractCall.allowance_721_1155(
                token_address,
                bidder?.TokenBidderAddress,
                network[Network].tradeContract
              ))
                ? await ContractCall.allowance_721_1155(
                  token_address,
                  bidder?.TokenBidderAddress,
                  network[Network].tradeContract
                )
                : 0
            )
          ))
        )
          Error.Wal = "Bidder Doesn't have enough Allowance";
        if (TokenQuantity * bidder?.TokenBidAmt > TokenBal)
          Error.Wal = "Bidder Doesn't have enough Balance";
        if (TokenQuantity > bidder?.Pending)
          Error.Wal = `Token Quantity Must Be less Than ${bidder?.Pending}`;
          console.log("Nftbal >= TokenQuantity",Nftbal < TokenQuantity,Nftbal, TokenQuantity);
          if(Number(Nftbal) < Number(TokenQuantity)){
            Error.Wal = `you not have enough token`
          }
      }
      return Error;
    };

    const TokenApproveCall = async () => {
      SetTokenBtn("process");
      const id = toast.loading("Approve Processing");
      const cont = await ContractCall.SetApproveStatus(
        item.ContractType == 721 || item.ContractType == "721"
          ? "Single"
          : "Multiple",
        item.ContractAddress
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
        SetBtn("start");
      } else SetTokenBtn("try");
    };
  
    const FormSubmit = async () => {
      const id = toast.loading("Accepting Token on processing");
      SetError({});
      SetBtn("process");
      var error = await Validation();
      if (!isEmpty(error)) {
        toast.update(id, {
          render: Object.values(error)[0],
          type: "error",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
        });
        SetBtn("error");
  
        SetError(error);
      } else {
        console.log("sefreeree");
        toast.update(id, {
          render: "Ready To Place Order",
          type: "success",
          isLoading: true,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
        });
        console.log(
          "swefred",
          bidder?.TokenBidAmt * TokenQuantity,
          bidder?.TokenBidAmt,
          TokenQuantity,
          bidder?.CoinName,
          bidder?.TokenBidderAddress,
          bidder?.ContractAddress
        );
        let cont = await ContractCall.accept_721_1155(
          bidder?.CoinName,
          [
            item.NFTId,
            web3.utils.toWei(String(bidder?.TokenBidAmt * TokenQuantity)),
            TokenQuantity,
            bidder?.ContractType,
            web3.utils.toWei(String(referredUser?.earnPercentage ?? 0)),
            web3.utils.toWei(
              String(
                bidderDetail?.referedBy && bidderDetail?.initialBuy == false
                  ? 4
                  : 0
              )
            ),
          ],
          [
            bidder?.ContractAddress,
            bidderDetail?.referedBy ? bidderDetail?.referedBy : config.DEADADDRESS,
            bidder?.TokenBidderAddress,
          ]
        );
        
        if (cont) {
          var FormValue = {
            TokenBidderAddress: bidder?.TokenBidderAddress,
            NFTQuantity: TokenQuantity,
            NFTId: item.NFTId,
            ContractAddress: item.ContractAddress,
            CollectionNetwork: item.CollectionNetwork,
            ContractType: item.ContractType,
            from: "accept",
            EmailId : payload.EmailId,
            item: item,
            newOwner: {
              HashValue: cont.HashValue,
              NewTokenOwner: bidder?.TokenBidderAddress,
              NFTQuantity: TokenQuantity,
              NFTId: item.NFTId,
              NFTOwner: owner?.NFTOwner,
              PutOnSale: owner?.PutOnSale,
              PutOnSaleType: owner?.PutOnSaleType,
              TP:
                owner.PutOnSaleType == "FixedPrice"
                  ? owner?.NFTPrice
                  : bidder?.TokenBidAmt
                    ? bidder?.TokenBidAmt
                    : bidder?.NFTPrice,
              CN:
                owner.PutOnSaleType == "FixedPrice"
                  ? owner?.CoinName
                  : bidder?.CoinName,
              activity: "Accept",
              Category: item.Category,
              New_EmailId: bidder?.EmailId,
              Old_EmailId: payload?.EmailId,
              click: `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${bidder?.TokenBidderAddress}/${owner?.NFTId}`,
              initialBuy: bidderDetail?.initialBuy,
              referedBy: bidderDetail?.referedBy,
              earnPercentage: referredUser?.earnPercentage,
              adminFeePercentage:
                Number(buyerFees) / 1e18 + Number(sellerFees) / 1e18,
            },
          };
        
          let Resp = await BidApprove(FormValue);
          
          if (payload?.initialBuy == false) {
            var newPayload = payload
            newPayload.initialBuy = true
            dispatch({
              type: 'Register_Section',
              Register_Section: {
                User: {
                  payload: newPayload
                }
              }
            })
          }
          if (Resp.success == "success") {
            toast.update(id, {
              render: "Accepting Token Successfully",
              type: "success",
              isLoading: false,
              autoClose: 1000,
              closeButton: true,
              closeOnClick: true,
            });
            SetBtn("done");
            push(`/profile/${payload?.CustomUrl}`);
          } else {
            toast.update(id, {
              render: "Transaction Failed",
              type: "error",
              isLoading: false,
              autoClose: 1000,
              closeButton: true,
              closeOnClick: true,
            });
            SetBtn("try");
          }
        } else {
          toast.update(id, {
            render: "Transaction Failed",
            type: "error",
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
          });
          SetBtn("try");
        }
      }
    };
  
    const onChange = async (e, data) => {
      SetError({});
      SetBtn("start");
      SetTokenQuantity(e.target.value);
    };
  
    useEffect(() => {
    //   BalanceCheck();
    }, [item, owner]);
  
    async function BalanceCheck() {
      
      if(Once){
        let Nftbalance = await ContractCall.Current_NFT_Balance(owner, item);
        console.log("ownneerrsnftbusdasdynowbalittemmm", Nftbalance , owner?.NFTBalance , Nftbalance , owner?.NFTOwner , item.ContractType  , owner?.NFTOwner);
        
        if ((Number(Nftbalance) != Number(owner?.NFTBalance) &&  item.ContractType == '1155' ) || ( Nftbalance.toLowerCase() !=  owner?.NFTOwner.toLowerCase()  &&  item.ContractType == '721') ) {
         
    
          toast.warning("You won't buy at this moment please refresh you data");
          setTimeout(() => {
            push("/");
          }, 1000);
        }
       
      }
  
      return ()=>{ setOnce(false)}
      
    }

  return (
    <div>
      <div
        className="modal fade place-content-center"
        id="Acceptbidmodel"
        tabIndex="-1"
        aria-labelledby="Acceptbidlabel"
        aria-hidden="true"
      >
        <div className="modal-dialog max-w-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="Acceptbidlabel">
                Accept Bid
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closePop()}
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
              <div className="mb-[15px]">
                <div className="pb-3">
                  You are to accept bid for <span>{item.NFTName}</span> from{" "}
                  <span>
                    {" "}
                    {bidder?.DisplayName
                      ? bidder?.DisplayName
                      : bidder?.TokenBidderAddress}
                  </span>
                </div>
                <h6 className="pb-4">
                  {bidder?.TokenBidAmt + " " + bidder?.CoinName} for{" "}
                  {Number(TokenQuantity)} Edition(s)
                </h6>
              </div>

              <div className="mb-[15px]">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-jacarta-700 dark:text-white">
                    Enter Qunatity ({owner?.NFTBalance} available)
                  </span>
                </div>

                <div className="relative mb-2 flex items-center overflow-hidden rounded-lg border border-jacarta-100 dark:border-jacarta-600">
                  <input
                    type="text"
                    id="TokenQuantity"
                    value={TokenQuantity}
                    onChange={(e) => onChange(e, "inp")}
                    disabled={
                      owner?.NFTBalance == "1" || owner?.NFTBalance == 1
                        ? true
                        : false
                    }
                    placeholder="Enter your quantity"
                    className="h-12 w-full flex-[3] border-0 focus:ring-inset focus:ring-accent"
                    defaultValue="1"
                  />
                </div>
              </div>
              <div></div>

              <div>
                <div className="flex justify-between flex-row w-100 mb-[5px]">
                  <div className="text-sm font-semibold text-jacarta-600  dark:text-white">
                  Seller fee in %:
                  </div>
                  <div className="text-sm font-normal text-jacarta-600  dark:text-accent-light">
                    {String(0
                        // sellerFees
                        )} {bidder?.CoinName}
                  </div>
                </div>
                <div className="flex justify-between flex-row w-100 mb-[5px]">
                  <div className="text-sm font-semibold text-jacarta-600  dark:text-white">
                  Royalty fee in %:
                  </div>
                  <div className="text-sm font-normal text-jacarta-600  dark:text-accent-light">
                  {item.NFTRoyalty} %
                  </div>
                </div>
                <div className="flex justify-between flex-row w-100 mb-[5px]">
                  <div className="text-sm font-semibold text-jacarta-600  dark:text-white">
                  You will get :
                  </div>
                  <div className="text-sm font-normal text-jacarta-600  dark:text-accent-light">
                  {Number( 0
                    // YouWillGet
                    )} {bidder?.CoinName}
                  </div>
                </div>
              </div>
            </div>
            {/* end body */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
              {approvestatus === "open" && (
              <button
                className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                disabled={
                  TokenBtn == "process" || TokenBtn == "done" ? true : false
                }
                onClick={
                  TokenBtn == "start" || TokenBtn == "try"
                    ? TokenApproveCall
                    : null
                }
                disableRipple
              >
                {TokenBtn == "start" && "Approve"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}
              </button>
            )}
            {((approvestatus !== "open") || (TokenBtn == "done")) && <button
              className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
              disabled={
                TokenBtn == "done" ?
                Btn == "error" || Btn === "process" || Btn === "done"
                  ? true
                  : false
                  :false
              }
              onClick={Btn == "start" || Btn === "try" ? FormSubmit : null}
            >
              {(Btn == "start" && "Accept Bid") ||
                (Btn == "try" && "Try-Again") ||
                (Btn == "error" && "Error") ||
                (Btn == "done" && "Done") ||
                (Btn == "process" && "In-Progress") ||
                (Btn == "putonsale" && "List")}
            </button>}
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
