import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ This makes it available throughout the app
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Fetch a player by ID
  getPlayer(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/players/${id}`);
  }
  

  // Fetch all players
  getAllPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/players`);
  }

  // Add a new player
  addPlayer(playerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/players`, playerData);
  }

  // Update player training data
  updatePlayerTraining(id: number, trainingData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/players/${id}/training`, trainingData);
  }

  updatePlayerRiskScores(playerId: string, scores: number[]) {
    return this.http.put(`http://localhost:3000/players/${playerId}/risk-scores`, { scores });
  }
  

  updatePlayer(id: string, updates: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/players/${id}`, updates);
  }
  
}
