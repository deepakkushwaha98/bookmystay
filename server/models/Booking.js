const mongoose = require("mongoose");
const User = require("./User");
const Listing = require("./Listing")


const bookingSchema = mongoose.Schema({
    listingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    checkIn:{
        type:Date
    },
    checkOut:Date,


    
})

module.exports = mongoose.model('Booking' , bookingSchema);