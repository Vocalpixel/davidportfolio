import { Routes } from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {GalleryComponent} from "./pages/gallery/gallery.component";

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'home', component: MainComponent },
  { path: 'gallery', component: GalleryComponent },
  // { path: 'gallery', component: GalleryComponent },
  // { path: 'about', component: AboutComponent }
];
