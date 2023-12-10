import { Bot, Context } from "grammy";
import { ConfigService } from "../config/config.service";

const bot = new Bot(ConfigService.get<string>("botConfig.token")); 

bot.command("start", (ctx: Context) => {
    const user = ctx.update.message.chat
    if (user.type !== "private") {
        return;
    }
    console.log(user);
    ctx.reply("Welcome! Up and running.")
});

bot.on("message", (ctx: Context) => ctx.reply("Got another message!"));


bot.start();
console.log("Bot ishlayapti")