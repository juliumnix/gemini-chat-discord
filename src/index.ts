import { Client, GatewayIntentBits, Message, Routes } from "discord.js";
import { BotController } from "./controller/botController";

const TOKEN =
  "MTIxMzQ5MTc0NzQzNTMxNTMzMA.GiFAtz.YPr0z-J2u8b83OnDJ-G9iKwxbxl0R4iOGLvo3k";
const CLIENT_ID = "1213491747435315330";

async function main() {
  try {
    console.log("Started refreshing application (/) commands");
    const bot = new BotController({token: TOKEN, clientId: CLIENT_ID});
    
    bot.initListeners();
    bot.login();
  } catch (error) {
    console.error(error);
  }
}

main();
