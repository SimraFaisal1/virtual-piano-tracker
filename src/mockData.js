// src/mockData.js

// Mock data for the Songs list
export const mockSongs = [
  { id: 'twinkle-twinkle', title: 'Twinkle Twinkle Little Star', difficulty: 'Easy' },
  { id: 'ode-to-joy', title: 'Ode to Joy', difficulty: 'Medium' },
  { id: 'fur-elise', title: 'Für Elise', difficulty: 'Hard' },
];

// Mock data for a single song's notes (for the player/quiz)
export const mockSongData = {
  'twinkle-twinkle': {
    title: 'Twinkle Twinkle Little Star',
    notes: [ { note: 'C4', duration: 'quarter' }, { note: 'C4', duration: 'quarter' }, /* ...etc */ ]
  }
};

// Mock data for the Forum
export const mockPosts = [
  { id: 1, author: 'Anthony', title: 'Having trouble with C# scales', replies: 2, likes: 5 },
  { id: 2, author: 'Jane', title: 'Any tips for playing faster?', replies: 4, likes: 12 },
];