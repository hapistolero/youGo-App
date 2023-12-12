const axios = require('axios')

const getNearbyYogaPlaces = async (latitude, longitude) => {
  const radius = 5000 // Adjust the radius as needed
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=gym&keyword=yoga&key=${process.env.PLACE_API_KEY}`
    
  try {
    const response = await axios.get(url)
    const placeRecommendation = response.data.results.slice(0, 5)
      
    const formattedPlaceRecommendation = await Promise.all(placeRecommendation.map(async (place) => {
      const photo = place.photos && place.photos[0] ? await getPhotoUrl(place.photos[0].photo_reference) : null
  
      return {
        id: place.place_id,
        name: place.name,
        photos: photo,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        location: place.vicinity,
        opening_hours: place.opening_hours,
      }
    }))
  
    return formattedPlaceRecommendation
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching nearby places:', error.message)
    throw error
  }
}
  
// Function to fetch place photo
const getPhotoUrl = async (photoReference) => {
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.PLACE_API_KEY}`
  
  try {
    // eslint-disable-next-line no-unused-vars
    const photoResponse = await axios.head(photoUrl)
    return photoUrl
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching place photo URL:', error.message)
    return null
  }
}

module.exports = getNearbyYogaPlaces
  