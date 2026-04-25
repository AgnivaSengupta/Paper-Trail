import cron from 'node-cron';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../utils/r2Client';
import MediaAsset from '../models/MediaAsset';

// Run every day at midnight
export const cleanupMediaJob = cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Running scheduled cleanup for orphaned media assets...');
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Find all 'pending' assets older than 24 hours
    const orphanedAssets = await MediaAsset.find({
      status: 'pending',
      createdAt: { $lt: twentyFourHoursAgo },
    });

    if (orphanedAssets.length === 0) {
      console.log('✅ No orphaned media assets found.');
      return;
    }

    console.log(`🗑️ Found ${orphanedAssets.length} orphaned assets. Deleting...`);

    let deletedCount = 0;
    let failedCount = 0;

    for (const asset of orphanedAssets) {
      try {
        // 1. Delete from Cloudflare R2 bucket
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: asset.key,
          })
        );

        // 2. Delete from MongoDB
        await MediaAsset.deleteOne({ _id: asset._id });
        deletedCount++;
      } catch (err) {
        console.error(`❌ Failed to delete asset ${asset.key}:`, err);
        failedCount++;
      }
    }

    console.log(`✅ Cleanup complete. Deleted: ${deletedCount}, Failed: ${failedCount}.`);
  } catch (error) {
    console.error('❌ Critical error during media cleanup job:', error);
  }
});
