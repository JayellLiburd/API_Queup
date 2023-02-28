import { Database } from "./config"
import * as tableType from './@Types'

interface filter{
  user?: tableType.PublicUser
  business?: tableType.BusinessTypes
  roster?: tableType.Roster
}

interface Queryies {
  /**
   * @method all
   * @param database table to query
   * @returns string for querying columns from the database that match the table
   */
  all(database: Database['table']): string

  /**
   * @method AllFiltered
   * @param database table to query
   * @param filter columns to filter by
   * @param data filter the data that matches the filter
   * @returns string for querying columns from the database that match the filter and data of that table
   */
  allFilter(database: Database['table'], filter: Array<tableType.TypeParamenters['user'] | tableType.TypeParamenters['business']>, data: filter['business'] | filter['user']): string
  
  /**
   * @method insert
   * @param database table to query
   * @param data data to insert into the database
   * @returns string for inserting data into the database
   */
  insert(database: Database['table'], data: filter['business'] | filter['user']): string

  /**
   * Grabs the user's info and their prefrences
   * @param data is the user's id
   * @returns basic info about the user and their prefrences
   */
  login(data: string): string

  update(database: Database['table'], data: filter['business'] | tableType.management, line_id: string): string
}

export const squery: Queryies = {
  all(database) {
    return `SELECT * FROM ${database}`
  },

  allFilter(database, filter, data) {
    if (!data) {
      throw new Error('data must have a value')
    }
    else if (filter.length <= 0) {
      throw new Error('filter must have a least one value otherwise use dbStatement.all')
    }
    else if (filter.length < 1) {
      throw new Error('filter can only have one value at which it should match the database youre querying')
    }
    else {
      for (let i = 0; i < filter.length; i++) {
        if (Object.keys(data).includes(filter[i]) && Object.keys(data).length === filter.length) {
          continue
        } else {
          throw new Error('filter and data must be the same to use this function')
        }
      }
    }
    let string = `Select * FROM ${database} WHERE `
    for (let i = 0; i < filter.length; i++) {
      let value = JSON.stringify(Object.entries(data).filter(item => item[0] === filter[i])[0][1])
      if (i === filter.length - 1) {
        string += `${filter[i]} = ${value}`
      } else {
        string += `${filter[i]} = ${value} AND `
      }
    }
    return string
  },

  insert(database, data) {
    if (!data) {
      throw new Error('data must have a value')
    }
    const columns = Object.keys(data).join(', ')
    const values = Object.values(data).map(item => JSON.stringify(item)).join(', ')
    return `INSERT INTO ${database} (${columns}) VALUES (${values})`
  },

  login(data) {
    return (`SELECT 
      users.user_id, 
      users.username,
      users.first_name,
      users.password, 
      prefrences.dark, 
      prefrences.weather, 
      prefrences.favorites 
    FROM users 
    INNER JOIN prefrences 
    ON users.user_id = prefrences.user_id where users.username = "${data}";`).replace(/\s+/g, ' ')
  },

  update(database, data, line_id){
    if (!data) { throw new Error('data must have a value') }
    else if (!line_id) { throw new Error('line_id must have a value') }
    else {
      let string = `UPDATE ${database} SET `
      for (let i = 0; i < Object.keys(data).length; i++) {
        if (Object.keys(data)[i] === 'line_id') {
          continue
        }
        if (i === Object.keys(data).length - 1) {
          string += `${Object.keys(data)[i]} = ${JSON.stringify(Object.values(data)[i])}`
        } else {
          string += `${Object.keys(data)[i]} = ${JSON.stringify(Object.values(data)[i])}, `
        }
      }
      string += ` WHERE line_id = ${line_id}`
      return string
    }
  }
}