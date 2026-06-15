import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Gallery from "../../components/Gallery/Gallery";

function GalleryPage() {
  return (
    <>
      <Helmet>
        <title>Галерея | Ледокол Гродно</title>
        <meta name="description" content="Фотогалерея хоккейного клуба Ледокол Гродно. Лучшие моменты матчей и атмосфера трибун." />
      </Helmet>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">Галерея <span className="text-gradient">клуба</span></h1>
            <p className="text-white/50 mt-4 max-w-xl">Лучшие моменты матчей, эмоции игроков и атмосфера трибун.</p>
          </motion.div>
        </div>
        <Gallery />
      </div>
    </>
  );
}

export default GalleryPage;