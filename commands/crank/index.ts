import searchMarkets from "../../helpers/searchMarket"


export const handleCrank = (bot, chatId) => {
  bot.sendMessage(chatId, '*Cranker*\nThis tool allows market owners to prefund their wallet with SOL and automatically crank their markets at pre-set intervals\n\nThe crank tool provides monitoring cost analysis and notification for cranking events', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Crank new Market', callback_data: 'newCrank' },
        ],
        [
          { text: 'View current crankers', callback_data: 'place_order' },
        ],
      ],
    },
  });
};

export const handleNewCrank = async (bot, chatId) => {
  const targetMarket = await bot.sendMessage(chatId, "Please input the marker ID of the market you want to crank", {
    reply_markup: {
      force_reply: true,
    },
  });

  bot.onReplyToMessage(chatId, targetMarket.message_id, async (market) => {
    const marketID = market.text;

    const foundMarket = await searchMarkets(marketID);

    if (foundMarket) {
    // Market found, reply with market information
    await bot.sendMessage(chatId, `Market found!\nMarket ID: ${foundMarket.market}\nPair: ${foundMarket.name}`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Confirm', callback_data: 'interval' },
          ]
        ]
      }
    });
    } else {
    // Market not found, reply with a message indicating that
    await bot.sendMessage(chatId, `Market not found for ID: ${marketID}`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Change market ID', callback_data: 'newCrank' },
          ]
        ]
      }
    });
    }

  });
};

export const handleInterval = (bot, chatId) => {
  bot.sendMessage(chatId, 'Please select the intervals you want your craker to run', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Every Minute', callback_data: 'minute-crank' },
        ],
        [
          { text: 'Every Hour', callback_data: 'hour crank' },
        ],
        [
          { text: 'Every Day', callback_data: 'day crank' },
        ],
        [
          { text: 'Customize', callback_data: 'custom-crank' },
        ]
      ]
    }
  });
};

// In your crankHandler.js file

export const handleCustomCrank = async (bot, chatId) => {
  bot.sendMessage(chatId, 'Select the period you want the crank to run', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Minute', callback_data: 'minute-crank' },
        ],
        [
          { text: 'Hour', callback_data: 'hour crank' },
        ],
        [
          { text: 'Day', callback_data: 'day crank' },
        ],
        [
          { text: 'Week', callback_data: 'week-crank' },
        ]
      ]
    }
  });

  // Listen for the user's selection
  const callbackQuery = bot.on('callback_query', async (callbackQuery) => {
    const selectedPeriod = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    // Handle the user's selection
    switch (selectedPeriod) {
      case 'minute-crank':
        await bot.sendMessage(chatId, 'You selected "Minute". Please input how many minutes you want:');
        break;

      case 'hour crank':
        await bot.sendMessage(chatId, 'You selected "Hour". Please input how many hours you want:');
        break;

      case 'day crank':
        await bot.sendMessage(chatId, 'You selected "Day". Please input how many days you want:');
        break;

      case 'week-crank':
        const week = await bot.sendMessage(chatId, 'You selected "Week". Please input how many weeks you want:', {
          reply_markup: {
            force_reply: true,
          },
        });

        bot.onReplyToMessage(chatId, week.message_id, async (replyMessage) => {
          const userInput = replyMessage.text;
          // Process the user's input as needed
          await bot.sendMessage(chatId, `Your cranker will run once every ${userInput} weeks`, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Confirm', callback_data: 'create-cranker' },
                ]
              ]
            },
          });
        });
        break;

      // Add more cases as needed

      default:
        // Handle unknown selections
        break;
    }
  });

};

