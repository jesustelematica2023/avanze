const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const StoreSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: [true, 'Ingrese el id'],
    unique: true,
    trim: true,
    maxlength: [10, 'Necesitas 10 caracteres']
  },
  address: {
    type: String,
    required: [true, 'ingresa la direcciòn']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Geocode & create location
StoreSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };

  // Do not save address
  this.address = undefined;
  next();
});

module.exports = mongoose.model('Store', StoreSchema);
