import { Client, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { MemoryDatabase } from "./database/memoryDatabase";
import { requestGemini } from "./service/requestGeminiData";

const TOKEN =
  "MTIxMzQ5MTc0NzQzNTMxNTMzMA.GiFAtz.YPr0z-J2u8b83OnDJ-G9iKwxbxl0R4iOGLvo3k";
const CLIENT_ID = "1213491747435315330";

const commands = [
  {
    name: "prompt",
    description: "prompt things...",
    options: [
      {
        name: "text",
        description: "text to prompt",
        type: 3,
        required: true,
      },
    ],
  },
];
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST().setToken(TOKEN);

const database = MemoryDatabase.getInstance();

client.on("ready", () => {
  console.log(`${client?.user!.tag} has loggin`);
});

client.on("guildCreate", async (guild) => {
  guild.systemChannel?.send(
    "Olá! Eu sou o seu novo bot. Qual prompt você gostaria de definir?"
  );

  const filter = (m: any) =>
    m.author.id === guild.ownerId && m.channel.id === guild.systemChannelId;
  const collector = guild.systemChannel?.createMessageCollector({
    filter,
    max: 1,
    time: 60000,
  });
  const idGuild = guild.id;
  collector?.on("collect", async (m) => {
    const prompt = m.content;
    console.log(`Prompt definido para o servidor ${guild.name}: ${prompt}`);
    database.createNewHistory(idGuild, prompt);
    console.log(m.author.id);
    console.log(idGuild);

    collector.stop();
  });

  collector?.on("end", (_, reason) => {
    if (reason === "time") {
      database.createNewHistory(
        idGuild,
        "Olá chat, voce vai responder as perguntas mais diversas de maneira curta e simples."
      );
    }
    collector.stop();
  });

  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, idGuild), {
    body: commands,
  });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await interaction.deferReply();

    const msg = interaction.options.get("text")?.value as string;

    try {
      const result = await requestGemini(msg, interaction.guild?.id!);
      await interaction.editReply({ content: result });
    } catch (error) {
      await interaction.editReply({
        content: `Ops, não consegui fazer nada com o prompt "${msg}"`,
      });
      console.error(error);
    }
  }
});

async function main() {
  try {
    console.log("Started refreshing application (/) commands");
    client.login(TOKEN);
  } catch (error) {
    console.error(error);
  }
}

main();
