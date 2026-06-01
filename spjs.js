        //localstorage

    function saveData() {

  localStorage.setItem(
    "subjects",
    document.getElementById("subjectList").innerHTML
  );

  localStorage.setItem(
    "assignments",
    document.getElementById("assignmentList").innerHTML
  );

  localStorage.setItem(
    "goals",
    document.getElementById("goalList").innerHTML
  );

  localStorage.setItem(
    "timetable",
    JSON.stringify(timetableData)
  );

  localStorage.setItem(
  "attendanceData",
  JSON.stringify(attendanceData)
);

localStorage.setItem(
  "attendanceHistory",
  JSON.stringify(attendanceHistory)
);

  localStorage.setItem(
    "completedTasks",
    completedTasks
  );

  localStorage.setItem(
    "totalTasks",
    totalTasks
  );
  localStorage.setItem(
    "exams",
    document.getElementById("examList").innerHTML
  );
}

function loadData() {

  let subjects =
  localStorage.getItem("subjects");

  if(subjects){
    document.getElementById("subjectList").innerHTML =
    subjects;
  }

  let subjectItems =
document.querySelectorAll("#subjectList li span");

subjectItems.forEach(subject => {

  let option =
  document.createElement("option");

  option.text =
  subject.textContent;

  document
  .getElementById("tableSubject")
  .add(option);

});

let exams =
localStorage.getItem("exams");  

if(exams){
  document.getElementById("examList").innerHTML = exams;
}   

updateCounts();

  let assignments =
  localStorage.getItem("assignments");

  if(assignments){
    document.getElementById("assignmentList").innerHTML =
    assignments;
  }

  let goals =
  localStorage.getItem("goals");

  if(goals){
    document.getElementById("goalList").innerHTML =
    goals;
  }

  let timetable =
  localStorage.getItem("timetable");

  if(timetable){
  timetableData = JSON.parse(timetable);
  renderTimetable();
}


  completedTasks =
  Number(
    localStorage.getItem("completedTasks")
  ) || 0;

  totalTasks =
  Number(
    localStorage.getItem("totalTasks")
  ) || 0;

  updateCounts();
  updateProgress();
  updateAlerts();
  renderAttendance();

}

    let completedTasks = 0;
    let totalTasks = 0;

    let attendanceData =
JSON.parse(
localStorage.getItem("attendanceData")
) || {};

    // SCROLL

    function scrollToSection(id){

      document
      .getElementById(id)
      .scrollIntoView({
        behavior:'smooth'
      });

    }

    // UPDATE PROGRESS

    function updateProgress(){

      let percentage = 0;

      if(totalTasks > 0){

        percentage =
        Math.round(
          (completedTasks / totalTasks) * 100
        );

      }

      document
      .getElementById("progressBar")
      .style.width = percentage + "%";

      document
      .getElementById("progressText")
      .textContent =
      percentage + "% Completed";

      document
      .getElementById("dashboardProgress")
      .textContent =
      percentage + "%";

    }

    // UPDATE COUNTS

    function updateCounts(){

      document.getElementById("subjectCount")
      .textContent =
      document.querySelectorAll("#subjectList li").length;

      document.getElementById("examCount")
      .textContent = 
      document.querySelectorAll("#examList li").length;

      document.getElementById("assignmentCount")
      .textContent =
      document.querySelectorAll("#assignmentList li").length;

      document.getElementById("goalCount")
      .textContent =
      document.querySelectorAll("#goalList li").length;

    }

    // ADD SUBJECT

    function addSubject(){

      let input =
      document.getElementById("subjectInput");

      let value =
      input.value.trim();

      if(value === ""){
        alert("Enter Subject");
        return;
      }

      let li =
      document.createElement("li");

      li.innerHTML = `

        <span>${value}</span>

        <div class="btn-group">

          <button
            class="edit-btn"
            onclick="editItem(this)">
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteItem(this)">
            Delete
          </button>

        </div>

      `;

      document
      .getElementById("subjectList")
      .appendChild(li);

      // ADD TO TIMETABLE DROPDOWN

      let option =
      document.createElement("option");

      option.text = value;
      attendanceData[value] = {
  attended:0,
  total:0
};

      document
      .getElementById("tableSubject")
      .add(option);

      input.value = "";

      updateCounts();
renderAttendance();
updateAlerts();
saveData();
    }

    // ADD TIMETABLE

 let timetableData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
};

