# BingeBox React App

A modern React application converted from a static HTML/CSS/JavaScript streaming platform.

## Features

- React with functional components and hooks
- React Router for navigation
- jQuery integration for animations and effects
- JSON data-driven content
- Video modal with YouTube embeds
- Favorites system with localStorage
- Responsive design
- Search functionality

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── Navbar.js
│   ├── Card.js
│   └── VideoModal.js
├── pages/
│   ├── Home.js
│   ├── Anime.js
│   ├── Drama.js
│   ├── Podcast.js
│   ├── Favorites.js
│   └── Login.js
├── data/
│   ├── homeData.json
│   ├── animeData.json
│   ├── dramaData.json
│   └── podcastData.json
├── App.js
├── index.js
└── style.css
```

## Routes

- `/` - Home page
- `/anime` - Anime page
- `/drama` - Drama page
- `/podcast` - Podcast page
- `/favorites` - Favorites page
- `/login` - Login page

## Login Credentials

- Username: admin
- Password: 1234

## Technologies Used

- React 18
- React Router DOM
- jQuery
- CSS3
- HTML5
