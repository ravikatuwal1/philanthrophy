import React from "react";
import './Carousal.css'
import carousalData from "../../data/carousalImages.json";

const importAll = (r) => {
  const images = {};
  r.keys().forEach((key) => {
    images[key.replace("./", "")] = r(key);
  });
  return images;
};

const images = importAll(require.context("../../assets/images/carousal", false, /\.(png|jpe?g|svg)$/));

const Carousal = () => {
  const { slides } = carousalData;
  const allImages = slides.flatMap((slide) => Object.values(slide).map((name) => images[name]));

  // Helper for class names based on name
  const getContainerClass = (title) => {
    const key = title.toLowerCase();
    if (key.includes("borda")) return "borda-back-container";
    if (key.includes("boroma")) return "boroma-back-container";
    if (key.includes("aacharyadev")) return "acharyadev-back-container";
    return "";
  };

  return (
    <div className="carousal">
      {/* ---------- DESKTOP CAROUSEL (4 per slide) ---------- */}
      <div className="d-none d-md-block">
        <div id="desktopCarousel" className="carousel carousel-fade container" data-bs-ride="carousel">
          <div className="carousel-inner carousel-container car-glow">
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}
              >
                <div className="row g-0">
                  {Object.entries(slide).map(([title, filename], colIndex) => (
                    <div
                      key={colIndex}
                      className={`col-md-3 order-${colIndex + 1} order-md-${colIndex + 1} ${getContainerClass(title)}`}
                    >
                      <div className="carousel-image-container">
                        <img
                          src={images[filename]}
                          alt={title}
                          className="d-block w-100"
                        />
                        <div className="carousel-caption d-none d-md-block">
                          <h5>{title}</h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#desktopCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#desktopCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* ---------- MOBILE CAROUSEL (1 per slide) ---------- */}
      <div className="d-block d-md-none">
        <div id="mobileCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner">
            {allImages.map((img, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <img src={img} className="d-block w-100" alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#mobileCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#mobileCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousal;
