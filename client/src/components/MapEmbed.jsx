const MapEmbed = ({ location }) => {
  const getMapUrl = (location) => {
    const locations = {
      'Blok-M Square': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.79982631529484!3d-6.194755662005247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f3b4b5e6b5%3A0x6b5f5b5b5b5b5b5b!2sBlok-M%20Square!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid',
      'Plaza Blok-M': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.79982631529484!3d-6.194755662005247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f3b4b5e6b5%3A0x6b5f5b5b5b5b5b5b!2sPlaza%20Blok-M!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid',
      'Melawai': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.79982631529484!3d-6.194755662005247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f3b4b5e6b5%3A0x6b5f5b5b5b5b5b5b!2sMelawai!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid',
      'Taman Literasi': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.79982631529484!3d-6.194755662005247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f3b4b5e6b5%3A0x6b5f5b5b5b5b5b5b!2sTaman%20Literasi!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid',
      'Barito': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.79982631529484!3d-6.194755662005247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f3b4b5e6b5%3A0x6b5f5b5b5b5b5b5b!2sBarito!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid',
      'Gulai Tikungan (Mahakam)': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.79982631529484!3d-6.194755662005247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f3b4b5e6b5%3A0x6b5f5b5b5b5b5b5b!2sGulai%20Tikungan!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid',
      'Senayan': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.79982631529484!3d-6.194755662005247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f3b4b5e6b5%3A0x6b5f5b5b5b5b5b5b!2sSenayan!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid',
      'Kebayoran Baru': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.79982631529484!3d-6.194755662005247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f3b4b5e6b5%3A0x6b5f5b5b5b5b5b5b!2sKebayoran%20Baru!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid'
    }
    return locations[location] || locations['Blok-M Square']
  }

  return (
    <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
      <iframe
        title="Location Map"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={getMapUrl(location)}
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default MapEmbed