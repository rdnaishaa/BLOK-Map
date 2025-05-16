import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import hero1 from '../assets/images/hero1.webp'
import hero2 from '../assets/images/hero2.jpg'
import hero3 from '../assets/images/hero3.jpg'

const HeroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  }

  return (
    <div className="w-full mb-8 relative">
      <Slider {...settings}>
        <div>
          <img 
            src={hero1} 
            alt="Hero 1" 
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
        <div>
          <img
            src={hero2}
            alt="Hero 2"
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
        <div>
          <img
            src={hero3}
            alt="Hero 3"
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      </Slider>
    </div>
  )
}

export default HeroSlider