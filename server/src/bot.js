const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");
const bot = new TelegramBot(config.telegram.token, { polling: true });
const crypto = require("crypto");

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `Welcome to the bot! Use /help to see available commands.`;

  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: {
      keyboard: [[{ text: "Get verification code", request_contact: true }]],
      resize_keyboard: true,
    },
  });
});

bot.on("contact", (msg) => {
  const chatId = msg.chat.id;
  const contact = msg.contact;
  const code = crypto.randomInt(100000, 999999).toString();

  if (msg.from.id === contact.user_id) {
    const message = `Your contact has been verified. Here is your verification code: <tg-spoiler>${code}</tg-spoiler>`;
    return bot.sendMessage(chatId, message, {
      parse_mode: "HTML",
    });
  }

  const message = `Your contact is not verified. Please try again.`;
  return bot.sendMessage(chatId, message);
});

console.log("✅ Telegram bot is running...");
module.exports = bot;
