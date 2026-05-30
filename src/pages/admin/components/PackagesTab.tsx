// src/pages/admin/components/PackagesTab.tsx

import { useState } from "react"
import { CreditPackage } from "../types"
import { 
  Zap, 
  Sparkles, 
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
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cấu hình Gói Nạp Credit</h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">Điều chỉnh giá bán (VND), lượng Credit cơ bản và khuyến mãi nạp ví nạp học viên trực tuyến.</p>
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
                className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  active 
                    ? "border-slate-100 hover:border-indigo-500/30" 
                    : "border-slate-200 bg-slate-50/50 opacity-60 grayscale"
                }`}
              >
                {/* Visual Accent Header */}
                <div className={`h-1.5 w-full ${
                  !active 
                    ? "bg-slate-200" 
                    : pack.price > 300000 
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500" 
                    : pack.price > 100000 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
                    : "bg-indigo-600"
                }`}></div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{pack.name}</h3>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Ưu tiên xếp: {pack.sortOrder}</span>
                      </div>
                      <span className={`p-2 rounded-xl text-xs font-semibold ${
                        !active 
                          ? "bg-slate-100 text-slate-400" 
                          : pack.price > 300000 
                          ? "bg-purple-50 text-purple-600" 
                          : "bg-indigo-50 text-indigo-600"
                      }`}>
                        {pack.price > 300000 ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </span>
                    </div>

                    {/* Pricing details */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                          {formatVnd(pack.price).replace("₫", "")}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">VND</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Nạp qua VietQR SePay</p>
                    </div>

                    {/* Credits details */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-slate-500">Credits gốc:</span>
                        <span className="text-slate-800 font-extrabold flex items-center gap-1">
                          <Coins className="w-4 h-4 text-indigo-500" />
                          {pack.credits}
                        </span>
                      </div>
                      {pack.bonus > 0 && (
                        <div className="flex justify-between items-center text-xs border-t border-slate-200/60 pt-2 font-medium">
                          <span className="text-slate-500">Credits tặng thêm:</span>
                          <span className="text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                            +{pack.bonus} Bonus
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleQuickActive(pack)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-transparent ${
                        active 
                          ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600" 
                          : "bg-slate-100 hover:bg-slate-250 text-slate-500"
                      }`}
                      title={active ? "Tạm dừng kinh doanh" : "Mở bán lại"}
                    >
                      {active ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Mở bán
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
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow hover:shadow-indigo-500/10 cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-sans">Chỉnh Sửa Gói Nạp</h3>
              <button 
                onClick={() => setEditingPack(null)}
                className="text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Tên gói nạp</label>
                <input 
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-850 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Giá bán (VND)</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-850 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Thứ tự Sort</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={editSort}
                    onChange={(e) => setEditSort(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-850 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Credits Gốc</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={editCredits}
                    onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-indigo-600 font-bold focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase mb-2">Credits Thưởng</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    value={editBonus}
                    onChange={(e) => setEditBonus(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-emerald-600 font-bold focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Status Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl mt-4">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Kích hoạt mở bán</span>
                  <span className="text-slate-400 text-[10px] font-semibold mt-1 block">Cho phép học viên nhìn thấy gói này để nạp.</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setEditActive(!editActive)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none flex items-center p-0.5 cursor-pointer border ${
                    editActive ? "bg-indigo-600 border-indigo-600" : "bg-slate-200 border-slate-300"
                  }`}
                >
                  <span className={`h-4.5 w-4.5 rounded-full bg-white shadow-md transform transition-all duration-200 ${
                    editActive ? "translate-x-5" : "translate-x-0"
                  }`}></span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setEditingPack(null)}
                  className="px-4.5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-md hover:shadow-indigo-500/10 cursor-pointer"
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
