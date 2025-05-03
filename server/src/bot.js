const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");
const bot = new TelegramBot(config.telegram.token, { polling: true });
const crypto = require("crypto");
const { query } = require("./utils/sql.helper");
const { v4: uuidv4 } = require("uuid");

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `Welcome to the bot! Use /help to see available commands.`;
  await bot.sendChatAction(chatId, "typing");

  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: {
      keyboard: [[{ text: "Get verification code", request_contact: true }]],
      resize_keyboard: true,
    },
  });
});

bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const contact = msg.contact;
  const code = crypto.randomInt(100000, 999999).toString();
  await bot.sendChatAction(chatId, "typing");

  if (msg.from.id === contact?.user_id) {
    const sqlGetUser = `SELECT * FROM users WHERE telegram_id = ?`;
    const userData = await query(sqlGetUser, [msg.from.id]);

    const payload = {
      id: uuidv4(),
      action: userData.length ? "login" : "register",
      data: JSON.stringify({
        telegram_id: msg.from.id,
        first_name: msg?.from?.first_name || null,
        last_name: msg?.from?.last_name || null,
        phone: contact?.phone_number,
      }),
      telegram_id: msg.from.id,
      code: code,
    };

    const sqlCheckVerification = `SELECT * FROM verification_codes WHERE telegram_id = ? AND is_used = 0`;
    const verificationData = await query(sqlCheckVerification, [msg.from.id]);
    if (verificationData.length) {
      const sqlUpdateVerification = `UPDATE verification_codes SET code = ? WHERE telegram_id = ?`;
      await query(sqlUpdateVerification, [code, msg.from.id]);

      const message = `Your contact has been verified. Here is your new verification code: <tg-spoiler>${code}</tg-spoiler>`;
      return bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    }

    const sqlInsertVerification = `INSERT INTO verification_codes SET ?`;
    const result = await query(sqlInsertVerification, [payload]);

    if (result?.affectedRows) {
      const message = `Your contact has been verified. Here is your verification code: <tg-spoiler>${code}</tg-spoiler>`;
      return bot.sendMessage(chatId, message, { parse_mode: "HTML" });
    }

    const message = `Your contact is verified. Please try again.`;
    return bot.sendMessage(chatId, message);
  }

  const message = `Your contact is not verified. Please try again.`;
  return bot.sendMessage(chatId, message);
});

console.log("✅ Telegram bot is running...");
module.exports = bot;
