import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Target, Users, Award, Heart } from "lucide-react";

const values = [
  { icon: Target, title: "Амбиции", desc: "Стремимся к высшим местам в каждом турнире и непрерывно развиваемся." },
  { icon: Users, title: "Команда", desc: "Верим в силу единства и взаимоподдержки на льду и за его пределами." },
  { icon: Award, title: "Традиции", desc: "Уважаем историю клуба и создаём новые легенды с каждым сезоном." },
  { icon: Heart, title: "Сообщество", desc: "Наши болельщики — главная сила. Вместе мы непобедимы." },
];

function About() {
  return (
    <>
      <Helmet>
        <title>О клубе | Ледокол Гродно</title>
        <meta name="description" content="История, миссия и ценности хоккейного клуба Ледокол Гродно. Любительский хоккей с 2015 года." />
      </Helmet>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-16">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">О <span className="text-gradient">клубе</span></h1>
            <p className="text-white/50 mt-4 max-w-2xl text-lg leading-relaxed">
              ХК «Ледокол Гродно» — любительский хоккейный клуб из Гродно. Команда энтузиастов, объединённых любовью к хоккею.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative rounded-2xl overflow-hidden aspect-video">
              <img src="https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&h=450&fit=crop" alt="Команда на льду" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="flex flex-col justify-center">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">История и миссия</h2>
              <p className="text-white/60 leading-relaxed mb-4">
                ХК «Ледокол» был основан в 2015 году группой друзей-любителей в Гродно. Сначала это были товарищеские матчи на городской арене, но с каждым годом команда росла и развивалась.
              </p>
              <p className="text-white/60 leading-relaxed">
                Сегодня «Ледокол Гродно» — это сплочённый коллектив из 25 игроков, собственная форма, участие в любительских турнирах и сотни болельщиков. Мы играем для души и гордимся своим городом.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
