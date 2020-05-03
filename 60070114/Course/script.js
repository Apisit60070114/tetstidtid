const auth = firebase.auth();
let cid = getParameterByName('cid')
console.log("cid is ", cid)
auth.onAuthStateChanged(function (user) {
  var nowUid = auth.currentUser.uid;
  console.log("now uid is ", nowUid);
});
// สร้างชื่อวิชา
firestore
  .collection('classes') // from collection users
  .doc(cid) // doc of current user by get user ID (uid)
  .get()
  .then(function (docs) {
    // set user as data that collect from firebase
    var classes = docs.data();
    //To mareena ดึงข้อมูลตรงนี้จะเอาอะไรเพิ่มเขียน class.{ชื่อข้อมูลที่จะเอาในไฟร์เบส}
    var classID = classes.classID;
    var className = classes.className;
    var endTime = classes.endTime;
    var startTime = classes.startTime;
    var studyDay = classes.studyDay;



    document.getElementById("subject").innerHTML = className;
    document.getElementById("subjectid").innerHTML = classID;
    document.getElementById("description").innerHTML = studyDay + " " + startTime + "-" + endTime;
  }).catch(() => {})

// popup addstudent
$(window).on('load', function () {
  $(".trigger_popup").click(function () {
    $('.hover_popup').show();
  });
  $('.popupCloseButton').click(function () {
    $('.hover_popup').hide();
  });
});


// delete subject
$(window).on('load', function () {
  $(".trigger_subject").click(function () {
    $('.hover_subject').show();
  });
  $('.subjectCloseButton').click(function () {
    $('.hover_subject').hide();
  });
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



// เรียกข้อมูลใน classes
firestore.collection("classes").doc(cid).get().then(function (docs) {
  if (docs.exists) {
    console.log(docs.data());
  } else {
    console.log("No data");
  }
})


// เรียกข้อมูลใน attendance
let timeStamp = new Date()
let date = timeStamp.toDateString()
let aid = ""
let attens = {}

firestore.collection("attendance").where("cid", "==", cid).get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      aid = doc.id
      attens[aid] = doc.data();



    });

    renderAttenDay(attens) //แสดง card วันที่
  })
  .catch(function (error) {
    console.log("Error getting documents: ", error);
  });


function renderAttenDay(attens) {
  let dayCard = document.getElementById('dayCard');
  dayCard.innerHTML = "";

  for (atten in attens) {
    let newDiv = document.createElement("div");
    newDiv.setAttribute("id", "attBox");
    newDiv.setAttribute("class", "date");

    newDiv.innerHTML = `
                    <a onclick="showAttenHistory('${atten}')" style="cursor:pointer">
                        <div class="time">
                            <div>
                                <div class="month">${new Date(attens[atten].date).toLocaleString('default', { month: 'long' })}</div>
                                <div class="day">${new Date(attens[atten].date).getDate()}</div>
                                <div class="year">${new Date(attens[atten].date).getFullYear()}</div>
                            </div>
                        </div>
                    </a>
    `
    dayCard.appendChild(newDiv)
  }

}



function showAttenHistory(aid) {
  console.log("selected aid is ", aid)
  let students = {}

  // to Mareena ดีงค่ากลับมาอยู่นี่

  firestore.collection('classes').doc(cid).collection("students").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var StudentID = doc.id // StudentID คือรหัสนศ
      var StudentFirstname = doc.data().firstName // StudentFirstname คือ ชื่อจริง
      var StudentLastname = doc.data().lastName // StudentLastname คือ นามสกุล
      students[StudentID] = doc.data();
    });

    renderAttenHistory(aid, students)

  });


  function renderAttenHistory(aid, students) {

    let studentCard = document.getElementById('studentCard');
    studentCard.innerHTML = "";

    for (student in students) {

      renderStudentRow(aid, studentCard, student, students[student])

    }
  }

  function renderStudentRow(aid, studentCard, sid, student) {
    let newTr = document.createElement("tr");
    let status = 'missed'

    firestore.collection("attendance").doc(aid).collection("students").doc(sid).get()
      .then(function (doc) {
        if (doc.exists) {
          status = doc.data().status
        } else {
          firestore
            .collection('attendance')
            .doc(aid)
            .collection('students')
            .doc(sid)
            .set({
              status: "missed",
              timeStamp: timeStamp.toISOString()
            }).then(() => {
              console.log(student, 'added')
            }).catch(function (error) {
              console.error("Error set student's status:", error);
            })
        }

        let onTime = document.createElement("td");
        let late = document.createElement("td");
        let absent = document.createElement("td");
        let missed = document.createElement("td");

        onTime.innerHTML = `
    <input onclick="setStudentStatus('${aid}', '${sid}', 'onTime')" type="radio" name="status${sid}" class="css_data_item" value="onTime"><span class="checkmark ontime"></span>
    `
        late.innerHTML = `
    <input onclick="setStudentStatus('${aid}','${sid}', 'late')" type="radio" name="status${sid}" class="css_data_item" value="late"><span class="checkmark late"></span>
    `
        absent.innerHTML = `
    <input onclick="setStudentStatus('${aid}','${sid}', 'absent')" type="radio" name="status${sid}" class="css_data_item" value="absent"><span class="checkmark absent"></span>
    `
        missed.innerHTML = `
    <input onclick="setStudentStatus('${aid}','${sid}', 'missed')" type="radio" name="status${sid}" class="css_data_item" value="missed"><span class="checkmark missed"></span>
    `

        onTime.getElementsByClassName('css_data_item')[0].checked = status == 'onTime' ? true : false;
        late.getElementsByClassName('css_data_item')[0].checked = status == 'late' ? true : false;
        absent.getElementsByClassName('css_data_item')[0].checked = status == 'absent' ? true : false;
        missed.getElementsByClassName('css_data_item')[0].checked = status == 'missed' ? true : false;


        newTr.innerHTML = `
    <td>
        <div id="studentid">${sid}</div>
        <div id="name">${student.firstName} ${student.lastName}</div>
    </td>
    `
        newTr.appendChild(onTime)
        newTr.appendChild(late)
        newTr.appendChild(absent)
        newTr.appendChild(missed)

        studentCard.appendChild(newTr)

      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

  }
}



function setStudentStatus(aid, sid, status) {
  firestore
    .collection('attendance')
    .doc(aid)
    .collection('students')
    .doc(sid)
    .set({
      status: status,
      timeStamp: new Date().toISOString()
    }).then(() => {
      console.log('set status to', status)
    }).catch(function (error) {
      console.error("Error set student's status:", error);
    })

}

// import Excel

var ExcelToJSON = function () {
  this.parseExcel = function (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[
          sheetName]);
        var json_object = JSON.stringify(XL_row_object);

        let result = JSON.parse(json_object);

        collectData(result)
      })
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  // console.log(files[0])
  var xl2json = new ExcelToJSON();
  xl2json.parseExcel(files[0]);
}

