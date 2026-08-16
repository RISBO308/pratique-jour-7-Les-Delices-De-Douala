// star-rating.ts
import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating {
  // Note actuelle reçue du parent (0 = pas encore noté)
  currentRating = input(0);

  // Événement émis vers le parent quand une étoile est cliquée
  ratingChanged = output<number>();

  // État purement visuel, local à ce composant : l'étoile survolée
  protected readonly hoveredRating = signal(0);

  protected readonly stars = [1, 2, 3, 4, 5];

  onStarHover(star: number): void {
    this.hoveredRating.set(star);
  }

  onMouseLeave(): void {
    this.hoveredRating.set(0);
  }

  onStarClick(star: number): void {
    // Toggle de la note : clic sur la même étoile retire la note.
    const nextRating = star === this.currentRating() ? 0 : star;
    this.ratingChanged.emit(nextRating);
  }

  isFilled(star: number): boolean {
    const reference = this.hoveredRating() || this.currentRating();
    return star <= reference;
  }
}