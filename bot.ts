import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

dotenv.config()

// replace the value below with the Telegram token you receive from @BotFather
const token: any = process.env.TELEGRAM || "";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg: any, match: any) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg: any) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
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