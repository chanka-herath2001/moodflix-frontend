import { Download, TextSnippet, Upload } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { downloadCSVTemplate, parseCSVFile, parseCSVText } from '../../utils/csvParser';

const CSVImport = ({ onImport }) => {
  const [csvText, setCsvText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const songs = await parseCSVFile(file);
      if (songs.length === 0) {
        showError('No valid songs found in CSV file');
        return;
      }
      onImport(songs);
      showSuccess(`Imported ${songs.length} songs from CSV! 📁`);
    } catch (error) {
      showError(error.message || 'Failed to parse CSV file');
    }

    // Reset file input
    event.target.value = '';
  };

  const handleTextImport = () => {
    if (!csvText.trim()) {
      showError('Please paste some CSV data');
      return;
    }

    try {
      const songs = parseCSVText(csvText);
      if (songs.length === 0) {
        showError('No valid songs found in text');
        return;
      }
      onImport(songs);
      showSuccess(`Imported ${songs.length} songs! 📝`);
      setCsvText('');
      setDialogOpen(false);
    } catch (error) {
      showError('Failed to parse CSV text');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<Upload />}
        sx={{ flex: 1, minWidth: 150 }}
      >
        Upload CSV
        <input
          type="file"
          hidden
          accept=".csv"
          onChange={handleFileUpload}
        />
      </Button>

      <Button
        variant="outlined"
        onClick={() => setDialogOpen(true)}
        startIcon={<TextSnippet />}
        sx={{ flex: 1, minWidth: 150 }}
      >
        Paste CSV
      </Button>

      <Button
        variant="outlined"
        onClick={downloadCSVTemplate}
        startIcon={<Download />}
        sx={{ flex: 1, minWidth: 150 }}
      >
        Template
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Paste CSV Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Format: "Song Title","Artist Name" (one per line)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`"Blinding Lights","The Weeknd"
"Shape of You","Ed Sheeran"
"Someone Like You","Adele"`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTextImport} variant="contained">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CSVImport;