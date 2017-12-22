chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "GET_KITTY" ) {
          //Get kitty info from contract
          console.log(KryptoKitties.getKitty(request.kittyId));
      }
    }
);