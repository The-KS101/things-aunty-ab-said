const { insertAt } = require("../../helper");

const addTimeSelect = async ({ ack, say, body, client }) => {
  await ack();

  try {
    // get index of add button
    const blocks = body.view.blocks;

    const addButtonIndex = blocks.findIndex(
      (block) =>
        block.type === "actions" && block.elements[0].value === "add_times_btn"
    );

    if (addButtonIndex < 0) {
      return;
    }

    insertAt(blocks, addButtonIndex, getTimeSelectBlock());


    client.views.update({
      view_id: body.view.id,
      hash: body.view.hash,
      view: {
        type: "modal",
        private_metadata: body.view.private_metadata,
        // View identifier
        callback_id: "submit_time",
        title: {
          type: "plain_text",
          text: "Configure the time",
        },
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
        blocks: body.view.blocks,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const getTimeSelectBlock = () => {
  return {
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
  };
};

module.exports = { addTimeSelect };
