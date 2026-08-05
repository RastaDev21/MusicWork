import { Box, Typography, Divider } from "@mui/material";
import { countries, countryCodeToFlag } from "../../constants/countries";

interface ProfileDetailsCardProps {
  secondaryProfession?: string;
  city?: string;
  nationality?: string | null;
}

export default function ProfileDetailsCard({
  secondaryProfession,
  city,
  nationality,
}: ProfileDetailsCardProps) {
  const country = countries.find(c => c.code === nationality);

  const items = [
    { label: "Profissão", value: secondaryProfession },
    { label: "Cidade", value: city },
    {
      label: "Nacionalidade",
      value: country
        ? `${country.name} ${countryCodeToFlag(country.code)}`
        : null,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        border: "1px solid #2a2a2a",
        p: 2,
        width: "100%",
      }}
    >
      {items.map((item, i) => (
        <Box key={item.label}>
          {i > 0 && <Divider sx={{ borderColor: "#2a2a2a", my: 1.5 }} />}
          <Typography sx={{ color: "#666", fontSize: 12, mb: 0.5 }}>
            {item.label}
          </Typography>
          <Typography sx={{ color: "#ccc", fontSize: 13 }}>
            {item.value || "—"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
