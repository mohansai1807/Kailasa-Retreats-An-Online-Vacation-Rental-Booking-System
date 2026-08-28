# Kailasa Retreats

Kailasa Retreats is a full-stack accommodation booking platform designed to provide users with a seamless way to discover, explore, and reserve unique stays and retreat properties.

The project focuses on building a real-world, production-style web application with authentication, property management, reviews, image handling, and responsive user interfaces.

## Live Demo

**Live Website:** https://kailasa-retreats-an-online-vacation.onrender.com/

## Features

### User Features

* User registration and login
* Secure authentication and authorization
* Browse available retreats and properties
* View detailed property information
* Search and explore listings
* Add and manage reviews
* View property ratings and reviews
* Create and manage property listings
* Edit and delete owned listings
* Responsive design for desktop and mobile devices
* Flash messages for user feedback

### Property Management

* Create new retreat listings
* Add property images
* Update listing information
* Delete listings
* Display property details
* Manage listing ownership

### Reviews

* Add reviews to properties
* Display ratings and reviews
* Delete reviews
* Associate reviews with authenticated users

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* Passport.js
* Express Session

### Other Technologies

* Cloudinary for image storage
* Multer for image uploads
* Mapbox for location-based features
* Express Validator for validation
* Connect Flash for notifications

## Project Architecture

```text
Kailasa-Retreats/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── includes/
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│
├── app.js
├── middleware.js
├── schema.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB
* Git

### Clone the Repository

```bash
git clone <your-repository-url>
cd Kailasa-Retreats
```

### Install Dependencies

```bash
npm install
```

### Start the Application

For development:

```bash
npm start
```

Or:

```bash
node app.js
```

The application will run locally at:

```text
http://localhost:8080
```

## Database Models

### User

Stores user authentication and account information.

```text
User
 ├── username
 ├── email
 └── password
```

### Listing

Stores information about each retreat/property.

```text
Listing
 ├── title
 ├── description
 ├── image
 ├── price
 ├── location
 ├── country
 ├── owner
 └── reviews
```

### Review

Stores reviews and ratings submitted by users.

```text
Review
 ├── comment
 ├── rating
 ├── author
 └── listing
```

## Application Flow

```text
User
  │
  ├── Register / Login
  │
  ├── Browse Retreats
  │       │
  │       └── View Listing
  │
  ├── Create Listing
  │
  ├── Edit / Delete Listing
  │
  └── Add / Manage Reviews
          │
          ▼
       MongoDB
```

## Security

The application implements:

* Authentication using Passport.js
* Authorization for protected routes
* Session-based login management
* Input validation
* Owner-based listing authorization
* Review authorization
* Environment variables for sensitive credentials
* Server-side validation

## Responsive Design

Kailasa Retreats is designed to provide a consistent experience across:

* Desktop
* Laptop
* Tablet
* Mobile devices

## Future Improvements

Potential improvements include:

* Online booking and reservation system
* Payment gateway integration
* Wishlist functionality
* Advanced property filtering
* Real-time availability
* Email booking confirmations
* User profile dashboard
* Admin dashboard
* Property owner dashboard
* AI-powered retreat recommendations
* Map-based property search
* Advanced search and sorting
* Image optimization
* Production-level caching and performance optimization

## Learning Outcomes

This project demonstrates practical experience with:

* Full-stack web development
* RESTful API architecture
* MVC architecture
* CRUD operations
* MongoDB data modeling
* Authentication and authorization
* Session management
* File uploads
* Cloud-based image storage
* Form validation
* Middleware
* Database relationships
* Responsive web design
* Deployment and environment configuration

## Author

**Mohanasai Kadirimangalam**

Full-Stack Developer

### Connect

* GitHub:https://github.com/mohansai1807
* LinkedIn: www.linkedin.com/in/mohanasai-kadirimangalam-a846612b3

## License

This project is developed for educational and portfolio purposes.
