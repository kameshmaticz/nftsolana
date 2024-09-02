import { offers } from "@/data/itemDetails";
import Link from "next/link";

//npm
import { useSelector } from "react-redux";

export default function Offers({
  data,
  POPUPACTION
}) {
  const {currency} =  useSelector(state=>state.LoginReducer)
  console.log('Offers-->',data,currency.find(item=>item.value == 'CAKE'))
  return (
    <div
      role="table"
      className="scrollbar-custom grid max-h-72 w-full grid-cols-5 overflow-y-auto rounded-lg rounded-tl-none border border-jacarta-100 bg-white text-sm dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white"
    >
      <div className="contents" role="row">
        <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            Price
          </span>
        </div>
        <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            USD Price
          </span>
        </div>
        <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            Floor Difference
          </span>
        </div>
        {/* <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            Expiration
          </span>
        </div> */}
        <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            From
          </span>
        </div>
        <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            Accept Offer
          </span>
        </div>
      </div>
      {data?.length > 0 ? data?.map((elm, i) => (
        <div key={i} className="contents" role="row">
          <div
            className="flex items-center whitespace-nowrap border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            <span className="-ml-1" data-tippy-content={elm.CoinName}>
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
              {elm.TokenBidAmt} {elm?.CoinName}
            </span>
          </div>
          <div
            className="flex items-center border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            {currency.find(item=>item.value == elm?.CoinName)?.usd ?? "0"}
          </div>
          <div
            className="flex items-center border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            {elm.difference}
          </div>
          {/* <div
            className="flex items-center border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            {elm.expiration}
          </div> */}
          <div
            className="flex items-center border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            <Link href={`/user/${elm?.CustomUrl}`} className="text-accent">
              {elm.DisplayName}
            </Link>
          </div>
          <div
            className="flex items-center border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            <button 
            class="inline-block w-full rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
            onClick={()=>POPUPACTION("dummy", "Accept", elm)}
            >Accept</button>
          </div>
        </div>
      )
      
    )
    :
    <div className="flex items-center mx-5"> No Bids Yet </div>}
    </div>
  );
}
