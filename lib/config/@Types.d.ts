import { Request } from "express"

export type BusinessTypes = {
  user_id?: string
  line_id?: string
  name?: string
  email?: string
  tele?: string
  street?: string
  address?: string
  open?: string
  close?: string
  image?: string
  color?: string
  website?: string
  notes?: string
  host?: string
  street_number?: string
  city?: string
  coordinates?: string
  zip?: string
  area?: string
  country?: string
  small?: number
  rate?: number
  category?: string
  raffle?: number
  promo?: number
  favorite?: any
  last_update?: string
  created?: string
}

export interface PublicUser {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
}

export interface PrivateUser extends PublicUser {
  user_id?: string
  username?: string
  password?: string
  sex?: string
  address_2?: string
  city?: string
  zip_code?: string
  state?: string
  counrty?: string
  standard_fav?: string
  last_update?: Date
  created?: Date
  verified?: number
}

export type management = {
  database_id?: number
  ID_NO?: number
  line_id?: string
  full_name?: string
  role?: string
  permissions?: 'Full-Access' | 'Limited-Access' |'No-Access'
  pin?: string
  [key: string]: any
}

export type Roster = {
  info?: BusinessTypes
  roles?: Array<{name: string, Access: 'Full-Access' | 'Limited-Access' |'No-Access'}>
  user?: Array<{
    name: string
    role: string | {name: string, Access: 'Full-Access' | 'Limited-Access' |'No-Access'}
    ID_NO: string
    [key: string]: any
  }>
}

export interface TypeParamenters {
  business: 
    'user_id' |
    'line_id' |
    'name' |
    'email' |
    'tele' |
    'street' |
    'address' |
    'open' |
    'close' |
    'image' |
    'color' |
    'website' |
    'notes' |
    'host' |
    'street_number' |
    'city' |
    'coordinates' |
    'zip' |
    'area' |
    'country' |
    'small' |
    'rate' |
    'category' |
    'raffle' |
    'promo' |
    'favorite' |
    'last_update' |
    'created'
  user:
    'first_name' |
    'last_name' |
    'email' |
    'phone' |
    'address',
  roster: 
    `database_id`|
    `ID_NO`|
    `line_id`|
    `full_name`|
    `role`|
    `permissions`|
    `pin`,

}

export interface Login extends Request {
  body: {
    username: string = ''
    password: string = ''
    credentials: string = ''
  }
}

/**
 * Googles JWT PAYLOAD
 */
export interface ABCLogin {
  /**
   * The JWT's issuer
   * @example => "https://accounts.google.com"
   * @description The value of iss is always https://accounts.google.com or accounts.google.com for Google ID tokens.
   */
  iss?: string   
  /**
   * The user's ID
   * @example "3141592653589793238"
   * @description The value of sub is the unique user ID. It is a 21-digit number for Google accounts and a 22-digit number for Google Apps accounts. The value of sub is not the same as the value of the email claim.
   */
  /**
   * Not Before
   * @example  161803398874
   * @description The value of nbf is the Unix time at which the assertion is not valid before. The value of nbf is optional.
   */
  nbf?: number 
  /**
   * Audience
   * @example "314159265-pi.apps.googleusercontent.com"
   * @description The value of aud is the client ID of the application that made the authentication request. The value of aud is not the same as the value of the iss claim.
   */
  aud?: string
  /**
   * The unique ID of the user's Google Account
   * @example "3141592653589793238"
   * @description The value of sub is the unique user ID. It is a 21-digit number for Google accounts and a 22-digit number for Google Apps accounts. The value of sub is not the same as the value of the email claim.
   */
  sub?: string
  /**
   * host domain
   * @example "gmail.com"
   * @description If present, the host domain of the user's GSuite email address
   */
  hd?: string
  /**
   * The user's email address
   * @example "elisa.g.beckett@gmail.com"
   */
  email?: string
  /**
   * email verified
   * @description true, if Google has verified the email address
   */
  email_verified?: boolean
  /**
   * Authorized party
   * @example "314159265-pi.apps.googleusercontent.com"
   * @description The value of azp is the client ID of the application that made the authentication request. The value of azp is not the same as the value of the iss claim.
   */
  azp?: string   // example "314159265-pi.apps.googleusercontent.com",
  /**
   * user's full name
   * @example "Elisa Beckett"
   */
  name?: string
  /**
   * user's profile picture
   * @example "https?://lh3.googleusercontent.com/a-/e2718281828459045235360uler"
   * @description If present, a URL to user's profile picture
   */
  picture?: string
  /**
   * user's given name (first name)
   * @example "Elisa"
   */
  given_name?: string
  /**
   * user's family name (last name)
   * @example "Beckett"
   */
  family_name?: string
  /**
   * issued at
   * @example 1596474000
   * @description Unix timestamp of the assertion's creation time
   */
  iat?: number
  /**
   * expiration time
   * @example 1596477600
   * @description Unix timestamp of the assertion's expiration time
   */
  exp?: string
  /**
   * JWT ID
   * @example "abc161803398874def"
   * @description The value of jti is a unique identifier for the assertion. The value of jti is not the same as the value of the iss claim.
   */
  jti?: string
}


enum inputNames {
  'user_id' = 'user_id',
  'line_id' = 'line_id',
  'name' = 'name',
  'email' = 'email',
  'tele' = 'tele',
  'street' = 'street',
  'address' = 'address',
  'open' = 'open',
  'close' = 'close',
  'image' = 'image',
  'color' = 'color',
  'website' = 'website',
  'notes' = 'notes',
  'host' = 'host',
  'street_number' = 'street_number',
  'city' = 'city',
  'coordinates' = 'coordinates',
  'zip' = 'zip',
  'area' = 'area',
  'country' = 'country',
  'small' = 'small',
  'rate' = 'rate',
  'category' = 'category',
  'raffle' = 'raffle',
  'promo' = 'promo',
  'favorite' = 'favorite',
  'last_update' = 'last_update',
  'created' = 'created',
  'first_name' = 'first_name',
  'last_name' = 'last_name',
  'phone' = 'phone',
}