import { Coins } from "lucide-react"

export default function LoyaltyPoint({ Point }) {
  const textSize = Point > 9999 ? "text-xl" : "text-2xl";
  const formattedPoint = Point.toLocaleString('en-US'); // Ajustar el locale si lo deseas

  return (
    <div className="bg-white p-6 rounded-lg flex items-center justify-between shadow-sm" id="PUNTOS">
      <div className="flex items-center">
        <Coins className="w-8 h-8 text-brand mr-3" />
        <div>
          <h3 className="text-md font-semibold text-gray-800">Puntos Acumulados</h3>
          <p className="text-xs text-gray-600">Canjeables por productos</p>
        </div>
      </div>
      <span className={`${textSize} font-bold text-gray-800`}>{formattedPoint}</span>
    </div>
  )
}
