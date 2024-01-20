import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token: any = process.env.TELEGRAM || "";
const bot = new TelegramBot(token, { polling: true });

const commands = [
  { command: 'start', description: 'Start the bot' },
  { command: 'crank', description: 'Crank a particular market' },
  { command: 'wallet', description: 'Infomation on your openbook bot wallet' },
  { command: 'createMarket', description: 'Create market on openbook' },
  { command: 'placeOrder', description: 'Place order to buy or sell a token on openbook' },
];

// Set the commands
bot.setMyCommands(commands)
  .then(() => {
    console.log('Commands have been set successfully.');
  })
  .catch((error) => {
    console.error('Error setting commands:', error.message);
  });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! Welcome to the Open bot.');
});

bot.onText(/\/crank (.+)/, (msg: any, match: any) => {
  const chatId = msg.chat.id;
  console.log(match);
  const resp = match[1];

  // Send back the matched "whatever" to the chat without the original message
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/wallet (.+)/, (msg: any, match: any) => {
  const chatId = msg.chat.id;
  console.log(match);
  const resp = match[1];

  // Send back the matched "whatever" to the chat without the original message
  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg: any) => {
  const chatId = msg.chat.id;

  // Check if the message starts with a slash (/) which indicates a command
  if (msg.text && msg.text.startsWith('/')) {
    // Do not send the received message for command messages
    return;
  }

  // Send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '« 1', callback_data: 'first' },
          { text: '‹ 3', callback_data: 'prev' },
          { text: '· 4 ·', callback_data: 'stay' },
          { text: '5 ›', callback_data: 'next' },
          { text: '31 »', callback_data: 'last' },
        ],
      ],
    },
  });
});

