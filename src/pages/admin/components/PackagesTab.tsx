// src/pages/admin/components/PackagesTab.tsx

import { useState } from "react"
import { CreditPackage } from "../types"
import { 
  Zap, 
  Sparkles, 
  DollarSign, 
  Coins, 
  Edit3, 
  Check, 
  EyeOff, 
  Eye,
  X
} from "lucide-react"

interface Props {
  packages: CreditPackage[]
  onUpdatePackage: (id: string, updated: Partial<CreditPackage>) => void
}

export default function PackagesTab({ packages, onUpdatePackage }: Props) {
  const [editingPack, setEditingPack] = useState<CreditPackage | null>(null)
  
  // Edit Form state
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState(0)
  const [editCredits, setEditCredits] = useState(0)
  const [editBonus, setEditBonus] = useState(0)
  const [editActive, setEditActive] = useState(true)
  const [editSort, setEditSort] = useState(0)

  // Format currency
  const formatVnd = (val: number): string => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val)
  }

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPack) return

    onUpdatePackage(editingPack.id, {
      name: editName,
      price: editPrice,
      credits: editCredits,
      bonus: editBonus,
      isActive: editActive,
      sortOrder: editSort
    })

    setEditingPack(null)
  }

  // Trigger Edit mode
  const startEdit = (pack: CreditPackage) => {
    setEditingPack(pack)
    setEditName(pack.name)
    setEditPrice(pack.price)
    setEditCredits(pack.credits)
    setEditBonus(pack.bonus)
    setEditActive(pack.isActive)
    setEditSort(pack.sortOrder)
  }

  // Toggle quick status
  const toggleQuickActive = (pack: CreditPackage) => {
    onUpdatePackage(pack.id, { isActive: !pack.isActive })
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Cấu hình Gói Nạp Credit</h2>
        <p className="text-slate-400 text-sm mt-1">Điều chỉnh giá tiền (VND), lượng Credits cơ bản và Credits khuyến mãi của các gói nạp trực tuyến.</p>
      </div>

      {/* PRICING GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((pack) => {
            const active = pack.isActive
            return (
              <div 
                key={pack.id} 
                className={`relative bg-slate-950 border rounded-2xl shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  active 
                    ? "border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/5" 
                    : "border-slate-900 opacity-60 grayscale"
                }`}
              >
                {/* Visual Accent Header */}
                <div className={`h-1.5 w-full ${
                  !active 
                    ? "bg-slate-800" 
                    : pack.price > 300000 
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500" 
                    : pack.price > 100000 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                    : "bg-indigo-600"
                }`}></div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{pack.name}</h3>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Sort Order: {pack.sortOrder}</span>
                      </div>
                      <span className={`p-2 rounded-lg text-xs font-semibold ${
                        !active 
                          ? "bg-slate-900 text-slate-500" 
                          : pack.price > 300000 
                          ? "bg-purple-500/10 text-purple-400" 
                          : "bg-indigo-500/10 text-indigo-400"
                      }`}>
                        {pack.price > 300000 ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </span>
                    </div>

                    {/* Pricing details */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white tracking-tight">
                          {formatVnd(pack.price).replace("₫", "")}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold uppercase">VND</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Cơ chế nạp tự động VietQR</p>
                    </div>

                    {/* Credits details */}
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-900 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Credits gốc:</span>
                        <span className="text-white font-bold flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-indigo-400" />
                          {pack.credits}
                        </span>
                      </div>
                      {pack.bonus > 0 && (
                        <div className="flex justify-between items-center text-xs border-t border-slate-950 pt-2">
                          <span className="text-slate-400">Khuyến mãi bonus:</span>
                          <span className="text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            +{pack.bonus} Bonus
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleQuickActive(pack)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        active 
                          ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400" 
                          : "bg-slate-900 hover:bg-slate-800 text-slate-400"
                      }`}
                      title={active ? "Tạm dừng hiển thị" : "Bật hiển thị"}
                    >
                      {active ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Tạm dừng
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => startEdit(pack)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 transition-all shadow hover:shadow-indigo-500/20 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* EDIT MODAL */}
      {editingPack && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Chỉnh Sửa Gói Nạp</h3>
              <button 
                onClick={() => setEditingPack(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-1.5">Tên gói nạp</label>
                <input 
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm font-semibold mb-1.5">Giá bán (VND)</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-semibold mb-1.5">Lượt Sort Order</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={editSort}
                    onChange={(e) => setEditSort(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm font-semibold mb-1.5">Credits Gốc</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={editCredits}
                    onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-indigo-400 font-bold focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-semibold mb-1.5">Credits Thưởng</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={editBonus}
                    onChange={(e) => setEditBonus(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Status Toggle Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-900 rounded-xl mt-4">
                <div>
                  <span className="text-sm font-semibold text-white block">Trạng thái kinh doanh</span>
                  <span className="text-slate-400 text-xs mt-0.5">Cho phép người học mua gói này trực tuyến.</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setEditActive(!editActive)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none flex items-center p-0.5 cursor-pointer ${
                    editActive ? "bg-indigo-600" : "bg-slate-800 border border-slate-700"
                  }`}
                >
                  <span className={`h-4.5 w-4.5 rounded-full bg-white shadow-md transform transition-all duration-200 ${
                    editActive ? "translate-x-5" : "translate-x-0"
                  }`}></span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPack(null)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
                >
                  Lưu Gói Nạp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
