export interface Army {
  name: string;
  id: string;
  tokens: {
    id: string;
    count: number;
    type: 'token' | 'terrain' | 'marker',
  }[];
}
