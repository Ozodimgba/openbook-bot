import { Client } from "@upstash/qstash";
import dotenv from "dotenv";

dotenv.config();

const token: any = process.env.QSTASH_TOKEN || "";

const c = new Client({
  token: token,
});

async function main() {
  try {
    await c.schedules.create({
      destination: process.env.SERVER_URL || "",
      cron: "* * * * *",
      body: JSON.stringify({ ask: "value" })
    });

    // const list = await c.schedules.list()
    // console.log(list)
    console.log("Schedule created successfully.");
  } catch (error) {
    console.error("Error creating schedule:", error);
  }
}

main();
