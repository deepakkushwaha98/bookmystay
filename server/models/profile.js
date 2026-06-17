const express = require('express');
const mongoose = require('mongoose')
const { create, updateMany } = require('./User');

const profilSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true

    },
    bio:{
        type:String,
    },
    phone:String,
    gender:{
        type:String,
        enum:['male','female','other']
    },
    dob:{
        type:String,
    },
    avatar:{
        type:String,
    },
    location:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    } ,
    updatedAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('Profile',profilSchema)