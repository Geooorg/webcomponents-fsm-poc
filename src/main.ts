import './components/app-menu';
import './components/app-map';
import './components/app-info';
import './components/app-ok-button';
import './components/app-freetext';
import type { AppMenu } from './components/app-menu';
import type { AppMap } from './components/app-map';
import type { AppInfo } from './components/app-info';
import type { AppFreetext } from './components/app-freetext';

const menu = document.querySelector<AppMenu>('app-menu')!;
const map = document.querySelector<AppMap>('app-map')!;
const info = document.querySelector<AppInfo>('app-info')!;
const freetext = document.querySelector<AppFreetext>('app-freetext')!;

menu.addEventListener('selection-change', (e) => {
  const { event, shape } = e.detail;
  info.event = event;
  info.shape = shape;
  map.shape = shape;
  if (event) freetext.text = event;
});
