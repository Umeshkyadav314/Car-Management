# Car Management Application

A full-stack web application that allows users to manage their cars, including creating, viewing, editing, and deleting cars. The app also supports user authentication, ensures that users can only manage their own cars, and includes a search functionality to filter cars based on different criteria.

## Features

- **User Authentication**: Secure login and registration system.
- **Car Management**: Users can add, edit, view, and delete cars.
- **Car Details**: Each car contains up to 10 images, a title, description, car type, company, and dealer.
- **Search Functionality**: Search for cars based on various tags (e.g., car type, company, dealer).
- **Role-based Access**: Ensures that users can only manage their own cars.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Screenshots

### 1. **Login Page**  
Here’s what the login page looks like:

![Login Page](./images/image1.png)

- Users can log in using their email and password.
- Provides error messages if credentials are incorrect.

### 2. **Register Page**  
The registration page for new users:

![Register Page](./images/image2.png)

- Users can sign up by providing a username, email, and password.
- Includes form validation to ensure required fields are filled.

### 3. **Home Page**  
The home dashboard where users can manage cars:

![Home Page](./screenshots/home-page.png)

- Displays a dashboard with links to view, add, or manage cars.
- Shows an overview of the user's cars and options to navigate to the car management section.

### 4. **Car Create Section**  
Where users can add a new car listing:

![Car Create Page](./screenshots/car-create.png)

- Users can add a new car by providing a title, description, and selecting tags such as car type, company, and dealer.
- Allows uploading up to 10 images for each car listing.

### 5. **Car List Page**  
A list of all cars added by the user:

![Car List Page](./screenshots/car-list.png)

- Displays all cars added by the logged-in user.
- Each car in the list shows basic information such as title, image thumbnails, and key details.
- Options to edit or delete each car.

### 6. **Car Details Page**  
Detailed information about a specific car:

![Car Details Page](./screenshots/car-details.png)

- Displays detailed information about a specific car when clicked.
- Shows the full description, all uploaded images, and tags (car type, company, dealer).

### 7. **Search Page**  
Where users can search for cars based on various criteria:


- Allows users to search for cars based on various criteria like car type, company, and dealer.
- Displays filtered results based on the search input.

## Tech Stack

- **Frontend**: React, Redux, React Router, Axios, Tailwind CSS (or another CSS framework)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (NoSQL Database)
- **Authentication**: JWT (JSON Web Tokens)
- **Storage**: Cloud storage for images (e.g., AWS S3, Firebase Storage)

## MongoDB Setup

### MongoDB Configuration

1. **Create a MongoDB Database**:
   - If you're using MongoDB Atlas, go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to create an account and set up a cluster.
   - If you're using a local MongoDB instance, ensure MongoDB is installed and running on your machine.

2. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory of the backend project and add the following environment variable for the MongoDB connection:
     ```bash
     MONGO_URI=mongodb://<username>:<password>@cluster0.mongodb.net/myCarManagementApp?retryWrites=true&w=majority
     ```
     Replace `<username>` and `<password>` with your MongoDB credentials if using MongoDB Atlas, or use your local MongoDB connection string if running locally.

3. **Connect to MongoDB**:
   - In your backend code (e.g., `server.js` or `app.js`), use the following code to connect to MongoDB:
     ```javascript
     const mongoose = require('mongoose');

     mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
     })
     .then(() => console.log('MongoDB connected'))
     .catch(err => console.log(err));
     ```

4. **Database Models**:
   - Define your MongoDB models for User and Car (or other necessary entities) in your backend. Example:
   
   **User Model (user.js)**:
   ```javascript
   const mongoose = require('mongoose');

   const userSchema = new mongoose.Schema({
       username: { type: String, required: true },
       email: { type: String, required: true, unique: true },
       password: { type: String, required: true },
       cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
   });

   module.exports = mongoose.model('User', userSchema);
