import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from '@auth0/auth0-angular';
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router, private http: HttpClient) {
    this.router.events.subscribe(event => {
     
    });
  }

  
  ngOnInit() {
    console.log('Current route:', this.router.url);

    
    
  
    combineLatest([this.auth.isLoading$, this.auth.user$])
      .pipe(filter(([loading, user]) => !loading && !!user))
      .subscribe(([_, user]) => {
        console.log('User is authenticated:', user);
  
        const role = localStorage.getItem('userRole');
        if (!role) {
          this.router.navigate(['/role-select']);
        }
  
        if (user && user.email) {
          const encodedEmail = encodeURIComponent(user.email);
          const role = localStorage.getItem('userRole') || 'player';
        
          const baseUrl = role === 'coach' ? 'http://localhost:3000/coaches' : 'http://localhost:3000/players';
        
          this.http.get(`${baseUrl}/email/${encodedEmail}`).subscribe({
            next: (existingUser: any) => {
              localStorage.setItem('userId', existingUser._id);
              console.log('✅ Existing user loaded:', existingUser);
            },
            error: err => {
              if (err.status === 404) {
                console.log('👤 No existing user, creating new one...');
        
                this.http.post(baseUrl, {
                  name: user.name,
                  email: user.email,
                  role: role,
                  password: '' // If you’re not using passwords yet, just store empty for now
                }).subscribe({
                  next: (created: any) => {
                    console.log('✅ User created:', created);
                    localStorage.setItem('userId', created._id);
                  },
                  error: postErr => {
                    console.error('❌ Error creating user:', postErr);
                  }
                });
              } else {
                console.error('❌ Error checking user existence:', err);
              }
            }
          });
        }
      })
    }
  }
          