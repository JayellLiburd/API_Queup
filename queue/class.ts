import { getFirestore, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
require('dotenv').config()

const db = getFirestore();

class queup {
  private user: string;
  private mainUserid: string;
  private line: string;
  private called: number;
  constructor(user: string, id: string, line: string, called?: number) {
    this.user = user
    this.mainUserid = id
    this.line = line
    this.called = called || 0
  }
  
  async add() {
    const Time = (time: Date) => {
      let hours = time.getHours()
      let minutes = time.getMinutes()
      let AmOrPm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12
      let min = minutes < 10 ? '0' + minutes : minutes
      let strTime = hours + ':' + min + ' ' + AmOrPm
      return strTime
    }
    if (this.user === null) {
      throw new Error("user is null")
    }
    const promise = new Promise<object>((resolve, reject) => {
      setDoc(doc(db, `Queue/${this.line}/Que`, this.mainUserid), {name: this.user, called: 0, time: Time(new Date()), accTime: new Date().getTime()})
      .then(() => {
        resolve({ message: 'Joined' })
      })
      .catch((error: any) => {
        console.error(`Error adding document: ${this.user}`, error);
        resolve({ message: 'Technical Error' })
      })
      resolve({ message: 'Joined' })
    })
    const result = await promise
    return result
  }
  
  async update() {
    if (this.user === null) {
      throw new Error("user is null")
    }
    const promise = new Promise<object>((resolve, reject) => {
      updateDoc(doc(db, `Queue/${this.line}/Que`, this.user), {
        called: this.called + 1,
      })
      .then(() => {
        resolve({ message: this.called === 0 ? 'Called' : 'Time Expired' })
      })
      .catch((err: any) => {console.log(err); resolve({Error: 'There was an error calling this user'})})
    })
    const result = await promise
    return result
  }

  async remove() {
    if (this.user === null) {
      throw new Error("user is null")
    }
    const promise = new Promise<object>((resolve, reject) => {
      deleteDoc(doc(db, `Queue/${this.line}/Que`, this.user))
      .then(() => {
        resolve({ message: 'Removed' })
      })
      .catch((err: any) => {console.log(err); resolve({Error: 'There was an error removing this user'})})
    })
    const result = await promise
    return result
  }
}

export {queup}