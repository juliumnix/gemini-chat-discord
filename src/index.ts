import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { MemoryDatabase } from './database/memoryDatabase';

const TOKEN =
  'MTIxMzQ5MTc0NzQzNTMxNTMzMA.GsO2c0.PnZsobeu3JTgX4VIRSjcbW-dAai3IahtRNpupY';

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  const database = MemoryDatabase.getInstance();

  client.on('ready', () => {console.log(`${client?.user!.tag} has loggin`)});

  client.on('guildCreate', guild => {
    guild.systemChannel?.send('Olá! Eu sou o seu novo bot. Qual prompt você gostaria de definir?');

    const filter = (m: any) => m.author.id === guild.ownerId && m.channel.id === guild.systemChannelId;
    const collector = guild.systemChannel?.createMessageCollector({ filter, max: 1, time: 60000 });
    const idGuild = guild.id;
    collector?.on('collect', m => {
        const prompt = m.content;
        console.log(`Prompt definido para o servidor ${guild.name}: ${prompt}`);
        database.createNewHistory(idGuild, prompt);
        collector.stop();
    });

    collector?.on('end', (_, reason) => {
        if (reason === 'time') {
            database.createNewHistory(idGuild, "Olá chat, voce vai responder as perguntas mais diversas de maneira curta e simples.");
        }
        collector.stop();
    });
});

function teste() {
    console.log('Started refreshing application (/) commands');
    client.login(TOKEN)
    
}

teste()


