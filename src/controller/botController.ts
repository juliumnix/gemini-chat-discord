import {
  Client,
  GatewayIntentBits,
  Guild,
  Interaction,
  Message,
  REST,
  Routes,
} from "discord.js";
import { MemoryDatabase } from "../database/memoryDatabase";
import { requestGemini } from "../service/requestGeminiData";

interface BotControllerProps {
  token: string;
  clientId: string;
}

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

export class BotController {
  private client: Client;
  private database: MemoryDatabase;
  private rest: REST;
  private clientId: string;
  private token: string;

  constructor({ token, clientId }: BotControllerProps) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.database = MemoryDatabase.getInstance();
    this.rest = new REST().setToken(token);
    this.clientId = clientId;
    this.token = token;
  }

  public login() {
    try {
      this.client.login(this.token);
    return true;
    } catch (error) {
      if(error){
        return false;
      }
    }
  }

  public initListeners(): boolean {
    try {
      this.client.on("ready", () => {
        console.log(`${this.client?.user!.tag} has loggin`);
      });

      this.client.on("guildCreate", async (guild) => {
        await this.insertPromptInDatabase(guild);
      });

      this.client.on("interactionCreate", async (interaction) => {
        await this.interactWithGemini(interaction);
      });

      return true;
    } catch (error){
      return false;
    }
  }

  private async interactWithGemini(interaction: Interaction) {
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
  }

  private async insertPromptInDatabase(guild: Guild) {
    guild.systemChannel?.send(
      "Olá! Eu sou o seu novo bot. Qual prompt você gostaria de definir?"
    );

    const filter = (message: Message) =>
      message.author.id === guild.ownerId && message.channel.id === guild.systemChannelId;

    const collector = guild.systemChannel?.createMessageCollector({
      filter,
      max: 1,
      time: 60000,
    });
    const idGuild = guild.id;
    collector?.on("collect", async (message) => {
      const prompt = message.content;
      this.database.createNewHistory(idGuild, prompt);

      collector.stop();
    });

    collector?.on("end", (_, reason) => {
      if (reason === "time") {
        this.database.createNewHistory(
          idGuild,
          "Olá chat, voce vai responder as perguntas mais diversas de maneira curta e simples."
        );
      }
      collector.stop();
    });

    await this.rest.put(
      Routes.applicationGuildCommands(this.clientId, idGuild),
      {
        body: commands,
      }
    );
  }
}
