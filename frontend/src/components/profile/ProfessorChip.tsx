import { Chip } from "@mui/material";

// Chip "🎓 Professor" — usado em Profile, PublicProfile e Search.
// `height` é opcional porque a lista de busca usa chips um pouco menores.
export default function ProfessorChip({ height }: { height?: number }) {
  return (
    <Chip
      label="🎓 Professor"
      size="small"
      sx={{
        backgroundColor: "#4caf5022",
        color: "#4caf50",
        fontSize: 11,
        ...(height ? { height } : {}),
      }}
    />
  );
}
