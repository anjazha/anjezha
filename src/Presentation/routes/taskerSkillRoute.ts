import { ISkillsRepository } from "@/Application/interfaces/Skills/ISkiilsRepository";
import { ITaskerSkillsRepository } from "@/Application/interfaces/Skills/ITaskerSkillsRepository";
import { ITaskerSkillsService } from "@/Application/interfaces/Skills/ITaskerSkillsService";
import { ITaskerRepository } from "@/Application/interfaces/User/Tasker/ITaskerRepository";
import { SkillsRepository } from "@/Application/repositories/skillsRepository";
import { TaskerSkillsRepository } from "@/Application/repositories/taskerSkillsRepository";
import { TaskerSkillService } from "@/Application/services/taskerSkillService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { Router } from "express";
import { Container } from "inversify";
import { TaskerSkillController } from "../controllers/taskerSkillController";
import { alllowTo, isAuth } from "../middlewares/isAuth";



const router = Router();

const container = new Container();

// resolve the dependencies for the skillRepository
container.bind<ISkillsRepository>(INTERFACE_TYPE.SkillsRepository).to(SkillsRepository);

// resolve the dependencies for the taskerSkillRepository
container.bind<ITaskerSkillsRepository>(INTERFACE_TYPE.TaskerSkillsRepository).to(TaskerSkillsRepository);

// resolvse the dependencies for the Skills Service

container.bind<ITaskerSkillsService>(INTERFACE_TYPE.TaskerSkillsService).to(TaskerSkillService);


// resolve the dependencies for the taskerSkillsRepository

container.bind<TaskerSkillController>(INTERFACE_TYPE.TaskerSkillsController).to(TaskerSkillController);


const taskerSkillController = container.get<TaskerSkillController>(INTERFACE_TYPE.TaskerSkillsController);

router.post('/create-skill',isAuth, alllowTo('tasker'), taskerSkillController.createSkill.bind(taskerSkillController));

router.put('/update-skill/:id',isAuth, alllowTo('tasker'), taskerSkillController.updateSkill.bind(taskerSkillController));

router.delete('/delete-skill/:id',isAuth, alllowTo('tasker'), taskerSkillController.deleteSkill.bind(taskerSkillController));

router.get('/get-skills',isAuth, alllowTo('tasker'), taskerSkillController.getSkills.bind(taskerSkillController));

export default router;