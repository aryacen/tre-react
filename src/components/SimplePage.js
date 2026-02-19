import NavBar from './NavBar';

function SimplePage({ title, description, heroBg }) {
  return (
    <div className="simple-page">
      <header
        className="sub-hero"
        style={
          heroBg
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(9, 20, 30, 0.85) 0%, rgba(16, 33, 45, 0.6) 45%, rgba(32, 60, 80, 0.35) 100%), url(${heroBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
            : undefined
        }
      >
        <NavBar />
        <div className="sub-hero-inner">
          <p className="eyebrow">TRE INDONESIA</p>
          <h1>{title}</h1>
          {description ? <p className="lead lead-dark">{description}</p> : null}
        </div>
        <div className="hero-curve" />
      </header>
    </div>
  );
}

export default SimplePage;
