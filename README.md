const readme = `
# E-Book Management API

This API allows users to manage books, borrow and return them, and reserve books. It includes authentication, book reservation functionality, and automatic borrowing for reserved users.

## Features

- User authentication and authorization with JWT
- Create, update, and delete books
- Borrow and return books
- Reserve books and automatic borrowing for reserved users
- Pagination for books listing

## Installation

1. Clone the repository:

\`\`\`bash
git clone <repository_url>
\`\`\`

2. Navigate to the project directory:

\`\`\`bash
cd e-book-management-app
\`\`\`

3. Install the dependencies:

\`\`\`bash
npm install
\`\`\`

4. Create a `.env` file in the root directory and set up your environment variables:

\`\`\`env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=4000
\`\`\`

5. Start the server:

\`\`\`bash
npm run dev
\`\`\`

The server should be running at \`http://localhost:4000\`.

## API Endpoints

### Authentication

- **Register User**  
  \`POST /api/users/register\`  
  Create a new user account.

- **Login User**  
  \`POST /api/users/login\`  
  Authenticate a user and return a JWT.

- **Logout User**  
  \`GET /api/users/logout\`  
  Log out the current user.

### Books

- **Create a New Book**  
  \`POST /api/books/create\`  
  Requires authentication. Add a new book to the system.

- **Get All Books (with Pagination)**  
  \`GET /api/books?page={page}&limit={limit}\`  
  Requires authentication. Retrieve a list of all books with pagination.

- **Get a Single Book**  
  \`GET /api/books/:id\`  
  Requires authentication. Get details of a specific book by ID.

- **Update a Book**  
  \`PATCH /api/books/:id\`  
  Requires authentication. Update book details.

- **Delete a Book**  
  \`DELETE /api/books/:id\`  
  Requires authentication. Delete a specific book by ID.

### Borrow & Return

- **Borrow a Book**  
  \`POST /api/books/borrow/:id\`  
  Requires authentication. Borrow a book if available.

- **Return a Book**  
  \`POST /api/books/return/:id\`  
  Requires authentication. Return a borrowed book.

### Reservations

- **Reserve a Book**  
  \`POST /api/books/reserve/:id\`  
  Requires authentication. Reserve a book for future borrowing.

- **Get Book Reservations**  
  \`GET /api/books/reservations/:id\`  
  Requires authentication. View all users who have reserved a specific book.

- **Delete a Reservation**  
  \`DELETE /api/books/reserve/:id\`  
  Requires authentication. Cancel a book reservation.

## Middleware

- **Authentication Middleware**  
  \`authenticateUser\`  
  This middleware is used to protect routes. It checks the validity of the JWT and ensures that only authenticated users can access certain routes.

## Book Borrowing Workflow

1. A user can borrow a book using the \`/borrow/:id\` route if it's available.
2. When a user returns a book using the \`/return/:id\` route, the first user in the reservation queue automatically borrows the book.

## Pagination

Pagination is implemented on the book listing API. You can retrieve a specific page of books by using the \`page\` and \`limit\` query parameters.

Example:
\`\`\`
GET /api/books?page=2&limit=10
\`\`\`

This will return the second page with 10 books per page.

## Book Reservation Logic

- Users can reserve books that are currently borrowed.
- When a book is returned, the first user in the reservation queue will automatically borrow it.

## Error Handling

All errors will return a JSON response with the following structure:

\`\`\`json
{
  "message": "Error message",
  "error": "Detailed error information"
}
\`\`\`

## License

This project is licensed under the MIT License.
`;
