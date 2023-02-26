const { blankAction } = require("./blank_action.js");
const { channelSelected } = require("./channel_selected.js");
const { setTime } = require("./set_time.js");
const { addTimeSelect } = require("./add_time_select.js");
const { setTexts } = require("./set_texts.js");
const { addTextInput } = require("./add_text_input.js");
const { removeText } = require("./remove_text.js");

module.exports.register = (app) => {
  app.action("blank_action", blankAction);
  app.action("channel_selected", channelSelected);
  app.action("set_time", setTime);
  app.action("add_time_select", addTimeSelect);
  app.action("set_texts", setTexts)
  app.action("add_text_input", addTextInput)
  app.action("remove_text", removeText)
};
