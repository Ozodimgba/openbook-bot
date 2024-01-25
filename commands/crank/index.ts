import searchMarkets from "../../helpers/searchMarket"
import scheduleCrank from "./scheduleCrank";


let crankDataStore = {};

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
  crankDataStore[chatId] = {
    ...crankDataStore[chatId],
    user: `${chatId}`,
  };

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
    crankDataStore[chatId] = {
      ...crankDataStore[chatId],
      market: foundMarket.market,
    };

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
          { text: 'Hour', callback_data: 'hour-crank' },
        ],
        [
          { text: 'Day', callback_data: 'day-crank' },
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
          crankDataStore[chatId] = {
            ...crankDataStore[chatId],
            period: "week",
          };
        
        const week = await bot.sendMessage(chatId, 'You selected "Week". Please input how many weeks you want:', {
            reply_markup: {
              force_reply: true,
            },
          });
        
          bot.onReplyToMessage(chatId, week.message_id, async (replyMessage) => {
            const userInput = replyMessage.text;
        
            // Validate if userInput is a number
            const weeks = parseInt(userInput);
        
            if (isNaN(weeks)) {
              // User input is not a valid number
              await bot.sendMessage(chatId, 'Error: Please input a valid number for the number of weeks.', {
                chat_id: chatId,
                message_id: week.message_id,
                 reply_markup: {
                   inline_keyboard: [
                            [
                              { text: 'Retry', callback_data: 'week-crank' },
                             ]
                           ]
                       },
              });
            } else {
              // Process the user's input as needed
              crankDataStore[chatId] = {
                ...crankDataStore[chatId],
                periodFreq: weeks,
              };
        
              await bot.sendMessage(chatId, `Your cranker will run once every ${weeks} weeks`, {
                reply_markup: {
                  inline_keyboard: [
                    [
                      { text: 'Confirm', callback_data: 'create-cranker' },
                    ]
                  ]
                },
              });
            }
          });
          break;
        

      // Add more cases as needed

      default:
        // Handle unknown selections
        break;
    }
  });

};

export const createCranker = async (bot, chatId) => {
  console.log(crankDataStore[chatId]);

  const user = crankDataStore[chatId].user;
  const periodNumber = crankDataStore[chatId].periodFreq;
  const period = crankDataStore[chatId].period;
  const market = crankDataStore[chatId].market

  try {
    const result = await scheduleCrank(user, periodNumber, period, market);
  
    if (result === true) {
      // Success: The cranker was created successfully
     await bot.sendMessage(chatId, `Your cranker has been created sucessfully!\nDetails:\nMarket:${market}\nInterval: Every ${periodNumber} ${period}s\n\nMake sure to fund your wallet with SOL as cranking requires SOL\n\nWe will send you notifications when your SOL balance is low, If you ignore and don't refund your cranking will be halted and you will have to re-register your cranker to continue
     \nYour can check and manage your crankers by calling the /cranker command`)
    } else {
      // Failure: Handle the error message
      await bot.sendMessage(chatId, `Some went wrong when creating your cranker`)
      console.error("Error creating cranker: " + result);
    }
  } catch (err) {
    // Handle any unhandled exceptions
    console.error("Unexpected error: " + err);
  }
};
