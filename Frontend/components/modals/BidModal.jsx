import { useEffect, useMemo, useState } from "react";

//npm
import { useSelector } from "react-redux";

//function
import { isEmpty } from "@/actions/common";
import Config from '@/Config/config'
import { BidApprove } from "@/actions/axios/nft.axios";
// import useContractProviderHook from "@/utlis/hooks/contractProviderHook";


/* eslint-disable react/no-unescaped-entities */
const collcections = [
  {
    id: 1,
    name: "Cake"
  },
  {
    id: 2,
    name: "Sol"
  },
 

];
const Currency = "BNB"
const Coin = "WBNB"
export default function BidModal({   bidder, bid, owner, item ,closePop }) {
  // const ContractCall = useContractProviderHook()
  const { currency } = useSelector(state => state.LoginReducer)
  const { web3, accountAddress, coinBalance } = useSelector(state => state.LoginReducer.AccountDetails);
  const [TokenBal, SetTokenBal] = useState(0)
  const [ Once , setOnce] = useState(true)
  const [Btn, SetBtn] = useState('start')
  const [FormValue, SetFormValue] = useState({
    TokenBidderAddress: accountAddress,
    Category: item.Category,
    NFTQuantity: isEmpty(bidder) ? 1 : bidder.NFTQuantity,
    TokenBidAmt: isEmpty(bidder) ? 0 : bidder.TokenBidAmt,
    NFTId: item.NFTId,
    ContractAddress: item.ContractAddress,
    ContractType: item.ContractType,
    CollectionNetwork: item.CollectionNetwork,
    CoinName: (isEmpty(owner?.CoinName) || owner?.PutOnSaleType != "TimedAuction") ?
      isEmpty(bidder) ?
        currency?.filter(item => item.address != Config.DEADADDRESS)?.length > 0 ?
          currency.filter(item => item.address !== Config.DEADADDRESS)[0].label
          : Coin
        : bidder.CoinName : owner?.CoinName
  })
  const Token_details = useMemo(() => {
    var data = currency?.filter(item => item.label === FormValue.CoinName)?.pop() ?? currency?.filter(item => item.label !== Currency)?.pop()
    return {
      decimal: data?.decimal ?? 18,
      token_address: data?.address ?? Config.DEADADDRESS
    }
  },[FormValue.CoinName])

  // useEffect(() => {
  //   BalCal()
  // }, [])

  const BalCal = async () => {
    let TokenBal = await ContractCall.Token_Balance_Calculation(Token_details.token_address, accountAddress)
    SetTokenBal(TokenBal)
  }
  const Validation = async () => {
    var Error = {}
    if (isEmpty(FormValue.TokenBidAmt)) Error.TokenBidAmt = "Must Enter Bid Amount"
    if (isEmpty(FormValue.NFTQuantity)) Error.NFTQuantity = "Must Select Atleast One Token"
    else if (Number(owner.NFTBalance) < Number(FormValue.NFTQuantity)) Error.NFTQuantity = "Token Quantity Must be less than token Available"
    else if (Number(FormValue.NFTQuantity) % 1 !== 0) Error.NFTQuantity = "Token Quantity Must be a Valid Count"
    if (ContractCall.Contract_Base_Validation()) Error.Wal = await ContractCall.Contract_Base_Validation()
    if (!isEmpty(bid)) {
      if (FormValue.TokenBidAmt <= bid.TokenBidAmt) Error.TokenBidAmt = "Must Be greater Than " + bid.TokenBidAmt
    }
    else if (owner?.PutOnSaleType === "TimedAuction") {
      if (FormValue.TokenBidAmt < Number(owner.NFTPrice)) Error.TokenBidAmt = "Minimum Bid is " + owner.NFTPrice
    }
    if (TokenBal <= 0) Error.TokenBal = "Not Enough token in your Wallet"
    return Error
  }

  const FormSubmit = async () => {
    const id = toast.loading('Approving Token on processing')
    SetError({})
    SetBtn('process')
    var error = await Validation()
    // console.log('RFGSFGRG',error)
    if (!isEmpty(error)) {
      setTimeout(() => {
      toast.update(id, { render: Object.values(error)[0], type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        
      }, 1000);
      SetBtn('error')
      SetError(error)
    }
    else {
      let allow = web3.utils.fromWei((await ContractCall.allowance_721_1155(Token_details.token_address, accountAddress)) ? String(await ContractCall.allowance_721_1155(Token_details.token_address, accountAddress)) : '0')
      // console.log('fhfhfa',Token_details,accountAddress,Number(allow))
      console.log("YouWillGet", YouWillGet, allow, String(Number(YouWillGet) + Number(allow)));
      let cont = await ContractCall.approve_721_1155(Token_details.token_address, network[Network].tradeContract, web3.utils.toWei(String(Number(YouWillGet) + Number(allow))))
      console.log('====================================');
      console.log("APProve data");
      console.log('====================================');
      if (cont) {

        var _data = FormValue
        _data.HashValue = cont.HashValue
        // _data.TokenOwner = owner.TokenOwner
        _data.from = isEmpty(bidder) ? 'Bid' : 'Edit'
        _data.activity = isEmpty(bidder) ? 'Bid' : 'Edit'
        _data.EmailId = payload.EmailId
        _data.click = `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`

        var Resp = await BidApprove(_data)
        console.log("BACKAPPROVE", Resp);
        if (Resp.success == 'success') {
          toast.update(id, { render: 'The bid is successfully placed', type: 'success', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          // SetBtn('done')
          // closePop();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          // push(`/my-item/${payload?.CustomUrl}`)
        }
        else {
          toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          SetBtn('try')
        }
      }
      else {
        toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        SetBtn('try')
      }

    }
  }

  const onChange = async (e, data) => {
    let oii = (data === "price") ? e : e.target
    SetBtn('start')
    const { value, id, name } = oii
    let val = (data === "price") ? "CoinName" : id
    SetFormValue({ ...FormValue, ...{ [val]: data === "inp" ? (name == "NumDotOnly" ? NumANdDotOnly(value) : NumberOnly(value)) : value } })
    if (data === "price") {
      BalCal(value)
    }
  }

  // useEffect(() => {
  //   BalanceCheck();
  // }, [item, owner]);

  async function BalanceCheck() {
    SetBtn('process')
    if(Once){
      let Nftbalance = await ContractCall.Current_NFT_Balance(owner, item);
      console.log("ownneerrsnftbusdasdynowbalittemmm", Nftbalance , owner?.NFTBalance , Nftbalance , owner?.NFTOwner , item.ContractType  , owner?.NFTOwner);
      if ((Number(Nftbalance) != Number(owner?.NFTBalance) &&  item.ContractType == '1155' ) || ( Nftbalance.toLowerCase() !=  owner?.NFTOwner.toLowerCase()  &&  item.ContractType == '721') ) {
        toast.warning("You won't Bid  at this moment please refresh you data");
        setTimeout(() => {
          push("/");
        }, 1000);
      }
    }
    SetBtn('start')
    return ()=>{ setOnce(false)}
    
  }

  return (
    <div>
      <div
        className="modal fade place-content-center"
        id="placeBidModal"
        tabIndex="-1"
        aria-labelledby="placeBidLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog max-w-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
                Place a bid
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
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-jacarta-700 dark:text-white">
                 Enter Your bid
                </span>
              </div>

              <div className="relative mb-2 flex items-center overflow-hidden rounded-lg border border-jacarta-100 dark:border-jacarta-600">
              

                <input
                  type="text"
                  onChange={(e) => onChange(e)}
                  id="TokenBidAmt"
                  className="h-12 w-full flex-[3] border-0 focus:ring-inset focus:ring-accent"
                  placeholder="Amount"
                  defaultValue="0.05"
                />

             
              </div>
              </div>
              <div className="dropdown my-1 cursor-pointer">
                <div
                  className="dropdown-toggle flex items-center justify-between rounded-lg border border-jacarta-100 bg-white py-3 px-3 dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-jacarta-300"
                  role="button"
                  id="item-collection"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="">SOL</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="h-4 w-4 fill-jacarta-500 dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
                  </svg>
                </div>

                <div
                  className="dropdown-menu z-10 hidden w-full whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl dark:bg-jacarta-800 w-[92%]"
                  aria-labelledby="item-collection"
                >
                  <ul className="scrollbar-custom flex max-h-48 flex-col overflow-y-auto">
                    {currency.filter(s=>s.label != "SOL").map((elm, i) => (
                      <li key={i} id="CoinName" value={elm?.value} className="mb-4 px-2 hover:bg-accent-dark" onClick={(e) => onChange(e)}>
                        <p className="text-600 hover:text-white">{elm.label}</p>
                      </li>
                    ))}
                  </ul>
                </div>
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
                  id="NFTQuantity"
                  onChange={(e)=>onChange(e)}
                  className="h-12 w-full flex-[3] border-0 focus:ring-inset focus:ring-accent"
                  placeholder="Amount"
                  defaultValue="1"
                />

             
              </div>
              </div>
              <div>
             
              </div>

              
              <div>
                <div className="flex justify-between flex-row w-100 mb-[5px]">
                  <p className="text-sm font-semibold text-jacarta-600  dark:text-white">Your Balance:</p>
                  <p className="text-sm font-normal text-jacarta-600  dark:text-accent-light">{coinBalance ?? 0} { Config.COIN_NAME}</p>
                </div>
                <div className="flex justify-between flex-row w-100 mb-[5px]">
                  <p className="text-sm font-semibold text-jacarta-600  dark:text-white">Your Bidding balance:</p>
                  <p className="text-sm font-normal text-jacarta-600  dark:text-accent-light">0 Cake</p>
                </div>
                <div className="flex justify-between flex-row w-100 mb-[5px]">
                  <p className="text-sm font-semibold text-jacarta-600  dark:text-white">Service fee:</p>
                  <p className="text-sm font-normal text-jacarta-600  dark:text-accent-light">2.5% Cake</p>
                </div>
                <div className="flex justify-between flex-row w-100 mb-[5px]">
                  <p className="text-sm font-semibold text-jacarta-600  dark:text-white">You will Pay:</p>
                  <p className="text-sm font-normal text-jacarta-600  dark:text-accent-light">0 Cake</p>
                </div>
              
              </div>

            
            </div>
            {/* end body */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <button
                 disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
                 onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null}
                  type="button"
                  className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                >
                  {Btn == 'start' && (isEmpty(bidder) ? 'Place a bid' : 'Edit Bid')
              || Btn == 'try' && 'Try-Again'
              || Btn == 'error' && 'Error'
              || Btn == 'done' && 'Done'
              || Btn == 'process' && 'In-Progress'
            }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
