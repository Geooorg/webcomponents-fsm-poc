import './components/app-menu.js';
import './components/app-map.js';
import './components/app-info.js';

const menu = document.querySelector('app-menu');
const map = document.querySelector('app-map');
const info = document.querySelector('app-info');

menu.addEventListener('selection-change', (e) => {
  const { event, shape } = e.detail;
  info.event = event;
  info.shape = shape;
  map.shape = shape;
});
