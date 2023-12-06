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

const postPose = async (pose)=>{
  try {
    const entity = {
      key: pool.db.key(['pose']),
      data: pose,
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

const getAllPoses = async (pool)=>{
  const kind = 'pose'

  const query = pool.db.createQuery(kind)

  const [poses] = await pool.db.runQuery(query)



  const formattedPose = poses.map((pose)=>({
    id: pose.id,
    title: pose.title,
    imageUrl: pose.imageUrl,
    category: pose.category,
    step: pose.step,
    time:Number(pose.time),
  }))

  return formattedPose
}

async function getPoseById (poseId, pool) {
  const kind = 'pose'
  const query = pool.db
    .createQuery(kind)
    .filter('id', '=', poseId)

  const [pose] = await pool.db.runQuery(query)
  
 
  if (!pose) {
    throw new Error('Pose not found')
  }

  const formattedPose = pose.map((pose)=>({
    id: pose.id,
    title: pose.title,
    imageUrl: pose.imageUrl,
    category: pose.category,
    step: pose.step,
    time:Number(pose.time),
  }))


  return formattedPose
}

async function UpdatePoseById(PoseData, pool) {
  try {
    const query = pool.db.createQuery('pose').filter('id', '=', PoseData.id)
    const [entities] = await pool.db.runQuery(query)

    if (entities && entities.length > 0) {
      const entityKey = entities[0][pool.db.KEY] // Assuming the key is needed for update

      // Update the entity data with PoseData
      const updatedEntity = {
        key: entityKey,
        data: { ...entities[0], ...PoseData },
      }

      // Save the updated entity back to the Datastore
      const updatedPose = await pool.db.update(updatedEntity)
      
      if (!updatedPose) {
        throw new Error('Failed to update Pose')
      }

      return updatedPose
    } else {
      throw new Error('Pose not found')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating Pose:', error.message)
    throw error
  }

  
}

const deletePoseById=async(poseId,pool)=> {
  try {
    const kind = 'pose'

    // Create a query with an explicit filter for the refreshToken
    const query = pool.db
      .createQuery(kind)
      .filter('id', '=', poseId)

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
module.exports = {postPose, getAllPoses, getPoseById,UpdatePoseById,deletePoseById}
