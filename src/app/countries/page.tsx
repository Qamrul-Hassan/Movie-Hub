import Link from 'next/link'
import { countryCategories } from '@/lib/countries'

export default function CountriesPage() {
  return (
    <main className="min-h-screen text-white">
      <section className="pt-2" aria-label="Countries">
        <div className="glass-country-card mb-4 p-4 sm:p-5">
          <h1 className="text-2xl font-semibold sm:text-3xl">Choose a Country</h1>
          <p className="mt-2 text-sm text-slate-300">
            Open a country page to view popular drama movies and TV series.
          </p>
          <div className="country-chip-wrap mt-4">
            {countryCategories.map((country) => (
              <Link
                key={country.key}
                href={`/countries/${country.key}`}
                className="country-chip"
              >
                {country.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
