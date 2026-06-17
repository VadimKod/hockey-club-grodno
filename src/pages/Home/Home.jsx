import { Helmet } from "react-helmet-async";
import Hero from "../../components/Hero/Hero";
import NextMatch from "../../components/NextMatch/NextMatch";
import NewsSection from "../../components/NewsSection/NewsSection";
import Standings from "../../components/Standings/Standings";
import TeamSection from "../../components/TeamSection/TeamSection";
import Gallery from "../../components/Gallery/Gallery";
import Shop from "../../components/Shop/Shop";
function Home() {
  return (
    <>
      <Helmet>
        <title>Ледокол Гродно — Любительский хоккейный клуб</title>
        <meta name="description" content="Официальный сайт хоккейного клуба Ледокол Гродно. Расписание матчей, состав команды, новости, турнирная таблица." />
        <meta property="og:title" content="Ледокол Гродно — Хоккейный клуб" />
        <meta property="og:description" content="Любительский хоккейный клуб из Гродно. Мы ломаем лёд с 2015 года!" />
      </Helmet>
      <div>
        <Hero />
        <NextMatch />
        <NewsSection />
        <Standings />
        <TeamSection />
        <Gallery />
        <Shop />
      </div>
    </>
  );
}
export default Home;