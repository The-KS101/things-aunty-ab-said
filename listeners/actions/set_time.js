const setTime = async ({ ack, say, body, client }) => {
  await ack();

  try {
    await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        private_metadata: body.channel.id + ";" + body.message.ts,
        // View identifier
        callback_id: "submit_time",
        title: {
          type: "plain_text",
          text: "Configure the time",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*At what times shall i entertain you?*",
            },
          },
          {
            type: "input",
            element: {
              type: "timepicker",
              initial_time: "09:00",
              placeholder: {
                type: "plain_text",
                text: "Select time",
                emoji: true,
              },
              action_id: "timepicker-action-0",
            },
            label: {
              type: "plain_text",
              text: " ",
              emoji: true,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "+ Add",
                  emoji: true,
                },
                value: "add_times_btn",
                action_id: "add_time_select",
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: " ",
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "weekend_radio_btn",
            element: {
              type: "radio_buttons",
              initial_option: {
                text: {
                  type: "plain_text",
                  text: "No",
                  emoji: true,
                },
                value: "no",
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "No",
                    emoji: true,
                  },
                  value: "no",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Yes",
                    emoji: true,
                  },
                  value: "yes",
                },
              ],
              action_id: "radio_buttons-action",
            },
            label: {
              type: "plain_text",
              text: "Include weekends?",
              emoji: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { setTime };
