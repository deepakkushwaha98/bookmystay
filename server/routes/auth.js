const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Profile = require('../models/profile');

router.post('/register', async (req, res) => {
    const { name,email, password} = req.body;

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = new User(
            {
                name ,
                email,
                password:hashedPassword
            }

        )
        await user.save();

        const userProfile = new Profile({
            user: user._id,
            bio: '',
            phone: '',
            dob: '',
            avatar: '',
            location: ''
        });
        await userProfile.save();


        const token = jwt.sign({userId:user.id}, 
            process.env.JWT_SECRET, 
            {expiresIn:'1d'});

        res.status(201).json({ token , user});
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({
            message: 'Error occurred while registering user',
            error: err.message
        });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'});
        }

        const existingProfile = await Profile.findOne({user: user._id});
        if(!existingProfile){
            const userProfile = new Profile({
                user: user.id,
                bio: '',
                phone: '',
                dob: '',
                avatar: '',
                location: ''
            });
            await userProfile.save();
        }

        const token = jwt.sign({ userId: user.id , isHost: user.isHost}, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
          token,
          id: user.id,
          name: user.name,
          email: user.email,
          isHost: user.isHost
       });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            message: 'Error occurred while logging in',
            error: err.message
        });
    }
});

module.exports = router;