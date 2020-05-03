function mockupClick(pageToHide, pageToShow, colorToHide, colorToShow) {
    document.querySelector('#' + pageToHide).style.display = "none";
    document.querySelector('#' + pageToShow).style.display = "block";
    document.querySelector('.' + colorToHide).style.display = "none";
    document.querySelector('.' + colorToShow).style.display = "block";
  }

const auth = firebase.auth();
const idList = document.querySelector('#id-list')
// call firestore
const firestore = firebase.firestore()

const settings = {
  /* your settings... */
  timestampsInSnapshots: true
};
firestore.settings(settings);

auth.onAuthStateChanged(function (user) {

});

function signUp() {
  var titlename = document.getElementById("titlename").value;
  var firstname = document.getElementById("firstname").value;
  var lastname = document.getElementById("lastname").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
    let newUser = authUser.user


    // set new user data
    firestore
      .collection('users') // to collection users
      .doc(newUser.uid) // in doc user ID (uid)
      .set({
        email: email,
        titlename: titlename,
        firstname: firstname,
        lastname: lastname,
      })
    // firestore
    //   .collection('classes')
    //   .add({
    //     classID: 0, ,pa
    //     classNameEN: "",
    //     classNameTH: "",
    //     year: 0,
    //     semester: 0,
    //     studyDay: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")), ตัวอย่างวัน
    //     startTime: "",
    //     endTime: "",
    //   }) สร้างตอนเพิ่ม class
    // firestore
    //   .collection('students')
    //   .add({
    //     firstName: "",
    //     lastName: ""
    //   }) สร้่างตอนเพิ่มนศ.
    // firestore
    //   .collection('attendance')
    //   .add({
    //     uid : newUser.uid,
    //     date: "",
    //     startTime: "",
    //     endTime: ""
    //   })  สร้างตอนกดเช็คชื่อ
    // firestore
    //   .collection('attendance')
    //   .doc(aid) สร้างเป็นตัวแปรเก็บไว้แล้วค่อยเอามาใส่
    //   .collection('students')
    //   .set({
    //     timeStamp: "",
    //     status: ""
    //   }) สร้างตอนแสกนเชคชื่อ
      .then(() => {
        alert('created!')
      }).catch((e) => {
        console.log(e)
      })

  }).catch(function (error) {
    // Handle Errors here.
    console.log(error.code, error.message)
    // ...
  });
}



function login() {

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(){

    alert("log in success")
    window.location.href = "../index.html";


  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
    } else {
      alert(errorMessage);
    }
    console.log(error);

  });


}


function addStudent() {
      firestore
      .collection('students')
      .add({
        firstName: "",
        lastName: ""
      })
}

function addSubject() {
  var nowUid = auth.currentUser.uid;
  firestore
      .collection('classes')
      .add({
        uid: nowUid,
        classID: 0, 
        classNameEN: "",
        classNameTH: "",
        year: 0,
        semester: 0,
        studyDay: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")), //ตัวอย่างวัน
        startTime: "",
        endTime: "",
        students: []
      })
}
