import express, { Router } from "express"
import {PutObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {r2} from '../utils/r2Client'

const router: Router = express.Router()

router.get("/get-upload-url", async (req, res) => {
    try {
        const {fileName, fileType} = req.query;

        if (!fileName || !fileType) {
            return res.status(400).json({msg: "fileName and fileType required"});
        }

        const uniqueName = `${Date.now()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: uniqueName,
            ContentType: fileType as string,
        });

        const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 60 }); // valid for 60 seconds
    
        const fileUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${uniqueName}`;

        res.json({ uploadUrl, fileUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate presigned URL" });
    }
})

const uploadRouter = router;
export default uploadRouter;