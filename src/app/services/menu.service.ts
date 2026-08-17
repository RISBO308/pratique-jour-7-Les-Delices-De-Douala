import { computed, Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Plat } from '../models/plat';

@Injectable({ providedIn: 'root' })
export class MenuService {
  readonly catalogue = httpResource<Plat[]>(() => `${environment.serverUrl}/api/plats.json`);
  readonly categorieSelectionnee = signal<string>('Toutes');

  readonly platsFiltres = computed(() => {
    const tousLesPlats = this.catalogue.value() ?? [];
    const categorie = this.categorieSelectionnee();

    return categorie === 'Toutes'
      ? tousLesPlats
      : tousLesPlats.filter((plat) => plat.categorie === categorie);
  });
}
