import { Component, input, output } from '@angular/core';
import { StarRating } from '../star-rating/star-rating';
import { Restaurant } from '../../models/restaurant';

@Component({
  selector: 'app-restaurant-card',
  imports: [StarRating],
  templateUrl: './restaurant-card.html',
  styleUrl: './restaurant-card.css',
})
export class RestaurantCard {
  restaurant = input.required<Restaurant>();
  restaurantRated = output<Restaurant>();

  onRatingChanged(newRating: number): void {
    const updatedRestaurant: Restaurant = {
      ...this.restaurant(),
      currentRating: newRating,
    };

    this.restaurantRated.emit(updatedRestaurant);
  }
}
