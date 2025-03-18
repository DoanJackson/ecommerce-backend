import { OAuth2Client } from "google-auth-library";
import { getEnv } from "../config/env.js";
import { RefreshToken, sequelize, Users } from "../models/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

/**
 *
 * @param {OAuth2Client} oAuth2Client - OAuth2Client instance
 * @returns {string} - Google auth url
 */
function getGoogleAuthUrl(oAuth2Client) {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline", // 'online' (default) or 'offline' (gets refresh_token)
    scope: ["profile", "email"], // scopes
  });
}

/**
 *
 * @param {OAuth2Client} oAuth2Client - OAuth2Client instance
 * @param {string} code - code from google redirect
 * @param {import('express').Response} res - response
 * @param {string} code - code from google redirect
 */
async function handleGoogleCallback(oAuth2Client, code) {
  // get tokens from code
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // get user info
  const userInfo = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: getEnv("GOOGLE_CLIENT_ID"),
  });
  const payload = userInfo.getPayload();

  const user = {
    google_id: payload.sub,
    email: payload.email,
    name: payload.name,
  };

  let t = await sequelize.transaction();
  try {
    let userRecord = await Users.findOne({
      where: {
        google_id: user.google_id,
      },
    });

    if (!userRecord) {
      userRecord = await Users.create(
        {
          google_id: user.google_id,
          email: user.email,
          name: user.name,
        },
        { transaction: t }
      );
    }

    const access_token = generateAccessToken(userRecord);
    const refresh_token = generateRefreshToken(userRecord);

    await RefreshToken.create(
      {
        user_id: userRecord.id,
        token: refresh_token,
        expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      { transaction: t }
    );

    await t.commit();

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: userRecord,
    };
  } catch (error) {
    if (t) await t.rollback();
    throw error;
  }
}

export { getGoogleAuthUrl, handleGoogleCallback };
