var dialog;


function showDialog(){
    var elem = document.getElementById("record_button");
    if (elem.value=="Start Recording") elem.value = "Stop Recording";
    else elem.value = "Start Recording";
}

//Navbar upload btn click
function upload_btn_click(){
    // document.querySelector('#upload_button').click();
    
}

//Upload input click. Btn is hidden
function upload_input_click(){
    document.getElementById("fileUpload_input").style.left = "1200px";
    console.log("clicked");
    console.log(this.value)
}

function init() {
    clicker = document.querySelector('#record_button');
    clicker.addEventListener('click', showDialog, false);

    upload = document.querySelector('#upload_button');
    upload.addEventListener('click', upload_btn_click, false);

    fileupload_input = document.querySelector('#fileUpload_input');
    fileupload_input.addEventListener('click', upload_input_click, false);
}
document.addEventListener('DOMContentLoaded', init);
