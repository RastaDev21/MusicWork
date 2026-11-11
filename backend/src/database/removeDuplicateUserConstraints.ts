import { QueryTypes } from "sequelize";
import sequelize from "./index";

// Até nov/2026, o `unique: true` no email e no googleId fazia o
// `sync({ alter: true })` criar uma constraint única nova a cada boot (bug do
// Sequelize com Postgres): eram centenas na tabela users. O model agora usa
// índices com os nomes das originais; aqui as cópias são apagadas, ficando só
// a original de cada coluna. Depois da primeira limpeza, não acha mais nada.
const ORIGINAL_CONSTRAINT: Record<string, string> = {
  email: "users_email_key",
  googleId: "users_googleId_key",
};

export async function removeDuplicateUserConstraints() {
  const constraints = await sequelize.query<{ name: string; column: string }>(
    `SELECT c.conname AS name, a.attname AS column
       FROM pg_constraint c
       JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
      WHERE c.conrelid = to_regclass('public.users')
        AND c.contype = 'u'
        AND array_length(c.conkey, 1) = 1
        AND a.attname IN (:columns)`,
    {
      replacements: { columns: Object.keys(ORIGINAL_CONSTRAINT) },
      type: QueryTypes.SELECT,
    },
  );

  const toDrop: string[] = [];
  for (const [column, original] of Object.entries(ORIGINAL_CONSTRAINT)) {
    const names = constraints
      .filter(constraint => constraint.column === column)
      .map(constraint => constraint.name);
    // Sem a original, não apaga nada dessa coluna: a unicidade nunca fica
    // sem nenhuma constraint
    if (!names.includes(original)) continue;
    toDrop.push(...names.filter(name => name !== original));
  }
  if (toDrop.length === 0) return;

  const drops = toDrop.map(name => `DROP CONSTRAINT "${name}"`).join(", ");
  await sequelize.query(`ALTER TABLE "users" ${drops}`);
  console.log(
    `🧹 ${toDrop.length} constraints únicas repetidas removidas de users`,
  );
}
