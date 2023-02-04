import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAuthenticated } from '../../middleware';
import { uploadImage } from 'utils/uploadImage';

const prisma = new PrismaClient();

const router = require('express').Router();

router.use(isAuthenticated);

// listings REST API everything is under /listings
// create listing
router.post('/', async (req: Request, res: Response) => {
  const {
    name,
    images,
    city,
    housing_type,
    description,
    price,
    petsAllowed,
    address,
    bathrooms,
    rooms,
    size,
    zipcode,
    distanceToUcf,
  } = req.body;
  const uploadImages = [];
  if (!name) {
    return res.status(400).json({ Error: 'Name is required' });
  }
  //check if images is an array
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ Error: 'Images are required' });
  } else {
    //check if images are base64 string
    //upload images to s3 bucket
    //add image urls to uploadImages array
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!/^data:image\/[a-z]+;base64,/.test(image)) {
        return res.status(400).json({ Error: 'Image should be a base64 image!' });
      }
      const uploadedImage = await uploadImage(image);

      if (!uploadedImage) return res.status(400).json({ Error: 'Failed to upload image' });
      uploadImages.push(uploadedImage);
    }
  }

  if (!city) {
    return res.status(400).json({ Error: 'City is required' });
  }
  if (!housing_type) {
    return res.status(400).json({ Error: 'Housing type is required' });
  }
  if (!description) {
    return res.status(400).json({ Error: 'Description is required' });
  }
  if (!price) {
    return res.status(400).json({ Error: 'Price is required' });
  }
  if (!petsAllowed) {
    return res.status(400).json({ Error: 'Pets allowed is required' });
  }
  if (!address) {
    return res.status(400).json({ Error: 'Address is required' });
  }
  try {
    const payload: payload = req.body[0];
    const userId = payload.userId;

    const listing = await prisma.listings.create({
      data: {
        name: name as string,
        images: uploadImages as string[],
        city: city as string,
        housing_type: housing_type as string,
        description: description as string,
        price: price as number,
        petsAllowed: petsAllowed as boolean,
        userId: userId as string,
        address: address as string,
        bathrooms: (bathrooms as number) || undefined,
        rooms: (rooms as number) || undefined,
        size: (size as number) || undefined,
        zipcode: (zipcode as string) || undefined,
        distanceToUcf: (distanceToUcf as number) || undefined,
      },
    });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

// * update a listing
router.put('/:listingId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const updatedListing = await prisma.listings.update({
      where: {
        id: req.params.listingId,
      },
      data: {
        name: req.body.name || undefined,
        images: req.body.images || undefined,
        city: req.body.city || undefined,
        housing_type: req.body.housing_type || undefined,
        description: req.body.description || undefined,
        price: req.body.price || undefined,
        petsAllowed: req.body.petsAllowed || undefined,
        address: req.body.address || undefined,
      },
    });
    res.status(200).json(updatedListing);
  } catch (err) {
    res.status(500).json(err);
  }
});

// * delete a listing
router.delete('/:listingId', async (req: Request, res: Response) => {
  try {
    await prisma.listings.delete({
      where: {
        id: req.params.listingId,
      },
    });
    res.status(200).json('Succesfully deleted listing');
  } catch (err) {
    res.status(500).json(err);
  }
});

// * get all listings
router.get('/all', async (req: Request, res: Response) => {
  try {
    const listings = await prisma.listings.findMany();
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json(err);
  }
});

// * get one listing
router.get('/:listingId', async (req: Request, res: Response) => {
  try {
    const listing = await prisma.listings.findFirst({
      where: {
        id: req.params.listingId,
      },
    });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
