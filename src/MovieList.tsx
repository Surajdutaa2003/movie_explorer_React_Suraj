import React, { useRef } from 'react';
import  MovieCard  from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Movie } from './Api';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onDeleteMovie?: (movieId: number) => Promise<void>;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onMovieClick, onDeleteMovie }) => {
  const allMoviesSwiperRef = useRef<SwiperCore | null>(null);
  const trendingSwiperRef = useRef<SwiperCore | null>(null);
  const topSwiperRef = useRef<SwiperCore | null>(null);
  const actorsSwiperRef = useRef<SwiperCore | null>(null);

  // Filter movies with rating >= 8.8 for All time Favourites
  const allTimeFavorites = movies.filter((movie) => movie.rating >= 8.5);

  // Trending movies with rating > 7
  const trendingMovies = movies.filter((movie) => movie.rating > 7);

  const topActors = [
    { name: 'Leonardo DiCaprio', image: 'https://cdn.britannica.com/65/227665-050-D74A477E/American-actor-Leonardo-DiCaprio-2016.jpg?w=400&h=300&c=crop' },
    { name: 'Emma Watson', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfY-AEO2Xb5_NydkrBuT0D6S-5cSvVtYfZ-Jh04P3KOs6D-qi4u3a4EimQ1d3YIuJJG6fLURaWS7HFyk749I0Uk8_xbSHOys3V9EMxtQ' },
    { name: 'Tom Holland', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRtPi_ebmCFou3cFxSOXyFnilbBTmv6dixf7lnUm9YPvLPX36sZV61Zvc8HUoe5Gm8jd_QM6pEXBk32z9EldotBGYUYV-tGYZ5LRfZKng' },
    { name: 'Robert Downey Jr.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM2x2eeYUrh06Zi32o3cgRhImhmxchWRKMj6snwepLPHo1l-27kOo7ry1gbe_WaOKnKEY&usqp=CAU' },
    { name: 'Leonardo DiCaprio', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcStzD0fuQ35rNa6jceHvTLmwxZzmwfWh9ZkvMTftjXpbe3PZngSccnpPi8fDN1Q2hENS_AMFVZWaTT1pnblRPfMYkFQDDOlJtCNKeHDSiM' },
    { name: 'Scarlett Johansson', image: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/4a6d/live/826aa090-160c-11f0-8a1e-3ff815141b98.jpg' },
    { name: 'Tom Hardy', image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQY2H53gvNDgr7L7P9IX9SE8pcM9FHlfDzBkfEQ4eiDJMosP8ReLCO-0VvSEDhXX0LtH4at6Oly4bZ9_gOkcL7PgQ' },
    { name: 'Zendaya', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtki5-7izlBYgPUu4aHC3FGNFC10Xr4gwxtvGKcT7j_5pOSAbu4wqUYsoHz2OnVCc5Qwk&usqp=CAU' },
    { name: 'Robert Pattinson', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPamFqYRka1uW1pUEdbsbaNzFIpA9_sXRbwL5RZcUrQWdE9YgsnPWplAnG1JSIWVb-GLk&usqp=CAU' },
  ];

  return (
    <div className="space-y-12 px-4">
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
              loop
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={{ nextEl: '.custom-next-all', prevEl: '.custom-prev-all' }}
              modules={[Autoplay, Navigation]}
              breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
              speed={600}
            >
              {movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCard movie={movie} onMovieClick={onMovieClick} onDeleteMovie={onDeleteMovie} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="custom-prev-all absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">←</button>
            <button className="custom-next-all absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">→</button>
          </div>
        ) : (
          <p className="text-gray-500">No movies available.</p>
        )}
      </section>

      {/* Trending Now */}
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
              loop
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={{ nextEl: '.custom-next-trending', prevEl: '.custom-prev-trending' }}
              modules={[Autoplay, Navigation]}
              breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
              speed={600}
            >
              {trendingMovies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCard movie={movie} onMovieClick={onMovieClick} onDeleteMovie={onDeleteMovie} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="custom-prev-trending absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">←</button>
            <button className="custom-next-trending absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">→</button>
          </div>
        ) : (
          <p className="text-gray-500">No trending movies available.</p>
        )}
      </section>

      {/* All time Favourites */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">All time Favourites</h2>
        {allTimeFavorites.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={() => topSwiperRef.current?.autoplay?.stop()}
            onMouseLeave={() => topSwiperRef.current?.autoplay?.start()}
          >
            <Swiper
              onSwiper={(swiper) => (topSwiperRef.current = swiper)}
              slidesPerView={2}
              spaceBetween={10}
              loop={allTimeFavorites.length >= 2}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={{ nextEl: '.custom-next-top', prevEl: '.custom-prev-top' }}
              modules={[Autoplay, Navigation]}
              breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
              speed={600}
            >
              {allTimeFavorites.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCard movie={movie} onMovieClick={onMovieClick} onDeleteMovie={onDeleteMovie} />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="custom-prev-top absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">←</button>
            <button className="custom-next-top absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10">→</button>
          </div>
        ) : (
          <p className="text-gray-500">No movies with rating 8.8 or higher available.</p>
        )}
      </section>

      {/* Top Actors */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Actors</h2>
        <div
          className="relative"
          onMouseEnter={() => actorsSwiperRef.current?.autoplay?.stop()}
          onMouseLeave={() => actorsSwiperRef.current?.autoplay?.start()}
        >
          <Swiper
            onSwiper={(swiper) => (actorsSwiperRef.current = swiper)}
            slidesPerView={2}
            spaceBetween={20}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            navigation={{
              nextEl: '.custom-next-actors',
              prevEl: '.custom-prev-actors',
              disabledClass: 'swiper-button-disabled',
              hiddenClass: 'swiper-button-hidden',
            }}
            modules={[Autoplay, Navigation]}
            breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }}
            speed={600}
          >
            {topActors.map((actor, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={actor.image}
                    alt={actor.name}
                    className="w-60 h-60 rounded-full object-cover shadow-md"
                  />
                  <p className="text-base font-medium text-gray-700 text-center">{actor.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="custom-prev-actors absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10" tabIndex={0} role="button" aria-label="Previous slide">←</button>
          <button className="custom-next-actors absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10" tabIndex={0} role="button" aria-label="Next slide">→</button>
        </div>
      </section>
    </div>
  );
};

export default MovieList;