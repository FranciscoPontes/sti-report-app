import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
        apiKey: "AIzaSyDmbSwxeZFWnvZDz6jjJaUk35jy1XF7HGw",
        authDomain: "sti-report-app.firebaseapp.com",
        projectId: "sti-report-app",
        storageBucket: "sti-report-app.appspot.com",
        messagingSenderId: "628699918493",
        appId: "1:628699918493:web:a6aea766064e7fc646a474"
}

let db;
const REPORT_COLLECTION = 'reports';
const USER_COLLECTION = 'users';

// const reportTemplate = 
// {
//     user: 'testUser',
//     latitude: '15',
//     longitude: '20',
//     accessType: 'medium', // easy, medium, hard
//     extractionType: 'truck',
//     isAnimalReport: false,
//     typeOfAnimal: null,
//     typeOfTrash: 'plastic', // plastic etc..
//     submissionDate: new Date('2017-08-15'), // data atual
//     status: 'processing' // processing, closed, rejected
// }


// what google gives us 
const userDataTemplate = {
    "displayName": "Francisco Pontes",
    "email": "franciscoluispontes@gmail.com",
    "phoneNumber": null,
    "photoURL": "https://lh3.googleusercontent.com/a-/AOh14Gh0sFJRqF-9Aip0Dg2i1hqI4OYfHbgE6kLgfSBTww=s96-c",
    "providerId": "google.com",
    "uid": "113842996349886677035",
}

export let userData = {};

export const startFirebase = () => {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('Firebase configured!');
    }
    else console.log('Firebase was already configured!');
};

export const login = async (response) => {
        console.log('got in');
        const { id_token } = response.params;
        console.log(`token retrieved ${id_token}`);
        const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
        return await firebase.auth().signInWithCredential(credential)
                        .then( response => { userData = {...response.user.providerData[0]};
                                             addUser();
                                             return userData; 
                                            } )
                        .catch( error => error.message );
};

const getData = async ( collection, query = null ) => {
    if (!query) {
        return db.collection(collection)
        .get()
        .then( querySnapshot => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
    }
    return db.collection(collection).where(query.attribute, query.comparator, query.value)
    .get()
    .then( querySnapshot => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch((error) => {
        console.error("Error getting documents: ", error);
    });
}

const postToCollection = async ( collection, data, docId = null ) => {
    return !docId ?
            await db.collection(collection).doc().set(data)
                .then( response => {
                    console.log('New post submitted!');
                    return response; 
                } )
                .catch( error => error.message )
            :
            await db.collection(collection).doc(docId).set(data)
            .then( response => {
                console.log('New post submitted!');
                return response; 
            } )
            .catch( error => error.message )
};

const postImage = async ( uId, image ) => {
    let storageRef = firebase.storage().ref();
    let completeRef = storageRef.child('images/' + uId + '/' + image.name);
    await completeRef.put(image).then().catch(error => console.error( error ) );
};

const addUser = async () => {
    const docRef = db.collection(USER_COLLECTION).doc(userData.uid);

    await docRef.get().then( async doc => {
        if (doc.exists) console.log("User already exists");
        else {
            await postToCollection( USER_COLLECTION, userData, userData.uid);
            console.log('User added');
        }
    }).catch( error => {
        console.error("Error adding user:", error.message);
    });
}

export const getAllReports = async () => await getData(REPORT_COLLECTION);

export const getCurrentUserReports = async () => await getData(REPORT_COLLECTION, { attribute: 'user', comparator: '==', value: userData.uid} )

export const addNewReport = async data => {
    // TODO: process images
    return await postToCollection( REPORT_COLLECTION, data );
}
