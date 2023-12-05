// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')
const { Datastore } = require('@google-cloud/datastore')

// Instantiate a Datastore client

// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: 'AIzaSyCyqoNrq92dt3D2Urh_CiDCiBuesKcHYvI',
  authDomain: 'serene-sentinel-401201.firebaseapp.com',
  projectId: 'serene-sentinel-401201',
  storageBucket: 'serene-sentinel-401201.appspot.com',
  messagingSenderId: '675155939501',
  appId: '1:675155939501:web:9e52c7afe34a03d54bf624',
  measurementId: 'G-K92T43HRGL',
}
  
// Initialize Firebase
const app = initializeApp(firebaseConfig)
  
const projectId = app.options.projectId
const keyFilename = 'credentials.json'
// Instantiate a Datastore client with the project ID
const db = new Datastore({
  projectId,
  keyFilename,
})

const pool = {
  db
}


async function getPoseById(poseId,pool){
  const kind = 'pose' 
  const query = pool.db
    .createQuery(kind)
    .filter('id', '=', poseId)

  const [pose] = await pool.db.runQuery(query)

      
  if (!pose) {
    throw new Error('pose not found')
  }
      
      
        
      
  return pose[0]
} 
async function getUserScheduleById(scheduleId,pool){
  const kind = 'schedule' 
  const query = pool.db
    .createQuery(kind)
    .filter('scheduleId', '=', scheduleId)


  const [schedule] = await pool.db.runQuery(query)

  if (!schedule || !schedule.length) {
    throw new Error('schedule not found')
  }
      
      
        
      
  return schedule[0]
} 
const postSchedule = async (article,pool)=>{
  try {
    const entity = {
      key: pool.db.key(['schedule']),
      data: article,
    }
    
    try {
      await pool.db.save(entity)
      return entity.data
    } catch (err) {
      throw new Error(err.message)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message)
    return error
  }
}

const getUserAllSchedule =async (userId,pool)=>{
  const kind = 'schedule' // Assuming 'articles' is the kind in your datastore
  
  // Create a query to retrieve all articles
  const query = pool.db
    .createQuery(kind)
    .filter('userId', '=', userId)
  
  const [schedule] = await pool.db.runQuery(query)
  
   
  
  // const formattedArticle = articles.map((article)=>({
  //   id: article.id,
  //   title: article.title,
  //   description: article.description,
  // }))
  
  return schedule
}

async function UpdateScheduleById(ScheduleData, pool) {
  try {
    const query = pool.db.createQuery('schedule').filter('scheduleId', '=', ScheduleData.scheduleId)
    const [entities] = await pool.db.runQuery(query)
  
    if (entities && entities.length > 0) {
      const entityKey = entities[0][pool.db.KEY] // Assuming the key is needed for update
  
      // Update the entity data with ArticleData
      const updatedEntity = {
        key: entityKey,
        data: { ...entities[0], ...ScheduleData },
      }
  
      // Save the updated entity back to the Datastore
      const updatedSchedule = await pool.db.update(updatedEntity)
        
      if (!updatedSchedule) {
        throw new Error('Failed to update Article')
      }
  
      return updatedSchedule
    } else {
      throw new Error('Article not found')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating Schedule:', error.message)
    throw error
  }
}

const deleteSchedule=async(scheduleId,pool)=> {
  try {
    const kind = 'schedule'
  
    // Create a query with an explicit filter for the refreshToken
    const query = pool.db
      .createQuery(kind)
      .filter('scheduleId', '=', scheduleId)
  
    const [entities] = await pool.db.runQuery(query)
  
  
    if (entities.length > 0) {
      const entityKey = entities[0][pool.db.KEY]
      await pool.db.delete(entityKey)
      return true
    }else{
      return false
    }
      
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    throw new Error(error.message)
  }
}


  
module.exports = {getPoseById,postSchedule,getUserAllSchedule,UpdateScheduleById,getUserScheduleById,deleteSchedule,pool}