import { Component, computed, input, output, signal } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { RestaurantCard } from '../restaurant-card/restaurant-card';

@Component({
  selector: 'app-restaurant-list',
  imports: [RestaurantCard],
  templateUrl: './restaurant-list.html',
  styleUrl: './restaurant-list.css',
})
export class RestaurantList {
  restaurants = input.required<Restaurant[]>();
  restaurantRated = output<Restaurant>();

  readonly showOnlyTopRated = signal(false);

  readonly sortedRestaurants = computed(() =>
    [...this.restaurants()].sort((a, b) => b.currentRating - a.currentRating),
  );

  readonly visibleRestaurants = computed(() =>
    this.showOnlyTopRated()
      ? this.sortedRestaurants().filter((restaurant) => restaurant.currentRating >= 4)
      : this.sortedRestaurants(),
  );

  toggleTopRatedFilter(): void {
    this.showOnlyTopRated.update((value) => !value);
  }

  onRestaurantRated(restaurant: Restaurant): void {
    this.restaurantRated.emit(restaurant);
  }
}
