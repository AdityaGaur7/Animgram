# SociApp - Social Media Application

## Overview

Welcome to SociApp, a small-scale social media platform developed using Express.js for the backend and MongoDB as the database. SociApp provides essential features such as user authentication (login and signup), post creation, post deletion, editing profile images, and a feed section to view posts from other users.

## Features

1. **User Authentication:**
   - Users can create a new account by signing up with a unique username and password.
   - Existing users can log in securely to access their accounts.

2. **Post Management:**
   - Users can create new posts to share updates or thoughts with the community.
   - Post deletion functionality allows users to remove their posts if needed.

3. **Profile Image Editing:**
   - Users have the ability to upload and edit their profile images to personalize their profiles.

4. **Feed Section:**
   - The feed section displays posts from other users, providing a centralized location to stay updated with community activity.

## Technologies Used

- **Express.js:** Used as the backend framework to handle routing, middleware, and server-side logic.
- **MongoDB:** Serves as the database to store user information, posts, and other relevant data.
- **HTML/CSS:** Basic front-end structure and styling.
- **Authentication:** Implemented for user security using secure login and signup mechanisms.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/sociapp.git
   ```

2. **Install Dependencies:**
   ```bash
   cd sociapp
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the project root and set the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     SESSION_SECRET=your_session_secret_key
     ```

4. **Run the Application:**
   ```bash
   npm start
   ```
   The application will be accessible at `http://localhost:3000` by default.

## Contributing

If you'd like to contribute to the SociApp project, feel free to fork the repository and submit pull requests. Please follow the [contribution guidelines](CONTRIBUTING.md) for a smooth collaboration process.

## License

This project is licensed under the [MIT License](LICENSE), which means you are free to use, modify, and distribute the code.

## Acknowledgments

Special thanks to [name of any libraries or frameworks you used] for their invaluable contributions to this project.

Enjoy using SociApp! If you have any questions or issues, feel free to open an [issue](https://github.com/your-username/sociapp/issues).


