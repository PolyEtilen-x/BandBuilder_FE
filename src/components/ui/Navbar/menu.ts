const menu = [
  {
    label: "IELTS Practice",
    dropdown: [
      { label: "Practice IELTS Reading", path: "/practice/reading" },
      { label: "Practice IELTS Listening", path: "/practice/listening" },
      { label: "Practice IELTS Writing", path: "/practice/writing" },
      { label: "Practice IELTS Speaking", path: "/practice/speaking" },
    ]
  },

  {
    label: "IELTS Mock Test",
    dropdown: [
      { label: "Full IELTS Test", path: "/mock-test" }
    ]
  },

  {
    label: "IELTS Materials",
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