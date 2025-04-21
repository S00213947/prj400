import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCard,
  IonItem,
  IonLabel,
  IonToggle, IonButton, IonIcon } from '@ionic/angular/standalone';
  import { AuthService } from '@auth0/auth0-angular';
  import { PlayerService } from './../services/player.service'; 
  import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, 
    IonToggle,
    IonLabel,
    IonItem,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
   
  ]
})
export class ProfilePage implements OnInit {
  public userRole: string | null = null;
  isDarkMode = false;
  userId: string | null = null;
  displayName: string = '';

  constructor(public auth: AuthService, private http: HttpClient) {
    this.isDarkMode = document.body.classList.contains('dark');
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    document.body.classList.toggle('dark', savedTheme === 'dark');
  
    this.userRole = localStorage.getItem('userRole');
    this.userId = localStorage.getItem('userId');
  
    console.log('DEBUG: role =', this.userRole, '| userId =', this.userId);
  
    if (!this.userRole || !this.userId) {
      console.warn('Missing userRole or userId in localStorage');
      return;
    }
  
   /*  const endpoint = this.userRole === 'coach'
      ? `http://localhost:3000/coaches/${this.userId}`
      : `http://localhost:3000/players/${this.userId}`; */
      const endpoint = this.userRole === 'coach'
      ? `${environment.apiUrl}/coaches/${this.userId}`
      : `${environment.apiUrl}/players/${this.userId}`;
  
    this.http.get(endpoint).subscribe({
      next: (user: any) => {
        this.displayName = user.displayName || '';
        console.log('Loaded display name:', this.displayName);
      },
      error: (err) => {
        console.error('❌ Failed to fetch user info:', err);
      }
    });
  }
   
  
  updateDisplayName() {
    console.log('🪪 userId:', this.userId);
    console.log('✏️ displayName:', this.displayName);
    
    if (!this.userId || !this.displayName.trim() || !this.userRole) {
      alert('Missing user ID or display name');
      return;
    }
  
   /*  const endpoint = this.userRole === 'coach'
      ? `http://localhost:3000/coaches/${this.userId}`
      : `http://localhost:3000/players/${this.userId}`; */
      const endpoint = this.userRole === 'coach'
      ? `${environment.apiUrl}/coaches/${this.userId}`
      : `${environment.apiUrl}/players/${this.userId}`;
  
    this.http.put(endpoint, {
      displayName: this.displayName.trim()
    }).subscribe({
      next: () => alert('✅ Display name updated'),
      error: (err) => {
        console.error('❌ Error updating name:', err);
        alert('Something went wrong.');
      }
    });
  }
  
  toggleDarkMode(event: CustomEvent) {
    this.isDarkMode = event.detail.checked;
    document.body.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  
  
  logout() {
    this.auth.logout({ returnTo: window.location.origin } as any);
  }

}
