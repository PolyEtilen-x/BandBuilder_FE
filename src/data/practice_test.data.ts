import { PracticeTest } from "./practice_test.types"

const mockTest: PracticeTest = {

  id: "european-transport",

  passage:
  "The nutmeg tree, Myristica fragrans, is a large evergreen tree native to Southeast Asia...",


  questionGroups: [

    {
      label: "Question 1–4",
      start: 1,
      end: 4
    },

    {
      label: "Question 5–7",
      start: 5,
      end: 7
    },

    {
      label: "Question 8–13",
      start: 8,
      end: 13
    }

  ],

  questions: [

    {
      id: 1,
      type: "fill_blank",
      text: "The leaves of the tree are _____ in shape"
    },

    {
      id: 2,
      type: "fill_blank",
      text: "The _____ surrounds the fruit"
    },

    {
      id: 3,
      type: "mcq",
      text: "What color are the flowers?",
      options: ["Red", "Yellow", "White", "Green"]
    },

    {
      id: 4,
      type: "true_false",
      text: "The nutmeg tree only grows in Europe"
    }

  ]

}

export default mockTest