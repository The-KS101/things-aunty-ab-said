const { getTeam, updateTeam } = require("../../database/db.js");

const channelSelected = async ({ ack, say, body, client }) => {
  await ack();

  try {
    // get selected channel
    const { selected_channel } = body.actions[0];
    const team = await getTeam(body.team.id);

    // set in db
    await updateTeam(body.team.id, {channel: selected_channel})

    try {
      // invite bot to channel
      await client.conversations.invite({
        channel: selected_channel,
        users: team.bot.userId,
        token: team.user.token,
      });
    } catch (err) {
      console.log(err);
    }

    // welcome message to channel
    client.chat.postMessage({
      channel: selected_channel,
      text: "👋 Hello everyone",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*👋 Hello everyone*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "I am your Aunty ab 👵 and will entertain you daily - be curious about my first messages",
          },
        },
      ],
    });

    // reply to user that channel got created
    client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      text: "Bot has been added to the channel.",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*The Bot has been successfully added to the channel!*",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Please configure now the ⌚times at which you want me to entertain you:",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Configure",
                emoji: true,
              },
              value: "set_time_btn",
              action_id: "set_time",
            },
          ],
        },
      ],
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { channelSelected };
