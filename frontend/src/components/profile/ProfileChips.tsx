import { Box, Chip } from "@mui/material";
import ProfessorChip from "./ProfessorChip";

interface ProfileChipsProps {
  instrument?: string;
  genre?: string;
  secondaryInstruments?: string[];
  secondaryGenres?: string[];
  isProfessor?: boolean;
}

export default function ProfileChips({
  instrument,
  genre,
  secondaryInstruments = [],
  secondaryGenres = [],
  isProfessor,
}: ProfileChipsProps) {
  return (
    <Box sx={{ display: "flex", gap: 1, mt: 0.5, mb: 1, flexWrap: "wrap" }}>
      {isProfessor && <ProfessorChip />}
      {instrument && (
        <Chip
          label={instrument}
          size="small"
          sx={{
            backgroundColor: "#7c4dff22",
            color: "#9c6fe4",
            fontSize: 11,
          }}
        />
      )}
      {genre && (
        <Chip
          label={genre}
          size="small"
          sx={{
            backgroundColor: "#ff4d6d22",
            color: "#ff4d6d",
            fontSize: 11,
          }}
        />
      )}
      {secondaryInstruments.map(inst => (
        <Chip
          key={inst}
          label={inst}
          size="small"
          sx={{
            backgroundColor: "#33333380",
            color: "#bbb",
            fontSize: 11,
          }}
        />
      ))}
      {secondaryGenres.map(g => (
        <Chip
          key={g}
          label={g}
          size="small"
          sx={{
            backgroundColor: "#ff4d6d15",
            color: "#ff9baf",
            fontSize: 11,
          }}
        />
      ))}
    </Box>
  );
}
