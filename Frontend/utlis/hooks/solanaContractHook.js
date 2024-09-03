/* ABI */
import idl from '../../Abi/abi.json'


/* for Get Program Instance NPM */
import * as anchor from "@project-serum/anchor";

/* Core Solana NPM funtions */
import {
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
  clusterApiUrl,
  PublicKey,
  Keypair,
} from "@solana/web3.js";

/* Core Solana SPL token function NPM */
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createApproveInstruction,
  // decodeInstructionData,
  createMint,
  mintTo,
  approveChecked,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  MintLayout,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddressSync,
  createInitializeMint2Instruction,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  approveCheckedInstructionData,
} from "@solana/spl-token";

/* Solana Wallet Adapters */
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  MathWalletAdapter,
} from "@solana/wallet-adapter-wallets";

/* Solana Mobile wallet adapter */
import {
  SolanaMobileWalletAdapter,
  createDefaultAuthorizationResultCache,
  createDefaultAddressSelector,
  createDefaultWalletNotFoundHandler,
} from "@solana-mobile/wallet-adapter-mobile";

/* Solana Math Wallet connect Adapter */
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";

/* Neccassary NPM */
import axios from "axios";

/* METAPLEX NPM */
// import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
// import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
// import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

const { SystemProgram } = anchor.web3;
var provider;
var programInstance;

import { useSelector,useDispatch } from 'react-redux';
import Config from '@/Config/config';

