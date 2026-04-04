export function normalizeListeningData(data: any) {
  return {
    ...data,
    content: {
      ...data.content,
      sections: data.content.sections.map((section: any) => ({
        ...section,
        question_blocks: section.question_blocks.map(normalizeBlock)
      }))
    }
  }
}

function normalizeBlock(block: any) {
  if (block.question_type === "matching") {
    const [start, end] = block.questions_range
      .split("-")
      .map(Number)

    const questions = Array.from(
      { length: end - start + 1 },
      (_, i) => ({
        id: `L-match-${start + i}`,
        number: start + i,
        text: "" 
      })
    )

    return {
      ...block,
      questions
    }
  }

  if (block.questions) {
    return {
      ...block,
      questions: block.questions.map((q: any) => ({
        ...q,
        id: q.id || `L-${q.number}`
      }))
    }
  }

  return block
}