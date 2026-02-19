import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { treCityData } from '../data/treCityData';

function TreIndividualsPage() {
  const [cityQuery, setCityQuery] = useState('');
  const cityPins = treCityData.map((city) => city.name);
  const citySlugMap = treCityData.reduce((acc, city) => {
    acc[city.name] = city.slug;
    return acc;
  }, {});
  const cityImageMap = treCityData.reduce((acc, city) => {
    acc[city.name] = city.image;
    return acc;
  }, {});
  const filteredCities = useMemo(() => {
    const query = cityQuery.trim().toLowerCase();
    if (!query) return [];
    return cityPins.filter((city) => city.toLowerCase().includes(query));
  }, [cityPins, cityQuery]);

  return (
    <div className="tre-individual-page">
      <header
        className="tre-individual-hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${process.env.PUBLIC_URL}/assets/home/atmosphere.jpg)`,
        }}
      >
        <NavBar />
        <div className="tre-individual-hero-inner">
          <h1>TRE For Individuals</h1>
        </div>
      </header>
      <div
        className="tre-individual-body"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/clouds.jpg)`,
        }}
      >
        <div className="tre-individual-map-wrap">
          <div className="tre-individual-map-heading">Kota Pelaksanaan</div>
          <div className="tre-individual-search">
            <input
              type="search"
              className="tre-individual-search-input"
              value={cityQuery}
              onChange={(event) => setCityQuery(event.target.value)}
              placeholder="Cari kota seminar"
              aria-label="Cari kota seminar"
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/search.svg)`,
              }}
            />
            <div className="tre-individual-suggestions" role="listbox">
              {cityQuery.trim() && filteredCities.length === 0 ? (
                <div className="tre-individual-no-results">Tidak ada kota</div>
              ) : (
                filteredCities.map((city) => (
                  <Link
                    key={city}
                    to={`/tre-individuals/${citySlugMap[city]}`}
                    className="tre-individual-suggestion"
                    role="option"
                  >
                    {city}
                  </Link>
                ))
              )}
            </div>
          </div>
          <div className="tre-individual-map-layer">
            <img
              className="tre-individual-map"
              src={`${process.env.PUBLIC_URL}/assets/home/map.svg`}
              alt="Global map"
            />
            <div className="city-pins">
              {cityPins.map((city) => (
                <Link
                  key={city}
                  to={`/tre-individuals/${citySlugMap[city]}`}
                  className="city-pin"
                  data-city={city}
                  aria-label={city}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/home/pin.svg`}
                    alt=""
                    aria-hidden="true"
                  />
                  <div
                    className="city-pin-tooltip"
                    style={{
                      backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/${cityImageMap[city]})`,
                    }}
                  >
                    <div className="city-pin-label">
                      <span>{city}</span>
                      <img
                        className="city-pin-arrow"
                        src={`${process.env.PUBLIC_URL}/assets/home/rightarrow.svg`}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <section
        className="tre-individual-cities"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/sky.jpg)`,
        }}
      >
        <div className="tre-individual-cities-inner">
          <div className="tre-individual-cities-heading">
            <h2>Semua Kota</h2>
            <p>Pilih kota terdekat untuk mengikuti seminar TRE.</p>
          </div>
          <div className="tre-individual-city-grid">
            {treCityData.map((city) => (
              <Link
                key={city.slug}
                className="tre-individual-city-link"
                to={`/tre-individuals/${city.slug}`}
                aria-label={`Buka Seminar TRE ${city.name}`}
              >
                <article className="tre-individual-city-card">
                  <div
                    className="tre-individual-city-media"
                    style={{
                      backgroundImage: `url(${process.env.PUBLIC_URL}/assets/home/${city.image})`,
                    }}
                    role="img"
                    aria-label={`Seminar TRE ${city.name}`}
                  />
                  <div className="tre-individual-city-body">
                    <div>
                      <span className="tre-individual-city-kicker">Seminar TRE</span>
                      <h3>{city.name}</h3>
                    </div>
                    <span className="tre-individual-city-arrow" aria-hidden="true">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/home/rightarrow.svg`}
                        alt=""
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section
        className="cta-section"
        style={{
          '--cta-bg': `url(${process.env.PUBLIC_URL}/assets/home/ocean.gif)`,
        }}
      >
        <div className="cta-content">
          <p>Temukan Layanan TRE yang Sesuai untuk Anda</p>
          <h>
            Jelajahi berbagai pilihan layanan yang dirancang untuk memenuhi
            kebutuhan dan kondisi Anda dengan fleksibel.
          </h>
          <button className="cta-button" type="button">
            Lihat layanan seminar
          </button>
        </div>
      </section>
    </div>
  );
}

export default TreIndividualsPage;
