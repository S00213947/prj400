import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, person } from 'ionicons/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})

export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private router: Router) {  // ✅ Keep only ONE constructor
    addIcons({ triangle, ellipse, square, person }); // ✅ Add icons correctly
  }

  goToPlayerPage(playerId: number) {
    this.router.navigate([`/tabs/PlayerProfile/${playerId}`]); // ✅ Fix navigation function
  }
}
