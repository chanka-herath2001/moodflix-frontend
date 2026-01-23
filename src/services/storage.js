// Storage service using window.storage API for persistence

export const storage = {
  // Get user data
  getUser: async () => {
    try {
      const result = await window.storage.get("current_user");
      return result ? JSON.parse(result.value) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  // Set user data
  setUser: async (user) => {
    try {
      await window.storage.set("current_user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Error setting user:", error);
      return false;
    }
  },

  // Remove user (logout)
  removeUser: async () => {
    try {
      await window.storage.delete("current_user");
      return true;
    } catch (error) {
      console.error("Error removing user:", error);
      return false;
    }
  },

  // Get user songs
  getUserSongs: async (userId) => {
    try {
      const result = await window.storage.get(`user_songs_${userId}`);
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error("Error getting songs:", error);
      return [];
    }
  },

  // Set user songs
  setUserSongs: async (userId, songs) => {
    try {
      await window.storage.set(`user_songs_${userId}`, JSON.stringify(songs));
      return true;
    } catch (error) {
      console.error("Error setting songs:", error);
      return false;
    }
  },

  // Get user favorite movies
  getUserMovies: async (userId) => {
    try {
      const result = await window.storage.get(`user_movies_${userId}`);
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error("Error getting movies:", error);
      return [];
    }
  },

  // Set user favorite movies
  setUserMovies: async (userId, movies) => {
    try {
      await window.storage.set(`user_movies_${userId}`, JSON.stringify(movies));
      return true;
    } catch (error) {
      console.error("Error setting movies:", error);
      return false;
    }
  },

  // Get user preferences
  getUserPreferences: async (userId) => {
    try {
      const result = await window.storage.get(`user_prefs_${userId}`);
      return result ? JSON.parse(result.value) : {};
    } catch (error) {
      console.error("Error getting preferences:", error);
      return {};
    }
  },

  // Set user preferences
  setUserPreferences: async (userId, preferences) => {
    try {
      await window.storage.set(
        `user_prefs_${userId}`,
        JSON.stringify(preferences)
      );
      return true;
    } catch (error) {
      console.error("Error setting preferences:", error);
      return false;
    }
  },

  // Clear all user data
  clearUserData: async (userId) => {
    try {
      await window.storage.delete(`user_songs_${userId}`);
      await window.storage.delete(`user_movies_${userId}`);
      await window.storage.delete(`user_prefs_${userId}`);
      return true;
    } catch (error) {
      console.error("Error clearing user data:", error);
      return false;
    }
  },
};

export default storage;
