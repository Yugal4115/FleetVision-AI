const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const tmpSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.pg.prisma');
const migrationDir = path.join(__dirname, '..', 'prisma', 'migrations', '20261124000000_init_postgresql');
const migrationSqlFile = path.join(migrationDir, 'migration.sql');

const content = fs.readFileSync(schemaPath, 'utf8');
const pgContent = content.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
fs.writeFileSync(tmpSchemaPath, pgContent, 'utf8');

try {
  fs.mkdirSync(migrationDir, { recursive: true });
  const sql = execSync(`npx prisma migrate diff --from-empty --to-schema-datamodel "${tmpSchemaPath}" --script`, {
    encoding: 'utf8'
  });
  fs.writeFileSync(migrationSqlFile, sql, 'utf8');
  console.log('✓ Successfully generated PostgreSQL migration file at:', migrationSqlFile);
} finally {
  if (fs.existsSync(tmpSchemaPath)) {
    fs.unlinkSync(tmpSchemaPath);
  }
}
