



export  class User {
    // private id?: number;
    // private name: string;
    // private email: string;
    // private password: string;
    // private profilePicture?: string;
    // private phoneNumber?: string;

    // previous code  is same as below code
    constructor(
         public  name:string,
         public  email:string,
         public  password:string,
         public  phoneNumber:string,
         public  id?:number,
         public  profilePicture?:string,
        ){
        // this.name = name;
        // this.email = email;
        // this.password = password;
        // this.id = id;
        // this.profilePicture = profilePicture;
        // this.phoneNumber = phoneNumber;
    }
}