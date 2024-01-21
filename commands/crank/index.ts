export default bot => async message => {
    try {
      const namePrompt = await bot.sendMessage(message.chat.id, "Hi, what's your market?", {
        reply_markup: {
          force_reply: true,
        },
      });
  
      bot.onReplyToMessage(message.chat.id, namePrompt.message_id, async (nameMsg) => {
        const name = nameMsg.text;
        // save name in DB if you want to ...
        await bot.sendMessage(message.chat.id, `Hello ${name}!`);
      });
    } catch (error) {
      console.error(error);
    }
  };
  