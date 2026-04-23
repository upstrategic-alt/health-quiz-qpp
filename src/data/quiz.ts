export interface Question {
  id: number;
  title: string;
  options: {
    id: 'A' | 'B';
    text: string;
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    title: "Core Challenge",
    options: [
      { id: 'A', text: "Figuring out if I'm doing it right — I follow instructions perfectly but constantly wonder if my specific situation requires adjustments." },
      { id: 'B', text: "Getting bored with rigid rules — I want to understand the principles so I can adapt them to different situations." }
    ]
  },
  {
    id: 2,
    title: "Ideal Learning Style",
    options: [
      { id: 'A', text: "Having an expert review my specific situation and tell me exactly what to do based on my unique circumstances." },
      { id: 'B', text: "Getting the complete system with all the science so I can implement it independently." }
    ]
  },
  {
    id: 3,
    title: "Problem-Solving Style",
    options: [
      { id: 'A', text: "Have someone with expertise analyze what changed and adjust my plan accordingly." },
      { id: 'B', text: "Understand the underlying mechanisms well enough to troubleshoot it myself." }
    ]
  },
  {
    id: 4,
    title: "Past Frustration",
    options: [
      { id: 'A', text: "They were too generic — I needed someone to look at my specific hormone patterns, work schedule, and stress levels." },
      { id: 'B', text: "They didn't teach me WHY things work — I want to understand the science so I'm not dependent on rigid meal plans." }
    ]
  },
  {
    id: 5,
    title: "Chaos / Travel Test",
    options: [
      { id: 'A', text: "Want specific backup protocols designed for my exact travel patterns and work demands." },
      { id: 'B', text: "Want to understand the principles well enough to adapt them to any situation myself." }
    ]
  },
  {
    id: 6,
    title: "Identity Statement",
    options: [
      { id: 'A', text: "I execute flawlessly when I have expert guidance, but I second-guess myself when left to figure things out alone." },
      { id: 'B', text: "I'm great at implementation once I understand the complete system and the science behind it." }
    ]
  },
  {
    id: 7,
    title: "Expert Relationship Preference",
    options: [
      { id: 'A', text: "Ongoing access to ask questions about my specific situation and get personalized adjustments." },
      { id: 'B', text: "Learning the complete operating system once, then being self-sufficient." }
    ]
  },
  {
    id: 8,
    title: "Investment Goal",
    options: [
      { id: 'A', text: "Personal analysis of my metabolic patterns and a custom roadmap designed for my specific life." },
      { id: 'B', text: "The complete knowledge base so I understand how to optimize my switchboard under any circumstances." }
    ]
  }
];