function collectData(data) {

  var x = 0
  for (student of data) {
    // sid คือ รหัสนศ
    let sid = student.id;
    // firstName คือ ชื่อจริง
    let firstName = student.firstName;
    // lastName คือนามสกุล
    let lastName = student.lastName;

    // To Jame  ส่งข้อมูลไป firestore ทำตรงนี้
    firestore
      .collection('classes')
      .doc(cid)
      .collection('students')
      .doc(data[x].id)
      .set({
        firstName: data[x].firstName,
        lastName: data[x].lastName
      })

    x += 1
  }
}

// ps. file Excel ต้องมีชื่อ column ตามใน file ตัวอย่าง (students.xlsx) ที่แนบไป

document.getElementById('upload').addEventListener('change', handleFileSelect, false);

function deleteSubject() {
  firestore.collection("classes").doc(cid).delete().then(function () {

    alert("Delete Completed")
    window.location.href = "../index.html";

  })
}

function addOneStudent() {
  var studentid = document.getElementById("stuid_form").value;
  var studentname = document.getElementById("name_form").value;
  var studentsurname = document.getElementById("surname_form").value;

  firestore
    .collection('classes')
    .doc(cid)
    .collection('students')
    .doc(studentid)
    .set({
      firstName: studentname,
      lastName: studentsurname
    })

  alert('Add student completed')
}


// Export Excel

function testExport() {

  let attendance = {}

  firestore.collection('attendance').where("cid", "==", cid).get().then(function (snapshot) {
    snapshot.forEach(function (docs) {
      let attenID = docs.id
      let data = docs.data()
      let cur_attendance = {
        uid: data.uid,
        date: data.date,
        cid: data.cid,
        students: {}
      }
      firestore.collection('attendance').doc(attenID).collection('students').get().then(function (snapshot) {
        snapshot.forEach(function (docs) {
          var stuID = docs.id
          cur_attendance.students[stuID] = docs.data()
        })
      });
      attendance[attenID] = cur_attendance
    })
  }).then(function () {

    console.log(attendance)

  });

}



// firestore.collection('attendance').doc(aid).collection("students").get().then(function (querySnapshot) {
//   querySnapshot.forEach(function (doc) {
//     var StudentID = doc.id // StudentID คือรหัสนศ
//     students[StudentID] = doc.data();
//     console.log(doc.id)
//     console.log(students[StudentID])
//   });
//   // runExport(students)
// });

// });


function runExport(students) {

  let cleanData = []

  console.log(attens)

  for (const sid in students) {
    let studentList = {}
    studentList['id'] = sid

    for (const dayCheck in attens) {
      let self = attens[dayCheck]

      // if (self) {
      //   studentList[dayCheck.date] = self.status
      // } else {
      //   studentList[dayCheck.date] = 'missed'
      // }
    }

    cleanData.push(studentList)

    // test
    firestore.collection('classes').doc(cid).collection("students").doc(sid).get().then(function (doc) {
      var StudentFirstname = doc.data().firstName // StudentFirstname คือ ชื่อจริง
      var StudentLastname = doc.data().lastName // StudentLastname คือ นามสกุล
      console.log("test -> ", StudentFirstname, StudentLastname)
    });

    // cleanData.push()

  }

}