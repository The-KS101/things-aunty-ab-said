const sampleEvent = async ({ ack, body, client, say, context }) => {
  try {
    await ack();

  } catch (error) {
    console.error(error);
  }
};


module.exports = { sampleEvent };
