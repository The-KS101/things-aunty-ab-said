const blankAction = async ({ ack, say, body, client }) => {
  await ack();
};

module.exports = { blankAction };
