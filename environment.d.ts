declare global {
  namespace NodeJS {
    interface ProcessEnv {

      db_host: string;
      db_user: string;
      db_password: string;
      db_database: string
      db_port: string;

      
      google_testing_clientid: string;
      apiKey: string;
      authDomain: string;
      databaseURL: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId: string;

      Server: string;
      cookie_secret: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}