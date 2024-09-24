const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'users', required: true },  // Store user ID as author
    authorName: { type: String, required: true },  // Store user name as author
    genre: { type: String, required: true },
    availability: { type: Boolean, default: true },
    borrowedBy: { type: Schema.Types.ObjectId, ref: 'users', default: null }, // Tracks user who borrowed the book
    reservationQueue: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});

module.exports = mongoose.model('Book', bookSchema);
