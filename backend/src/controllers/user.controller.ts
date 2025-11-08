import { Request, Response } from 'express'
import userModel from '../models/user.model'
import { User } from '../types/user'

/**
 * Sign up (add user)
 * 
 * @route POST user/signup
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */
const addUser = async(req:Request<{},{},Omit<User, 'id'>>, res:Response)=>{
    const { username, password, firstname, lastname} = req.body
    if(!username.trim()||!password.trim()||!firstname.trim()||!lastname.trim()){
        res.status(500).json({
            message:"Missing necessary inputs"
        })
        return
    }

    const isSuccess:boolean = await userModel.create({username, password, firstname, lastname})

    if(!isSuccess){
        res.status(409).json({
            message: "Username is taken"
        })
        return
    }

    res.status(201).json({
        message:"User successfully added!"
    })
}


/**
 * Log in 
 * 
 * @route POST user/login
 * @param {Request<{}, {}, Partial<User>>} req
 * @param {Response} res
 * @returns {void} Respond with success/fail.
 */
const loginUser=async(req:Request<{}, {}, Partial<User>>, res:Response)=>{
    const {username, password} = req.body

    if(!username?.trim()||!password?.trim()){
        res.status(500).json({
            message:"Username or password is empty!"
        })
        return
    }

    const user = await userModel.login({username,password})

    if(!user){
        res.status(500).json({
            message:"Incorect login detail"
        })
        return
    }
    console.log("session",req.session)
    if(req.session){
        req.session.isLoggedIn = true
        req.session.username = user.username
    }
    console.log("session",req.session)
    res.status(200).json({
        message:"Login successfully done"
    })
}

/**
 * Get user by username
 * 
 * @route GET user/check-auth
 * @param {Request} req
 * @param {Response} res
 * @returns {void} return user info from database based on username
 */

const getUserByUsername = (req: Request, res: Response) => {
  if (!req.session || !req.session.username) {
    console.log(req.session)
    res.status(401).json({
      message: "Only logged-in users can access this page!"
    })
    return
  }
  //get username from cookie-session
  const { username } = req.session
  const user = userModel.findByUsername(username)
  if (!user) {
    res.status(404).json({
      message: "User does not exist!"
    })
    return
  }
  res.status(200).json({
    user: user
  })
}


/**
 * Log out
 * 
 * @route GET /users/logout
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Clear session cookie.
 */
const logout = (req: Request, res: Response) => {
  if (req.session) {
    req.session = null // clear the session cookie
  }
  res.status(200).json({
    message: "Logout successful!"
  })
}


export default{
    addUser,
    logout,
    getUserByUsername,
    loginUser
}