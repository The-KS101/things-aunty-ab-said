const removeText = async ({ ack, say, body, client }) => {
  try {
    await ack();

    let blocks = body.view.blocks;

    const { value: removeBtnId } = body.actions[0];
    
    // get index of remove button
    const removeButtonIndex = blocks.findIndex(
      (block) =>
        block.type === "section" && block.accessory && block.accessory.value == removeBtnId
    );

    const textToRemoveIndex = removeButtonIndex-1;

    // remove text item from blocks
    blocks = blocks.filter((item, index) => index !=textToRemoveIndex  );

    
    // remove button
    blocks = blocks.filter((item, index) => index !=removeButtonIndex-1  );

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
        blocks,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { removeText };
