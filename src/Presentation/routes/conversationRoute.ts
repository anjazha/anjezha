import {Router} from 'express'
import { safePromise } from '@/helpers/safePromise'


const conversationRouter = Router();


conversationRouter.get('/conversations', async (req, res, next) => {
     // use safePromise
     const [error, result] = await safePromise(()=>{
            return 'Hello from real time chat'
     })

     if(error) return res.status(400).json({error: error.message})
      res.status(200).json({message: result})
})


conversationRouter.get('/chat/:id', (req, res) => {
    res.send('Hello from real time chat with id')
})

export default conversationRouter