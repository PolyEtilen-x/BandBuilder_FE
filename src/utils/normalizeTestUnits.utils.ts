export function normalizeTestUnits(test:any){
    
    // Reading
    if(test?.content?.passages){
        return test.content.passages.map((p:any)=>({
        id: p.passage_number,
        title: `${p.title || 'Reading'} - Passage ${p.passage_number}`,
        description: p.title,
        questionBlocks: p.question_blocks,
        type: "reading"
        }))
    }

    // Listening
    if(test?.content?.sections){
        const formatTitle = (str: string) =>
            str
                .split("_")
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
        return test.content.sections.map((s:any)=>({
        id: s.section,
        title: `${formatTitle(s.context || 'Listening')} - Section ${s.section}`,
        description: s.description,
        audioUrl: s.audioUrl,
        questionBlocks: s.question_blocks,
        type: "listening"
        }))
    }

    return []
}