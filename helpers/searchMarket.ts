import { Connection, PublicKey } from "@solana/web3.js";
import { getProvider, Program } from "@coral-xyz/anchor";
import { RPC, getKeypairFromFile, programId } from "../helpers/utils";
import * as os from "os";
import {
  OpenBookV2Client,
  IDL,
  type OpenbookV2,
} from "@openbook-dex/openbook-v2";
import { findAllMarkets } from "@openbook-dex/openbook-v2";

export default async function searchMarkets(targetMarketId: string) {
    const connection = new Connection(RPC, "confirmed");
  
    try {
      let markets = await findAllMarkets(connection, programId);
  
      // Iterate through the array and find the market with the matching market ID
      for (const market of markets) {
        if (market.market === targetMarketId) {
          console.log(market)
          return market; // Return the matching market object
        }
      }
  
      // If no match is found, return null or handle it according to your needs
      return null;
    } catch (error) {
      // Handle errors, log them, or throw further if needed
      console.error("Error in searchMarkets:", error);
      return null;
    }
  }
  

// const targetMarketId = '6zMCNwMSSWCZVENSjkjkdoDPxqZ334NFjhgfvkxWhP1o';
// searchMarkets(targetMarketId);