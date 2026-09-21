import './components/app-menu';
import './components/app-map';
import './components/app-info';
import type { AppMenu } from './components/app-menu';
import type { AppMap } from './components/app-map';
import type { AppInfo } from './components/app-info';

const menu = document.querySelector<AppMenu>('app-menu')!;
const map = document.querySelector<AppMap>('app-map')!;
const info = document.querySelector<AppInfo>('app-info')!;

menu.addEventListener('selection-change', (e) => {
  const { event, shape } = e.detail;
  info.event = event;
  info.shape = shape;
  map.shape = shape;
});
