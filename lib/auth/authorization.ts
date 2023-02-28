import { sign, verify } from 'jsonwebtoken'
import Express from "express";
require('dotenv').config();

type AuthMethods = {

  /**
   * A method which checks if the user is verified by checking the cookies and verifying the JWT-Token
   * @param req incoming data
   * @param res response parameter from the route
   * @returns if verified responds with a user's ID else returns false
   */
  isVerified(req: Express.Request, res: Express.Response):Promise<any>

  /**
   * a method to log the user out by clearing the cookies and sending a response
   * @param res response parameter from the route
   */
  logout(res: Express.Response, message: string):Promise<any>


  /**
   * A method to dispatch cookies to the client and send a response
   * @param res response parameter from the route
   * @param data object containing the Authorized Token and the Reverification Token
   * @param send any extra data to be sent to the client
   * @param options CookieOptions object, all options are optional and will default to the values shown
   */
  dispatchCookies(res: Express.Response, data: {AuthToken: string, VToken: string}, send?: any, options?: Express.CookieOptions ):Promise<any>
}

export const auth: AuthMethods = {

  async isVerified(req, res) {
    try {
      if (!req.signedCookies._ss) {this.logout(res, 'Not Authorized'); return false}
      if (!process.env.cookie_secret) {throw new Error('cookie_secret is not defined in the .env file')}
      return verify(req.signedCookies._ss, process.env.cookie_secret)
    } 
    catch (error) {
      this.logout(res, 'Unauthorized')
      return false
    }
  },

  async dispatchCookies(res, cookie, send, options = {sameSite: 'lax', secure: true, httpOnly: true, domain: process.env.cookie_domains, maxAge: 1000*60*60*24*30, signed: true}) {
    if (process.env.secure === '0') {options.sameSite = false; options.secure = false}
    if (!process.env.cookie_secret) {throw new Error('cookie_secret is not defined in the .env file')}
    res
      .cookie('_ss', sign(cookie.AuthToken, process.env.cookie_secret), options)
      .cookie('_Secure1PSSUD', sign(cookie.VToken, process.env.cookie_secret), options)
      .status(200).send(send)
  },

  async logout(res, message) {
    res
      .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
      .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
      .status(200).send({messageAuth: message});
  }
}