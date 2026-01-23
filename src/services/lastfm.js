import axios from "axios";

const LASTFM_API_KEY =
  import.meta.env.VITE_LASTFM_API_KEY || "43693f63d7758d63c2e15c956ccb1a04";
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export const lastfmService = {
  // Get user's top tracks
  getTopTracks: async (username, limit = 20) => {
    try {
      const response = await axios.get(LASTFM_BASE_URL, {
        params: {
          method: "user.gettoptracks",
          user: username,
          api_key: LASTFM_API_KEY,
          format: "json",
          limit,
        },
      });

      if (!response.data.toptracks?.track) {
        throw new Error("No tracks found for this user");
      }

      return response.data.toptracks.track.map((track) => ({
        title: track.name,
        artist: track.artist.name,
        playcount: parseInt(track.playcount),
        id: `${track.name}-${track.artist.name}-${Date.now()}`,
      }));
    } catch (error) {
      console.error("Last.fm API Error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch Last.fm tracks"
      );
    }
  },

  // Get user's recent tracks
  getRecentTracks: async (username, limit = 20) => {
    try {
      const response = await axios.get(LASTFM_BASE_URL, {
        params: {
          method: "user.getrecenttracks",
          user: username,
          api_key: LASTFM_API_KEY,
          format: "json",
          limit,
        },
      });

      if (!response.data.recenttracks?.track) {
        throw new Error("No recent tracks found for this user");
      }

      return response.data.recenttracks.track
        .filter((track) => track.artist && track.name)
        .map((track) => ({
          title: track.name,
          artist:
            typeof track.artist === "string"
              ? track.artist
              : track.artist["#text"],
          id: `${track.name}-${track.artist}-${Date.now()}`,
        }));
    } catch (error) {
      console.error("Last.fm API Error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch recent tracks"
      );
    }
  },

  // Validate Last.fm username
  validateUsername: async (username) => {
    try {
      const response = await axios.get(LASTFM_BASE_URL, {
        params: {
          method: "user.getinfo",
          user: username,
          api_key: LASTFM_API_KEY,
          format: "json",
        },
      });

      return !!response.data.user;
    } catch (error) {
      return false;
    }
  },
};

export default lastfmService;
