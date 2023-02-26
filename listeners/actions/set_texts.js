const { getTeam } = require("../../database/db");
const { v4: uuidv4 } = require('uuid');


const setTexts = async ({ ack, say, body, client }) => {
  await ack();

  try {
    const team = await getTeam(body.team.id);

    const blocks = getModalBlocks(team.texts);

    // open modal to set texts
    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: "submit_texts",
        title: {
          type: "plain_text",
          text: "Set Aunty 👵",
        },
        submit: {
          type: "plain_text",
          text: "Save",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        blocks: blocks,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const getModalBlocks = (loadedTexts) => {
  const blocks = [];

  if (loadedTexts && loadedTexts.length > 0) {
    loadedTexts.map((text) => {
      blocks.push(...getTextInput(text));
    });
  } else {
    blocks.push(...getTextInput());
  }

  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "+ Add new",
          emoji: true,
        },
        value: "add_text_input_btn",
        action_id: "add_text_input",
      },
    ],
  });

  return blocks;
};

const getTextInput = (text) => {
  const blocks = [
    {
      type: "input",
      element: {
        type: "plain_text_input",
        action_id: "plain_text_input-action",
        placeholder: {
          type: "plain_text",
          text: "Your speech, joke, ...",
          emoji: true,
        },
      },
      label: {
        type: "plain_text",
        text: " ",
        emoji: true,
      },
    },
  ];

  if (text) {
    blocks[0].element.initial_value = text;
  }

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: " ",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "🗑️ Remove",
        emoji: true,
      },
      value: uuidv4(),
      action_id: "remove_text",
    },
  });

  return blocks;
};

module.exports = { setTexts, getTextInput };
