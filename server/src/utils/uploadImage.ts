//Upload image to s3 bucket.

import S3 from 'aws-sdk/clients/s3';
import { uuid } from 'uuidv4';
import { Buffer } from 'buffer';
import { v4 } from 'uuid';

// @params file: string (base64) image file
export const uploadImage = async (image: string) => {
  try {
    const s3 = new S3({
      accessKeyId: process.env.AWSACCESS_KEY,
      secretAccessKey: process.env.AWSSECRET_KEY,
    });
    const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];

    const params = {
      Bucket: process.env.AWSBucket,
      Key: `${v4()}.${type}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    };

    const { Location } = await s3.upload(params).promise();
    return Location;
  } catch (error) {
    console.log(error);
    return null;
  }
};
