const {ControlBodyKeys} = require('./functions.ts')
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const req = {body: {
  name: 'jay',
  host: 'akili page',
  website: 'https://starbucks.com',
  tele: '347-555-5555',
  email: 'starbucks@gmail.com',
  notes: '<p>test</p>',
  open: '9:00am',
  close: '9:00pm',
  address: '1111 test ave, test, 11111',
  street: 'test ave',
  street_number: '1111',
  city: 'test',
  zip: '11111',
  area: 'test',
  country: 'usa',
  coordinates: '1111, 1111',
  small: '0',
  rate: '50',
  category: 'hh',
  raffle: '0',
  promo: '1',
  color: '{"primary":"#000000","secondary":"#ffffff"}',
}, etc: {
  user_id: 'gvygggbnj',
  line_id: "(replace(uuid(),'-',''))", 
  last_update: 'CURRENT_TIMESTAMP()',
  created: 'CURRENT_TIMESTAMP()'
}}

// const control = new ControlBodyKeys(req.body, req.etc)
initializeApp({
  apiKey: "AIzaSyDAICINYSy_X7b0CMDNJkRkJxeWE08x58w",
  authDomain: "queup-358912.firebaseapp.com",
  databaseURL: "https://queup-358912-default-rtdb.firebaseio.com/",
  projectId: "queup-358912",
  storageBucket: "queup-358912.appspot.com",
  messagingSenderId: "606581966610",
  appId: "1:606581966610:web:6c532778a4dc45703d95cb",
  measurementId: "G-NTK8LEJN8N"
})
const db = getFirestore()
setDoc(doc(db, 'Queue/3991286c766911edaf53000d3a8f611e', 'Queue', '578433'), {name: 'Ishmael Liburd'}).then(() => {
  console.log('done')
}).catch((err) => {
  console.log(err)
})
// console.log(control.keyQuery('business'))