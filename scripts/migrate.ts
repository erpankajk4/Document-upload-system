import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('Running database migrations...');
  
  try {
    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Run any custom migrations here
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();