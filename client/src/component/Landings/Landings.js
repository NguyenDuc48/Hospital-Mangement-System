import React from 'react';
import Header from './Header';  // Adjust the path based on your file structure
import Slider from './Slider';  // Adjust the path based on your file structure
import About from './About'; 
import Department from './Department'; 

const Landings = () => {
  return (
    <div>
      <Header />
      <Slider />
      <About />
      <Department />
      {/* Add more components or content as needed */}
    </div>
  );
};

export default Landings;
