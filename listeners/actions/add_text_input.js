const { insertAt } = require("../../helper");
const { getTextInput } = require("./set_texts");

const addTextInput = async ({ ack, say, body, client }) => {
  await ack();

  try {
    // get index of add button
    const blocks = body.view.blocks;

    const addButtonIndex = blocks.findIndex(
      (block) =>
        block.type === "actions" &&
        block.elements[0].value === "add_text_input_btn"
    );

    if (addButtonIndex < 0) {
      return;
    }

    insertAt(blocks, addButtonIndex, getTextInput());

    client.views.update({
      view_id: body.view.id,
      hash: body.view.hash,
      view: {
        type: "modal",
        private_metadata: body.view.private_metadata,
        // View identifier
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
        blocks: body.view.blocks,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { addTextInput };
