//file:///C:/Users/ctk/Desktop/index.html?name=ctk&class=0

//const { default: fetch } = require("node-fetch");

let app = new Vue({
    el: '#app',
    data: {

        showAffiliation : 0,
        chkHasExposure : false,
        chkTraveled : false,
        AskVax: false,
        payload : {
            name: "",
            class: "",
            onCampus: false,
            symptoms: [],
            hasExposure: false,
            hasTraveled: false,
            hasTested: false,
            dateTested: "",
            reasonTested: "",
            hasVacine: false,
            isFullVax: false
        },

        //ISOLATION OR QUARANTINE VARIABLES
        iqReason : "N/A",
        iqStartDate: "",
        iqEndDate: "",
        showBtnsIQ : false, 
        arrIorQ : [
            { text: "No" },
            { text: "Isolation" },
            { text: "Quarantine" }
        ],

        //ON CAMPUS VARIABLES
        rdoOnCampus : "",
        showBtnsOnCampus : false,
        arrOnCampusCriteria : [
            { text: "Working on campus" },
            { text: "Working remotely" },
            { text: "Sick and unable to work" },
            { text: "Not working but coming on campus (e.g., to check mail)" },
        ],

        //TEST RESULTS VARIABLES
        chkTested : false, 
        dateTested: "",
        showTestButtons : false,
        arrTestResults : [
            { text:  "Awaiting Results"},
            { text:  "Positive"},
            { text:  "Negative"},
            { text:  "I have not been tested"}
        ],

        //TEST REASON VARIABLES
        testReason : "N/A",
        showTestReasonButtons : false,
        arrTestReasons : [
            { text: "Screening"},
            { text: "Symptomatic" },
            { text: "Exposure" }
        ],

        //MAJOR SYMPTOMS VARIABLES
        symptomsMajor : [],
        showSymptoms1Buttons : false,
        arrSymptoms1st : [
            { text: "New cough"},
            { text: "Shortness of breath"},
            { text: "Fever(chills/sweating)"},
            { text: "Temperature greater than 100.3F"},
            { text: "None of these"}
        ],

        //MINOR SYMPTOMS VARIABLES
        symptomsMinor: [],
        showSymptoms2Buttons : false,
        arrSymptoms2nd : [
            { text: "Fatigue" },
            { text: "Diarrhea"},
            { text: "Headache" },
            { text: "Sore throat" },
            { text: "Nausea or vomiting" },
            { text: "Muscle or body aches" },
            { text: "Congestion or runny nose" },
            { text: "New loss of taste or smell" },
            { text: "None of these apply"},   
        ],

        //VACINE INFORMATION
        hasVacine : false,
        vaxYesMax: false,
        showVaxButtons : false,
        dateVacinated : "",

        //TESTING SCHEDULE ARRAY
        arrTestingSchedule : [
            { lastname : "A through C", onday : "Monday and Thursday", hours : "8:00 am - 12:30 pm"},
            { lastname : "D through K", onday : "Monday and Thursday", hours : "12:30 pm - 5:00 pm" },
            { lastname : "C through Q", onday : "Tuesday and Friday", hours : "8:00 am - 12:30 pm" },
            { lastname : "R through Z", onday : "Tuesday and Friday", hours : "12:30 pm - 5:00 pm" }
        ]

    },
    methods: {

        //CONSTRUCT THE REQUEST'S BODY OBJECT
        Payload_Summary : async function() {

            //GET PCR TEST ANSWER
            let testDate = "N/A";
            let arrTestDate = this.dateTested.split('-')
            if(arrTestDate[1] != null){
                testDate = `${arrTestDate[1]}-${arrTestDate[2]}-${arrTestDate[0]}`
            }

            //SET DEFAULT VALUES FOR THOSE PEOPLE WHOM ARE NOT ON CAMPUS (THEY BYPASS MOST OF THE SCREENS/OPTIONS)
            if(this.symptomsMajor.length === 0){ this.symptomsMajor = ["None of these"] }
            if(this.testResult === ""){ this.testResult = "I have not been tested" }
            if(this.chkTested == false){ 
                testDate = "N/A",
                this.testReason ="N/A"
            }
            //if(this.hasVacine == false){ this.dateVacinated = "N/A"}

            //CONSTRUCT THE REQUEST'S BODY OBJECT
            this.payload.name = parameters["name"],
            this.payload.class = parameters["class"],
            this.payload.onCampus = this.rdoOnCampus,
            this.payload.symptoms = this.symptomsMajor,
            this.payload.hasExposure = this.chkHasExposure,
            this.payload.hasTraveled = this.chkTraveled,
            this.payload.hasTested = this.chkTested,
            this.payload.dateTested = testDate,
            this.payload.reasonTested = this.testReason,
            this.payload.hasVacine = this.hasVacine,
            this.payload.dateVacinated = this.dateVacinated,
            this.payload.isFullVax = this.vaxYesMax
            

            showAffiliation = parameters["class"]

        },

        Submit_Form : async function(){

            showAffiliation = parameters["class"]
            
            console.log("payload=", payload);
            
            //CREATE THE REQUEST'S OPTIONS OBJECT
            const options = {
                method: "POST",
                body: JSON.stringify(this.payload),
                headers: {
                    "Content-Type": "application/json"
                }
            }

            //SEND REQUEST OBJECT TO THE "SUBMIT" FUNCTION IN THE API                
            fetch("/api/Submit", options)
                .catch(err => console.log("Error: ", err))

            //GET RECOMMENDATION FOR PERSON
            this.Get_Recommendation(options);
        },

        //GET RECOMMENDATION FOR PERSON
        Get_Recommendation: async function(options){
            //Advise_Person({redFlag: 0});
            
            await fetch("/api/Get_Recommendation", options)
                .then( resp => resp.json() )
                .then( data => Advise_Person(data) )
                .catch( err => console.log("ERR: Get_Recommendation:", err) )
        },

        //ISOLATED OR QUARENTINED
        IQ_Submit: async function(){

            let arrStart = this.iqStartDate.split('-')
            let iqStart = `${arrStart[1]}-${arrStart[2]}-${arrStart[0]}`

            let arrEnd = this.iqEndDate.split('-')
            let iqEnd = `${arrEnd[1]}-${arrEnd[2]}-${arrEnd[0]}`

            let iqAlert = {
                name: parameters["name"],
                IQ: this.iqReason,
                startDate: iqStart,
                endDate: iqEnd
            }

            //CREATE THE REQUEST'S OPTIONS OBJECT
            const iqOptions = {
                method: "POST",
                body: JSON.stringify(iqAlert),
                headers: {
                    "Content-Type": "application/json"
                }
            }

            fetch("/api/Send_IsolationOrQuarentineInfo", iqOptions)
                .catch(err => console.log("Error: ", err))
        }

    }
})

