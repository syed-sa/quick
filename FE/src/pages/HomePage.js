import HeroSection from "../components/sections/HeroSection"
import CategoriesSection from "../components/sections/CategoriesSection"
import PopularServicesSection from "../components/sections/PopularServicesSection"
import AppDownloadSection from "../components/sections/AppDownloadSection"

const HomePage = ({ selectedCity }) => {
  return (
    <main className="flex-grow">
      <HeroSection selectedCity={selectedCity} />
      <CategoriesSection />
      <PopularServicesSection />
      <AppDownloadSection />
    </main>
  )
}

export default HomePage
//adding a comment to test git commit