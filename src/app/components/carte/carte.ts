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
    const nom = plat.nom.trim().toLowerCase();
    if (nom.includes('ndolè') || nom.includes('ndole')) {
      return '/images/ndole%20crevettes.jpeg';
    }
    if (nom.includes('poulet dg')) {
      return '/images/poulet%20dg.jpg';
    }
    if (nom.includes('poisson')) {
      return '/images/poisson%20brais%C3%A9.jpg';
    }
    if (nom.includes('eru')) {
      return '/images/eru.jpg';
    }
    if (nom.includes('koki')) {
      return '/images/koki%20plantain.jpg';
    }
    if (nom.includes('bissap')) {
      return '/images/jus%20de%20Bissap.jpg';
    }
    if (nom.includes('gingembre')) {
      return '/images/jus%20de%20gingembre.jpg';
    }
    if (nom.includes('taro')) {
      return '/images/taro%20sauce%20jaune.jpg';
    }
    return '';
  }
}
