import { Request, Response } from 'express';
import {PutObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {r2} from '../utils/r2Client'
import MediaAsset from "../models/MediaAsset"

const upload = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res.status(400).json({ msg: "fileName and fileType required" });
    }

    const key = `uploads/${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType as string,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 60 }); // valid for 60 seconds
    
    const publicUrl = `${process.env.R2_DEVURL}/${key}`;
        
    await MediaAsset.create({
      url: publicUrl,
      key: key,
      userId: req.user._id,
      status: 'pending',
    })

    res.json({ uploadUrl, key, publicUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}


export default upload;