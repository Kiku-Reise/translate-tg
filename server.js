const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const translate = require('@vitalets/google-translate-api');

const apiId = 7444397;
const apiHash = "4383298978b7f1c5c4d91b084c700e38";
const stringSession = new StringSession(
  "1BVtsOLQBuyGi-h9i1q1unB-AO6fdVjpSG5FD1WGE4E13A8jhtuDjljKruMcgsvGWNf1IHtx-BeFxjVsogyuuOXTzoOPxxkdV00D6IF-zcNHOUzbU_qQ9g_7QmwCWZ5e56ty6KPO2zfJBB06WswV8G-GjhMbyLxLIVDkKRvcmtNrZ1HqZdKTpLDwVFd8pMnDM4b3QHarYjvIkGm8yccqiLGWoOK0w0EQi0bozOLv9XO6wENCDKr-5z-ekOSMouOc4eRY08T9rKadqUvk1jOV5Qit5VhzzSPKUtxvWyFt0OtPNEWBwNLi-rukYv10Gk71hqVXFexsPPsvf3TY5GTli30u2TGu-Txw="
); // fill this later with the value from session.save()

const BigInt = require("big-integer");

randomId = () => {
  return BigInt(-Math.floor(Math.random() * 10000000000000));
}

forward_config = {
  '1212786466' : {cid: 1597458594}, // philipines
  '1565773584' : {cid: 1597458594} //test
}

const  eventPrint = (client) => async (event) => {
  const message = event.message;
  console.log("MSG FROM CHANNEL: ", message.peerId?.channelId)
  if (forward_config[`${message.peerId?.channelId}`]) {
    if (message.media) {
      const result = await client.invoke(
        new Api.messages.SendMedia({
          peer: new Api.PeerChannel({ channelId: forward_config[`${message.peerId?.channelId}`].cid  }),
          media: message.media,
          message: message.message,
          randomId: randomId(),
        })
      );
    }else{
      await client.sendMessage(new Api.PeerChannel({ channelId: forward_config[`${message.peerId?.channelId}`].cid }),{
        message: (await translate(message.message, {to: 'en'})).text,
      });
    }
  }
}

(async () => {
  console.log("TG CHANNEL CUSTOM FORWARDER");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  client.addEventHandler(eventPrint(client), new NewMessage({}));
  await client.start({
    onError: (err) => console.log(err),
  });
})();