export default function Usewallet() {

  
   const {web3,accountAddress,coinBalance} = useSelector((state)=>state.LoginReducer.AccountDetails)



   const Contract_Base_Validation = () => {
    if (!web3) return 'Connect Your Wallet'
    if (!accountAddress) return 'Connect Your Wallet'
    if (!coinBalance) return "You Don't have Enough Balance"
    else return ''
}




  const stringToArrayBuffer = (string) => {
    /* Way 1 */
    // let byteArray = new Uint8Array(string.length);
    // for(var i=0; i < string.length; i++) {
    //   byteArray[i] = string.codePointAt(i);
    // }
    // return byteArray;

    /* way 2  */
    const binaryString = atob(string);
    return new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)));
  };

  const arrayBufferToString = (buf) => {
    let uint8Array = new Uint8Array(buf);
    return btoa(String.fromCharCode(...uint8Array));
  };

  const secKey ="8snpsfciUIpp9fd+v4uT9dHftnhqWC71ub54Rh9cVsgauggS1MdPH1Zvd1ap4zBHbR5+GVb24Gy9LN6aNGhDyA=="

  const delegateSecretKey =
    // [26, 254, 95, 239, 70, 173, 74, 114, 226, 27, 180, 139, 203, 52, 128, 218, 148, 231, 4, 176, 132, 195, 127, 232, 158, 80, 233, 111, 184, 39, 225, 224, 132, 31, 82, 68, 29, 91, 227, 42, 5, 154, 79, 245, 24, 123, 50, 71, 17, 191, 197, 112, 186, 38, 87, 71, 88, 168, 61, 251, 46, 94, 151, 51]
    stringToArrayBuffer(secKey);

  console.log("🚀 ~ Usewallet ~ delegateSecretKey:", delegateSecretKey);
  const delegateKeypair = Keypair.fromSecretKey(Buffer.from(delegateSecretKey));
  console.log("🚀 ~ Usewallet ~ delegateKeypair:", delegateKeypair);

  const mintAddress = new PublicKey(
    "Gvvv8sTBQf4vdJUr98SnwDf47dZTKGw5Q5yvBQqSrjCN"
  );

  const sellerAddress = new PublicKey(
    "4u3eraNdnLt7Wtn1KNkYvf8nE2obu1vr4FsmLfowMGxP"
  );

  function toF32(number) {
    // Create a Float32Array with one element
    let f32Array = new Float32Array(1);
    // Assign the number to the first (and only) element of the array
    f32Array[0] = number;
    // Retrieve the number back in f32 format
    return f32Array[0];
  }

  function isMobileOrTablet() {
    return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
  }

  const getTransactionstatus = async (tx) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const result = await connection.getSignatureStatus(tx, {
      searchTransactionHistory: true,
    });
    console.log("🚀 ~ getTransactionstatus ~ result:", result);
    return result?.value?.confirmationStatus === "confirmed";
  };

  /**
   * @function Walletconncet
   * @param {data}
   * @returns {walletAdapter,Address,Sol}
   */

  const Walletconnect = async (data) => {
    const network = clusterApiUrl("devnet");
    console.log("🚀 ~ Walletconnect ~ network:", network);
    try {
      let walletAdapter;
      if (data === "math") {
        if (isMobileOrTablet()) {
          /* Mobile Walletconncet */
          walletAdapter = new WalletConnectWalletAdapter({
            network,
            options: {
              relayUrl: "wss://relay.walletconnect.com",
              projectId: "b8a1daa2dd22335a2fe1d2e139980ae0",
              metadata: {
                name: "Example App", // App Name
                description: "Example App", // App Description
                url: "https://200.140.70.236:3001/walcon", // App Frontend URL
                icons: [
                  "https://avatars.githubusercontent.com/u/35608259?s=200",
                ], // App Logo
              },
            },
          });
        } else {
          /* Math wallet Extension */
          walletAdapter = new MathWalletAdapter({ network });
        }
      }
      if (data === "mobile") {
        /* Solana Mobile wallet Adapter (panthom , solfare) */
        walletAdapter = new SolanaMobileWalletAdapter({
          addressSelector: createDefaultAddressSelector(),
          appIdentity: {
            name: "My app", //App Name
            uri: "https://200.140.70.236:3001/walcon", //App
            icon: "public/logo512.png",
          },
          authorizationResultCache: createDefaultAuthorizationResultCache(),
          cluster: "devnet",
          onWalletNotFound: createDefaultWalletNotFoundHandler(),
        });
      }
      if (data === "panthom") {
        /* Panthom wallet adapter */
        walletAdapter = new PhantomWalletAdapter();
      }
      if (data === "solfare") {
        /* Solfare wallet adapter */
        walletAdapter = new SolflareWalletAdapter({ network: "devnet" });
      }

      /* Wallet connections */
      await walletAdapter.connect();
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      let bal = await connection.getBalance(walletAdapter.publicKey);
      provider = walletAdapter;
      return {
        walletAdapter,
        Address: walletAdapter?.publicKey.toString(),
        Sol: bal / LAMPORTS_PER_SOL,
      };
    } catch (error) {
      if (data === "math") {
        let walletAdapter = new MathWalletAdapter({ network });
        if (walletAdapter.readyState === "NotDetected") {
          window.alert(
            "Math Wallet not Detected , make sure panthom is not exist"
          );
        } else {
          window.alert("Make Sure youre Wallet was unlocked");
        }
        return {};
      }
    }
  };

  /**
   * @function getTokenbalance
   * @param {walletAddress , tokenAddress}
   * @returns {tokenBalance,Decimal}
   */

  const getTokenbalance = async (walletAddress, tokenAddress) => {
    let tokenBalance = 0;
    let Decimal = 0;
    const response = await axios({
      url: `https://api.devnet.solana.com/`, // devnet URL or mainnet URL
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          walletAddress, // account addrss
          {
            mint: tokenAddress, // token mint address
          },
          {
            encoding: "jsonParsed",
          },
        ],
      },
    });
    console.log("🚀 ~ getTokenbalance ~ response:", response);
    if (
      Array.isArray(response?.data?.result?.value) &&
      response?.data?.result?.value?.length > 0 &&
      response?.data?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount
        ?.amount > 0
    ) {
      tokenBalance = Number(
        response?.data?.result?.value?.length > 0 &&
          response?.data?.result?.value[0]?.account?.data?.parsed?.info
            ?.tokenAmount?.uiAmount
      );
      Decimal =
        response?.data?.result?.value[0]?.account?.data?.parsed?.info
          ?.tokenAmount?.decimals;
    }
    return { tokenBalance, Decimal };
  };

  /**
   * @function SendSolanaWithoutUsingProgram
   * @param {fromAddress , toAddress , amount in lamports}
   * @returns {status : true or false}
   */
  const sendSolWithoutContract = async (fromAdd, toAdd, amount) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(fromAdd), // FROM ADDRESS
          toPubkey: new PublicKey(toAdd), // TO WALLET ADDRESS
          lamports: amount, // YOU WANT TO SEND AMOUNT
        })
      );
      transaction.feePayer = new PublicKey(fromAdd);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      console.log("blockhash-->", blockhash);
      const signed = await provider.signTransaction(transaction);
      console.log("signed-->", signed);
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log("signature-->", signature);
      let signhash = await connection.confirmTransaction(signature);
      console.log("signhash-->", signhash);
      let status = await getTransactionstatus(signature);
      return { status };
    } catch (err) {
      console.error(err);
      return { status: false };
    }
  };

  /**
   * @function createProgramInstance
   * @param {}
   * @returns {programInstance}
   */

  const getProgramInstance = async (jsonfile) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const anchorProvider = new anchor.AnchorProvider(connection, provider, {
      preflightCommitment: "confirmed",
    });
    anchor.setProvider(anchorProvider);
    console.log("🚀 ~ getProgramInstance ~ provider:", provider);
    const programID = new PublicKey(
      jsonfile ? jsonfile.metadata.address : idl.metadata.address
    );
    const anchorProgram = new anchor.Program(
      jsonfile ?? idl,
      programID,
      anchorProvider
    );
    programInstance = anchorProgram;
    return anchorProgram;
  };

  /**
   * @function SendSolanaUsingProgam
   * @param {fromAddress , toAddress , amount in lamports}
   * @returns {status : true or false}
   */
  const sendSolWithContract = async (fromAdd, toAdd, amount) => {
    try {
      const value = new anchor.BN(amount); // value you want to send
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const transfersolana = await programInstance.methods
        .transferLamports(value)
        .accounts({
          sender: new PublicKey(fromAdd), // FROM ADDRESS
          recipient: new PublicKey(toAdd), // TO ADDRESS
          system_program: new PublicKey(SystemProgram.programId.toString()),
        })
        .transaction();
      transfersolana.feePayer = new PublicKey(fromAdd);
      const { blockhash } = await connection.getLatestBlockhash();
      transfersolana.recentBlockhash = blockhash;
      console.log("blockhash-->", blockhash);
      const signed = await provider.signTransaction(transfersolana);
      console.log("signed-->", signed);
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log("signature-->", signature);
      let signhash = await connection.confirmTransaction(signature);
      console.log("signhash-->", signhash);
      let status = await getTransactionstatus(signature);
      return { status };
    } catch (error) {
      console.log("🚀 ~ sendSolWithContract ~ error:", error);
      return { status: false };
    }
  };

  /**
   * @function SingMessagewithwallet
   * @param {message}
   * @return {singHash}
   */
  const signmsg = async (message) => {
    const encodedMessage = new TextEncoder().encode(message);
    console.log("🚀 ~ signmsg ~ provider:", provider);
    const signedMessage = await provider.signMessage(encodedMessage, "hex");
    console.log(
      "🚀 ~ signmsg ~ signedMessage:",
      signedMessage,
      signedMessage?.toString()
    );
    return signedMessage?.signature?.toString();
  };

  /**
   * @function sendSPLTokenWithoutProgram
   * @param { fromAdd, toAdd, amount, tokenAdd , decimal }
   * @returns {status : true or false}
   */

  const sendTokenWithoutContract = async (
    fromAdd,
    toAdd,
    amount,
    tokenAdd,
    decimal
  ) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const value = new anchor.BN(amount * 10 ** Number(decimal)); // value you want to send
      const address = new PublicKey(fromAdd); // your address
      console.log("Token in console-->");
      const fromTokenAccount = await createATA(fromAdd, tokenAdd, fromAdd); // from accound address
      const toTokenAccount = await createATA(toAdd, tokenAdd, fromAdd); // to account address
      console.log("logToken-->", fromTokenAccount, toTokenAccount);
      const transaction = new Transaction().add(
        createTransferInstruction(
          new PublicKey(fromTokenAccount),
          new PublicKey(toTokenAccount),
          address,
          value,
          [],
          TOKEN_PROGRAM_ID
        )
      );
      transaction.feePayer = new PublicKey(fromAdd);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      console.log("blockhash-->", blockhash);
      const signed = await provider.signTransaction(transaction);
      console.log("signed-->", signed, signed.serialize());
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log("signature-->", signature);
      let signhash = await connection.confirmTransaction(signature);
      console.log("signhash-->", signhash);
      let status = await getTransactionstatus(signature);
      return { status };
    } catch (error) {
      console.log("🚀 ~ sendTokenWithoutContract ~ error:", error);
      return { status: false };
    }
  };

  /**
   * @function sendSPLTokenWithoutProgram
   * @param { fromAdd, toAdd, amount, tokenProgram , tokenAdd, decimal }
   * @returns {status : true or false}
   */

  const sendTokenWithContract = async (
    fromAdd,
    toAdd,
    amount,
    tokenProgram,
    tokenAdd,
    decimal
  ) => {
    try {
      const value = new anchor.BN(amount * 10 ** Number(decimal)); // you want send amout
      const address = new PublicKey(fromAdd); // YOUR WALLET ADDRESS
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const fromTokenAccount = await createATA(fromAdd, tokenAdd, fromAdd);
      const toTokenAccount = await createATA(toAdd, tokenAdd, fromAdd); // to account address

      const mintToken = new PublicKey(tokenProgram); // TOKEN PROGRAM ID

      let transfertoken = await programInstance.methods
        .transferSplTokens(value)
        .accounts({
          authority: address,
          sourceTokenAccount: new PublicKey(fromTokenAccount),
          destinationTokenAccount: new PublicKey(toTokenAccount),
          splTokenProgram: mintToken,
        })
        .transaction();
      console.log("transfertoken-->", transfertoken);
      transfertoken.feePayer = new PublicKey(fromAdd);
      const { blockhash } = await connection.getLatestBlockhash();
      transfertoken.recentBlockhash = blockhash;
      console.log("blockhash-->", blockhash);
      const signed = await provider.signTransaction(transfertoken);
      console.log("signed-->", signed, signed.serialize());
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log("signature-->", signature);
      let signhash = await connection.confirmTransaction(signature);
      console.log("signhash-->", signhash);
      let status = await getTransactionstatus(signature);
      return { status };
    } catch (error) {
      console.log("🚀 ~ sendTokenWithContract ~ error:", error);
      return { staus: false };
    }
  };

  /**
   *
   * @param {*} payer
   * @param {*} newAccount
   */
  const createAccount = async (payer, newAccount) => {
    console.log("🚀 ~ createAccount ~ payer,newAccount:", payer, newAccount);
    const connection = new Connection(clusterApiUrl("devnet"));
    let space = 0;
    const rentExemptionAmount =
      await connection.getMinimumBalanceForRentExemption(space);
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        payer,
        newAccount,
        lamports: rentExemptionAmount,
        space,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    transaction.feePayer = payer;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    console.log("blockhash-->", blockhash);
    const signed = await provider.signTransaction(transaction);
    console.log("signed-->", signed);
    const signature = await connection.sendRawTransaction(signed.serialize());
    console.log("signature-->", signature);
    let signhash = await connection.confirmTransaction(signature);
    console.log("signhash-->", signhash);
    let status = await getTransactionstatus(signature);
    return status;
  };

  /**
   * @function CreateAssociatedTokenAccount
   * @param {ADD ,tokenadd, signer}
   * @returns {AssociatedTokenAccount}
   */

  const createATA = async (ADD, tokenadd, signer) => {
    console.log(
      "🚀 ~ createATA ~ ADD, tokenadd, signer:",
      ADD,
      tokenadd,
      signer
    );
    return new Promise(async (resolve, reject) => {
      try {
        const connection = new Connection(
          "https://api.devnet.solana.com",
          "confirmed"
        );
        const publicKey = new PublicKey(ADD);
        const mintAddress = new PublicKey(tokenadd); // TOKEN ADDRESS

        // Calculate the associated token account address
        const ata = await getAssociatedTokenAddress(
          mintAddress,
          publicKey,
          false, // Allow owner off curve
          TOKEN_PROGRAM_ID, //new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log("ata-->", ata.toBase58());
        // Check if the associated token account already exists
        const ataInfo = await connection.getAccountInfo(ata);
        console.log("ataInfo-->", ataInfo);
        if (ataInfo) {
          console.log(
            `Associated token account already exists: ${ata.toBase58()}`
          );
          // return ata.toBase58();
          return resolve(ata.toBase58());
        }

        // Create the associated token account
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            new PublicKey(signer), // payer (connected walllet address)
            ata, // associated token account
            publicKey, // token account owner
            mintAddress // token mint
            // TOKEN_PROGRAM_ID,//new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
            // ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
        console.log("transaction-->", transaction);
        // Sign and send the transaction (assuming you have the public key's private key)
        // Here, replace `YOUR_PRIVATE_KEY` with the actual private key of the public key
        transaction.feePayer = new PublicKey(signer);
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        console.log("blockhash-->", blockhash);
        const signed = await web3.signTransaction(transaction);
        console.log("signed-->", signed);
        const signature = await connection.sendRawTransaction(
          signed.serialize()
        );
        console.log("signature-->", signature);
        let signhash = await connection.confirmTransaction(signature);
        console.log("signhash-->", signhash);
        // return ataInfo
        resolve(ata.toBase58());
      } catch (error) {
        console.error("Error creating associated token account:", error);
        reject(error);
        return null;
      }
    });
  };

  /**
   * @function TokenApproval
   * @param {*} address
   * @param {*} approvalAddress
   * @param {*} tokenAdd
   * @param {*} amount
   * @param {*} decimal
   * @returns { status : true or false}
   */

  const tokenApprove = async (
    address,
    approvalAddress,
    tokenAdd,
    amount,
    decimal
  ) => {
    try {
      const value = Number(amount); //new anchor.BN(amount * 10 ** Number(decimal)); // assuming token has 9 decimal places
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const walletPublicKey = new PublicKey(address); // from account or Owner of token
      const delegatePublicKey = new PublicKey(approvalAddress); // to account or recipiant of token
      const associatedMintTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(tokenAdd),
        new PublicKey(address)
      );
      // ); // associated token acoount from owner
      console.log("associatedMintTokenAddress-->", associatedMintTokenAddress);
      const transaction = new Transaction().add(
        createApproveInstruction(
          new PublicKey(associatedMintTokenAddress),
          delegatePublicKey,
          walletPublicKey,
          value,
          [],
          TOKEN_PROGRAM_ID
        )
      );
      transaction.feePayer = new PublicKey(walletPublicKey.toString());
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      console.log("blockhash-->", blockhash);
      const signed = await web3.signTransaction(transaction);
      console.log("signed-->", signed);
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log("signature-->", signature);
      if (signature) {
        console.log(
          "TransactionHash",
          `https://explorer.solana.com/tx/${signature}?cluster=devnet`
        );
      }
      let signhash = await connection.confirmTransaction(signature);
      console.log("signhash-->", signhash);
      let status = await getTransactionstatus(signature);
      return {status : true , hash : signature };
    } catch (error) {
      console.log("🚀 ~ tokenApprove ~ error:", error);
      return false;
    }
  }
 
  const nftDelegateApprove = async (
    walletAddress,
    nftAddress
  ) => {
    try{
    const delegateAddress = Keypair.generate();
    console.log(
      "🚀 ~ nftDelegateApprove ~ delegateAddress:",
      delegateAddress.publicKey.toString()
    );

    let string = arrayBufferToString(delegateAddress.secretKey.buffer);
    console.log("string", string);

    // let arraybuffer = stringToArrayBuffer(string);
    // console.log("arraybuffer:", arraybuffer);

    const seller = new PublicKey(walletAddress);
    // const nftMint = mintAddress;
    // console.log("🚀 ~ nftDelegateApprove ~ nftMint:", nftMint);
    /* Token Approve */
    const tokenapprove = await tokenApprove(
      seller.toString(),
      delegateAddress.publicKey.toString(),
      nftAddress.toString(), // mint Token Address
      1 // amount of Token
    );

    let retData = {
        status : tokenapprove.status,
        hash : tokenapprove.hash,
        delegateSecKey : string
    }
    return retData;
  }catch(err){
    return {
      status : false
  }
  }
  };

 

  const buyNFT = async (delegate,nftId,owner) => {
    console.log("🚀 ~ buyNFT ~ delegate,nftId,owner:", delegate,nftId,owner)
    try {
console.log('buyNFT-->',)
      const delegateSecretKey =
      stringToArrayBuffer(delegate);
  
    console.log("🚀 ~ Usewallet ~ delegateSecretKey:", delegateSecretKey);
    const delegateKeypair = Keypair.fromSecretKey(Buffer.from(delegateSecretKey));

      const delegateAddress = delegateKeypair;
      console.log(
        "🚀 ~ buyNFT ~ delegateAddress:",
        delegateAddress,
        delegateAddress.publicKey.toString()
      );
      const nftMint = new PublicKey(nftId);
      console.log("🚀 ~ buyNFT ~ nftMint:", nftMint);
      const price = new anchor.BN(1);
      console.log("🚀 ~ buyNFT ~ price:", price);
      const seller = new PublicKey(owner);

      console.log("🚀 ~ buyNFT ~ seller:", seller);
      const buyer = new PublicKey(accountAddress);
      console.log("🚀 ~ buyNFT ~ buyer:", buyer);
      let program = await getProgramInstance(idl);
      console.log("🚀 ~ buyNFT ~ program:", program);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const sellerATA = await getAssociatedTokenAddress(nftMint, seller);

      console.log("🚀 ~ buyNFT ~ sellerATA:", sellerATA);

      const buyerATA = 
      await createATA(
        buyer.toString(),
        nftMint.toString(),
        buyer.toString()
      );

      console.log("🚀 ~ buyNFT ~ buyerATA:", buyerATA);

      let transaction = await program.methods
        .buyNft(price)
        .accounts({
          buyer: buyer,
          seller: seller,
          sellerNftAccount: sellerATA, // Replace with the seller's NFT token account
          buyerNftAccount: buyerATA, // Replace with the buyer's NFT token account
          delegate: delegateAddress.publicKey, // Replace with the delegate authority's public key
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      console.log("transaction1111-,->", transaction);
      transaction.feePayer = buyer;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.sign(delegateAddress);
      console.log("blockhash-->", blockhash, transaction);
      const signed = await web3.signTransaction(transaction);
      console.log("signed-->", signed, connection);
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log("signature-->", signature);
      if (signature) {
        console.log(
          "TransactionHash",
          `https://explorer.solana.com/tx/${signature}?cluster=devnet`
        );
      }
      let signhash = await connection.confirmTransaction(signature);
      console.log("signhash-->", signhash);
      let status = await getTransactionstatus(signature);
      let retData = {
        HashValue : signature,
        status : true
      }
      return retData;
    } catch (err) {
      console.log("🚀 ~ buyNFT ~ err:", err);
      return false
    }
  };

  const mintNFT = async (walletAddress,metaipfs,nftName,royalty,count) => {
    const connection = new Connection(clusterApiUrl(Config.network), "confirmed");
    let program = await getProgramInstance(idl);
    const payer = new PublicKey(walletAddress);
    console.log("🚀 ~ constsol_git_mintfuct= ~ payer:", payer);
    const mintAccount = Keypair.generate();
    console.log("🚀 ~ constsol_git_mintfuct= ~ mintAccount:", mintAccount);
    const tokenMetadataProgram = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    console.log(
      "🚀 ~ constsol_git_mintfuct= ~ tokenMetadataProgram:",
      tokenMetadataProgram
    );
    const metadata = {
      name: nftName,
      symbol: "",
      uri: `${Config.IPFS}${metaipfs}`,//"https://naifty.infura-ipfs.io/ipfs/QmYqwDtZSJHzsrxjqwvntBp7CfwsN6AZPswAFSRrRVy3Wg",
    };
    const associatedTokenAccount = getAssociatedTokenAddressSync(
      mintAccount.publicKey,
      payer
    );
    console.log(
      "🚀 ~ constsol_git_mintfuct= ~ associatedTokenAccount:",
      associatedTokenAccount
    );
    const metadataAccount = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        tokenMetadataProgram.toBuffer(),
        mintAccount.publicKey.toBuffer(),
      ],
      tokenMetadataProgram
    )[0];

    const editionAccount = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        tokenMetadataProgram.toBuffer(),
        mintAccount.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      tokenMetadataProgram
    )[0];

    const tokenProgram = TOKEN_PROGRAM_ID;
    const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID;
    const systemProgram = SystemProgram.programId;
    console.log("🚀 ~ constsol_git_mintfuct= ~ systemProgram:", systemProgram);
    const rent = new PublicKey("SysvarRent111111111111111111111111111111111");

    let accounts = {
      payer: payer.toString(),
      metadataAccount,
      editionAccount,
      mintAccount: mintAccount.publicKey.toString(),
      associatedTokenAccount,
      tokenProgram,
      tokenMetadataProgram,
      associatedTokenProgram,
      systemProgram,
      rent,
    };

    let transaction = await program.methods
      .mintNft(metadata.name, metadata.symbol, metadata.uri)
      .accounts(accounts)
      .signers([mintAccount])
      // .rpc({ skipPreflight: true })
      .transaction();
    console.log("transaction-->", transaction);

    transaction.feePayer = payer;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.sign(mintAccount);
    console.log("blockhash-->", blockhash, transaction);
    const signed = await web3.signTransaction(transaction);
    console.log("signed-->", signed, connection);
    const signature = await connection.sendRawTransaction(signed.serialize());
    console.log("signature-->", signature);
    if (signature) {
      console.log(
        "TransactionHash",
        `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    }
    let signhash = await connection.confirmTransaction(signature);
    console.log("signhash-->", signhash);
    let status = await getTransactionstatus(signature);

    let retData = {
        HashValue : signature,
        tokenCounts : mintAccount.publicKey.toString(),  
    }
    return retData;
  };



  return {
    Walletconnect,
    getTokenbalance,
    sendSolWithoutContract,
    getProgramInstance,
    sendSolWithContract,
    signmsg,
    sendTokenWithoutContract,
    sendTokenWithContract,
    tokenApprove,
    buyNFT,
    nftDelegateApprove,
    mintNFT,
    Contract_Base_Validation
  };
}
