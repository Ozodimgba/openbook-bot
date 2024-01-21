import { Keypair } from "@solana/web3.js";

const wallet = Keypair.generate().publicKey.toBase58()

console.log(wallet)