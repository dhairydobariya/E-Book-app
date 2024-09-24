const Book = require('../models/bookModel');

// Create a new book
let createBook = async (req, res) => {
    const { title, genre } = req.body;
    const userId = req.user.id;   // Access the logged-in user's ID from the token
    const userName = req.user.name;  // Access the logged-in user's name from the token

    if (!title || !genre) {
        return res.status(400).json({ message: 'Title and genre are required.' });
    }

    try {
        const newBook = new Book({
            title,
            authorId: userId,    // Set the authorId to the logged-in user's ID
            authorName: userName,  // Set the authorName to the logged-in user's name
            genre,
            availability: true,
        });
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all books
let getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a book by ID
let getBookById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a book
let updateBook = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Get the fields to update from the request body

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, { $set: updates }, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Delete a book
let deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Borrow a book
let borrowBook = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Get logged-in user's ID from req.user

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (!book.availability) {
            return res.status(400).json({ message: 'Book is not available for borrowing' });
        }

        book.availability = false;
        book.borrowedBy = userId; // Set the logged-in user as the borrower
        await book.save();

        res.status(200).json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Return a book
// Return a book and automatically assign it to the first reserved user
let returnBook = async (req, res) => {
    const { id } = req.params; // Book ID
    const userId = req.user.id; // Logged-in user's ID (the one returning the book)

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.borrowedBy.toString() !== userId) {
            return res.status(403).json({ message: 'You cannot return a book you did not borrow' });
        }

        // Clear the borrowedBy field
        book.borrowedBy = null;
        book.availability = true;

        // Check if there is a reservation queue
        if (book.reservationQueue.length > 0) {
            // Automatically assign the book to the first user in the reservation queue
            const nextUser = book.reservationQueue.shift(); // Get and remove the first user from the queue
            book.borrowedBy = nextUser;
            book.availability = false; // Set book as borrowed

            // Notify the user that they can now borrow the book
            // (You can implement notifications here using a notification system like FCM or email)

            await book.save();

            return res.status(200).json({
                message: `Book returned successfully and assigned to the next user in the reservation queue`,
                book
            });
        } else {
            // If no one has reserved the book, make it available
            await book.save();
            return res.status(200).json({ message: 'Book returned successfully and is now available', book });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Reserve a book
let reserveBook = async (req, res) => {
    const { id } = req.params; // Book ID
    const userId = req.user.id; // Logged-in user's ID

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!book.availability) {
            // If the book is already reserved by other users, add the user to the reservation queue
            if (book.reservationQueue.includes(userId)) {
                return res.status(400).json({ message: 'You have already reserved this book' });
            }

            book.reservationQueue.push(userId); // Add the user to the reservation queue
            await book.save();

            return res.status(200).json({ message: 'Book reserved successfully', book });
        } else {
            return res.status(400).json({ message: 'Book is available, no need for reservation' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getBookReservations = async (req, res) => {
    try {
        const bookId = req.params.id;
        
        // Find the book by its ID and populate the reservation queue
        const book = await Book.findById(bookId).populate('reservationQueue', 'name email'); // Assuming reservationQueue holds user IDs

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Respond with the list of users who have reserved the book
        res.status(200).json({
            bookTitle: book.title,  // Assuming the book has a 'title' field
            reservations: book.reservationQueue,  // Array of users who reserved the book
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cancel reservation
const cancelReservation = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.user.id;  // Assuming `req.user.id` holds the authenticated user's ID

        // Find the book by its ID
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if the reservationQueue exists and has elements
        if (!book.reservationQueue || book.reservationQueue.length === 0) {
            return res.status(400).json({ message: 'No reservations found for this book.' });
        }

        // Convert user ID to string (to avoid type mismatches)
        const userIdStr = userId.toString();

        // Check if the user is in the reservation queue
        const userIndex = book.reservationQueue.findIndex(reservedUser => reservedUser.toString() === userIdStr);

        if (userIndex === -1) {
            return res.status(400).json({ message: 'You do not have a reservation for this book.' });
        }

        // Remove the user from the reservation queue
        book.reservationQueue.splice(userIndex, 1);

        // Save the updated book document
        await book.save();

        res.status(200).json({ message: 'Reservation successfully canceled.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    reserveBook,
    getBookReservations,
    cancelReservation
}
