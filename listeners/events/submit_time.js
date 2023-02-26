const { updateTeam } = require("../../database/db.js");

const submitTime = async ({ ack, body, client }) => {
  try {
    await ack();

    // get channel and message ts from private metadata (to reply to the user);
    const [channelId, messageTs] = body.view.private_metadata.split(";");

    // format state and get time + weekendYN
    const { weekend_radio_btn } = body.view.state.values;

    // get all times
    const times = getTimesFromState(body.view.state);

    const weekendValue =
      weekend_radio_btn["radio_buttons-action"].selected_option.value;
    const weekendYN = weekendValue === "no" ? false : true;

    // update values on database
    updateTeam(body.team.id, { times, weekendYN });

    // reply to user
    client.chat.update({
      channel: channelId,
      ts: messageTs,
      text: "You're setup!🥳",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Thank you very much.🙏 ",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "last but not least, you can now set and update all your jokes, sayings, ... which will be sent at your configured times.",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Set Aunty👵",
                emoji: true,
              },
              value: "set_texts_btn",
              action_id: "set_texts",
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
};

const getTimesFromState = (state) => {
  const times = [];
  const keys = Object.keys(state.values);
  keys.map((key) => {
    const subKey = Object.keys(state.values[key])[0];

    if (state.values[key][subKey].type === "timepicker") {
      const convertedTime = parseInt(
        state.values[key][subKey].selected_time.slice(0, 2)
      );
      times.push(convertedTime);
    }
  });

  return times;
};

module.exports = { submitTime };
