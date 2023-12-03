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

const postArtikel = async (article)=>{
  try {
    const entity = {
      key: pool.db.key(['article']),
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

const getAllArticles =async (pool)=>{
  const kind = 'article' // Assuming 'articles' is the kind in your datastore

  // Create a query to retrieve all articles
  const query = pool.db.createQuery(kind)

  const [articles] = await pool.db.runQuery(query)

 

  const formattedArticle = articles.map((article)=>({
    id: article.id,
    title: article.title,
    description: article.description,
  }))

  return formattedArticle
}

async function getArticleById(articleId,pool) {
  const kind = 'article' 
  const query = pool.db
    .createQuery(kind)
    .filter('id', '=', articleId)

  const [article] = await pool.db.runQuery(query)

      
  if (!article) {
    throw new Error('Article not found')
  }
      
      
        
      
  return article
}


module.exports ={ postArtikel, getAllArticles, getArticleById}