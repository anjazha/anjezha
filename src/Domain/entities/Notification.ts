import { ENOTIFICATION_TYPES } from "@/Application/interfaces/enums/ENotificationTypes";

export class Notification {
    constructor(
      public userId: number,
      public message : string,
      public type?:ENOTIFICATION_TYPES,
      public isRead? : boolean,
      public createdAt? : Date  
    ){}
}