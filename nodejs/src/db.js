import Loki from 'lokijs';

const db = new Loki('lokijs.db');
export const sitemapsDb = db.addCollection('sitemaps', {
  exact: ['name', 'lastupdate', 'items'],
  indices: ['name'],
  autoload: false,
  autosave: false,
  autosaveInterval: 10000
});
export const sitemapListDb = db.addCollection('sitemapsList', {
  exact: ['name', 'lastupdate', 'json'],
  indices: ['name'],
  autoload: false,
  autosave: false,
  autosaveInterval: 10000
});
