export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type ResourceArticle = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  type: string;
  image: string;
  description: string;
  content: ArticleSection[];
};

export const RESOURCES_DATA: ResourceArticle[] = [
  {
    id: "r1",
    slug: "understanding-anxiety",
    title: "Understanding Anxiety: A Guide",
    subtitle: "Navigating the complexities of your mind and body under stress.",
    category: "Mental Health",
    type: "Article",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2000&auto=format&fit=crop",
    description: "Learn about the physiological roots of anxiety and daily coping strategies.",
    content: [
      {
        heading: "What is Anxiety",
        paragraphs: [
          "Anxiety is a natural human response to stress. It's an evolutionary mechanism designed to keep us safe by alerting us to potential dangers. However, when this system becomes overactive or triggers without a real threat, it can disrupt daily life.",
          "It's characterized by feelings of tension, worried thoughts, and physical changes like increased blood pressure. Everyone experiences it differently, and recognizing your specific patterns is the first step toward managing it."
        ]
      },
      {
        heading: "Symptoms",
        paragraphs: [
          "Physical symptoms often include a racing heart, rapid breathing, sweating, trembling, or feeling exhausted. Mentally, you may experience persistent worry, difficulty concentrating, or a sense of impending doom.",
          "Behavioral symptoms can manifest as avoiding certain situations, restlessness, or difficulty sleeping. Over time, chronic anxiety can lead to more severe health issues if left unaddressed."
        ]
      },
      {
        heading: "Causes",
        paragraphs: [
          "The causes of anxiety disorders are complex and often a combination of factors. Genetics, brain chemistry, personality, and life events (such as trauma or chronic stress) can all play a role.",
          "Environmental triggers like a demanding job, financial stress, or relationship difficulties can also precipitate or worsen anxiety episodes."
        ]
      },
      {
        heading: "Coping Techniques",
        paragraphs: [
          "Deep breathing exercises, such as the 4-7-8 technique, can help activate the parasympathetic nervous system and quickly reduce immediate feelings of panic.",
          "Grounding techniques, like the 5-4-3-2-1 method, are excellent for bringing your focus back to the present moment and away from racing thoughts. Engaging in regular physical activity is also a potent, natural anxiety reliever."
        ]
      },
      {
        heading: "Long-term Solutions",
        paragraphs: [
          "Cognitive Behavioral Therapy (CBT) is widely considered one of the most effective long-term treatments. It helps you identify and challenge negative thought patterns.",
          "Lifestyle changes, building a strong support network, and establishing a consistent routine involving adequate sleep and balanced nutrition are crucial for long-term management."
        ]
      },
      {
        heading: "When to Seek Help",
        paragraphs: [
          "It's important to seek professional help when anxiety begins to interfere with your daily routine, relationships, or work. If you feel overwhelmed, isolated, or are self-medicating, reaching out to a therapist or counselor is a vital step.",
          "Do not hesitate to contact a professional if your symptoms persist or worsen over time. Help is always available."
        ]
      }
    ]
  },
  {
    id: "r2",
    slug: "5-minute-grounding",
    title: "5-Minute Grounding Exercise",
    subtitle: "A quick technique to bring your focus back to the present.",
    category: "Coping",
    type: "Exercise",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2000&auto=format&fit=crop",
    description: "A quick guided exercise to help you return to the present moment.",
    content: [
      {
        heading: "What is Grounding",
        paragraphs: [
          "Grounding is a practice that can help you pull away from flashbacks, unwanted memories, and negative or challenging emotions. It helps keep you in the present moment.",
          "These techniques are especially useful during panic attacks or moments of intense anxiety."
        ]
      },
      {
        heading: "The 5-4-3-2-1 Method",
        paragraphs: [
          "Acknowledge FIVE things you see around you. It could be a pen, a spot on the ceiling, or anything in your surroundings.",
          "Acknowledge FOUR things you can touch around you. Focus on the texture of your clothes, the smooth surface of a table, or the feeling of the floor under your feet.",
          "Acknowledge THREE things you hear. This could be any external sound. Focus on things outside your body like a clock ticking or distant traffic.",
          "Acknowledge TWO things you can smell. This might be difficult, but try to notice a subtle fragrance, the scent of a recent meal, or even the smell of fresh air.",
          "Acknowledge ONE thing you can taste. What does the inside of your mouth taste like? Gum, coffee, or your last meal."
        ]
      },
      {
        heading: "When to Use This",
        paragraphs: [
          "Use this whenever you feel overwhelmed, your thoughts are spiraling, or you feel disconnected from reality. It's a quick, portable tool you can use anywhere without anyone knowing."
        ]
      }
    ]
  },
  {
    id: "r3",
    slug: "better-sleep-hygiene",
    title: "Better Sleep Hygiene",
    subtitle: "Proven techniques to improve your sleep quality and mental clarity.",
    category: "Wellness",
    type: "Tips",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2000&auto=format&fit=crop",
    description: "Proven techniques to improve your sleep quality and mental clarity.",
    content: [
      {
        heading: "Why Sleep Matters",
        paragraphs: [
          "Sleep is critical for cognitive function, emotional regulation, and overall physical health. Poor sleep can exacerbate anxiety and depression, creating a difficult cycle to break.",
          "Good sleep hygiene refers to both your sleep environment and your habits leading up to bedtime."
        ]
      },
      {
        heading: "Creating a Sleep-Inducing Environment",
        paragraphs: [
          "Keep your bedroom dark, quiet, and cool. Consider using blackout curtains, earplugs, or a white noise machine if necessary.",
          "Your bed should be associated only with sleep and intimacy, not with work or scrolling on your phone."
        ]
      },
      {
        heading: "Establishing a Routine",
        paragraphs: [
          "Try to go to bed and wake up at the same time every day, even on weekends. Consistency reinforces your body's sleep-wake cycle.",
          "Develop a relaxing pre-sleep routine, such as taking a warm bath, reading a book, or doing light stretching. Avoid heavy meals and stimulants like caffeine or nicotine close to bedtime."
        ]
      }
    ]
  },
  {
    id: "r4",
    slug: "breathing-for-stress-relief",
    title: "Breathing for Stress Relief",
    subtitle: "Master the 4-7-8 technique for immediate relaxation.",
    category: "Coping",
    type: "Exercise",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop",
    description: "Master the 4-7-8 technique for immediate relaxation.",
    content: [
      {
        heading: "The Power of Breath",
        paragraphs: [
          "Your breath is intimately connected to your nervous system. Fast, shallow breathing signals danger to your brain, while deep, slow breathing signals safety and relaxation.",
          "Controlling your breath is one of the fastest ways to hack your nervous system and induce a state of calm."
        ]
      },
      {
        heading: "The 4-7-8 Technique",
        paragraphs: [
          "Exhale completely through your mouth, making a whoosh sound.",
          "Close your mouth and inhale quietly through your nose to a mental count of four.",
          "Hold your breath for a count of seven.",
          "Exhale completely through your mouth, making a whoosh sound to a count of eight. This completes one cycle."
        ]
      },
      {
        heading: "Practice Makes Perfect",
        paragraphs: [
          "Try to do four full cycles at a time. The more you practice, the more effective this technique will become at quickly reducing your stress levels."
        ]
      }
    ]
  }
];
