type Props = {
  bandIndex: number | null
}

export default function BandList({ bandIndex }: Props) {
  const bands = ["5.0+", "6.0+", "7.0+", "8.0+"]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vocab by Band {bandIndex}</h1>

      <div className="grid grid-cols-2 gap-4">
        {bands.map((band, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer"
          >
            Band {band}
          </div>
        ))}
      </div>
    </div>
  )
}