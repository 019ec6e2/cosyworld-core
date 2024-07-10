import express from 'express';

import { db } from '../../database.mjs';
import { ObjectId } from 'mongodb';

const router = express.Router();
const collectionName = 'avatars';


// Route to get all avatars
router.get(`/`, async (req, res) => {
    try {
        const avatars = await db.collection(collectionName).find().toArray();
        res.status(200).send(avatars);
    } catch (error) {
        console.error('🎮 ❌ Failed to fetch avatars:', error);
        res.status(500).send({ error: 'Failed to fetch avatars' });
    }
});

// Route to create a new avatar
router.post('/', async (req, res) => {
    const avatarData = req.body;
    try {
        const result = await db.collection(collectionName).insertOne(avatarData);
        res.status(201).send({ message: 'Avatar created successfully', id: result.insertedId });
    } catch (error) {
        console.error('🎮 ❌ Failed to create avatar:', error);
        res.status(500).send({ error: 'Failed to create avatar' });
    }
});
// Route to get a avatar by ID
router.get(`/:id`, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: 'ID is required to fetch the avatar' });
    }
    try {
        const avatar = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
        if (!avatar) {
            return res.status(404).send({ error: 'Avatar not found' });
        }
        res.status(200).send(avatar);
    } catch (error) {
        console.error('🎮 ❌ Failed to fetch avatar:', error);
        res.status(500).send({ error: 'Failed to fetch avatar' });
    }
});



// Route to update a avatar (PATCH)
router.patch(`/:id`, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
        return res.status(400).send({ error: 'ID is required to update the avatar' });
    }

    try {
        const result = await db.collection(collectionName).updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Avatar not found' });
        }

        res.status(200).send({ message: 'Avatar updated successfully' });
    } catch (error) {
        console.error('🎮 ❌ Failed to update avatar:', error);
        res.status(500).send({ error: 'Failed to update avatar' });
    }
});

export default router;
