import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { MarketAccount, OpenBookV2Client } from "../../ts/client/src";
import { RPC, authority, programId, sleep } from "../../helpers/utils";
import { AnchorProvider, BN, Wallet } from "@coral-xyz/anchor";
import { Logger } from 'tslog';
import { error } from "console";
import dotenv from 'dotenv'

dotenv.config()

async function start(
    ) {

  const {
    ENDPOINT_URL,
    INTERVAL,
    MARKET_ID,
    CONSUME_EVENTS_LIMIT,
    CLUSTER,
  } = process.env;

  
   const wallet = new Wallet(authority);

   const log = new Logger({name: "openbook-cranker-V2", minLevel: 1});

   const cluster = CLUSTER || 'devnet';
   const interval = INTERVAL || 1000 * 10;
   const limit = new BN(CONSUME_EVENTS_LIMIT || 7)
   const marketId = MARKET_ID || "GTDUTmgYsRLdYNPueUwxFYkfC37gBawYftjG3tmJmbWh"

   

   if(!CLUSTER){
    log.warn("Cluster is not set, using fallback cluster");
   }

   if(!MARKET_ID){
    log.warn("Market ID error")
   }

   if(!CONSUME_EVENTS_LIMIT){
    log.warn("Limit is not set, using fallback limit")
   }
   
   if(!INTERVAL){
    log.warn("Interval is not set, will crank every 10 second")
   }
   

   const provider = new AnchorProvider(new Connection(clusterApiUrl("devnet")), wallet, {
    commitment: "confirmed",
   });

  while(true){
    try{
      
   log.info("Cranking by: "+ authority.publicKey.toBase58())
   
   const balance: number | any = await provider.connection.getBalance(authority.publicKey)

   log.info(("BALANCE: "+ balance / LAMPORTS_PER_SOL) + " SOL")

   const client = new OpenBookV2Client(provider, programId);

   const marketPubkey = new PublicKey(marketId);
   log.info("CRANKING MARKET: "+ marketPubkey.toBase58())

   const marketObject = await client.getMarket(marketPubkey)

  if (!marketObject) {
    throw "No market";
  }

  const events = await client.getEventHeap(marketObject.eventHeap)

  const remainingAccts: PublicKey[] = await client.getAccountsToConsume(marketObject)

    if(remainingAccts.length > 0) {
      const tx = await client.consumeEvents(marketPubkey, marketObject, limit, remainingAccts)
      log.info("Signature: "+ tx)
    }
  await sleep(interval)
  } catch(e){
    log.error(e);

  }
  };  

}

start();