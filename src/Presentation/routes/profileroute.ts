import { Router } from "express";

import { IProfileService } from "@/Application/interfaces/User/IProfileService";
import { IUserRepository } from "@/Application/interfaces/User/IUserRepository";
import { UserRepository } from "@/Application/repositories/userRepository";
import { ProfileService } from "@/Application/services/profileService";
import { INTERFACE_TYPE } from "@/helpers";
import { Container } from "inversify";
import { ProfileController } from "../controllers/profileController";
import isAuth from "../middlewares/isAuth";


const router = Router();


const container = new Container();

// resolve dependencies  with user repository
container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository);


container.bind<IProfileService>(INTERFACE_TYPE.ProfileService).to(ProfileService);


container.bind<ProfileController>(INTERFACE_TYPE.ProfileController).to(ProfileController);


const profileController = container.get<ProfileController>(INTERFACE_TYPE.ProfileController);


 router.get('/profile', 
   // allow to access only if user is authenticated, tasker 
   isAuth,
     profileController.getPRofile.bind(profileController));

 router.put('/profile', 
   // allow to access only if user is authenticated 
   isAuth,
     profileController.updateProfile.bind(profileController));

 router.delete('/profile', 
   // allow to access only if user is authenticated 
   isAuth,
     profileController.deleteProfile.bind(profileController));

 router.patch('/profile/picture', 
   // allow to access only if user is authenticated 
   isAuth,
     profileController.updateProfilePicture.bind(profileController));

 router.patch('/profile/change-password',
    isAuth,
      profileController.changePassword.bind(profileController));

export default router;