import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(__dirname, '../../migrations')

// Simple SQL migration runner
async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://fabricloop:password@localhost:5432/fabricloop',
  })

  try {
    console.log('🔗 Connecting to database...')
    await pool.query('SELECT NOW()')
    console.log('✅ Connected to database')

    // Create migrations table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Get all migration files
    const files = await readdir(MIGRATIONS_DIR)
    const migrations = files
      .filter((f) => f.endsWith('.sql'))
      .sort()

    console.log(`📄 Found ${migrations.length} migration files`)

    for (const file of migrations) {
      // Check if migration was already executed
      const result = await pool.query(
        'SELECT id FROM schema_migrations WHERE name = $1',
        [file]
      )

      if (result.rows.length > 0) {
        console.log(`⏭️  Skipping ${file} (already executed)`)
        continue
      }

      console.log(`▶️  Running ${file}...`)

      const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8')
      await pool.query(sql)

      await pool.query(
        'INSERT INTO schema_migrations (name) VALUES ($1)',
        [file]
      )

      console.log(`✅ Completed ${file}`)
    }

    console.log('🎉 All migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigrations()
