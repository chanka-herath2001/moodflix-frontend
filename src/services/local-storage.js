// Storage service using localStorage (works everywhere)
// Use this instead of storage.js if window.storage is not available

export const storage = {
  // Get user data
  getUser: async () => {
    try {
      const data = localStorage.getItem("current_user");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  // Set user data
  setUser: async (user) => {
    try {
      localStorage.setItem("current_user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Error setting user:", error);
      return false;
    }
  },

  // Remove user (logout)
  removeUser: async () => {
    try {
      localStorage.removeItem("current_user");
      return true;
    } catch (error) {
      console.error("Error removing user:", error);
      return false;
    }
  },

  // Get user songs
  getUserSongs: async (userId) => {
    try {
      const data = localStorage.getItem(`user_songs_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting songs:", error);
      return [];
    }
  },

  // Set user songs
  setUserSongs: async (userId, songs) => {
    try {
      localStorage.setItem(`user_songs_${userId}`, JSON.stringify(songs));
      return true;
    } catch (error) {
      console.error("Error setting songs:", error);
      return false;
    }
  },

  // Get user favorite movies
  getUserMovies: async (userId) => {
    try {
      const data = localStorage.getItem(`user_movies_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting movies:", error);
      return [];
    }
  },

  // Set user favorite movies
  setUserMovies: async (userId, movies) => {
    try {
      localStorage.setItem(`user_movies_${userId}`, JSON.stringify(movies));
      return true;
    } catch (error) {
      console.error("Error setting movies:", error);
      return false;
    }
  },

  // Get user preferences
  getUserPreferences: async (userId) => {
    try {
      const data = localStorage.getItem(`user_prefs_${userId}`);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error getting preferences:", error);
      return {};
    }
  },

  // Set user preferences
  setUserPreferences: async (userId, preferences) => {
    try {
      localStorage.setItem(`user_prefs_${userId}`, JSON.stringify(preferences));
      console.log("✅ Preferences saved to localStorage:", preferences);
      return true;
    } catch (error) {
      console.error("Error setting preferences:", error);
      return false;
    }
  },

  // Clear all user data
  clearUserData: async (userId) => {
    try {
      localStorage.removeItem(`user_songs_${userId}`);
      localStorage.removeItem(`user_movies_${userId}`);
      localStorage.removeItem(`user_prefs_${userId}`);
      return true;
    } catch (error) {
      console.error("Error clearing user data:", error);
      return false;
    }
  },
};

export default storage;
