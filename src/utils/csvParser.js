/**
 * Parse CSV text into song objects
 * Expected format: "Title","Artist" or Title,Artist
 */
export const parseCSVText = (csvText) => {
  const lines = csvText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const songs = [];

  lines.forEach((line) => {
    // Try to match quoted values first
    const quotedMatch = line.match(/"([^"]+)","([^"]+)"/);

    if (quotedMatch) {
      songs.push({
        title: quotedMatch[1].trim(),
        artist: quotedMatch[2].trim(),
        id: `${quotedMatch[1]}-${
          quotedMatch[2]
        }-${Date.now()}-${Math.random()}`,
      });
    } else {
      // Fall back to simple comma split
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        songs.push({
          title: parts[0],
          artist: parts[1],
          id: `${parts[0]}-${parts[1]}-${Date.now()}-${Math.random()}`,
        });
      }
    }
  });

  return songs;
};

/**
 * Parse CSV file into song objects
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const songs = parseCSVText(text);
        resolve(songs);
      } catch (error) {
        reject(new Error("Failed to parse CSV file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

/**
 * Generate CSV template string
 */
export const generateCSVTemplate = () => {
  return `"Song Title","Artist Name"
"Blinding Lights","The Weeknd"
"Shape of You","Ed Sheeran"
"Someone Like You","Adele"`;
};

/**
 * Download CSV template file
 */
export const downloadCSVTemplate = () => {
  const template = generateCSVTemplate();
  const blob = new Blob([template], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "moodflix_songs_template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Validate song object
 */
export const validateSong = (song) => {
  return (
    song &&
    typeof song.title === "string" &&
    song.title.trim().length > 0 &&
    typeof song.artist === "string" &&
    song.artist.trim().length > 0
  );
};

/**
 * Remove duplicates from song array
 */
export const removeDuplicateSongs = (songs) => {
  const seen = new Set();
  return songs.filter((song) => {
    const key = `${song.title.toLowerCase()}-${song.artist.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
