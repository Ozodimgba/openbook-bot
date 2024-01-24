import Redis from "ioredis"
import { Keypair } from "@solana/web3.js";
import dotenv from "dotenv"

dotenv.config()

const url: any = process.env.REDIS || "";
const client = new Redis(url);

const main = async () => {
    try {
      // Set a key-value pair in Redis
      // Sample user object
const userObject = {
  username: 'john_doe',
  email: 'john@example.com',
};

// Key representing the Redis list
const userListKey = 'users';

// Convert the user object to a JSON string
const jsonString = JSON.stringify(userObject);

// Push the JSON string into the Redis list
client.rpush(userListKey, jsonString)
  .then(() => {
    console.log('User pushed into the Redis list');
  })
  .catch((error) => {
    console.error('Error pushing user into Redis list:', error);
  });

      // const check = await client.get("foo")
      // console.log(check);
    } catch (error) {
      console.error('Error setting key in Redis:', error);
    } finally {
      // Close the Redis connection
      client.quit();
    }
  };

  // main();

  async function searchUserByEmail(email) {
    try {
      const userListKey = 'users';
      // Retrieve the list of users from Redis
      const userList = await client.lrange(userListKey, 0, -1);
  
      // Iterate through the list to find the user with the matching email
      for (const userString of userList) {
        const user = JSON.parse(userString);
        if (user.email === email) {
          return user; // Found the user with the matching email
        }
      }
  
      // User not found
      return null;
    } catch (error) {
      console.error('Error searching for user by email:', error);
      throw error;
    }
  }
  
  // Example usage
  const userEmailToSearch = 'john@example.com';
  searchUserByEmail(userEmailToSearch)
    .then((foundUser) => {
      if (foundUser) {
        console.log('User found:', foundUser);
      } else {
        console.log('User not found');
      }
    })
    .catch((error) => {
      console.error('Error searching for user:', error);
    });