function addTimetable(){

  let subject =
  document.getElementById("tableSubject").value;

  let day =
  document.getElementById("dayInput").value;

  let time =
  document.getElementById("timeInput").value;

  if(subject === "" || day === "" || time === ""){
    alert("Please Fill All Fields");
    return;
  }

  timetableData[day].push({
    subject: subject,
    time: time
  });

  renderTimetable();
  renderAttendance();
  saveData();

  document.getElementById("timeInput").value = "";
}

function renderTimetable(){

  let tbody =
  document.getElementById("timetableBody");

  tbody.innerHTML = "";

  for(let day in timetableData){

    let lectures =
    timetableData[day];

    if(lectures.length === 0)
      continue;

    lectures.forEach((lecture,index)=>{

      let row =
      document.createElement("tr");

      if(index === 0){

        row.innerHTML = `
          <td rowspan="${lectures.length}">
            ${day}
          </td>

          <td>${lecture.subject}</td>

          <td>${lecture.time}</td>

          <td>

  <button
  class="edit-btn"
  onclick="editLecture('${day}',${index})">
  Edit
  </button>

  <button
  class="delete-btn"
  onclick="deleteLecture('${day}',${index})">
  Delete
  </button>

</td>
        `;
      }
      else{

        row.innerHTML = `
          <td>${lecture.subject}</td>

          <td>${lecture.time}</td>

          <td>

  <button
  class="edit-btn"
  onclick="editLecture('${day}',${index})">
  Edit
  </button>

  <button
  class="delete-btn"
  onclick="deleteLecture('${day}',${index})">
  Delete
  </button>

</td>
        `;
      }

      tbody.appendChild(row);

    });

  }

}

function deleteLecture(day,index){

  let lecture =
  timetableData[day][index];

  let subject =
  lecture.subject;

  timetableData[day].splice(index,1);

  if(attendanceData[subject]){

    if(attendanceData[subject].total > 0){

      attendanceData[subject].total--;

      if(
        attendanceData[subject].attended >
        attendanceData[subject].total
      ){
        attendanceData[subject].attended =
        attendanceData[subject].total;
      }

    }

  }

  renderTimetable();
  renderAttendance();
  updateAlerts();
  saveData();

}
function editLecture(day,index){

  let lecture =
  timetableData[day][index];

  let newSubject =
  prompt(
    "Edit Subject",
    lecture.subject
  );

  if(newSubject === null)
    return;

  let newTime =
  prompt(
    "Edit Time",
    lecture.time
  );

  if(newTime === null)
    return;

  timetableData[day][index].subject =
  newSubject;

  timetableData[day][index].time =
  newTime;

  renderTimetable();
  renderAttendance();
  saveData();
}

//ATTENDANCE
function renderAttendance(){

  let todayLectures =
  document.getElementById("todayLectures");

  let attendanceList =
  document.getElementById("attendanceList");

  todayLectures.innerHTML = "";
  attendanceList.innerHTML = "";

  let today =
  new Date().toLocaleDateString(
    "en-US",
    { weekday:"long" }
  );

  if(timetableData[today]){

    timetableData[today].forEach(lecture=>{

      let div =
      document.createElement("div");

     let date =
new Date().toISOString().split("T")[0];

let key =
lecture.subject +
"-" +
lecture.time +
"-" +
date;

if(attendanceHistory[key] !== undefined){

  div.innerHTML = `
  <p>
  ${lecture.subject}
  (${lecture.time})

  ${
    attendanceHistory[key]
    ? "✅ Present"
    : "❌ Absent"
  }
  </p>
  `;
}
else{

  div.innerHTML = `
  <p>
  ${lecture.subject}
  (${lecture.time})

  <button
  class="complete-btn"
  onclick="markAttendance(
  '${lecture.subject}',
  '${lecture.time}',
  true
  )">
  Present
  </button>

  <button
  class="delete-btn"
  onclick="markAttendance(
  '${lecture.subject}',
  '${lecture.time}',
  false
  )">
  Absent
  </button>
  </p>
  `;
}
      todayLectures.appendChild(div);

    });

  }

  if(todayLectures.innerHTML === ""){
  todayLectures.innerHTML = `
    <p>🎉 No lectures scheduled today.</p>
  `;
}


  let totalAttended = 0;
  let totalLectures = 0;

  for(let subject in attendanceData){

    let attended =
    attendanceData[subject].attended;

    let total =
    attendanceData[subject].total;

    totalAttended += attended;
    totalLectures += total;

    let percentage =
    total === 0
    ? 0
    : Math.round(
        attended/total*100
      );

      let li = document.createElement("li");

li.innerHTML = `
<span>

${subject}
<br>

${attended}/${total} lectures

<br>

Attendance:
${percentage}%

<br>

${
percentage < 75
? "⚠ Below 75%"
: "✅ Safe"
}

</span>

<div class="btn-group">

<button
class="delete-btn"
onclick="resetAttendance('${subject}')">
Reset
</button>

</div>
`;

attendanceList.appendChild(li);
  }
  let overall =
  totalLectures === 0
  ? 0
  : Math.round(
      totalAttended /
      totalLectures *
      100
    );

  document.getElementById(
    "overallAttendance"
  ).textContent =
  overall + "%";
}

