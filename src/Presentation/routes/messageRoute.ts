import {Router} from 'express'
import { Container } from 'inversify';

import { IMessageRepository } from '@/Application/interfaces/conversation/IMessageRepository';
import { MessageRepository } from '@/Application/repositories/messageRepository';
import { MessageController } from '@/Presentation/controllers/messageContoller';
import { IMessageService } from '@/Application/interfaces/conversation/IMessageService';
import { MessageService } from '@/Application/services/messageService';


import { INTERFACE_TYPE } from '@/helpers/containerConst';



const messageRouter = Router();

const container = new Container();

container.bind<IMessageRepository>(INTERFACE_TYPE.MessageRepository).to(MessageRepository);

container.bind<IMessageService>(INTERFACE_TYPE.MessageService).to(MessageService);

container.bind<MessageController>(INTERFACE_TYPE.MessageController).to(MessageController);

const messageContoller = container.get<MessageController>(INTERFACE_TYPE.MessageController);


messageRouter.post('/create-message', messageContoller.createMessage.bind(messageContoller));

messageRouter.get('/get-messages/:conversationId', messageContoller.getMessages.bind(messageContoller));

messageRouter.get('/get-message/:messageId', messageContoller.getMessageById.bind(messageContoller));

messageRouter.put('/update-message', messageContoller.updateMessage.bind(messageContoller));

messageRouter.delete('/delete-message/:messageId', messageContoller.deleteMessage.bind(messageContoller));

// messageRouter.get('/get-unread-messages/:conversationId', messageContoller.getUnreadMessages.bind(messageContoller));

// messageRouter.put('/mark-as-read', messageContoller.markAsRead.bind(messageContoller));



export default messageRouter;

