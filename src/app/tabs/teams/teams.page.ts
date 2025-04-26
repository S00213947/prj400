import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonButton, IonLabel, IonContent, IonButtons, IonTitle, IonHeader, IonModal, IonToolbar, IonItem, IonList, IonText, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonInput } from "@ionic/angular/standalone";
import { Team } from 'src/app/models/team.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
  standalone: true,
  imports: [IonInput, IonCardHeader, IonCardContent, IonCardTitle, IonCard, IonText,  IonItem,   IonHeader, IonTitle,  IonLabel, IonButton, CommonModule, FormsModule, ]
})
export class TeamsPage {
  userRole: string | null = null;
  teamName: string = '';
  showModal = false;

  constructor(private router: Router, private http: HttpClient) {}

  
  teams: Team[] = [];


  ngOnInit() {



  this.userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  if (this.userRole === 'coach') {
   // this.http.get<any[]>(`http://localhost:3000/api/teams/coach/${userId}`).subscribe({
      this.http.get<any[]>(`${environment.apiUrl}/api/teams/coach/${userId}`).subscribe({
      next: (teams) => {
        this.teams = teams;
        console.log('👨‍🏫 Coach teams:', teams);
      },
      error: (err) => {
        console.error('❌ Error loading coach teams:', err);
      }
    });
  } else if (this.userRole === 'player' && userId) {
   // this.http.get<Team[]>(`http://localhost:3000/api/teams/player/${userId}`).subscribe({
      this.http.get<Team[]>(`${environment.apiUrl}/api/teams/player/${userId}`).subscribe({
     
      next: (teams) => {
        this.teams = teams;
        console.log('[TeamsPage] Loaded teams for player:', teams);
      },
      error: (err) => console.error('❌ Failed to load player teams:', err)
    });
  }
}

  createTeam() {
    this.showModal = true;
  }

/*   saveTeam() {
      if (this.teamName.trim()) {
        const newTeam: Team = {
          id: crypto.randomUUID(),
          name: this.teamName,
          coachId: localStorage.getItem('userId') || 'temp-coach-id',
          players: ['John Doe', 'Alex Johnson'] // 🔥 Hardcoded players
        };
    
        this.teams.push(newTeam);
        localStorage.setItem('teams', JSON.stringify(this.teams));
    
        console.log('[saveTeam] Team created with players:', newTeam);
    
        this.teamName = '';
        this.showModal = false;
    }
  } */
  
    saveTeam() {
      if (this.teamName.trim()) {
        const newTeam = {
          name: this.teamName,
          coachId: localStorage.getItem('userId'),
          players: []  // start empty, or optionally pull from a source
        };
    
       // this.http.post('http://localhost:3000/api/teams', newTeam).subscribe({
          this.http.post(`${environment.apiUrl}/api/teams`, newTeam).subscribe({
          next: (createdTeam: any) => {
            this.teams.push(createdTeam); // update UI
            console.log('[saveTeam] ✅ Team saved to DB:', createdTeam);
    
            this.teamName = '';
            this.showModal = false;
          },
          error: (err) => {
            console.error('[saveTeam] ❌ Failed to save team:', err);
            alert('Error creating team. Please try again.');
          }
        });
      }
    }
  
  cancel() {
    this.showModal = false;
  }

  openTeam(team: Team) {
    console.log('Selected team:', team);
    // Later: open a modal or navigate to a detailed route
  }

  viewTeam(team: Team) {
    console.log('Navigating to team:', team);
    this.router.navigateByUrl(`/tabs/teams/${team._id}`);
  }

  

/*   goToTeam(id: string) {
    console.log('Navigating to team with ID:', id);
   // this.router.navigate(['/tabs/teams', id]);
   //this.router.navigateByUrl(`/tabs/teams/${team.id}`);
   this.router.navigateByUrl(`/tabs/teams/${id}`);

  } */
 
   goToTeam(id: string) {
    console.log('[goToTeam] navigating to team:', id);
    this.router.navigate(['/tabs/teams', id]);
  }
  
  
}

