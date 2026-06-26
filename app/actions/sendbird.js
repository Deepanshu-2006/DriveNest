"use server"

const APP_ID = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;
const API_TOKEN = process.env.SENDBIRD_API_TOKEN;

/**
 * Syncs user to Sendbird via Platform API, creating them if they don't exist.
 * @param {string} userId - User identifier (e.g. email)
 * @param {string} nickname - Display name
 * @param {string} profileUrl - Avatar image URL
 */
export async function getOrCreateSendbirdUser(userId, nickname, profileUrl) {
  if (!APP_ID || !API_TOKEN) {
    console.error("Sendbird App ID or API Token is missing in environment variables.");
    return { success: false, error: "Sendbird is not configured. Please add NEXT_PUBLIC_SENDBIRD_APP_ID and SENDBIRD_API_TOKEN to .env.local" };
  }

  const encodedUserId = encodeURIComponent(userId);
  const baseUrl = `https://api-${APP_ID}.sendbird.com/v3`;

  try {
    // 1. Try to fetch user from Sendbird
    const response = await fetch(`${baseUrl}/users/${encodedUserId}`, {
      headers: {
        "Api-Token": API_TOKEN
      }
    });

    if (response.ok) {
      const data = await response.json();
      
      // Update nickname or profile URL if they changed
      if (data.nickname !== nickname || data.profile_url !== profileUrl) {
        await fetch(`${baseUrl}/users/${encodedUserId}`, {
          method: "PUT",
          headers: {
            "Api-Token": API_TOKEN,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nickname: nickname || data.nickname || "Anonymous",
            profile_url: profileUrl || data.profile_url || ""
          })
        });
      }
      return { success: true, user: data };
    }

    // 2. If user not found, create new user
    const createResponse = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Api-Token": API_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        nickname: nickname || "Anonymous",
        profile_url: profileUrl || ""
      })
    });

    if (createResponse.ok) {
      const data = await createResponse.json();
      return { success: true, user: data };
    } else {
      const errData = await createResponse.json();
      console.error("Sendbird user creation failed:", errData);
      return { success: false, error: errData.message || "Failed to create user in Sendbird." };
    }
  } catch (error) {
    console.error("Sendbird user sync action error:", error);
    return { success: false, error: error.message };
  }
}
