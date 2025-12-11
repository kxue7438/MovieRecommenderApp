# CineScope: Movie and TV Show Review Aggregator

CineScope is a high-quality web application that aggregates movie and TV show reviews and uses text data analysis to assign genre tags. Users can explore movies, filter by genres, search titles, and manage their watchlist. The dataset includes 100 movies for streamlined review aggregation and genre analysis. All movie data and posters were gathered using text mining and information retrieval techniques.

## Features

### Home Screen
- **Search Bar:** Search all movies in the dataset by name.
- **Trending:** Displays a random selection of movies. Clicking a poster navigates to the movie's detail page.
- **Browse by Genre:** Filter movies by genre and navigate directly to the All Movies screen with the selected genre applied.
- **Navigation Hotbar:** Easily navigate between Home, All Movies, and Watchlist from the top-right menu.

### All Movies Screen
- Displays all movies in the dataset with clickable posters to view individual movie pages.
- **Filter and Search:** Search by movie name or genre tags.
- **Sort Options:** Sort movies by rating, release year, title, or relevance.

### Watchlist
- Track movies marked as **Want to Watch** or **Watched**.
- Separate views for each status.

### Individual Movie Page
- **Important Information:** Genre, release year, poster, and watchlist options displayed prominently.
- **Synopsis:** Movie synopsis retrieved via text mining and data retrieval.
- **You May Also Like:** Recommendations based on similar genre tags.


## Installation and Activation

1. Navigate to the folder containing the source code.
2. Install dependencies:

    npm i

3. Start the development server:

    npm run dev

4. Open the app in your browser (https://kxue7438.github.io/MovieRecommenderApp/ or default at http://localhost:3000).

## Technologies Used

- Frontend: React
- Data Processing: Text mining and information retrieval for summaries, posters, and genre assignment
- Styling: CSS / Tailwind
- Dataset: 100 movies for review aggregation and genre analysis

## Dataset

The CineScope dataset contains:

- Movie title
- Genre tags (assigned via text data analysis)
- Release year
- Poster images (scraped using text mining)
- Synopsis


## Implementation Details

### Frontend
- Built with **React** and styled using CSS.
- Screens are organized into React components: Home, All Movies, Watchlist, and Individual Movie Pages.
- Filtering, searching, and sorting are handled directly in the React components with basic algorithms.

### Data Handling
- Movie dataset initially stored in a **CSV file** and parsed into **JSON files** for use in the application.
- **Watchlist statuses** (“Want to Watch” and “Watched”) are saved using **localStorage**.

### Data Collection
- **Movie summaries and posters** were gathered via **web scraping**.
- Text retrieval techniques were used to extract relevant content from large amounts of website data.

### Genre Assignment
- Simple genre matching is applied using **text data analysis** on movie summaries to assign genre tags.

### Recommendations
- “You May Also Like” section uses **genre similarity** to suggest other movies in the dataset.

### Development
- Currently runs a **local development server** via `npm run dev`.
- Frontend handles all filtering, searching, and recommendation logic; no backend server is required for local use.


## Team
- Jackie Sun - jackies3
- Kenneth Xue - kxue8
- Pengshao Ye - py12
- Macy Liu - meishi2
- Kerry Wang (Project Coordinator) - kerryzw2
