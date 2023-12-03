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

module.exports = {pool}