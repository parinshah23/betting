/**
 * Home Page
 *
 * TODO: Implement according to docs/pages/01-home.md
 *
 * Components needed:
 * - HeroSlider
 * - CompetitionGrid
 * - WinnersCarousel
 * - HowItWorks section
 */

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            RaffleSite
          </h1>
          <p className="text-gray-600">
            Coming Soon - See docs/pages/01-home.md for implementation spec
          </p>
        </div>
      </div>
    </main>
  );
}