let parameters = {}
window.location.search.replace("?","").split("&").forEach(parameter => {
    let param = parameter.split("=");
    parameters[param[0]] = param[1];
});

let NAME = parameters["name"];
if( !(isBlank(NAME)) ){ document.getElementById("paraName").value = NAME };
let CLASS = parameters["class"];
if(!(!CLASS)){ document.getElementById("paraRelation").value = CLASS };

if(CLASS === "0"){document.getElementById("spanID").textContent = "Name" };

const sections = document.getElementsByTagName("section");
sections[0].style.visibility = "visible";


function Check_Greeting(){
    
    if( !(isBlank(NAME)) ){ 
        //document.getElementById("divParaName").style.visibility = "visible";
        NAME = document.getElementById("paraName").value;
    }
    
    if( !(isBlank(CLASS)) ){ 
        //document.getElementById("divParaRelation").style.visibility = "visible";
        CLASS = document.getElementById("paraRelation").value;
    }

    //if( isBlank(NAME) || isBlank(CLASS) ){
    if( !( isBlank(NAME) && isBlank(CLASS) ) ){
        document.getElementById("btnGreetingContinue").style.visibility = "collapse";
    } else {
        //document.getElementById("divParaName").style.visibility = "collapse";
        //document.getElementById("divParaRelation").style.visibility = "collapse";
        document.getElementById("btnGreetingContinue").style.visibility = "visible";
    }
    
    console.log("boo 1");
}


function Check_Staff(screen){
    if(CLASS === "0" || CLASS === "2"){
        Continue_Button(screen, false);
    } else {
        Continue_Button(screen, true);
    }
}


function isBlank(str){
    //return( !(str || str.trim().length === 0 || str !== '') );
    return !str; // && str === "")
}


function Continue_Button(section, skip){
    sections[section].style.visibility = "collapse";

    if(skip){
        sections[section].nextElementSibling.nextElementSibling.style.visibility = "visible";
    } else {
        sections[section].nextElementSibling.style.visibility = "visible";
    };
}


function Back_Button(section){
    sections[section].style.visibility = "collapse";
    sections[section].previousElementSibling.style.visibility = "visible";
}


function Skip_Back_To(from, to){
    sections[from].style.visibility = "collapse";
    sections[to].style.visibility = "visible";
}


//DETERMINE WHICH SCREEN, "GREEN" OR "RED" TO DISPLAY TO USER
function Advise_Person(data){
    sections["screenThinking"].style.visibility = "collapse";

    //document.getElementById('showFlag').innerText = data.redFlag;   //tracking bug section

    if(data.redFlag > 1 ){
        sections["screenRed"].style.visibility = "visible";
    } else {
         sections["screenGreen"].style.visibility = "visible";
    }
}

Check_Greeting();
