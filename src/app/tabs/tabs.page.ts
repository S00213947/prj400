import { Component, OnInit, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, person, homeOutline, peopleOutline, personCircleOutline, flashOutline, personOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule],
})
export class TabsPage implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);
  userRole: string | null = null;

  constructor(public router: Router) {
    addIcons({homeOutline,flashOutline,personOutline,person,peopleOutline,personCircleOutline,triangle,ellipse,square});
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    console.log('[TabsPage] userRole loaded from localStorage:', this.userRole);
  }

  goToPlayerPage(playerId: number) {
    this.router.navigate([`/tabs/PlayerProfile`, playerId]);
  }

/*   goToTeam(teamId: string) {
    this.router.navigate(['/tabs/teams', teamId]);
  } */

  goToTeam(id: string) {
    this.router.navigate(['/tabs/teams', id]);
  }
  
}

