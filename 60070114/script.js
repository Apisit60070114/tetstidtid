const auth = firebase.auth();
// open nav bar
function myFunction(x) {
  x.classList.toggle("change");
}


// popup addsubject
$(window).on('load', function () {
  $(".trigger_popup").click(function () {
    $('.hover_popup').show();
  });
  $('.popupCloseButton').click(function () {
    $('.hover_popup').hide();
  });
});

// popup user
$(window).on('load', function () {
  $(".trigger_user").click(function () {
    $('.hover_user').show();
  });
  $('.humbergerCloseButton').click(function () {
    $('.hover_user').hide();
  });
});





auth.onAuthStateChanged(function (user) {
  var nowUid = auth.currentUser.uid;
  console.log(nowUid);
  if (user) {
    // User is signed in.
    firestore
      .collection('users') // from collection users
      .doc(user.uid) // doc of current user by get user ID (uid)
      .get()
      .then(function (docs) {
        // set user as data that collect from firebase
        var user = docs.data();

        var firstname_id = user.firstname;
        var lastname_id = user.lastname;
        var email_id = user.email;
        var titlename = user.titlename;
        document.getElementById("userinfo").innerHTML = "Welcome User : <br/>" + titlename + " " + firstname_id + " " + lastname_id;
        document.getElementById("useremail").innerHTML = email_id;
      }).catch(() => {})
  }
});


function logout() {
  firebase.auth().signOut();
}


//add class


function addClass() {
  var nowUid = auth.currentUser.uid;
  var classID = document.getElementById("classID").value;
  var className = document.getElementById("className").value;
  var studyYear = document.getElementById("studyYear").value;
  var semester = document.getElementById("semester").value;
  var section = document.getElementById("section").value;
  var studyDay = document.getElementById("studyDay").value;
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;
  var description = document.getElementById("description").value;

  firestore
    .collection('classes')
    .add({
      uid: nowUid,
      classID: classID, //รอหน้าฟิวเสร็จจะได้เอาข้อมูลมาใส่ตั้งแต่ตรงนี้
      className: className,
      year: studyYear,
      semester: semester,
      section: section,
      studyDay: studyDay,
      startTime: startTime,
      endTime: endTime,
      description: description,
      students: []

    })

  alert('Add Class!')
}

// to Mareena อันนี้คือที่เรียกแต่ละปีออกมา
function getSelectYear() {
  var yearSel = document.getElementById("year").value;
  var nowUid = auth.currentUser.uid;

  firestore.collection("classes").where("year", "==", yearSel).where("uid" ,"==", nowUid).get().then(function (snapshot) {
    console.log(snapshot.docs.length);
    let subjects = {}
    snapshot.forEach(function (docs) {
      subjects[docs.id] = docs.data();
    })
    renderCard(subjects)
  });
}


function renderCard(subjects) {
  let classCard = document.getElementById('classCard');
  classCard.innerHTML = "";

  for (subject in subjects) {
    let newLi = document.createElement("li");
    newLi.setAttribute("id", "Course");
    newLi.setAttribute("class", "object_course");

    newLi.innerHTML = `
                        <div class="setcourse" onclick="location.href='./Course/course.html?cid=${subject}';" style="cursor: pointer;">
                            <div class="course-top">
                                <div id="subjectid">${subjects[subject].classID}</div>
                            </div>
                            <div class="course-middle">
                                <div id="subjectname"><a>${subjects[subject].className}</a></div>
                            </div>
                            <div class="course-down">
                            ${subjects[subject].studyDay} ${subjects[subject].startTime}-${subjects[subject].endTime}
                            </div>
                        </div>
    `

    classCard.appendChild(newLi)

  }


}