import { Bot, Context, Keyboard } from "grammy";
import { ConfigService } from "../config/config.service";

const bot = new Bot(ConfigService.get<string>("botConfig.token"));
const { PROTOCOL, HOST, PORT } = ConfigService.get<string>("serverOptions") as any;
const BACKEND_URL = `${PROTOCOL}://${HOST}:${PORT}`;

bot.command('start', async (ctx) => {
    const keyboard = new Keyboard().requestContact('Send My Contact').oneTime(true);
    const user = ctx.update.message.chat;

    return ctx.reply(`Salom ${user["first_name"] || "foydalanuvchi"} 👋
    @onlineplatformrobot'ning rasmiy botiga xush kelibsiz
    
    ⬇️ Kontaktingizni yuboring (tugmani bosib)
    `, { reply_markup: keyboard })
});
  
bot.on(':contact', async (ctx: Context) => {
    try {
        const message = ctx.update.message;
        const contact = message.contact;
        const user = message.chat as any;
    
        const query = `
            mutation($createUserQueueInput: CreateUserQueueInput!) {
                generateCode(createUserQueueInput: $createUserQueueInput) {
                  id
                  code
                  sended_time
                  telegram_user_id
                }
            }
        `
    
        const variables = {
            createUserQueueInput: {
              telegram_user_id: user.id,
              contact: contact.phone_number,
              fullname: user.first_name,
            }
        }
    
        const response = await fetch(BACKEND_URL + '/graphql', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables })
        })
    
        const codeResponse = (await response.json()).data.generateCode;
        ctx.reply(`
            sizning 1 daqiqalik kodingiz <code>${codeResponse.code}</code>. 
        `, {
            parse_mode: "HTML"
        })
    } catch (error) {
        console.log(error);
    }
})

bot.callbackQuery('send_contact', async (ctx) => {    
    await ctx.reply(`User's Contact Sent!\nUser ID: ${ctx.from.id}\n`);
});

bot.start()
console.log('bot eshityapti')

export default bot;