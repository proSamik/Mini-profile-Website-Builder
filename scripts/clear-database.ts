import 'dotenv/config';
import { db } from '../src/lib/db/client';
import { profiles, users } from '../src/lib/db/schema';

async function clearDatabase() {
  try {
    console.log('Deleting all profiles...');
    await db.delete(profiles);
    console.log('✓ All profiles deleted');

    console.log('Deleting all users...');
    await db.delete(users);
    console.log('✓ All users deleted');

    console.log('\n✓ Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
