import {Router} from 'express'
import { Container } from 'inversify';
import { IConversationRepository } from '@/Application/interfaces/conversation/IConversationRepository';
import { INTERFACE_TYPE } from '@/helpers/containerConst';
import { ConversationRepository } from '@/Application/repositories/conversationRepository';
import { IConversationService } from '@/Application/interfaces/conversation/IConversationService';
import { ConversationService } from '@/Application/services/conversationService';
import { ConversationController } from '../controllers/conversationController';
import { isAuth } from '../middlewares/isAuth';


const conversationRouter = Router();

const container = new Container();

container.bind<IConversationRepository>(INTERFACE_TYPE.ConversationRepository).to(ConversationRepository);

container.bind<IConversationService>(INTERFACE_TYPE.ConversationService).to(ConversationService);

container.bind<ConversationController>(INTERFACE_TYPE.ConversationController).to( ConversationController)

const conversationController = container.get<ConversationController>(INTERFACE_TYPE.ConversationController);

// route to create conversation
conversationRouter.post('/create-conversation',isAuth, conversationController.createConversation.bind(conversationController))
// render user conversation 
conversationRouter.route('/conversations/:userId') 
.get(conversationController.getConversationByUser.bind(conversationController))
.delete(conversationController.deleteConversaitonByUserId.bind(conversationController))

// conversationRouter.route('conversations/:conversationId', )

export default conversationRouter