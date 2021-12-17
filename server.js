const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const translate = require('@vitalets/google-translate-api');
const { Logger } = require("telegram/extensions");

const apiId = ;
const apiHash = "";
const stringSession = new StringSession(
  ""
); // fill this later with the value from session.save()

const BigInt = require("big-integer");

randomId = () => {
  return BigInt(-Math.floor(Math.random() * 10000000000000));
}

forward_config = {
  '1212786466' : {cid: 1277753274}, // philipines
  '1161735479' : {cid: 1558625455} //the crypto
}

const  eventPrint = (client) => async (event) => {
  const message = event.message;
  // console.log("MSG FROM CHANNEL: ", message.peerId?.channelId)
  if (forward_config[`${message.peerId?.channelId}`]) {
    // if (message.media) {
      // const result = client.invoke(
      //   new Api.messages.SendMedia({
      //     peer: new Api.PeerChannel({ channelId: forward_config[`${message.peerId?.channelId}`].cid  }),
      //     media: message.media,
      //     message: "Auto translate: \n\n" + (await translate(message.message, {to: 'en'})).text,
      //     randomId: randomId(),
      //   })
      // );
    // }else{
      client.sendMessage(new Api.PeerChannel({ channelId: forward_config[`${message.peerId?.channelId}`].cid }),{
        message: "Auto translate: \n\n" + (await translate(message.message, {to: 'en'})).text,
      });
    // }
  }
}

(async () => {
  console.log("TG CHANNEL CUSTOM FORWARDER");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
    baseLogger: new Logger('warn')
  });
  client.addEventHandler(eventPrint(client), new NewMessage({}));
  await client.start({
    onError: (err) => console.log(err),
  });
})();
