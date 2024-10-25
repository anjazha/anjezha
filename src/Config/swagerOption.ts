import { Category } from "@/Domain/entities/Category";
import { Conversation } from "@/Domain/entities/Conversation";
import { Message } from "@/Domain/entities/Message";
import { Review } from "@/Domain/entities/Review";
import { Role } from "@/Domain/entities/role";
import { Skills } from "@/Domain/entities/Skills";
import { SubCategory } from "@/Domain/entities/SubCategory";
import { TaskerSkills } from "@/Domain/entities/TakserSkills";
import { TaskApplication } from "@/Domain/entities/TaskApplication";
import { TaskAssignment } from "@/Domain/entities/TaskAssignment";
import { Tasker } from "@/Domain/entities/Tasker";
import { User } from "@/Domain/entities/User";

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'ANJAZHA API',
            version: '1.0.0',
            description: 'Anjazha API documentation',
            contact: {
                name: 'Support',
                url: 'https://anjazha.example.com/support',
                email: 'support@anjazha.example.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1',
                description: 'Local server'
            },
            {
                url: 'https://anjez.tech/api/v1',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header',
                    name: 'Authorization'
                }
            },
            schemas: {
                User:{
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the user'
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user'
                        },
                        password: {
                            type: 'string',
                            description: 'Password of the user'
                        },
                        name: {
                            type: 'string',
                            description: 'First name of the user'
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number of the user'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                    }

                },

                 Role:{
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the role'
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the role'
                        },
                        userId:{
                            type:Number,
                            required:true,
                            description:'add user id'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                   },
                },
                Tasker:{

                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the tasker'
                        },
                        userId: {
                            type: 'string',
                            description: 'ID of the user who is a tasker'
                        },
                        bio: {
                            type: 'string',
                            description: 'Detailed description of the tasker'
                        },
                        skills: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'List of skills the tasker has'
                        },
                        // rating: {
                        //     type: 'number',
                        //     description: 'Average rating of the tasker'
                        // },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                    }

                },

                Skills:{
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the skill'
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the skill'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                    }
                },

                TaskerSkills:{
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the tasker skill'
                        },
                        taskerId: {
                            type: 'string',
                            description: 'ID of the tasker who has the skill'
                        },
                        skillId: {
                            type: 'string',
                            description: 'ID of the skill'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                    }
                },

                Category:{
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the category'
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the category'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                    }
                },

                SubCategory:{
                    
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the subcategory'
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the subcategory'
                        },
                        categoryId: {
                            type: 'string',
                            description: 'ID of the category to which the subcategory belongs'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                },
                },

                Review:{

                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the review'
                        },
                        taskId: {
                            type: 'string',
                            description: 'ID of the task for which the review is posted'
                        },
                        rating: {
                            type: 'number',
                            description: 'Rating given by the customer'
                        },
                        comment: {
                            type: 'string',
                            description: 'Comment posted by the customer'
                        },
                        customerId: {
                            type: 'string',
                            description: 'ID of the customer who posted the review'
                        },
                        taskerId: {
                            type: 'string',
                            description: 'ID of the tasker who received the review'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                    }


                },
                Task: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the task'
                        },
                        title: {
                            type: 'string',
                            description: 'Title of the task'
                        },
                        description: {
                            type: 'string',
                            description: 'Detailed description of the task'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'assigned', 'completed', 'canceled'],
                            description: 'Current status of the task'
                        },
                        customerId: {
                            type: 'string',
                            description: 'ID of the customer who posted the task'
                        },
                        taskerId: {
                            type: 'string',
                            description: 'ID of the tasker assigned to the task'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                    }
                },

                TaskApplication:{
                  
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier for the task application'
                        },
                        taskId: {
                            type: 'string',
                            description: 'ID of the task for which the application is made'
                        },
                        taskerId: {
                            type: 'string',
                            description: 'ID of the tasker who applied for the task'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'accepted', 'rejected'],
                            description: 'Current status of the application'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Update timestamp'
                        }
                },

            },

            TaskAssignment:{
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique identifier for the task assignment'
                    },
                    taskId: {
                        type: 'string',
                        description: 'ID of the task assigned to the tasker'
                    },
                    taskerId: {
                        type: 'string',
                        description: 'ID of the tasker assigned to the task'
                    },
                    status: {
                        type: 'string',
                        enum: ['pending', 'in_progress', 'completed', 'canceled'],
                        description: 'Current status of the assignment'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Update timestamp'
                    }
                }

            },

            Conversation:{

                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique identifier for the conversation'
                    },
                    taskId: {
                        type: 'string',
                        description: 'ID of the task for which the conversation is made'
                    },
                    customerId: {
                        type: 'string',
                        description: 'ID of the customer who started the conversation'
                    },
                    taskerId: {
                        type: 'string',
                        description: 'ID of the tasker who is part of the conversation'
                    },
                    message: {
                        type: 'string',
                        description: 'Content of the conversation message'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp'
                    }
                }

            },

            Message:{
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique identifier for the message'
                    },
                    conversationId: {
                        type: 'string',
                        description: 'ID of the conversation to which the message belongs'
                    },
                    senderId: {
                        type: 'string',
                        description: 'ID of the user who sent the message'
                    },
                    receiverId: {
                        type: 'string',
                        description: 'ID of the user who received the message'
                    },
                    message: {
                        type: 'string',
                        description: 'Content of the message'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp'
                    }
                }

            },

            Notification:{
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique identifier for the notification'
                    },
                    userId: {
                        type: 'string',
                        description: 'ID of the user to whom the notification is sent'
                    },
                    message: {
                        type: 'string',
                        description: 'Content of the notification message'
                    },
                    read: {
                        type: 'boolean',
                        description: 'Flag to indicate whether the notification is read'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp'
                    }
                }
            }

                

                // Add more schemas as per your database entities, such as `Customer`, `Tasker`, etc.
                // Add more components as per your database entities, such as `Customer`, `Tasker`, etc.

            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    apis: ['./src/Presentation/routes/*.ts'],
};

module.exports = options;
