import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonButtons, IonBackButton, IonButton, IonLabel } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Team } from 'src/app/models/team.model';


@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
  standalone: true,
  imports: [IonLabel, IonButton, IonBackButton, IonButtons, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TeamDetailPage implements OnInit {

  team: any;

 
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
   /*  const id = this.route.snapshot.paramMap.get('id');
  console.log('Route ID:', id); // 👈 add this log
  const stored = localStorage.getItem('teams');
  if (stored && id) {
    const allTeams = JSON.parse(stored);
    this.team = allTeams.find((t: any) => t.id === id);
    console.log('Loaded team:', this.team); // 👈 and this
    console.log('[TeamDetailPage] Activated route ID:', id);
console.log('[TeamDetailPage] All teams:', allTeams);
console.log('[TeamDetailPage] Selected team:', this.team);
    }
  } */

    const teamId = this.route.snapshot.paramMap.get('id');
    this.http.get<Team>(`http://localhost:3000/api/teams/${teamId}`).subscribe({
      next: (team) => {
        this.team = team;
        console.log('Loaded team:', team);
      },
      error: (err) => {
        console.error('Error loading team:', err);
      }
    });
  }
  
  invitePlayer(playerId: string, teamId: string) {
    const team = this.team.find((t: { id: string; }) => t.id === teamId);
    if (!team.pendingInvites) team.pendingInvites = [];
    if (!team.pendingInvites.includes(playerId)) {
      team.pendingInvites.push(playerId);
      localStorage.setItem('teams', JSON.stringify(this.team));
      alert(`Invited player ${playerId} to team.`);
    } else {
      alert('Player already invited!');
    }
  }
  

}
