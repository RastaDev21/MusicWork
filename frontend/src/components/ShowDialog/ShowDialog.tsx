import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { createShow, uploadShowFlyer } from "../../services/api";
import { useSnackbar } from "notistack";

const genres = [
  "Rock",
  "Samba",
  "Jazz",
  "MPB",
  "Reggae",
  "Funk",
  "Forró",
  "Pagode",
  "Blues",
  "Metal",
  "Pop",
  "Gospel",
  "Eletrônico",
  "Clássico",
  "Bossa Nova",
  "Outro",
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#7c4dff" },
    "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
  },
  "& .MuiInputLabel-root": { color: "#aaa" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#7c4dff" },
};

const selectSx = {
  color: "#fff",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7c4dff" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7c4dff" },
  "& .MuiSvgIcon-root": { color: "#aaa" },
};

const menuSx = {
  "& .MuiPaper-root": {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
  },
};

const menuItemSx = {
  color: "#fff",
  "&:hover": { backgroundColor: "#7c4dff22" },
  "&.Mui-selected": { backgroundColor: "#7c4dff33" },
};

interface ShowDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function ShowDialog({
  open,
  onClose,
  onCreated,
}: ShowDialogProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");
  const [genre, setGenre] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  function resetForm() {
    setTitle("");
    setDate("");
    setTime("");
    setCity("");
    setGenre("");
    setVenue("");
    setDescription("");
    setFlyerFile(null);
    setFlyerPreview(null);
  }

  function handleSelectFlyer(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFlyerFile(file);
    setFlyerPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function handleRemoveFlyer() {
    setFlyerFile(null);
    setFlyerPreview(null);
  }

  async function handleSubmit() {
    if (!title.trim() || !date || !time || !city.trim() || !genre) {
      enqueueSnackbar("Preencha título, data, horário, cidade e gênero", {
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      let flyerUrl: string | undefined;
      if (flyerFile) {
        const data = await uploadShowFlyer(flyerFile);
        flyerUrl = data.flyerUrl;
      }

      const dateTime = new Date(`${date}T${time}`).toISOString();
      await createShow({
        title,
        dateTime,
        city,
        genre,
        venue: venue || undefined,
        description: description || undefined,
        flyerUrl,
      });
      enqueueSnackbar("Show adicionado!", { variant: "success" });
      resetForm();
      onCreated();
      onClose();
    } catch (error: unknown) {
      let msg = "Erro ao criar o show. Tente novamente.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) msg = err.response.data.error;
      }
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { backgroundColor: "#1a1a1a", borderRadius: 3 } },
      }}
    >
      <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #2a2a2a" }}>
        Novo show
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          fullWidth
          label="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ex: Show acústico no Bar do Zé"
          sx={{ ...inputSx, mb: 2, mt: 1 }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Data"
            value={date}
            onChange={e => setDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={inputSx}
          />
          <TextField
            fullWidth
            type="time"
            label="Horário"
            value={time}
            onChange={e => setTime(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={inputSx}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Cidade"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Ex: Santos, SP"
            sx={inputSx}
          />
          <FormControl fullWidth>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Gênero
            </InputLabel>
            <Select
              value={genre}
              label="Gênero"
              onChange={e => setGenre(e.target.value)}
              sx={selectSx}
              MenuProps={{ sx: menuSx }}
            >
              {genres.map(g => (
                <MenuItem key={g} value={g} sx={menuItemSx}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="Local (opcional)"
          value={venue}
          onChange={e => setVenue(e.target.value)}
          placeholder="Ex: Bar do Zé"
          sx={{ ...inputSx, mb: 2 }}
        />

        <TextField
          fullWidth
          label="Descrição (opcional)"
          multiline
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          sx={{ ...inputSx, mb: 2 }}
        />

        <Box sx={{ mb: 1 }}>
          {flyerPreview ? (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box
                component="img"
                src={flyerPreview}
                sx={{ maxHeight: 180, borderRadius: 2, display: "block" }}
              />
              <IconButton
                size="small"
                onClick={handleRemoveFlyer}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box
              component="label"
              sx={{
                display: "block",
                border: "1.5px dashed #444",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: "#7c4dff" },
              }}
            >
              <Box sx={{ color: "#aaa", fontSize: 13 }}>
                🖼️ Adicionar flyer de divulgação (opcional)
              </Box>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleSelectFlyer}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid #2a2a2a", p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#aaa", "&:hover": { color: "#fff" } }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: "#7c4dff",
            "&:hover": { backgroundColor: "#6a3de8" },
          }}
        >
          {loading ? "Salvando..." : "Adicionar show"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
