interface ReqBody {
  'street_number': string
  'street': string
  'city': string
  'zip': string
  [key: string]: string,
}

class ControlBodyKeys {
  private keys: ReqBody
  private etc: object | undefined
  constructor(Form: ReqBody, etc?: object) {
    this.keys = Form
    this.etc = etc
  }

  
  keyQuery(database: string) {
    if (Object.keys(this.keys).length === 0) {
      throw new Error('No keys')
    } else {
      let allKeys = Object.keys(this.keys)
      let allValues = Object.values(this.keys)
      const {street_number, street, city, zip} = this.keys
      const address = `${street_number} ${street}, ${city}, ${zip}`
      allKeys.push('address')
      allValues.push(address)
      if (this.etc) {
        for (let i = 0; i < Object.keys(this.etc).length; i++) {
          allKeys.push(Object.keys(this.etc)[i])
          allValues.push(Object.values(this.etc)[i])
        }
      }
      let stringedValues = allValues.filter((_, index) => index < allValues.length - 2).join('", "')
      stringedValues = stringedValues.concat(`", ${allValues.filter((_, index) => index >= allValues.length - 2).join(', ')}`)
      stringedValues = `"${stringedValues}"`
      stringedValues = stringedValues.slice(0, stringedValues.length - 1)
      let StringedKeys = allKeys.join(', ')

      const insert = `insert into ${database} (${StringedKeys}) values (${stringedValues})`
      return insert
    }
  }
}


export {ControlBodyKeys}