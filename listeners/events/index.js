const { sampleEvent } = require("./sample_event.js");
const { submitTime } = require("./submit_time.js");
const { submitTexts } = require("./submit_texts.js");

module.exports.register = (app) => {
  app.view("sample_event", sampleEvent);
  app.view("submit_time", submitTime);
  app.view("submit_texts", submitTexts);

};
