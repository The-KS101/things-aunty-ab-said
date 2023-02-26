const { getTeams } = require("../database/db.js");
const { changeTimeZone } = require("../helper/index");

const axios = require("axios");
const cron = require("node-cron");

const sendJoke = async () => {
  try {

    cron.schedule("0 * * * *", async () => {
      // get teams
      const teams = await getTeams();

      teams.map(async (team) => {

        if(!team.texts || team.texts.length === 0) return;
     
        const convertedDate = changeTimeZone(new Date(), team.user_tz);
        const hours = convertedDate.getHours();

        // check if hours are included in the selected team times, if not return
        if(!team.times.includes(hours)) return;

        // check if there is a weekend and weekends are not allowed -> return
        if((convertedDate.getDay() === 6 || convertedDate.getDay() === 0) && !team.weekendYN) return;

        const jokes = team.texts;

        // get random number by the jokes length
        let randomNumber = Math.floor(Math.random() * jokes.length);

        if (randomNumber > jokes.length) {
          randomNumber--;
        }

        const joke = jokes[randomNumber];

        await axios.post(
          "https://slack.com/api/chat.postMessage",
          {
            text: joke,
            channel: team.channel,
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: joke,
                },
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${team.bot.token}`,
            },
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const registerJobs = () => {
  sendJoke();
};

module.exports = registerJobs;
