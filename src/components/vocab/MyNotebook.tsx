export default function MyNotebook() {
  const words = ["Sustainable", "Innovative", "Globalization"]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Notebook</h1>

      <ul className="space-y-3">
        {words.map((word, index) => (
          <li
            key={index}
            className="p-3 bg-white rounded-lg shadow"
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  )
}