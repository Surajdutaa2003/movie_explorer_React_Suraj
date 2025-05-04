import React, { useRef, useState } from 'react';
import MovieCard from './MovieCard';
import MovieDetail from './MovieDetails';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Movie } from './Api';

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const allMoviesSwiperRef = useRef<SwiperCore | null>(null);
  const trendingSwiperRef = useRef<SwiperCore | null>(null);

  const trendingMovies = movies.filter((movie) => movie.rating > 7);

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseDetail = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="space-y-8">
      {/* All Movies */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">All Movies</h2>
        {movies.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={() => allMoviesSwiperRef.current?.autoplay?.stop()}
            onMouseLeave={() => allMoviesSwiperRef.current?.autoplay?.start()}
          >
            <Swiper
              onSwiper={(swiper) => (allMoviesSwiperRef.current = swiper)}
              slidesPerView={2}
              spaceBetween={10}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: '.custom-next-all',
                prevEl: '.custom-prev-all',
              }}
              modules={[Autoplay, Navigation]}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              speed={600}
            >
              {movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    poster={
                      movie.poster_url ||
                      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQoSOgjBmQN9GUg3GQnTNKJHlyuZjP8ESr8AMgf7fYTu9rOr9G5Ewd9IMMi6nuCu8LNp_I8xIMBrlRbt_AJ8fLyVysNlk93Q0so4nyU5c0Hdw9Pd4Q1bemJ'
                    }
                    genre={movie.genre}
                    rating={movie.rating}
                    onMovieClick={handleMovieClick}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="custom-prev-all absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">
              ←
            </button>
            <button className="custom-next-all absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">
              →
            </button>
          </div>
        ) : (
          <p className="text-gray-500">No movies available.</p>
        )}
      </section>

      {/* Trending */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Trending Now</h2>
        {trendingMovies.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={() => trendingSwiperRef.current?.autoplay?.stop()}
            onMouseLeave={() => trendingSwiperRef.current?.autoplay?.start()}
          >
            <Swiper
              onSwiper={(swiper) => (trendingSwiperRef.current = swiper)}
              slidesPerView={2}
              spaceBetween={10}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: '.custom-next-trending',
                prevEl: '.custom-prev-trending',
              }}
              modules={[Autoplay, Navigation]}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              speed={600}
            >
              {trendingMovies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    poster={
                      movie.poster_url ||
                      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQoSOgjBmQN9GUg3GQnTNKJHlyuZjP8ESr8AMgf7fYTu9rOr9G5Ewd9IMMi6nuCu8LNp_I8xIMBrlRbt_AJ8fLyVysNlk93Q0so4nyU5c0Hdw9Pd4Q1bemJ'
                    }
                    genre={movie.genre}
                    rating={movie.rating}
                    onMovieClick={handleMovieClick}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="custom-prev-trending absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">
              ←
            </button>
            <button className="custom-next-trending absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">
              →
            </button>
          </div>
        ) : (
          <p className="text-gray-500">No trending movies available.</p>
        )}
      </section>

      {/* Movie Detail Modal */}
      {selectedMovieId && (
        <MovieDetail movieId={selectedMovieId} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default MovieList;