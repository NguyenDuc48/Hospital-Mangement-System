import React from 'react';
import heroImage from '../../photo/h1_hero.png';

const Slider = () => {
  const sliderStyle = {
    backgroundImage: `url(${heroImage})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    height: '100vh',  // Set the height to 100% of the viewport height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className="slider-area position-relative">
      <div className="slider-active">
        {/* Single Slider 1 */}
        <div className="single-slider" style={sliderStyle}>
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="hero__caption">
                  <span className="hero__subtitle">Committed to Success</span>
                  <h1 className="cd-headline letters scale">We Care About Your
                    <strong className="cd-words-wrapper">
                      <b className="is-visible">Health</b>
                      <b>Sushi</b>
                      <b>Steak</b>
                    </strong>
                  </h1>
                  <p className="hero__description" data-animation="fadeInLeft" data-delay="0.1s">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi uquip ex ea commodo consequat is aute irure.
                  </p>
                  <div className="hero__buttons">
                    <a href="#" className="btn hero-btn" data-animation="fadeInLeft" data-delay="0.5s">Make an Appointment <i className="ti-arrow-right"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
