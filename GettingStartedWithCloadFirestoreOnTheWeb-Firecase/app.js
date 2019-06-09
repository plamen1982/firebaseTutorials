const config = {
    apiKey: 'AIzaSyD6UUhwbjBO1o5Ny5epzxdLQItRZYW7PZk',
    authDomain: 'ishotdogasandwich-test.firebaseapp.com',
    databaseURL: 'https://ishotdogasandwich-test.firebaseio.com',
    projectId: 'ishotdogasandwich-test',
    storageBucket: 'ishotdogasandwich-test.appspot.com',
    messagingSenderId: '182270411429'
};

firebase.initializeApp(config);

const firestore = firebase.firestore();

// const documentSandwichReference = firebase.collections('samples').doc('sandwichData');
const documentSandwichReference = firestore.doc('samples/sandwichData');

const outputHeader = document.querySelector('#hotDogOutput');
const inputTextField = document.querySelector('#latestHotDogStatus');
const saveButton = document.querySelector('#saveButton');
const loadButton = document.querySelector('#loadButton');

saveButton.addEventListener('click', () => {
    const textToSave = inputTextField.value;
    console.log('I am going to save ' + textToSave + ' to Firestore'); 
    documentSandwichReference.set({
        hotDogStatus: textToSave
    }).then(() => {
        console.log('Status saved');
    }).catch((error) => {
        console.log('Got an error', error);
    })
});

loadButton.addEventListener('click', () => {
    documentSandwichReference.get()
    .then((documentSnapshot) => {
        if(documentSnapshot && documentSnapshot.exists) {
            const myDocResult = documentSnapshot.data();
            console.log('documentSnapshot', myDocResult.hotDogStatus);
            outputHeader.innerText = `Hot dog status: ${ myDocResult.hotDogStatus }`;
        }
    }).catch((error) => {
        console.log('An error occured', error);
    });
});

getRealtimeUpdates = () => {
    //onSnapshot is real time event listener for changes in the database in our firebase, as a first argument we can add 
    //{ includeMetadataChanges: true }, is an option if is set to true, onSpanshot event is going to be called again when we receive documentSnapshot from the firestore
    //and we have property documentSnapshot.metadata.hasPendingWrites when is false it means that this data is comming from firebase 
    //and is not a local copy
    documentSandwichReference.onSnapshot({ includeMetadataChanges: true }, (documentSnapshot) => {
        if(documentSnapshot && documentSnapshot.exists && !documentSnapshot.metadata.hasPendingWrites) {
            const myDocResult = documentSnapshot.data();
            console.log('documentSnapshot is comming from the database', myDocResult);
            outputHeader.innerText = `Hot dog status: ${ myDocResult.hotDogStatus }`;
        }
    });
}

getRealtimeUpdates();