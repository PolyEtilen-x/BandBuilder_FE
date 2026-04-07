import { useState } from "react"

export default function Flashcard() {
  const [flip, setFlip] = useState(false)

  return (
    <div className="flex justify-center items-center h-full">
      <div
        onClick={() => setFlip(!flip)}
        className="w-80 h-48 bg-white shadow-xl rounded-xl flex items-center justify-center text-xl cursor-pointer"
      >
        {flip ? "Definition: Improve quickly" : "Word: Accelerate"}
      </div>
    </div>
  )
}