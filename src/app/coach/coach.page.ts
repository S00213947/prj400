import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCheckbox, IonIcon, IonContent,IonSelect, IonSelectOption, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonInput, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

addIcons({
  'trash-outline': trashOutline
});


@Component({
  selector: 'app-coach',
  templateUrl: './coach.page.html',
  styleUrls: ['./coach.page.scss'],
  standalone: true,
  imports: [IonInput, IonContent, IonSelectOption,IonSelect,
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

  constructor(private router: Router, private http: HttpClient) {
      addIcons({trashOutline});}

  goToPlayerProfile(playerId: number) {
    this.router.navigate(['/tabs/PlayerProfile', playerId]);
  }

  teams: any[] = [];
  selectedTeamId: string = '';

  ngOnInit() {
    this.coachId = localStorage.getItem('userId');
    
    const role = localStorage.getItem('userRole');
    console.log('[CoachPage] Loaded. Role from localStorage:', role);

    if (this.coachId) {
      this.http.get<any[]>(`http://localhost:3000/coaches/${this.coachId}/pending-players`).subscribe({
        next: (players) => {
          this.players = players;
        },
        error: (err) => {
          console.error('❌ Error loading pending players:', err);
        }
      });
    
    }

    this.http.get<any[]>(`http://localhost:3000/api/teams/coach/${this.coachId}`).subscribe({
      next: (teams) => {
        this.teams = teams;
        console.log('Loaded coach teams:', this.teams);
      },
      error: (err) => {
        console.error('Error loading teams', err);
      }
    });

  }

  players: any[] = [];
selectedTeam: Set<string> = new Set();
newPlayerEmail: string = '';
coachId: string | null = null;


togglePlayerSelection(player: any) {
  const key = player._id || player.id;
  if (this.selectedTeam.has(key)) {
    this.selectedTeam.delete(key);
  } else {
    this.selectedTeam.add(key);
  }
}


  addPlayerByEmail() {
    if (!this.newPlayerEmail || this.newPlayerEmail.trim() === '') {
      alert('Please enter a valid email address.');
      return;
    }
  
    const encoded = encodeURIComponent(this.newPlayerEmail.trim());
  
    this.http.get(`http://localhost:3000/players/email/${encoded}`).subscribe({
      next: (player: any) => {
        if (!this.players.some(p => p._id === player._id)) {
          this.players.push(player);
          console.log('✅ Player added:', player);
  
          // ✅ Also save this player to the coach's pendingPlayers in the DB
          if (this.coachId) {
            this.http.put(`http://localhost:3000/coaches/${this.coachId}/add-player/${player._id}`, {})
              .subscribe({
                next: () => console.log('📌 Player saved to coach document'),
                error: err => console.error('❌ Error saving player to coach:', err)
              });
          }
  
        } else {
          alert('Player already added.');
        }
      },
      error: err => {
        console.error('❌ Error fetching player:', err);
        alert('Player not found or could not be added.');
      }
    });
  
    this.newPlayerEmail = '';
  }

  confirmRemovePlayer(player: any) {
    const confirmed = confirm(`Are you sure you want to remove ${player.displayName || player.email}?`);
    if (confirmed) {
      this.removePlayer(player);
    }
  }
  
  removePlayer(player: any) {
    this.players = this.players.filter(p => p._id !== player._id);
  
    // 🔁 Optional: persist the updated list to DB
    if (this.coachId) {
      this.http.put(`http://localhost:3000/coaches/${this.coachId}/pending-players`, {
        players: this.players.map(p => p.email)
      }).subscribe({
        next: () => console.log('✅ Player list updated'),
        error: err => console.error('❌ Error saving updated list', err)
      });
    }
  }
  
  
  isSelected(player: any): boolean {
    const key = player._id || player.id;
    return this.selectedTeam.has(key);
  }

  /* addToTeam() {
    const teamId = prompt("Enter the team ID to add selected players to:");
    console.log('🟡 Team ID entered:', teamId);
  
    if (!teamId) {
      console.log('⛔ No team ID entered');
      return;
    }
  
    this.players.forEach(player => {
      if (this.selectedTeam.has(player._id)) {
        console.log('📤 Sending player to backend:', player.email, player._id);
  
        this.http.put(`http://localhost:3000/api/teams/${teamId}/add-player`, {
          playerId: player._id
        }).subscribe({
          next: res => {
            console.log(`✅ Added ${player.email} to team`, res);
          },
          error: err => {
            console.error(`❌ Failed to add ${player.email}`, err);
          }
        });
      } else {
        console.log('⛔ Player not selected:', player.email);
      }
    });
  } */

    addToTeam() {
      if (!this.selectedTeamId || this.selectedTeam.size === 0) {
        alert('Please select a team and at least one player.');
        return;
        
      }
      console.log('selectedTeamId:', this.selectedTeamId);
      console.log('selected players:', Array.from(this.selectedTeam));
      this.players.forEach(player => {
        if (this.selectedTeam.has(player._id)) {
          console.log('📤 Sending player to backend:', player.email, player._id);
          this.http.put(`http://localhost:3000/api/teams/${this.selectedTeamId}/add-player`, {
            playerId: player._id
          }).subscribe({
            next: res => {
              console.log(`✅ Added ${player.email} to team`, res);
            },
            error: err => {
              console.error(`❌ Failed to add ${player.email}`, err);
            }
          });
        }
      });
    }
    
  
  getRiskLevel(player: any): string {
    if (!player.riskScores || !player.riskScores.length) return 'Unknown';
  
    const score = player.riskScores[player.riskScores.length - 1];
    if (score < 12) return 'Low';
    if (score < 18) return 'Moderate';
    return 'High';
  }
  
}
