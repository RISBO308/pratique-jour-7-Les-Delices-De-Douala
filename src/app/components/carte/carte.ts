import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Plat } from '../../models/plat';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-carte',
  imports: [CurrencyPipe],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte {
  readonly menuService = inject(MenuService);
  readonly catalogue = this.menuService.catalogue;
  readonly platsFiltres = this.menuService.platsFiltres;
  readonly categories = ['Toutes', 'Plats', 'Grillades', 'Végétarien', 'Boissons'];

  selectionnerCategorie(cat: string): void {
    this.menuService.categorieSelectionnee.set(cat);
  }

  imageDuPlat(plat: Plat): string {
    switch (plat.nom.trim().toLowerCase()) {
      case 'jus de bissap':
        return '/images/jus%20de%20Bissap.jpg';
      case 'jus de gingembre':
        return '/images/jus%20de%20gingembre.jpg';
      default:
        return '';
    }
  }
}
