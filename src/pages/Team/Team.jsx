import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import TeamSection from "../../components/TeamSection/TeamSection";
function Team() {
  return (
    <>
      <Helmet>
        <title>Состав команды | Ледокол Гродно</title>
        <meta name="description" content="Состав хоккейного клуба Ледокол Гродно. Игроки, позиции, статистика сезона." />
      </Helmet>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">Состав <span className="text-gradient">команды</span></h1>
            <p className="text-white/50 mt-4 max-w-xl">Познакомьтесь с игроками, которые бьются за победу в каждом матче.</p>
          </motion.div>
        </div>
        <TeamSection />
      </div>
    </>
  );
}
export default Team;