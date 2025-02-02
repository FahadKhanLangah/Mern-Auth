import mongoose from 'mongoose'

async function connectDb() {
  await mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Database Connected")
  }).catch(err =>
    console.log('Error ' + err)
  )
}

export default connectDb;