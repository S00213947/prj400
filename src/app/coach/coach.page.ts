import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCheckbox, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.page.html',
  styleUrls: ['./coach.page.scss'],
  standalone: true,
  imports: [IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonIcon,
    IonButton,
    CommonModule,
    FormsModule,]
})
export class CoachPage implements OnInit {

  constructor(private router: Router) {}

  goToPlayerProfile(playerId: number) {
    this.router.navigate(['/tabs/PlayerProfile', playerId]);
  }

  ngOnInit() {
  }

  players = [
    { id: 1, name: 'John Doe', riskLevel: 'Low', details: 'Some details about John.' },
    { id: 2, name: 'Jane Smith', riskLevel: 'Moderate', details: 'Some details about Jane.' },
    { id: 3, name: 'Alex Johnson', riskLevel: 'High', details: 'Some details about Alex.' },
    { id: 4, name: 'Chris Evans', riskLevel: 'Low', details: 'Some details about Chris.' },
  ];

  selectedTeam: Set<number> = new Set();

  togglePlayerSelection(player: any) {
    if (this.selectedTeam.has(player.id)) {
      this.selectedTeam.delete(player.id);
    } else {
      this.selectedTeam.add(player.id);
    }
  }

  isSelected(player: any): boolean {
    return this.selectedTeam.has(player.id);
  }

  confirmTeam() {
    const team = this.players.filter((player) => this.selectedTeam.has(player.id));
    if (team.some((player) => player.riskLevel === 'High')) {
      alert('Warning: Some players in the selected team have high risk scores.');
    } else {
      alert('Team confirmed successfully!');
    }

    console.log('Selected Team:', team);
  }
}