function markAttendance(subject,time,present){

  let today =
  new Date().toISOString().split("T")[0];

  let key =
  subject + "-" + time + "-" + today;

  if(attendanceHistory[key] !== undefined){
    alert("Attendance already marked.");
    return;
  }

  attendanceHistory[key] = present;

 if(!attendanceData[subject]){
  attendanceData[subject] = {
    attended: 0,
    total: 0
  };
}

attendanceData[subject].total++;

if(present){
  attendanceData[subject].attended++;
}

  saveData();
  renderAttendance();
  updateAlerts();
}
function resetAttendance(subject){

  if(!confirm(
    "Reset attendance for " + subject + " ?"
  )){
    return;
  }

  attendanceData[subject] = {
    attended:0,
    total:0
  };

  for(let key in attendanceHistory){

    if(key.startsWith(subject + "-")){
      delete attendanceHistory[key];
    }

  }

  saveData();
  renderAttendance();
  updateAlerts();
}

let attendanceHistory =
JSON.parse(
localStorage.getItem("attendanceHistory")
) || {};

// ADD EXAM 
function addExam(){

  let subject =
  document.getElementById("examSubject").value;

  let date =
  document.getElementById("examDate").value;

  if(subject === "" || date === ""){
    alert("Please Fill All Fields");
    return;
  }

  let li =
  document.createElement("li");

 let today = new Date();
today.setHours(0,0,0,0);

let examDate = new Date(date);
examDate.setHours(0,0,0,0);

let daysLeft = Math.ceil(
  (examDate - today) /
  (1000 * 60 * 60 * 24)
);
  li.innerHTML = `

  <span>
    ${subject}
    <br>
    Exam Date: ${date}
    <br>
    ⏳ ${daysLeft} Days Left
  </span>

  <div class="btn-group">

    <button
      class="edit-btn"
      onclick="editItem(this)">
      Edit
    </button>

    <button
      class="delete-btn"
      onclick="deleteItem(this)">
      Delete
    </button>

  </div>

`;
  document
  .getElementById("examList")
  .appendChild(li);

  document.getElementById("examSubject").value = "";
  document.getElementById("examDate").value = "";

  updateCounts();
  updateAlerts();
  saveData();

}

