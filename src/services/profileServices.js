
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')
const { Datastore } = require('@google-cloud/datastore')

// Instantiate a Datastore client

// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyBClv6sNt9E1d0uKqH3CSMT7ZZznYwL8tM",
  authDomain: "capstone-404613.firebaseapp.com",
  projectId: "capstone-404613",
  storageBucket: "capstone-404613.appspot.com",
  messagingSenderId: "810640269478",
  appId: "1:810640269478:web:eb717633f558bb3f535467"
}

  
// Initialize Firebase
const app = initializeApp(firebaseConfig,"Capstone")
  
const projectId = app.options.projectId
const keyFilename = 'credentials.json'
// Instantiate a Datastore client with the project ID
const db = new Datastore({
  projectId,
  keyFilename,
  databaseId: `${process.env.DATABASE_ID}`,
})

const pool = {
  db
}

async function getUserById(userId,pool) {
  const kind = 'users' 
  const query = pool.db
    .createQuery(kind)
    .filter('id', '=', userId)
  
  const [user] = await pool.db.runQuery(query)
  
        
  if (!user) {
    throw new Error('Article not found')
  }
        
        
          
  return user[0]
}
async function UpdateUserById(userData, pool) {
  
  try {
    // Assuming pool.db.update is an asynchronous function that updates the user

    
    const updatedUser = await pool.db.update(userData)
  
  
    if (!updatedUser) {
      // Throw an error if the user is not found (adjust the error message as needed)
      throw new Error('User not found')
    }
  
      
    return updatedUser
  } catch (error) {
    // Handle errors appropriately (log, rethrow, or return an error response)
    // eslint-disable-next-line no-console
    console.error('Error updating user:', error.message)
    throw error // Rethrow the error to propagate it up the call stack
  }
}

const getAllUserProfile =async (pool)=>{
  const kind = 'users' // Assuming 'articles' is the kind in your datastore

  // Create a query to retrieve all articles
  const query = pool.db.createQuery(kind)

  const [users] = await pool.db.runQuery(query)

 
  return users
}
const getUserProfileById =async (userId,pool)=>{
  const kind = 'users' // Assuming 'articles' is the kind in your datastore

  // Create a query to retrieve all articles
  const query = pool.db.createQuery(kind).filter('id', '=', userId)

  const [users] = await pool.db.runQuery(query)

  const formattedProfile = users.map((user)=>({
    id:user.id,
    email:user.email,
    profile:{
      id:user.profile.id,
      firstName:user.profile.firstName,
      lastName:user.profile.lastName,
      imageUrl:user.profile.imageUrl,
      age:Number(user.profile.age),
      weight:Number(user.profile.weight),
      height:Number(user.profile.height),
      bmi:Number(user.profile.bmi),
      status:user.profile.status,
      idealWeightRange:user.profile.idealWeightRange
    }
  }))
  return formattedProfile[0]
}
module.exports = {
  getUserById,
  UpdateUserById,
  getAllUserProfile,
  getUserProfileById,
  pool
}