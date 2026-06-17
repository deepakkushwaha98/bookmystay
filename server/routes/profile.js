const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/profile');   

router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });    
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', auth, async (req, res) => {
    const { bio, phone, gender, dob, avatar, location } = req.body;
    try {
        let profileData = {...req.body, user: req.user.id};
        const existingProfile = await Profile.findOne({ user: req.user.id });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
        }
        
        const profile = new Profile(profileData);
        await profile.save();
        res.json(profile);
        res.status(201).json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });      
    }

});

router.put('/', auth, async (req, res) => {
    try{
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: req.body },
            { new: true }
        );
        if(!updatedProfile){
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(updatedProfile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/', auth, async (req, res) => {
    try {
        const deletedProfile = await Profile.findOneAndDelete({ user: req.user.id });
        if (!deletedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
