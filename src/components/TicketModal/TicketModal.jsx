import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ticket, Calendar, MapPin, Clock, Armchair } from "lucide-react";
import { api } from "../../services/api";
import toast from "react-hot-toast";
const SEATS = [
  { section: "A", rows: ["1-5", "6-10", "11-15"], price: 20 },
  { section: "B", rows: ["1-5", "6-10", "11-15"], price: 15 },
  { section: "C", rows: ["1-5", "6-10", "11-15"], price: 10 },
];
function TicketModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", count: 1, seat: "" });
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedRow, setSelectedRow] = useState("");
  const handleSeatSelect = (section, row) => {
    setSelectedSection(section);
    setSelectedRow(row);
    setForm({ ...form, seat: `${section.section}, ряд ${row}` });
  };
  const total = form.count * (selectedSection?.price || 15);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSection || !selectedRow) {
      toast.error('Пожалуйста, выберите сектор и ряд');
      return;
    }
    try {
      await api.createTicket({ ...form, total });
      setStep(2);
      setTimeout(() => {
        setStep(1);
        setForm({ name: "", phone: "", email: "", count: 1, seat: "" });
        setSelectedSection(null);
        setSelectedRow("");
        onClose();
      }, 3000);
    } catch (err) {
      toast.error(err.message || 'Ошибка при заказе билета');
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-brand-950/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg glass rounded-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            {step === 1 ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Купить билет</h2>
                    <p className="text-white/50 text-sm">Ледокол Гродно — следующий матч</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-white/70 text-sm"><Calendar className="w-4 h-4 text-accent-400" /><span>22 марта 2026</span></div>
                  <div className="flex items-center gap-2 text-white/70 text-sm"><Clock className="w-4 h-4 text-accent-400" /><span>19:30</span></div>
                  <div className="flex items-center gap-2 text-white/70 text-sm"><MapPin className="w-4 h-4 text-accent-400" /><span>Ледовый дворец Гродно</span></div>
                </div>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Armchair className="w-4 h-4 text-accent-400" /> Выберите сектор</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {SEATS.map((s) => (
                      <button
                        key={s.section}
                        onClick={() => setSelectedSection(s)}
                        className={`p-3 rounded-xl border text-center transition-all ${selectedSection?.section === s.section ? 'border-accent-500 bg-accent-500/10' : 'border-white/10 hover:border-white/20'}`}
                      >
                        <div className="text-white font-bold">Сектор {s.section}</div>
                        <div className="text-white/40 text-xs">{s.price} BYN</div>
                      </button>
                    ))}
                  </div>
                  {selectedSection && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {selectedSection.rows.map((r) => (
                        <button
                          key={r}
                          onClick={() => handleSeatSelect(selectedSection, r)}
                          className={`p-2 rounded-lg text-sm border transition-all ${selectedRow === r ? 'border-accent-500 bg-accent-500/10 text-accent-400' : 'border-white/10 text-white/60 hover:border-white/20'}`}
                        >
                          Ряд {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Ваше имя" required className="w-full p-3 rounded-xl bg-brand-950 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input type="tel" placeholder="Телефон" required className="w-full p-3 rounded-xl bg-brand-950 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 outline-none" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input type="email" placeholder="Email" required className="w-full p-3 rounded-xl bg-brand-950 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 outline-none" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <div className="flex items-center gap-4">
                    <label className="text-white/70 text-sm">Количество:</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setForm({ ...form, count: Math.max(1, form.count - 1) })} className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20">-</button>
                      <span className="text-white font-bold w-6 text-center">{form.count}</span>
                      <button type="button" onClick={() => setForm({ ...form, count: Math.min(10, form.count + 1) })} className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20">+</button>
                    </div>
                  </div>
                  {form.seat && <p className="text-white/50 text-sm">Место: {form.seat}</p>}
                  <button type="submit" className="w-full p-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold hover:shadow-lg hover:shadow-accent-500/25 transition-all">
                    Оформить заказ ({total} BYN)
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Заявка принята!</h3>
                <p className="text-white/50">Мы свяжемся с вами для подтверждения бронирования.</p>
                {form.email && <p className="text-white/30 text-sm mt-2">Подтверждение отправлено на {form.email}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default TicketModal;