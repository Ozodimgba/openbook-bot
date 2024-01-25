import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import * as crank from './commands/crank'


dotenv.config();

const token: any = process.env.TELEGRAM || "";
const bot = new TelegramBot(token, { polling: true });

// const web_link = "https://celebrated-torte-184681.netlify.app/";

bot.on('callback_query', (callbackQuery: any) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  // Handle different button callbacks
  switch (data) {
    case 'crank':
      crank.handleCrank(bot, chatId);
      break;
    case 'newCrank':
      crank.handleNewCrank(bot, chatId);
      break;
    case 'interval':
      crank.handleInterval(bot, chatId);
      break;
    case 'custom-crank':
      crank.handleCustomCrank(bot, chatId);
      break;
    case 'create-cranker':
      crank.createCranker(bot, chatId);
      break;
    case 'create_market':
      // Handle the 'Create Market' button click
      bot.sendMessage(chatId, 'Create Market button clicked!');
      break;

    case 'settings':
      // Handle the 'Settings' button click
      bot.sendMessage(chatId, '*Settings:*\n\n', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Change Cluster', callback_data: 'crank' },
              { text: 'Consume event limit', callback_data: 'get_markets' },
            ],
            [
              { text: 'Edit Cranker', callback_data: 'place_order' },
              { text: 'Change wallet', callback_data: 'create_market' },
            ],
          ]
        }
      });
      break;

    case 'close_market':
      // Handle the 'Close Market' button click
      bot.sendMessage(chatId, 'Close Market button clicked!');
      break;

    case 'get_markets':
      // Handle the 'Get Markets' button click
      bot.sendMessage(chatId, 'Get Markets button clicked!');
      break;

    default:
      // Handle unknown button clicks
      break;
  }
});

const commands = [
  { command: 'start', description: 'Start the bot' },
  { command: 'crank', description: 'Crank a particular market' },
  { command: 'wallet', description: 'Infomation on your openbook bot wallet' },
  { command: 'cranker', description: 'Information about all your cranking events and costs' },
  // { command: 'cluster', description: 'Infomation on solana cluster(mainet/devnet)' },
  // { command: 'createMarket', description: 'Create market on openbook' },
  // { command: 'placeOrder', description: 'Place order to buy or sell a token on openbook' },
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
  console.log(chatId)
  bot.sendMessage(chatId, '*Hello! Welcome to the Openbook bot.*\nA cutting edge bot built on top of Openbook V2.\n\n', {
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Crank', callback_data: 'crank' },
        { text: 'Get Markets', callback_data: 'get_markets' },
      ],
      [
        { text: 'Place Order', callback_data: 'place_order' },
        { text: 'Create Market', callback_data: 'create_market' },
      ],
      [
        { text: 'Settings', callback_data: 'settings' },
        { text: 'Close Market', callback_data: 'close_market' },
      ],
    ],
  },
  });

  });


bot.onText(/\/wallet (.+)/, (msg: any, match: any) => {
  const chatId = msg.chat.id;
  console.log(match);
  const resp = match[1];

  // Send back the matched "whatever" to the chat without the original message
  bot.sendMessage(chatId, resp);
});

// bot.onText(/\/crank/, async (msg: any, match: any) => {
//   const namePrompt = await bot.sendMessage(msg.chat.id, "Hi, what's your name?", {
//       reply_markup: {
//           force_reply: true,
//       },
//   });
//   bot.onReplyToMessage(msg.chat.id, namePrompt.message_id, async (nameMsg) => {
//       const name = nameMsg.text;
//       // save name in DB if you want to ...
//       await bot.sendMessage(msg.chat.id, `Hello ${name}!`);
//   });
// });

bot.onText(/\/crank/, (msg) => crank.handleCrank(bot, msg.chat.id));

bot.onText(/\/cranker/, (msg: any, match: any) => {
  const chatId = msg.chat.id;


  const web_link = "https://celebrated-torte-184681.netlify.app/";
  // Send back the matched "whatever" to the chat without the original message
  bot.sendMessage(chatId, 'Received your message', {
    reply_markup: {
      keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
    },
  });
});

// bot.on('message', (msg: any) => {
//   const chatId = msg.chat.id;

//   // Check if the message starts with a slash (/) which indicates a command
//   if (msg.text && msg.text.startsWith('/')) {
//     // Do not send the received message for command messages
//     return;
//   }

//   // Send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message', {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           { text: '« 1', callback_data: 'first' },
//           { text: '‹ 3', callback_data: 'prev' },
//           { text: '· 4 ·', callback_data: 'stay' },
//           { text: '5 ›', callback_data: 'next' },
//           { text: '31 »', callback_data: 'last' },
//         ],
//       ],
//     },
//   });
// });

export default bot;