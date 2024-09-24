import { Router } from "express";

import { IProfileService } from "@/Application/interfaces/User/IProfileService";
import { IUserRepository } from "@/Application/interfaces/User/IUserRepository";
import { UserRepository } from "@/Application/repositories/userRepository";
import { ProfileService } from "@/Application/services/profileService";
import { INTERFACE_TYPE } from "@/helpers/containerConst";
import { Container } from "inversify";
import { ProfileController } from "../controllers/profileController";
import {isAuth, allowTo} from "../middlewares/isAuth";


const router = Router();


const container = new Container();

// resolve dependencies  with user repository
container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);


container.bind<IProfileService>(INTERFACE_TYPE.ProfileService).to(ProfileService);


container.bind<ProfileController>(INTERFACE_TYPE.ProfileController).to(ProfileController);


const profileController = container.get<ProfileController>(INTERFACE_TYPE.ProfileController);


// alllow use this route to acess only if user is authenticated

// router.use('/profile/*',isAuth, allowTo('user', 'tasker'));

 router.get('/profile', 
     isAuth, 
     allowTo('user', 'tasker'),
     profileController.getPRofile.bind(profileController));

 router.put('/profile', 
   // allow to access only if user is authenticated 
     isAuth,
     allowTo('user', 'tasker'),
     profileController.updateProfile.bind(profileController));

 router.delete('/profile', 
   // allow to access only if user is authenticated 
     isAuth, 
     allowTo('user', 'tasker'),
     profileController.deleteProfile.bind(profileController));

 router.patch('/profile/picture', 
   // allow to access only if user is authenticated 
     isAuth, 
     allowTo('user', 'tasker'),
     profileController.updateProfilePicture.bind(profileController));

 router.patch('/profile/change-password',
      isAuth, 
      allowTo('user', 'tasker'),
      profileController.changePassword.bind(profileController));

export default router;