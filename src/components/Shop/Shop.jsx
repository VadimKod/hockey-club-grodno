import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { products } from "../../data/shop";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Shop() {
  return (
    <section id="shop" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">
              Магазин
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2">
              Атрибутика <span className="text-gradient">клуба</span>
            </h2>
          </div>
          <a
            href="/shop"
            className="group flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors"
          >
            Все товары
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((p) => (
            <motion.div
              key={p.id}
              variants={item}
              whileHover={{ y: -6 }}
              className="group glass rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {p.badge && (
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        p.badge === "Скидка"
                          ? "bg-accent-500"
                          : p.badge === "Новинка"
                          ? "bg-brand-500"
                          : p.badge === "Хит"
                          ? "bg-red-500"
                          : p.badge === "Эксклюзив"
                          ? "bg-purple-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold mb-2 group-hover:text-accent-400 transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-white">
                    {p.price} BYN
                  </span>
                  <button className="p-2.5 rounded-xl bg-white/5 hover:bg-accent-500 text-white hover:text-white transition-all duration-200">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Shop;
