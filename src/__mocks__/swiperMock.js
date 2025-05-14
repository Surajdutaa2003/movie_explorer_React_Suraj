const React = require('react');

const Swiper = ({ children }) => React.createElement('div', { 'data-testid': 'swiper-container' }, children);
const SwiperSlide = ({ children }) => React.createElement('div', { 'data-testid': 'swiper-slide' }, children);
const Navigation = jest.fn();
const Autoplay = jest.fn();

module.exports = {
  Swiper,
  SwiperSlide,
  Navigation,
  Autoplay
};