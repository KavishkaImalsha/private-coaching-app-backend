import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import axios from 'axios'

const clientId = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = async (req, res) => {
    const { token } = req.body
    try{
        const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
        );

        const { email, name, sub } =googleResponse.data

        let user = await User.findOne({email})

        if(!user){
            user = await User.create({
                email: email,
                name: name,
                googleId: sub
            })
        }

        const appToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

        res.status(200).json({token: appToken})
    }catch(error){
        res.status(400).json({message: 'Google authentication failed'})
    }
}
