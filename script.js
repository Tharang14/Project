/* ==========================================
   DEFAULT QUESTIONS
========================================== */

let defaultQuestions = [
    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        optionA: "var",
        optionB: "int",
        optionC: "define",
        optionD: "variable",
        answer: "A"
    },

    {
        question: "Which symbol is used for a single-line comment?",
        optionA: "//",
        optionB: "/* */",
        optionC: "#",
        optionD: "<!-- -->",
        answer: "A"
    },

    {
        question: "Which method converts JSON text into a JavaScript object?",
        optionA: "JSON.stringify()",
        optionB: "JSON.parse()",
        optionC: "JSON.convert()",
        optionD: "JSON.object()",
        answer: "B"
    },

    {
        question: "Which keyword creates a block-scoped variable?",
        optionA: "var",
        optionB: "let",
        optionC: "define",
        optionD: "variable",
        answer: "B"
    },

    {
        question: "Which operator is used for strict equality?",
        optionA: "=",
        optionB: "==",
        optionC: "===",
        optionD: "!=",
        answer: "C"
    }
];


/* ==========================================
   INITIALIZE LOCAL STORAGE
========================================== */

if (localStorage.getItem("questions") === null) {

    localStorage.setItem(
        "questions",
        JSON.stringify(defaultQuestions)
    );
}

if (localStorage.getItem("students") === null) {

    localStorage.setItem(
        "students",
        JSON.stringify([])
    );
}

if (localStorage.getItem("results") === null) {

    localStorage.setItem(
        "results",
        JSON.stringify([])
    );
}


/* ==========================================
   STUDENT SIGNUP
========================================== */

let signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = document.getElementById("signupName").value;
        let email = document.getElementById("signupEmail").value;
        let password = document.getElementById("signupPassword").value;

        let students =
            JSON.parse(localStorage.getItem("students")) || [];

        let existingStudent = students.find(
            student => student.email === email
        );

        if (existingStudent) {

            alert("Email already registered!");

            return;
        }

        let newStudent = {
            name: name,
            email: email,
            password: password
        };

        students.push(newStudent);

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        alert("Signup successful!");

        window.location.href = "login.html";
    });
}


/* ==========================================
   STUDENT LOGIN
========================================== */

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email =
            document.getElementById("loginEmail").value;

        let password =
            document.getElementById("loginPassword").value;

        let students =
            JSON.parse(localStorage.getItem("students")) || [];

        let student = students.find(
            s => s.email === email &&
                 s.password === password
        );

        if (student) {

            localStorage.setItem(
                "loggedInStudent",
                JSON.stringify(student)
            );

            alert("Login successful!");

            window.location.href = "student.html";

        } else {

            alert("Invalid email or password!");
        }
    });
}


/* ==========================================
   STUDENT DASHBOARD
========================================== */

let welcomeStudent =
    document.getElementById("welcomeStudent");

if (welcomeStudent) {

    let student =
        JSON.parse(localStorage.getItem("loggedInStudent"));

    if (!student) {

        window.location.href = "login.html";

    } else {

        welcomeStudent.innerText =
            "Welcome " + student.name;
    }
}


/* ==========================================
   START EXAM
========================================== */

function startExam() {

    window.location.href = "exam.html";
}


/* ==========================================
   LOAD EXAM QUESTIONS
========================================== */

let questionsContainer =
    document.getElementById("questionsContainer");

if (questionsContainer) {

    let questions =
        JSON.parse(localStorage.getItem("questions")) || [];

    let student =
        JSON.parse(localStorage.getItem("loggedInStudent"));

    if (!student) {

        window.location.href = "login.html";

    } else {

        document.getElementById("studentName").innerText =
            "Student: " + student.name;
    }

    questionsContainer.innerHTML = "";

    questions.forEach(function(question, index) {

        let questionHTML = `

            <div class="question">

                <h3>
                    ${index + 1}. ${question.question}
                </h3>

                <label>
                    <input type="radio"
                           name="question${index}"
                           value="A">
                    A. ${question.optionA}
                </label>

                <label>
                    <input type="radio"
                           name="question${index}"
                           value="B">
                    B. ${question.optionB}
                </label>

                <label>
                    <input type="radio"
                           name="question${index}"
                           value="C">
                    C. ${question.optionC}
                </label>

                <label>
                    <input type="radio"
                           name="question${index}"
                           value="D">
                    D. ${question.optionD}
                </label>

            </div>

        `;

        questionsContainer.innerHTML += questionHTML;

    });
}


/* ==========================================
   SUBMIT EXAM
========================================== */

let examForm =
    document.getElementById("examForm");

if (examForm) {

    examForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let questions =
            JSON.parse(localStorage.getItem("questions")) || [];

        let student =
            JSON.parse(localStorage.getItem("loggedInStudent"));

        let score = 0;

        questions.forEach(function(question, index) {

            let selectedAnswer =
                document.querySelector(
                    `input[name="question${index}"]:checked`
                );

            if (selectedAnswer) {

                if (selectedAnswer.value === question.answer) {

                    score++;
                }
            }

        });

        let results =
            JSON.parse(localStorage.getItem("results")) || [];

        let newResult = {

            studentName: student.name,

            studentEmail: student.email,

            score: score,

            total: questions.length,

            date: new Date().toLocaleString()
        };

        results.push(newResult);

        localStorage.setItem(
            "results",
            JSON.stringify(results)
        );

        alert("Exam submitted successfully!");

        window.location.href = "result.html";
    });
}


/* ==========================================
   VIEW STUDENT RESULT
========================================== */

