// Validação no boot: sem JWT_SECRET o servidor não deve subir.
// (Antes havia um fallback "default_secret" que tornava tokens forjáveis.)
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET não definido. Configure a variável de ambiente antes de iniciar o servidor.",
  );
}

export const JWT_SECRET = jwtSecret;