//add assignment
    function addAssignment(){

      let input =
      document.getElementById("assignmentInput");

      let value =
      input.value.trim();

      if(value === ""){
        alert("Enter Assignment");
        return;
      }

      totalTasks++;

      let li =
      document.createElement("li");

      li.innerHTML = `

        <span>${value}</span>

        <div class="btn-group">

          <button
            class="complete-btn"
            onclick="completeTask(this)">
            Pending
          </button>

          <button
            class="edit-btn"
            onclick="editItem(this)">
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteItem(this)">
            Delete
          </button>

        </div>

      `;

      document
      .getElementById("assignmentList")
      .appendChild(li);

      input.value = "";

      updateCounts();
      updateProgress();
      updateAlerts();
      saveData();

    }

    
    // ADD GOAL

    function addGoal(){
      

      let goal =
      document.getElementById("goalInput").value;

      let type =
      document.getElementById("goalType").value;

      if(goal === ""){
        alert("Enter Goal");
        return;
      }

      totalTasks++;

      let li =
      document.createElement("li");

      li.innerHTML = `

        <span>
          ${goal} (${type})
        </span>

        <div class="btn-group">

          <button
            class="complete-btn"
            onclick="completeTask(this)">
            Pending
          </button>

          <button
            class="edit-btn"
            onclick="editItem(this)">
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteItem(this)">
            Delete
          </button>

        </div>

      `;
      

      document
      .getElementById("goalList")
      .appendChild(li);

      document.getElementById("goalInput").value = "";

      updateCounts();
      updateProgress();
      updateAlerts();
      saveData();

    }

    //ALERTS
    function updateAlerts(){

  let alertBox =
  document.getElementById("alertBox");

  alertBox.innerHTML = "";

  // Exams

  document
  .querySelectorAll("#examList li span")
  .forEach(exam=>{

    let text =
    exam.textContent;

    let alert =
    document.createElement("div");

    alert.className =
    "alert-item alert-danger";

    alert.innerHTML =
    "🎓 Upcoming Exam:<br>" + text;

    alertBox.appendChild(alert);

  }
);
  

  // Assignments

  document
  .querySelectorAll("#assignmentList li")
  .forEach(item=>{

    let status =
    item.querySelector(".complete-btn");

    if(status &&
      status.textContent.trim() === "Pending"){

      let task =
      item.querySelector("span")
      .textContent;

      let alert =
      document.createElement("div");

      alert.className =
      "alert-item";

      alert.innerHTML =
      "📝 Pending Assignment: " + task;

      alertBox.appendChild(alert);

    }

  });
  
 // Goals
  document
.querySelectorAll("#goalList li")
.forEach(item=>{

  let status =
  item.querySelector(".complete-btn");


  if(status &&
    status.textContent.trim() === "Pending"){

    let goal =
    item.querySelector("span")
    .textContent;

    let alert =
    document.createElement("div");

    alert.className =
    "alert-item";

    alert.innerHTML =
    "🎯 Pending Goal: " + goal;

    alertBox.appendChild(alert);

  }

});

// Attendance Alerts

let totalAttended = 0;
let totalLectures = 0;

for(let subject in attendanceData){

  let attended =
  attendanceData[subject].attended;

  let total =
  attendanceData[subject].total;

  totalAttended += attended;
  totalLectures += total;

  if(total === 0){
  continue;
}

let percentage =
Math.round((attended / total) * 100);

  if(percentage < 75){

    let alert =
    document.createElement("div");

    alert.className =
    "alert-item alert-danger";

    alert.innerHTML =
    `📊 ${subject} Attendance is only ${percentage}%`;

    alertBox.appendChild(alert);

  }

}

// Overall Attendance Alert

let overallAttendance =
totalLectures === 0
? 100
: Math.round(
    (totalAttended / totalLectures) * 100
  );

if(overallAttendance < 75){

  let alert =
  document.createElement("div");

  alert.className =
  "alert-item alert-danger";

  alert.innerHTML =
  `🚨 Overall Attendance is only ${overallAttendance}%`;

  alertBox.appendChild(alert);

}

if(alertBox.children.length === 0){

    alertBox.innerHTML = `
      <div class="alert-item alert-success">
        ✅ No Alerts & reminders !!
      </div>
    `;
  }
}

    // COMPLETE TASK

    function completeTask(button){

      if(button.textContent.trim() === "Pending"){

        button.textContent = "Completed";

        completedTasks++;

      }
      else{

        button.textContent = "Pending";

        completedTasks--;

      }

      updateProgress();
      updateAlerts();
      saveData();

    }

    // EDIT

    function editItem(button){

  if(button.closest("#subjectList")){
    alert("Editing subject names is disabled.");
    return;
  }

  let span =
  button.parentElement.previousElementSibling;

  let newValue =
  prompt(
    "Edit Item",
    span.textContent
  );

  if(newValue !== null && newValue !== ""){
    span.textContent = newValue;
    saveData();
    updateCounts();
    updateAlerts();
  }
}


    // DELETE

function deleteItem(button){

  let li =
  button.parentElement.parentElement;

  let completeBtn =
  li.querySelector(".complete-btn");

  if(completeBtn){

    totalTasks--;

    if(completeBtn.textContent.trim() === "Completed"){
      completedTasks--;
    }

  }

 if(li.parentElement.id === "subjectList"){

  let subjectName =
  li.querySelector("span")?.textContent.trim();

  delete attendanceData[subjectName];

  for(let day in timetableData){

  timetableData[day] =
  timetableData[day].filter(
    lecture =>
    lecture.subject !== subjectName
  );

}

  for(let key in attendanceHistory){

    if(key.startsWith(subjectName + "-")){
      delete attendanceHistory[key];
    }

  }



let options =
document.querySelectorAll(
  "#tableSubject option"
);

options.forEach(option => {

  if(option.text === subjectName){
    option.remove();
  }

});

 }

  li.remove();

  updateCounts();
  updateProgress();
  updateAlerts();
  renderTimetable();
renderAttendance();
  saveData();

}

document.addEventListener(
  "DOMContentLoaded",
  function(){
    loadData();
  }
);

function toggleSidebar(){

  document
    .getElementById("sidebar")
    .classList
    .toggle("active");

}