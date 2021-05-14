import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import * as Google from 'expo-auth-session/providers/google';

var firebaseConfig = {
    apiKey: "AIzaSyDmbSwxeZFWnvZDz6jjJaUk35jy1XF7HGw",
    authDomain: "sti-report-app.firebaseapp.com",
    projectId: "sti-report-app",
    storageBucket: "sti-report-app.appspot.com",
    messagingSenderId: "628699918493",
    appId: "1:628699918493:web:a6aea766064e7fc646a474"
  };

let db;

export const firebaseInit = () => { 
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
}

export const firebaseLogin = async response => {
    console.log('got in');
    const { id_token } = response.params;
    console.log(`token retrieved ${id_token}`)
    const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
    return await firebase.auth().signInWithCredential(credential)
                    .then( response => response.user )
                    .catch( error => error.message );
}

export const reportCollection = 'reports';
export const userCollection = 'users';

export const getCollection = async collection => await db.collection(collection).get().then( response => console.log(response) );

export const postToCollection = async ( collection, data, docId = null ) => {
    return !docId ?
            await db.collection(collection).doc().set(data)
                .then( response => response )
                .catch( error => error.message )
            : 
            await db.collection(collection).doc(docId).set(data)
            .then( response => response )
            .catch( error => error.message )
};

export const postImage = async ( uId, image ) => {
    let storageRef = firebase.storage().ref();
    let completeRef = storageRef.child('images/' + uId + '/' + image.name);
    await completeRef.put(image).then().catch(error => console.error( error ) );
}
