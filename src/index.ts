import dotenv from "dotenv";
import { BotController } from "./controller/botController";


dotenv.config();
async function main() {
  try {
    const bot = new BotController({token: process.env.TOKEN!, clientId: process.env.CLIENT_ID!});
    
    bot.initListeners();
    bot.login();
    console.log("Started refreshing application (/) commands");
  } catch (error) {
    console.error(error);
  }
}

main();
