import { Router } from "express";




const router = Router();


//router.post("/login",)


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // const user = await User
    //     .findOne({ email })
    //     .select("+password");
});
