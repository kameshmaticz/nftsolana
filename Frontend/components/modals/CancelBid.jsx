/* eslint-disable react/no-unescaped-entities */
export default function CancelBid() {
  return (
    <div>
      <div
        className="modal fade place-content-center"
        id="CancelBidModal"
        tabIndex="-1"
        aria-labelledby="placeBidLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog max-w-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
               Cancel Bid
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
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
              
              <div>
                <div className="mb-[20px]">
                  
                  <div className="text-sm dark:text-jacarta-400 text-center">You are about to delete</div>
                  <div className="text-sm font-semibold dark:text-jacarta-400 text-center">asdasd</div>
                </div>
         
              </div>
            
           
            </div>
            {/* end body */}
            

            <div className="modal-footer">
            <div className="flex items-center justify-center space-x-4">
            <button
                type="button"
                className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
              >
              Start
              </button>
              <button
                type="button"
                className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
              >
              Cancel
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
