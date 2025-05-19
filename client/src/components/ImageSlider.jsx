import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const ImageSlider = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <div className="w-full">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img 
              src={image || `/images/resto${index % 3 + 1}.png`} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ImageSlider