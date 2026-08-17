import { Component, computed, signal } from '@angular/core';
import { Header } from './components/header/header';
import { RestaurantList } from './components/restaurant-list/restaurant-list';
import { Carte } from './components/carte/carte';
import { Restaurant } from './models/restaurant';

@Component({
  selector: 'app-root',
  imports: [Header, RestaurantList, Carte],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly restaurants = signal<Restaurant[]>([
    { id: 1, name: 'Le Calao Doré', district: 'Akwa', specialty: 'Ndolé aux crevettes', currentRating: 0, image: '/images/ndole crevettes.jpeg' },
    { id: 2, name: 'Chez Madame Ngono', district: 'Bonapriso', specialty: 'Eru à la viande de bœuf', currentRating: 0, image: '/images/eru.jpg' },
    { id: 3, name: 'La Fourchette Camerounaise', district: 'Bonanjo', specialty: 'Poulet DG', currentRating: 0, image: '/images/poulet dg.jpg' },
    { id: 4, name: 'Saveurs du Wouri', district: 'Bonamoussadi', specialty: 'Poisson braisé', currentRating: 0, image: '/images/poisson braisé.jpg' },
    { id: 5, name: "L'Akwa Gourmand", district: 'Akwa', specialty: 'Taro sauce jaune', currentRating: 0, image: '/images/taro sauce jaune.jpg' },
    { id: 6, name: 'Le Royal de Bali', district: 'Bali', specialty: 'Koki et plantain', currentRating: 0, image: '/images/koki plantain.jpg' },
  ]);

  readonly ratedCount = computed(
    () => this.restaurants().filter((restaurant) => restaurant.currentRating > 0).length,
  );

  readonly averageRating = computed(() => {
    const ratedRestaurants = this.restaurants().filter((restaurant) => restaurant.currentRating > 0);
    return ratedRestaurants.length === 0
      ? 0
      : ratedRestaurants.reduce((sum, restaurant) => sum + restaurant.currentRating, 0) / ratedRestaurants.length;
  });

  onRestaurantRated(updated: Restaurant): void {
    this.restaurants.update((list) =>
      list.map((restaurant) => (restaurant.id === updated.id ? updated : restaurant)),
    );
  }
}
