import Redis from "ioredis";
import { Keypair } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

const url: any = process.env.REDIS || "";
const client = new Redis(url);

async function rescheduleTaskLuaScript(taskId: string, newTimestamp: number): Promise<void> {
  try {
    const luaScript = `
      local taskId = ARGV[1]
      local newTimestamp = ARGV[2]

      redis.call('ZADD', 'sortedTasks', newTimestamp, taskId)
    `;

    // Execute the Lua script
    await client.eval(luaScript, 0, taskId, newTimestamp);
    console.log(`Task ${taskId} rescheduled to ${newTimestamp}`);
  } catch (error) {
    console.error('Error executing Lua script:', error);
  }
}

async function processTasks(interval: number): Promise<void> {
  try {
    while (true) {
      // Retrieve the task with the earliest timestamp from the sorted set
      const [taskId, timestamp] = await client.zrange('sortedTasks', 0, 0, 'WITHSCORES');

      if (!taskId || !timestamp) {
        console.log('No tasks to process. Waiting...');
        // Adjust the delay based on your requirements
        await new Promise(resolve => setTimeout(resolve, interval));
        continue; // Go to the next iteration of the loop
      }

      // Check if the task is ready to be processed (timestamp is in the past)
      const currentTimestamp = new Date().getTime();
      if (parseInt(timestamp) <= currentTimestamp) {
        // Perform the processing logic for the task here
        console.log(`Processing task: ${taskId}`);

        // Calculate the new timestamp for rescheduling (e.g., after the specified interval)
        const newTimestamp = currentTimestamp + interval;

        // Reschedule the task using the provided Redis client
        await rescheduleTaskLuaScript(taskId, newTimestamp);

        // Optionally, perform any additional processing steps
      } else {
        console.log('No tasks ready for processing. Waiting...');
      }

      // Adjust the delay based on your requirements
      await new Promise(resolve => setTimeout(resolve, interval));
    }

  } catch (error) {
    console.error('Error processing tasks:', error);
  }
}

// Example usage
const processingInterval = 2* 1000; // 24 hours (in milliseconds)

// Call the function to process tasks perpetually
processTasks(processingInterval);
