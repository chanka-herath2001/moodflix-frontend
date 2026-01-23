import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://web-production-688b.up.railway.app";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("access_token");
      localStorage.removeItem("current_user");
      window.location.href = "/";
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const api = {
  // ===== Authentication =====
  signup: async (name, email, password) => {
    const response = await apiClient.post("/auth/signup", {
      name,
      email,
      password,
    });
    // Store token
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("current_user", JSON.stringify(response.data.user));
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    // Store token
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("current_user", JSON.stringify(response.data.user));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("current_user");
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  // ===== Movies =====
  getMovies: async () => {
    const response = await apiClient.get("/movies");
    return response.data;
  },

  // ===== User Data =====
  getFavoriteMovies: async () => {
    const response = await apiClient.get("/user/favorite-movies");
    return response.data;
  },

  setFavoriteMovies: async (movies) => {
    const response = await apiClient.post("/user/favorite-movies", movies);
    return response.data;
  },

  addFavoriteMovie: async (movie) => {
    const response = await apiClient.post("/user/favorite-movies/add", {
      movie_title: movie.title,
      poster_url: movie.poster_url,
    });
    return response.data;
  },

  removeFavoriteMovie: async (movieTitle) => {
    const response = await apiClient.delete(
      `/user/favorite-movies/${encodeURIComponent(movieTitle)}`,
    );
    return response.data;
  },

  getUserSongs: async () => {
    const response = await apiClient.get("/user/songs");
    return response.data;
  },

  setUserSongs: async (songs) => {
    const response = await apiClient.post("/user/songs", songs);
    return response.data;
  },

  // ===== Recommendations =====
  getRecommendations: async (songs, selectedMovieTitles) => {
    console.log("🚀 API: Building request...");
    console.log("Songs count:", songs.length);
    console.log("Selected movies:", selectedMovieTitles);

    const formData = new FormData();
    formData.append("track_count", songs.length.toString());
    formData.append("selected_titles", selectedMovieTitles.join(","));

    songs.forEach((song, index) => {
      formData.append(`track_title_${index}`, song.title);
      formData.append(`artist_name_${index}`, song.artist);
    });

    console.log("📤 Sending request to /predict_batch");

    try {
      const response = await apiClient.post("/predict_batch", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response data:", response.data);

      if (!response.data) {
        throw new Error("Empty response from server");
      }

      if (
        !response.data.recommendations ||
        !Array.isArray(response.data.recommendations)
      ) {
        console.error("Invalid response structure:", response.data);
        throw new Error("Invalid response structure from server");
      }

      return response.data;
    } catch (error) {
      console.error("❌ API Error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw error;
    }
  },

  getRecommendationHistory: async () => {
    const response = await apiClient.get("/user/recommendations");
    return response.data;
  },
};

export default apiClient;
