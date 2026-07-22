export const countries = [
  { code: "BR", name: "Brasil" },
  { code: "PT", name: "Portugal" },
  { code: "US", name: "Estados Unidos" },
  { code: "AR", name: "Argentina" },
  { code: "UY", name: "Uruguai" },
  { code: "PY", name: "Paraguai" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colômbia" },
  { code: "MX", name: "México" },
  { code: "ES", name: "Espanha" },
  { code: "FR", name: "França" },
  { code: "IT", name: "Itália" },
  { code: "DE", name: "Alemanha" },
  { code: "GB", name: "Reino Unido" },
  { code: "JP", name: "Japão" },
  { code: "AO", name: "Angola" },
  { code: "MZ", name: "Moçambique" },
  { code: "CV", name: "Cabo Verde" },
  { code: "CA", name: "Canadá" },
  { code: "OTHER", name: "Outro" },
];

export function countryCodeToFlag(code: string) {
  if (!code || code === "OTHER" || code.length !== 2) return "🌍";
  return code
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
