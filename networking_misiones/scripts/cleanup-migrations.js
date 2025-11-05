/*
  Limpia carpetas de migraciones de Prisma manteniendo las más recientes.
  - Lee variables desde `.env` si existen:
    - CLEAN_MIGRATIONS: "1" para borrar; cualquier otro valor hace dry-run
    - CLEAN_MIGRATIONS_KEEP_COUNT: cantidad de carpetas a conservar (por defecto 1)
  - Por seguridad, siempre conserva al menos 1 carpeta.
*/

const fs = require('fs');
const path = require('path');

// Carga simple de .env sin dependencias
function loadDotEnv(root) {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  });
}

function main() {
  const root = path.resolve(__dirname, '..');
  loadDotEnv(root);

  const migrationsDir = path.join(root, 'prisma', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log(`[cleanup-migrations] No existe el directorio: ${migrationsDir}`);
    return;
  }

  const keepCount = Math.max(1, Number(process.env.CLEAN_MIGRATIONS_KEEP_COUNT || 1));
  const doDelete = String(process.env.CLEAN_MIGRATIONS || '').trim() === '1';

  const entries = fs.readdirSync(migrationsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'node_modules')
    .map((e) => e.name)
    .sort(); // por nombre (timestamp + slug) ascendente

  // Excluir archivos como migration_lock.toml
  const folders = entries.filter((name) => !name.endsWith('.toml'));

  if (folders.length <= keepCount) {
    console.log(`[cleanup-migrations] Nada para borrar. Total: ${folders.length}, keepCount: ${keepCount}`);
    return;
  }

  const toKeep = folders.slice(-keepCount);
  const toDelete = folders.slice(0, folders.length - keepCount);

  console.log(`[cleanup-migrations] Manteniendo (${toKeep.length}): ${toKeep.join(', ')}`);
  if (!doDelete) {
    console.log(`[cleanup-migrations] DRY-RUN. Se borrarían (${toDelete.length}): ${toDelete.join(', ')}`);
    return;
  }

  for (const name of toDelete) {
    const dir = path.join(migrationsDir, name);
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`[cleanup-migrations] Borrado: ${name}`);
    } catch (err) {
      console.error(`[cleanup-migrations] Error al borrar ${name}:`, err && err.message ? err.message : err);
    }
  }
}

main();