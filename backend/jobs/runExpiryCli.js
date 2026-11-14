import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.config.js';
import { runMembershipExpiry } from './membershipExpiry.job.js';

async function main() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting Heaven Gym membership expiry job...`);
  try {
    await connectDB();
    const result = await runMembershipExpiry();
    console.log(`[${new Date().toISOString()}] Expiry job completed successfully:`, JSON.stringify(result));
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Expiry job failed:`, error);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
}

main();
