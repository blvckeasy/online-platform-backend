import { Bot, Context, Keyboard } from "grammy";
import { ConfigService } from "../config/config.service";

async function botBootstrap () {
    const bot = new Bot(ConfigService.get<string>("botConfig.token"));
    const { PROTOCOL, HOST, PORT } = ConfigService.get<string>("serverOptions") as any;
    const BACKEND_URL = `${PROTOCOL}://${HOST || "localhost"}:${PORT}`;
    
    bot.command('start', async (ctx) => {
        const keyboard = new Keyboard().requestContact('Send My Contact').oneTime(true);
        const user = ctx.update.message.chat;
    
        return ctx.reply(`Salom ${user["first_name"] || "foydalanuvchi"} 👋
@onlineplatform42'ning rasmiy botiga xush kelibsiz
        
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
                  telegram_user_id: String(user.id),
                  contact: contact.phone_number,
                  fullname: `${user.first_name} ${user.last_name || ""}`.trim(),
                }
            }
        
            const response = await fetch(BACKEND_URL + '/graphql', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query, variables })
            }) 

            const { data, errors } = await response.json();

            if (errors) {
                console.error(errors);
                return;
            }

            const codeResponse = data.generateCode;
            
            return ctx.reply(`
                sizning 1 daqiqalik kodingiz <code>${codeResponse.code}</code>. 
            `, {
                parse_mode: "HTML",
                reply_markup: {
                    remove_keyboard: true,
                }
            })
        } catch (error) {
            console.log(error);
        }
    })

    // await bot.stop();
    bot.start({
        onStart(botInfo) {
            console.log('🤖 Bot is listening')
        },
    })
}

export default botBootstrap;