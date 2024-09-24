const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');  // Correctly import bookController
const authenticateUser = require('../middleware/authMiddleware'); // Correctly import middleware

// Create a new book
router.post('/create', authenticateUser, bookController.createBook);  

// Get all books with pagination and optional filters (e.g., search, category, etc.)
router.get('/', authenticateUser, bookController.getBooks);  

// Get a specific book by ID
router.get('/:id', authenticateUser, bookController.getBookById);  

// Update a book using PATCH
router.patch('/:id', authenticateUser, bookController.updateBook);  

// Delete a book
router.delete('/:id', authenticateUser, bookController.deleteBook);  

// Borrow a book (with reservation queue management)
router.post('/borrow/:id', authenticateUser, bookController.borrowBook);  

// Return a book (automatically triggers borrowing for the first reservation in queue, if any)
router.post('/return/:id', authenticateUser, bookController.returnBook);  

// Reserve a book (add the user to the reservation queue)
router.post('/reserve/:id', authenticateUser, bookController.reserveBook);

// Get all reservations for a book
router.get('/reservations/:id', authenticateUser, bookController.getBookReservations);

// Cancel a reservation
router.delete('/reserve/:id', authenticateUser, bookController.cancelReservation);

// Export the router properly
module.exports = router;
