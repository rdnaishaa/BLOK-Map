import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import tamanLiterasi from '../assets/images/taman-literasi.webp'; 

const defaultImages = [
  tamanLiterasi,
];

const ImageSlider = ({ images }) => {
  const sliderImages = images && images.length > 0 ? images : defaultImages;
  // Jika hanya 1 gambar, tampilkan tanpa slider
  if (sliderImages.length === 1) {
    return (
      <div className="w-full">
        <img
          src={sliderImages[0]}
          alt="Login Visual"
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
  }

  return (
<div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <Slider {...settings}>
        {sliderImages.map((image, index) => (
          <div key={index}>
            <img 
              src={image}
              alt={'Slide ' + (index + 1)}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ImageSlider