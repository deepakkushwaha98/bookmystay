const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Listing = require('../models/Listing'); // Assuming you have a Listing model



router.get('/', auth, async (req, res) => {
    try{
        const {location , minPrice, maxPrice } = req.query;
        const filter = {};
        if(location){
            filter.location = {$regex: location, $options: 'i'}; // case-insensitive search
        }
        if(minPrice || maxPrice){
            filter.price = {};
        }
        if(minPrice){
            filter.price.$gte = +minPrice;
        }
        if(maxPrice){
            filter.price.$lte = +maxPrice;
        }
        const listings = await Listing.find(filter);
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message:"Error fectching listings" });
    }
});

router.get("/:id" , async (req, res)=>{
    try{
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return res.status(404).json({message:'Listing not found'});
        }
        res.json(listing);


    }
    catch(err){
        res.status(500).json({message:'Error fetching listing'});

    }
})



//post 

router.post('/', auth, async (req, res) => {
    const { title, description, price, location, images } = req.body;
    try {
        if (!req.user.isHost) {
            return res.status(403).json({ message: 'Only hosts can create listings' });
        }

        const listing = new Listing({
            title,
            description,
            price,
            location,
            images,
            hostId: req.user.id
        });
        await listing.save();
        res.status(201).json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Error creating listing' });
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.hostId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this listing' });
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedListing);
    } catch (err) {
        res.status(500).json({ message: 'Error updating listing' });
    }
});


router.delete("/:id" , auth , async (req,res)=>{
    try{
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.hostId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this listing' });
        }

        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: 'Listing deleted successfully' });


    }
    catch(err){
        res.status(500).json({message:"error deleting Listing"})
    }
})



router.get('/my-listing', auth, async (req, res) => {
    try {
        if (!req.user.isHost) {
            return res.status(403).json({
                message: 'Only hosts can view their listings'
            });
        }

        const listings = await Listing.find({ hostId: req.user.id });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching listings' });
    }
});


module.exports = router;
