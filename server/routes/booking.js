const express = require("express");
const router = express.Router();

const auth= require("../middleware/auth")
const Booking = require("../models/Booking");



router.post("/" , auth ,async (req,res)=>{
    try{
        const {listingId , checkIn , checkOut } = req.body;

        const booking = new Booking({
            listingId,
            userId : req.user.id,
            checkIn,
            checkOut,
        });
        await booking.save();
        res.status(201).json(booking);

    }
    catch(err){
        res.status(500).json({message: "Error creating"});
    }
})


router.get("/my-bookings" , auth ,async (req,res)=>{
    try{
        const booking = await Booking.find({userId:req.user.id}).populate("listingId");
        res.json(booking);

    }
    catch(err){
        res.status(500).json({message:"error not fecting booking"})
    }
})


router.get("./:id" , auth , async (req,res)=>{
    try{
        const booking = await Booking.findById(req.params.id).populate("listingId");
        if(!booking) return  res.status(404).json({message: "Booking not found"});
        if(booking.userId.toSting() !== req.user.id)
            return res.status(403).json({message: "unauthrized"});
        res.json(booking);

    }
    catch(err){
         res.status(500).json({message: "Error fecting booking"})
    }
});

router.put("/:id" , auth , async (req,res)=>{
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking) return res.status(404).json({message:"Booing not found"});
        if(booking.userId.toSting() !== req.user.id){
            return res.status(404).json({message: "Unautherized"})
        }

        const {checkIn , checkOut} = req.body;
        booking.checkIn = checkIn || booking.checkIn;
        booking.checkOut = checkOut || booking.checkOut;
    }
    catch(err){
        res.status(500).json({message: "error updating booking"})

    }
})


router.delete("/:id" , auth , async (req, res)=>{
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking) return res.status(404).json({message:"Booing not found"});
        if(booking.userId.toSting() !== req.user.id){
            return res.status(404).json({message: "Unautherized"})
        }

        await Booking.deleteOne();
        res.json({message:"Booking Deleted"});
    }
    catch(err){
        res.status(500).json({message:"Error delete Booking"})
    }
})


module.exports = router;