export interface Team {
  _id: string;
  name: string;
  coachId: {
    _id: string;
    email: string;
  };
  players: {
    _id: string;
    email: string;
  }[];
}
