
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD_WCCXTyDVEl6Es99yuzPvIT_3y74Zczg",
    authDomain: "f-todo-app.firebaseapp.com",
    databaseURL: "https://f-todo-app.firebaseio.com",
    projectId: "f-todo-app",
    storageBucket: "f-todo-app.appspot.com",
    messagingSenderId: "214777349161"
  };
  firebase.initializeApp(config);
  const db = firebase.firestore();
  db.settings({ timestampsInSnapshots: true });

const todoList = document.querySelector('#todo-list');
const form = document.querySelector('#add-todo-form');

//RENDERING

function renderTodos(doc){
  let li = document.createElement('li');
  let activity = document.createElement('span');
  let category = document.createElement('span');
  let cross = document.createElement('div');

li.setAttribute('data-id', doc.id);
activity.textContent = doc.data().activity;
category.textContent = doc.data().category;
cross.textContent = 'x';

li.appendChild(activity);
li.appendChild(category);
li.appendChild(cross);

todoList.appendChild(li);

//DELETING FROM THE DATABASE
cross.addEventListener('click', (e) => {
  e.stopPropagation();
  let id = e.target.parentElement.getAttribute('data-id');
  db.collection('todo').doc(id).delete();
})


//MARKES TO-DOS THAT ARE CLICKED
li.addEventListener('click', () => {
let circle = document.querySelector('li .fa');
li.className = ' special';
li.className += ' marked';
})

}

/*
//REPLACED BY THE REAL-TIME METHOD
//Getting Data
db.collection('todo').get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    console.log(doc.data());
  })
})*/


//SAVING TO THE DATABASE
form.addEventListener('submit', (e) => {
  e.preventDefault();

  db.collection('todo').add({
    activity: form.activity.value,
    category: form.category.value
  });

  form.activity.value = '';
  form.category.value = '';
})


//REAL-TIME METHOD
db.collection('todo').orderBy('activity').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if(change.type == 'added'){
      renderTodos(change.doc);
    }else if(change.type == 'removed'){
      let li = todoList.querySelector('[data-id=' + change.doc.id + ']');
      todoList.removeChild(li);
    }
  })
})



//UPDATING
db.collection('todo').doc('ex9gPw1dxKrbXnN2O2hL').update({
    activity: 'Go to the gym',
    category: 'Fitness'
  });
