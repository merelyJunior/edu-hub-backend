const express = require('express')
const db = require('./config/database')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const user = require('./routes/user')
const assignment = require('./routes/Assignment')
const article = require('./routes/article')
const course = require('./routes/course')
const courseModule = require('./routes/courseModule')
const courseModuleItem = require('./routes/courseModuleItem')
const discussionsRouter = require('./routes/Discussions')
const cheatingDetection = require('./routes/cheatingDetection')
const notification = require('./routes/notification')
const lectureRouter = require('./routes/lecture')
const AnnouncementsRouter = require('./routes/announcement')
const assessmentRouter = require('./routes/assessment')
const SubmissionRouter = require('./routes/submissions')
const gradeBookRouter = require('./routes/gradeBook')
const enrollmentRouter = require('./routes/enrollment')
const deadlineRouter = require('./routes/deadlines')
const achievementsRouter = require('./routes/achievementsRouter')

const auth = require('./middleware/auth')

const fileUpload = require('express-fileupload')

app.use(
  fileUpload({
    debug: true,
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: 4
  })
)

mongoose
  .connect(process.env.MONGODB_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Connected to MongoDB successfully!')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
    console.log('Possible cause: IP address is not whitelisted in MongoDB Atlas.')
  })

const publicDirectoryPath = path.join(__dirname, './view')

app.use(express.static(publicDirectoryPath))

app.use('/course-file', express.static('course-file'))
app.use(cors())

app.use(express.json())

// Middleware для логирования всех запросов
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`)
  next()
})

app.use('/users', user)
app.use('/discussions', discussionsRouter)
app.use('/announcements', AnnouncementsRouter)
app.use('/courses', course)
app.use('/assignment', assignment)
app.use('/cheatingDetection', cheatingDetection)
app.use('/article', article)
app.use('/notification', notification)
app.use('/deadlines', deadlineRouter)
app.use('/:courseId/', gradeBookRouter)
app.use('/:courseId/assessments', assessmentRouter)
app.use('/:courseId/enrollments', enrollmentRouter)
app.use('/:courseId/assessments/:assessmentId/submissions', SubmissionRouter)
app.use('/courses/:courseId/modules', courseModule)
app.use('/courses/:courseId/modules/:moduleId/module-item', courseModuleItem)
app.use('/courses/:courseId/lectures', lectureRouter)
app.use('/achievements', achievementsRouter)

// Логирование ошибок с загрузкой файлов
app.use((err, req, res, next) => {
  if (err) {
    console.error('File upload error:', err)
    res.status(500).send('File upload failed')
  } else {
    next()
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('App is running on Port ' + port)
})
