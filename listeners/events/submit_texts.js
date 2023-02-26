const { updateTeam, getTeam } = require("../../database/db");

const submitTexts = async ({ ack, body, client, say, context }) => {
  try {
    await ack();

    const user_team = await getTeam(body.team.id);

    // get all texts from state
    const texts = getTextsFromState(body.view.state);

    if(!texts || texts.length === 0) return;

    // add in db
    updateTeam(body.team.id, { texts });

    // send success message to user

    // if there were no texts before -> new creation reply
    if (!user_team.texts || user_team.texts.length === 0) {
      client.chat.postMessage({
        channel: body.user.id,
        text: "The bot is now fully ready to sweeten your team's day :partying_face::grin:! Look forward to the first messages",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "The bot is now fully ready to sweeten your team's day :partying_face::grin:! Look forward to the first messages",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Feel free to come back to the 'Set Aunty 👵'-Button from above to add more texts 🙂",
            },
          },
        ],
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const getTextsFromState = (state) => {
  const texts = [];
  const keys = Object.keys(state.values);
  keys.map((key) => {
    const subKey = Object.keys(state.values[key])[0];

    if (state.values[key][subKey].type === "plain_text_input") {
      const text = state.values[key][subKey].value;
      texts.push(text);
    }
  });

  return texts;
};

module.exports = { submitTexts };
