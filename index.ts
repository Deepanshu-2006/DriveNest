import postgres from 'postgres'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config({ path: '.env.local' });

async function main() {
    console.log("Connecting to database...");
    const client = postgres(process.env.DATABASE_URL!, { prepare: false });
    try {
        const sqlPath = path.join(process.cwd(), 'drizzle', '0000_numerous_stone_men.sql');
        console.log("Reading migration SQL from:", sqlPath);
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        // Split by statement-breakpoint
        const statements = sqlContent
            .split('--> statement-breakpoint')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        console.log(`Executing ${statements.length} migration statements...`);
        for (const statement of statements) {
            console.log("Running statement:\n", statement);
            await client.unsafe(statement);
        }
        console.log("Migration executed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

main();
