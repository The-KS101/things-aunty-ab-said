const axios = require("axios");

const User = require("./models/userModel.js");

/** Workspace Installation */
const saveUserWorkspaceInstall = async (installation) => {
  try {
    // if there is a user token the user will be stored seperately in the database (instead the team entry)
    // the token will be also later needed to change the users status and to set the absence (pause notifications) special user scope
    const id = installation.team.id;

    // get users timezone
    const {
      data: { ok, user },
    } = await axios.post(
      "https://slack.com/api/users.info",
      new URLSearchParams({
        user: installation.user.id,
        token: installation.bot.token,
      })
    );

    const resp = await User.updateOne(
      { _id: id },
      {
        team: { id: installation.team.id, name: installation.team.name },
        // entperise id is null on workspace install
        enterprise: { id: "null", name: "null" },
        // user scopes + token is null on workspace install
        user: {
          token: installation.user.token,
          scopes: installation.user.scopes,
          id: installation.user.id,
        },
        user_tz: user.tz,
        tokenType: installation.tokenType,
        isEnterpriseInstall: installation.isEnterpriseInstall,
        appId: installation.appId,
        authVersion: installation.authVersion,
        bot: {
          scopes: installation.bot.scopes,
          token: installation.bot.token,
          userId: installation.bot.userId,
          id: installation.bot.id,
        },
      },
      { upsert: true }
    );

    // send welcome message
    await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: installation.user.id,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*You made it!🎉*",
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Let’s get started!",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Which channel would you like me post to ?*",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "channels_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a public channel",
                  emoji: true,
                },
                action_id: "channel_selected",
              },
            ],
          },
        ],
        text: "Let’s get started!",
      },
      {
        headers: {
          Authorization: `Bearer ${installation.bot.token}`,
        },
      }
    );

    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** Enterprise Installation */
const saveUserOrgInstall = async function (installation) {
  try {
    const resp = await User.updateOne(
      { _id: installation.enterprise.id },
      {
        team: "null",
        enterprise: {
          id: installation.enterprise.id,
          name: installation.enterprise.name,
        },
        user: {
          token: installation.user.token,
          scopes: installation.user.scopes,
          id: installation.user.id,
        },
        tokenType: installation.tokenType,
        isEnterpriseInstall: installation.isEnterpriseInstall,
        appId: installation.appId,
        authVersion: installation.authVersion,
        bot: "null",
      },
      { upsert: true }
    );
    return resp;
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** GET Workspace Installation */
const getWorkspaceInstallation = async (teamId) => {
  try {
    // fetch user from database
    const user = await User.find({ "team.id": teamId });
    return user[0];
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** GET Enterprise Installation */
const getEnterpriseInstallation = async (enterpriseId) => {
  try {
    // fetch user from database
    const user = await User.find({ "enterprise.id": enterpriseId });
    return user[0];
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** DELETE Enterprise Installation */
const deleteEnterpriseInstallation = async (enterpriseId) => {
  try {
    await User.deleteMany({ "enterprise.id": enterpriseId });
  } catch (error) {
    console.error(error);
    return error;
  }
};

/** DELETE Workspace Installation */
const deleteWorkspaceInstallation = async (teamId) => {
  try {
    await User.deleteMany({ "team.id": teamId });
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  deleteWorkspaceInstallation,
  deleteEnterpriseInstallation,
  getEnterpriseInstallation,
  getWorkspaceInstallation,
  saveUserOrgInstall,
  saveUserWorkspaceInstall,
};
