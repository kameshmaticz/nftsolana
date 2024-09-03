// import ERC721 from '../../src/Abi/erc721.json'
// import ERC1155 from '../../src/Abi/erc1155.json'
// import TRADE from '../../src/Abi/market.json'
// import profile from '../../assets/images/avatar.png'
const EnvName = 'demo';
var key = {};
key.KEY = 'CardBo@rD1290%6Fine3'
key.ONEDAYINSECONDS = 0
key.env = EnvName
key.ENCODEKEY = 'encodenft@x'
key.BLOCKS_PER_YEAR = 0
key.RPAD_ADDRESS = ''
key.ROUTER = ''
key.EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
key.MOBILE = /^\d{10}$/
key.NumOnly = /^\d+$/
key.PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
key.OnlyAlbhabets = /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/
key.notSpecil = /^[a-zA-Z0-9]+$/
key.OnlyAlphSpecial = /^[A-Za-z_@.#&+-]*$/
key.IPFS = 'https://naifty.infura-ipfs.io/ipfs/'
// 'https://ipfs.io/ipfs/'
key.DecimalAlloweddigits = /^([0-9]+[\.]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?|[0-9]+)$/
key.limit = 50
key.NumDigitOnly = /[^0-9\.]/g
key.NumberOnly = /[^0-9]/g
// if(EnvName === "demo") {
//     key.FRONT_URL       =   'http://nftdemo.bimaticz.com/naifty'
//     key.BACK_URL        =   'https://backend-kittynft.maticz.in/v1/front'
//     key.ADMIN_URL        =   'https://backend-kittynft.maticz.in/v1/admin'
//     key.IMG_URL         =   'https://backend-kittynft.maticz.in'
//     key.DEADADDRESS     =   '0x000000000000000000000000000000000000dEaD'.toLowerCase()
//     // key.profile         =    profile
//     key.TradeContract   =   '0x600A3fEed87E3a2f9EFe61eAd7F1dAe8eA60a59d'.toLowerCase()
//     // key.TradeContract   =   '0x3bE52bd3A97ac6Ba20F1482e58d9694B3E15Fb05'.toLowerCase()
//     key.ERC721          =   '0x9A9EBc3A48D9ddc54A2D6A3599642aBA4363E7e1'.toLowerCase()
//     key.ERC1155         =    '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
//     key.erc20Address    =   '0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A'.toLowerCase()
//     key.RPC_URL         =   "https://api.avax-test.network/ext/bc/C/rpc"
//     key.chain_Id_List        =   [97,43113]
//     key.BNBCHAIN = 97
//     key.ETHCHAIN = 43113
//     // key.RPC_URL         =   "https://endpoints.omniatech.io/v1/bsc/testnet/public"
//     key.CHAIN_ID        =   245022926
//     key.COIN_NAME        =   "SOL"
//     key.Block_URL = {
//         ETH : "https://testnet.snowtrace.io/",
//         BNB : "https://testnet.bscscan.com/"
//     }
// }
if (EnvName === "demo") {
    key.FRONT_URL = 'http://nftdemo.bimaticz.com/naifty'
    key.BACK_URL = 'https://backend-nftsolana.maticz.in/v1/front'
    key.ADMIN_URL = 'https://backend-nftsolana.maticz.in/v1/admin'
    key.IMG_URL = 'https://backend-nftsolana.maticz.in'
    key.network = "devnet"
    key.IPFS = 'https://naifty.infura-ipfs.io/ipfs/'
    key.erc20Address = '7uJSXwU5iNEw2v7eQBkuaMo2RsNS7P5qcYFvy92GDodX'.toLowerCase()

    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    // key.profile         =    profile
    key.TradeContract = '0x600A3fEed87E3a2f9EFe61eAd7F1dAe8eA60a59d'.toLowerCase()
    // key.TradeContract   =   '0x3bE52bd3A97ac6Ba20F1482e58d9694B3E15Fb05'.toLowerCase()
    key.ERC721 = '0x9A9EBc3A48D9ddc54A2D6A3599642aBA4363E7e1'.toLowerCase()
    key.ERC1155 = '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
    key.erc20Address = '0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A'.toLowerCase()
    key.RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"
    key.chain_Id_List = [97, 43113]
    key.BNBCHAIN = 97
    key.Network = "SOLANA"
    key.ETHCHAIN = 43113
    // key.RPC_URL         =   "https://endpoints.omniatech.io/v1/bsc/testnet/public"
    key.CHAIN_ID = 43113
    key.COIN_NAME = "SOL"
    key.Block_URL = 'https://solscan.io/account/'
    key.devnet = "?cluster=devnet"
    key.network = "devnet"
}
else if (EnvName === "stage") {

}
else if (EnvName === "production") {
    key.FRONT_URL = 'https://naifty.io'
    key.BACK_URL = 'https://api.naifty.io/v1/front'
    key.ADMIN_URL = 'https://api.naifty.io/v1/admin'
    key.IMG_URL = 'https://api.naifty.io'
    key.profile = "/img/avatars/owner_1.png"
    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    key.TradeContract = '0xC9Cfa2dd1Ed7Bc29C7d9B990b2DE7Ee630478ec4'.toLowerCase()
    key.ERC721 = '0x99d344133e46720e286f9c5527d2cc2e304953d8'.toLowerCase()
    key.ERC1155 = '0x0b6369b506e811df30ab7c0ce0ae00b8690b76be'.toLowerCase()
    key.erc20Address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'.toLowerCase()
    key.RPC_URL = "https://endpoints.omniatech.io/v1/eth/mainnet/public"
    // key.RPC_URL         =   "https://mainnet.infura.io/v3/be5bdb23c61c4b92b174cb569e57f7b2"
    key.CHAIN_ID = 1
    key.chain_Id_List = [56, 1]
    key.BNBCHAIN = 56
    key.ETHCHAIN = 1
    key.Network = "SOLANA"
    key.COIN_NAME = "SOL"
    key.Block_URL = {
        ETH: "https://etherscan.io/",
        BNB: "https://bscscan.com/"
    }
}
else if (EnvName === "demossl") {

    key.FRONT_URL = 'https://nftdemo.maticz.com'
    key.BACK_URL = 'https://backend-naifty.maticz.in/v1/front'
    key.ADMIN_URL = 'https://backend-naifty.maticz.in/v1/admin'
    key.IMG_URL = 'https://backend-naifty.maticz.in'
    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    // key.profile         =    profile
    key.TradeContract = '0x600A3fEed87E3a2f9EFe61eAd7F1dAe8eA60a59d'.toLowerCase()
    // key.TradeContract   =   '0x3bE52bd3A97ac6Ba20F1482e58d9694B3E15Fb05'.toLowerCase()
    key.ERC721 = '0x9A9EBc3A48D9ddc54A2D6A3599642aBA4363E7e1'.toLowerCase()
    key.ERC1155 = '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
    key.erc20Address = '0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A'.toLowerCase()
    key.RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"
    key.chain_Id_List = [97, 43113]
    key.BNBCHAIN = 97
    key.ETHCHAIN = 43113
    // key.RPC_URL         =   "https://endpoints.omniatech.io/v1/bsc/testnet/public"
    key.CHAIN_ID = 43113
    key.COIN_NAME = "SOL"
    key.Block_URL = {
        ETH: "https://testnet.snowtrace.io/",
        BNB: "https://testnet.bscscan.com/"
    }
}
else {
    key.FRONT_URL = 'http://localhost:3000/'
    key.BACK_URL = 'http://192.53.121.26:7017/v1/front/'
    key.ADMIN_URL = 'http://192.53.121.26:7017/v1/admin'
    key.IMG_URL = 'http://192.53.121.26:7017'
    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    key.profile         =    "/img/avatars/owner_1.png"
    key.TradeContract = '0x600A3fEed87E3a2f9EFe61eAd7F1dAe8eA60a59d'.toLowerCase()
    // key.TradeContract   =   '0x3bE52bd3A97ac6Ba20F1482e58d9694B3E15Fb05'.toLowerCase()
    key.ERC721 = '0x9A9EBc3A48D9ddc54A2D6A3599642aBA4363E7e1'.toLowerCase()
    key.ERC1155 = '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
    key.erc20Address = '7uJSXwU5iNEw2v7eQBkuaMo2RsNS7P5qcYFvy92GDodX'.toLowerCase()
    key.RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc"
    // key.RPC_URL  = "https://data-seed-prebsc-1-s1.bnbchain.org:8545"
    key.chain_Id_List = [97, 43113]
    key.BNBCHAIN = 97
    key.ETHCHAIN = 43113
    key.Network = "SOLANA"
    // key.RPC_URL         =   "https://endpoints.omniatech.io/v1/bsc/testnet/public"
    key.CHAIN_ID = 245022926
    key.COIN_NAME = "SOL"
    key.Block_URL = {
        ETH: "https://testnet.snowtrace.io/",
        BNB: "https://testnet.bscscan.com/"
    }
    key.network = "devnet"
    key.IPFS = 'https://naifty.infura-ipfs.io/ipfs/'
}
export default key;
