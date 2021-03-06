import * as firebase from 'firebase';
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
//     status: 'processing' // processing, approved, closed, rejected
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
                        .then( async response => { userData = {...response.user.providerData[0]};
                                             await addUser();
                                             return userData; 
                                            } )
                        .catch( error => error.message );
};

export const logout = async () => await firebase.auth().signOut().then(() => {
                                                console.log('Signed out with success!')
                                            }).catch( error => {
                                                console.log(error.message);
                                            });

const getData = async ( collection, query = null ) => {
    if (!query) {
        return db.collection(collection)
        .get()
        .then( querySnapshot => {
            let dataArray = [];
            querySnapshot.forEach( doc => {
                var docData = doc.data();
                docData.id = doc.id;
                dataArray.push(docData);
            });
            // console.log(dataArray);
            return dataArray;
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
    }
    return db.collection(collection).where(query.attribute, query.comparator, query.value)
    .get()
    .then( querySnapshot => {
        let dataArray = [];
        querySnapshot.forEach( doc => {
            var docData = doc.data();
            docData.id = doc.id;
            dataArray.push(docData);
        });
        return dataArray;
    })
    .catch((error) => {
        console.error("Error getting documents: ", error);
    });
}

const postToCollection = async ( collection, data, docId = null ) => {
    return !docId ?
            await db.collection(collection).add((data))
                .then( docRef => {
                    console.log('New post submitted!');
                    return docRef; 
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

export const postImage = async ( imageId, imageUrl, isAnimalReport) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    var reportType = isAnimalReport ? "animals" : "trash";
    const ref = firebase.storage().ref().child("images/" + reportType + "/" + imageId);
    return ref.put(blob);
};

export const editReportState = async ( reportId, state) => {
    var reportRef = db.collection(REPORT_COLLECTION).doc(reportId);
    return reportRef.update({
        status: state
    })
    .then(() => {
        console.log("Report state updated");
    })
    .catch((error) => {
        console.error("Error updating: ", error);
    });
};

export const getImage = async ( reportId, isAnimalReport) => {
    var reportType = isAnimalReport ? "animals" : "trash";
    const ref = firebase.storage().ref("images/" + reportType + "/" + reportId);
    const downloadURL = await ref.getDownloadURL();
    return downloadURL;
};

// used to login with test user
export const changeUserData = data => userData = data;

export const addUser = async () => {
    const docRef = db.collection(USER_COLLECTION).doc(userData.uid);
    
    await docRef.get().then( async doc => {
        if (doc.exists) { 
            userData = await isCurrentUserAdmin();
            console.log("User already exists");
        }
        else {
            await postToCollection( USER_COLLECTION, {...userData, numberCompletedReports: 0, admin: false }, userData.uid );
            userData = {...userData, numberCompletedReports: 0, admin: false };
            console.log('User added');
        }
    }).catch( error => {
        console.error("Error adding user:", error.message);
    });
}

export const getAllReports = async () => await getData(REPORT_COLLECTION);

export const getCurrentUserReports = async () => await getData(REPORT_COLLECTION, { attribute: 'user', comparator: '==', value: userData.uid} )

export const getReport = async (reportId) => await getData(REPORT_COLLECTION, {attribute: firebase.firestore.FieldPath.documentId(), comparator: '==', value: reportId});

export const getUser = async (userId) => await getData(USER_COLLECTION, {attribute: 'uid', comparator: '==', value: userId});

export const getAllUsers = async () => await getData(USER_COLLECTION);

export const addNewReport = async data => {
    return await postToCollection( REPORT_COLLECTION, data );
}

export const updateCurrentUserData = async data => await postToCollection( USER_COLLECTION, data, userData.uid );

const isCurrentUserAdmin = async () => {
    const result = await getUser(userData.uid);
    return {...userData, admin: result[0].admin};
}