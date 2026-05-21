const menu = [
  {
    label: "IELTS Practice",
    dropdown: [
      { label: "Practice IELTS Reading", path: "/practice-ielts/reading" },
      { label: "Practice IELTS Listening", path: "/practice-ielts/listening" },
      { label: "Practice IELTS Writing", path: "/practice-ielts/writing" },
      { label: "Practice IELTS Speaking", path: "/practice-ielts/speaking" },
    ]
  },

  {
    label: "General Practice",
    dropdown: [
      { label: "Pronunciation Practice", path: "/practice-general/pronunciation-practice" },
      { label: "Sample Writings", path: "/practice-general/sample-writings" },
      { label: "Call with AI", path: "/practice-general/call-with-ai" }
    ]
  },

  {
    label: "Materials",
    dropdown: [
      { label: "Vocabulary", path: "/materials/vocabulary" },
      { label: "Grammar", path: "/materials/grammar" },
      { label: "IELTS Tips", path: "/materials/tips" }
    ]
  },

  {
    label: "Study Plan",
    dropdown: [
      { label: "Learning Roadmap", path: "/roadmap" }
    ]
  }
]

export default menu