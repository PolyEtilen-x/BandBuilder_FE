import { SkillPractice } from "./practice.types"

export const practiceData: SkillPractice[] = [

{
  skill: "reading",
  sections: [

    {
      name_practice: "Reading Passage 1",
      total: 6,

      exercises: [
        {
          id: "european-transport",
          title: "European Transport System",
          questions: 40,
          participants: 3663,
          progress: 36
        },
        {
          id: "2",
          title: "Climate Change Impact",
          questions: 40,
          participants: 2210,
          progress: 12
        },
        {
          id: "3",
          title: "Ocean Pollution",
          questions: 40,
          participants: 4872,
          progress: 0
        }
      ]
    },

    {
      name_practice: "Reading Passage 2",
      total: 4,

      exercises: [
        {
          id: "4",
          title: "The Step Pyramid",
          questions: 40,
          participants: 3663,
          progress: 0
        }
      ]
    }

  ]
},

{
  skill: "listening",
  sections: [

    {
      name_practice: "Listening Test 1",
      total: 3,

      exercises: [
        {
          id: "5",
          title: "University Enrollment",
          questions: 40,
          participants: 5123,
          progress: 0
        },
        {
          id: "6",
          title: "Hotel Booking",
          questions: 40,
          participants: 3112,
          progress: 12
        },
        {
          id: "7",
          title: "Travel Information",
          questions: 40,
          participants: 2003,
          progress: 48
        }
      ]
    }

  ]
}

]