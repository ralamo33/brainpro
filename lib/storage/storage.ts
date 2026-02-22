"use server";

import serviceAccount from "@/service-account.json";
import { Storage, Bucket, File } from "@google-cloud/storage";
import { err, ok, Result } from "../result/result";

export async function getBucket(): Promise<Result<Bucket>> {
    const storage = new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID!,
        credentials: serviceAccount,
    });
    const bucketName = "brain_pro_faces";

    try {
        const bucketResp = await storage.getBuckets();
        const maybeBucket = bucketResp[0].find((b) => b.name === bucketName);
        if (!maybeBucket) {
            return err("Found bucket");
        }
        return ok(maybeBucket);
    } catch {
        return err("Failed to fetch buckets");
    }
}
