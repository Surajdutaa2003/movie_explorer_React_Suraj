
export interface Movie {
  id: number;
  title: string;
  poster: string;
  genre: string;
  year: number;
  rating: number;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    poster: 'https://m.media-amazon.com/images/I/71thFiIUSpL._AC_UF894,1000_QL80_.jpg',
    genre: 'Sci-Fi',
    year: 2010,
    rating: 8.8,
  },
  {
    id: 2,
    title: 'Interstellar',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp-w-sBl84r5mK3pWGnGhqE8ZnG73JlWZm7Q&s',
    genre: 'Sci-Fi',
    year: 2014,
    rating: 8.6,
  },
  {
    id: 3,
    title: 'The Dark Knight',
    poster: 'https://rukminim2.flixcart.com/image/850/1000/k8xduvk0/poster/j/m/z/medium-the-dark-knight-poster-decorative-wall-poster-wall-d-cor-original-imafqu8evqxuvfvg.jpeg?q=90&crop=false',
    genre: 'Action',
    year: 2008,
    rating: 9.0,
  },
  {
    id: 4,
    title: 'Tenet',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmGMV8qFJnb1x2xlrOapv04cH_5hNq6hK74Q&s',
    genre: 'Sci-Fi',
    year: 2020,
    rating: 7.3,
  },
  {
    id: 5,
    title: 'Avatar: The Way of Water',
    poster: 'https://m.media-amazon.com/images/I/91vwVHABnZL._AC_UF894,1000_QL80_.jpg',
    genre: 'Adventure',
    year: 2022,
    rating: 7.6,
  },
  {
    id: 6,
    title: 'John Wick: Chapter 4',
    poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtiHQay3t__Yl4kZed1cEFt3swME-BF_FdEg&s',
    genre: 'Action',
    year: 2023,
    rating: 7.7,
  },
  {
    id: 7,
    title: 'Guardians of the Galaxy Vol. 3',
    poster: 'https://m.media-amazon.com/images/I/71OLMNKaKEL._AC_UF1000,1000_QL80_.jpg',
    genre: 'Adventure',
    year: 2023,
    rating: 7.9,
  },
  {
    id: 8,
    title: 'Spider-Man: No Way Home',
    poster: 'https://cdn.marvel.com/content/1x/snh_online_6072x9000_posed_01.jpg',
    genre: 'Adventure',
    year: 2021,
    rating: 8.2,
  },
];

export const genres: string[] = ['All', 'Sci-Fi', 'Action', 'Adventure'];
