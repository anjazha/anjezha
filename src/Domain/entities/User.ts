



export  class User {
    // private id?: number;
    // private name: string;
    // private email: string;
    // private password: string;
    // private profilePicture?: string;
    // private phoneNumber?: string;

    // previous code  is same as below code
    constructor(private readonly name:string,
         private readonly email,
         private readonly password,
         private readonly id?:number,
         private readonly profilePicture?:string,
         private readonly phoneNumber?:string
        ){
        // this.name = name;
        // this.email = email;
        // this.password = password;
        // this.id = id;
        // this.profilePicture = profilePicture;
        // this.phoneNumber = phoneNumber;
    }
}