const {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} = require("discord-interactions");
const config = require("../config.json");
const dcapi = require("discord-api-types/v10");
const express = require("express");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} = require("@discordjs/builders");
const getDoviz = require("../functions/getDoviz");

const Colors = {
  Default: 0x000000,
  White: 0xffffff,
  Aqua: 0x1abc9c,
  Green: 0x57f287,
  Blue: 0x3498db,
  Yellow: 0xfee75c,
  Purple: 0x9b59b6,
  LuminousVividPink: 0xe91e63,
  Fuchsia: 0xeb459e,
  Gold: 0xf1c40f,
  Orange: 0xe67e22,
  Red: 0xed4245,
  Grey: 0x95a5a6,
  Navy: 0x34495e,
  DarkAqua: 0x11806a,
  DarkGreen: 0x1f8b4c,
  DarkBlue: 0x206694,
  DarkPurple: 0x71368a,
  DarkVividPink: 0xad1457,
  DarkGold: 0xc27c0e,
  DarkOrange: 0xa84300,
  DarkRed: 0x992d22,
  DarkGrey: 0x979c9f,
  DarkerGrey: 0x7f8c8d,
  LightGrey: 0xbcc0c0,
  DarkNavy: 0x2c3e50,
  Blurple: 0x5865f2,
  Greyple: 0x99aab5,
  DarkButNotBlack: 0x2c2f33,
  NotQuiteBlack: 0x23272a,
};
/**
 *
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  (async () => {
    await InstallGlobalCommands(config.discordBot.appID, [
      new SlashCommandBuilder().setName("test").setDescription("Test").toJSON(),
      new SlashCommandBuilder()
        .setName("api")
        .setDescription("Api Listesi")
        .toJSON(),
    ]);
  })();
  app.use(
    express.json({ verify: VerifyDiscordRequest(config.discordBot.publicKey) })
  );

  app.post("/api/interactions", async (req, res) => {
    const { type, id, data } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;
      if (name === "test") {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Çalışıyorum",
          },
        });
      } else if (name == "api") {
        await res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Kontrol etmek istediğin apiye tıkla",
            components: [
              new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId("dovizbutton")
                    .setLabel("Döviz")
                    .setStyle(dcapi.ButtonStyle.Danger)
                )
                .toJSON(),
            ],
          },
        });
      }
    }
    if (type == InteractionType.MESSAGE_COMPONENT) {
      const { custom_id, component_type } = data;
      if (component_type == dcapi.ComponentType.Button) {
        if (custom_id == "dovizbutton") {
          const endpoint = `webhooks/${config.discordBot.appID}/${req.body.token}/messages/${req.body.message.id}`;

          try {
            // Send results
            res.send({
              type: InteractionResponseType.UPDATE_MESSAGE,
              data: { content: "Kontrol ediliyor..." , components: [],},
             
            });
            const values = await getDoviz();
            setTimeout(async()=>{
              
            if (!values)
              return await DiscordRequest(endpoint, {
                method: "PATCH",
                body: {
                  content: "Failed to get info",
                  components: [],
                },
              });
            await DiscordRequest(endpoint, {
              method: "PATCH",
              body: {
                content: "",
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Döviz API")
                    .setTimestamp()
                    .setColor(Colors.Yellow)
                    .setFields(
                      {
                        name: "USD/TRY",
                        value: `${values.dolar}TRY`,
                        inline: true,
                      },
                      {
                        name: "EUR/TRY",
                        value: `${values.euro}TRY`,
                        inline: true,
                      },
                      {
                        name: "GBP/TRY",
                        value: `${values.sterlin}TRY`,
                        inline: true,
                      }
                    )
                    .toJSON(),
                ],
                components: [],
              },
            });
            },1000)
          } catch (err) {
            console.error("Error sending message:", err);
          }
        }
      }
    }
  });
};
function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

async function DiscordRequest(endpoint, options) {
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${config.discordBot.token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "Uptrical Bot/1.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

async function InstallGlobalCommands(appId, commands) {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, { method: "PUT", body: commands });
  } catch (err) {
    console.error(err);
  }
}
