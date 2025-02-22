import express, { Response } from 'express';
import User, { UserRequest } from './types';
const router = express.Router();

router.get('/usernames',async (req:UserRequest, res: Response)=>{
    let usernames = req.users?.map((user) => {
        return { id: user.id, username: user.username };
      });
      res.send(usernames);
})
router.get('/username/:name', async(req:UserRequest,res: Response)=>{
    try {
        let user_search = req.params.name  
        //const found_user = users.find((u)=>u.firstName.contains(user_search) || u.lastName.contains(user_search) || u.username.contains(user_search));
        const found_user = req.users?.filter((user:User):boolean=>{
           return user.username === user_search 
        })
        //filter, check if username === name 
        if(!found_user){
            throw Error("User not found");
        }
        else{
            return res.status(200).json(found_user);
        }
    }catch(e:any){
      return res.status(400).json({message:e.message});
    }
})

export default router;