function viewResult() {

    window.location.href = "result.html";
}


/* ==========================================
   LOAD RESULT
========================================== */

let resultStudent =
    document.getElementById("resultStudent");

if (resultStudent) {

    let student =
        JSON.parse(localStorage.getItem("loggedInStudent"));

    if (!student) {

        window.location.href = "login.html";

    } else {

        let results =
            JSON.parse(localStorage.getItem("results")) || [];

        let studentResults =
            results.filter(
                result =>
                    result.studentEmail === student.email
            );

        if (studentResults.length === 0) {

            resultStudent.innerText =
                student.name;

            document.getElementById("resultScore")
                .innerText = "No exam attempted";

            document.getElementById("resultTotal")
                .innerText = "-";

            document.getElementById("resultPercentage")
                .innerText = "-";

        } else {

            let latestResult =
                studentResults[studentResults.length - 1];

            let percentage =
                (latestResult.score /
                latestResult.total) * 100;

            resultStudent.innerText =
                "Student: " + student.name;

            document.getElementById("resultScore")
                .innerText = latestResult.score;

            document.getElementById("resultTotal")
                .innerText = latestResult.total;

            document.getElementById("resultPercentage")
                .innerText = percentage.toFixed(2);
        }
    }
}


/* ==========================================
   BACK TO DASHBOARD
========================================== */

function goDashboard() {

    window.location.href = "student.html";
}


/* ==========================================
   STUDENT LOGOUT
========================================== */

function studentLogout() {

    localStorage.removeItem("loggedInStudent");

    window.location.href = "index.html";
}


/* ==========================================
   ADMIN LOGIN
========================================== */

let adminLoginForm =
    document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let username =
            document.getElementById("adminUsername").value;

        let password =
            document.getElementById("adminPassword").value;

        if (
            username === "admin" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            alert("Admin login successful!");

            showAdminDashboard();

        } else {

            alert("Invalid admin username or password!");
        }
    });
}


/* ==========================================
   SHOW ADMIN DASHBOARD
========================================== */

function showAdminDashboard() {

    let loginSection =
        document.getElementById("adminLoginSection");

    let dashboard =
        document.getElementById("adminDashboard");

    if (loginSection && dashboard) {

        loginSection.style.display = "none";

        dashboard.style.display = "block";

        displayAdminQuestions();

        displayAdminResults();
    }
}


/* ==========================================
   CHECK ADMIN LOGIN
========================================== */

if (
    document.getElementById("adminDashboard") &&
    localStorage.getItem("adminLoggedIn") === "true"
) {

    showAdminDashboard();
}


/* ==========================================
   ADD QUESTION
========================================== */

let questionForm =
    document.getElementById("questionForm");

if (questionForm) {

    questionForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let question =
            document.getElementById("questionText").value;

        let optionA =
            document.getElementById("optionA").value;

        let optionB =
            document.getElementById("optionB").value;

        let optionC =
            document.getElementById("optionC").value;

        let optionD =
            document.getElementById("optionD").value;

        let answer =
            document.getElementById("correctAnswer").value;

        let questions =
            JSON.parse(localStorage.getItem("questions")) || [];

        questions.push({

            question: question,

            optionA: optionA,

            optionB: optionB,

            optionC: optionC,

            optionD: optionD,

            answer: answer

        });

        localStorage.setItem(
            "questions",
            JSON.stringify(questions)
        );

        alert("Question added successfully!");

        questionForm.reset();

        displayAdminQuestions();
    });
}


/* ==========================================
   DISPLAY ADMIN QUESTIONS
========================================== */

function displayAdminQuestions() {

    let adminQuestions =
        document.getElementById("adminQuestions");

    if (!adminQuestions) {
        return;
    }

    let questions =
        JSON.parse(localStorage.getItem("questions")) || [];

    adminQuestions.innerHTML = "";

    questions.forEach(function(question, index) {

        adminQuestions.innerHTML += `

            <div class="admin-question">

                <h3>
                    ${index + 1}. ${question.question}
                </h3>

                <p>A. ${question.optionA}</p>

                <p>B. ${question.optionB}</p>

                <p>C. ${question.optionC}</p>

                <p>D. ${question.optionD}</p>

                <p>
                    <b>Correct Answer:</b>
                    ${question.answer}
                </p>

            </div>

        `;
    });
}


/* ==========================================
   DISPLAY ADMIN RESULTS
========================================== */

function displayAdminResults() {

    let adminResults =
        document.getElementById("adminResults");

    if (!adminResults) {
        return;
    }

    let results =
        JSON.parse(localStorage.getItem("results")) || [];

    adminResults.innerHTML = "";

    if (results.length === 0) {

        adminResults.innerHTML =
            "<p>No student results available.</p>";

        return;
    }

    results.forEach(function(result) {

        let percentage =
            (result.score / result.total) * 100;

        adminResults.innerHTML += `

            <div class="admin-result">

                <p>
                    <b>Student:</b>
                    ${result.studentName}
                </p>

                <p>
                    <b>Email:</b>
                    ${result.studentEmail}
                </p>

                <p>
                    <b>Score:</b>
                    ${result.score} / ${result.total}
                </p>

                <p>
                    <b>Percentage:</b>
                    ${percentage.toFixed(2)}%
                </p>

                <p>
                    <b>Date:</b>
                    ${result.date}
                </p>

            </div>

        `;
    });
}


/* ==========================================
   ADMIN LOGOUT
========================================== */

function adminLogout() {

    localStorage.removeItem("adminLoggedIn");

    window.location.reload();
}