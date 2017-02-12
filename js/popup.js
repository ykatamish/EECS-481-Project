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

//Upload input click
function upload_input_click(){
    // Clears file picker value
    this.value = null;
}
//Upload input value change
function upload_input_change(){
    document.getElementById("audioFile").src = URL.createObjectURL(this.files[0]);
    console.log(document.getElementById("audioFile").duration);
    
}

function init() {
    clicker = document.querySelector('#record_button');
    clicker.addEventListener('click', showDialog, false);

    upload = document.querySelector('#upload_button');
    upload.addEventListener('click', upload_btn_click, false);

    fileupload_input = document.querySelector('#fileUpload_input');
    fileupload_input.addEventListener('click', upload_input_click, false);
    fileupload_input.addEventListener('change', upload_input_change, false);
}
document.addEventListener('DOMContentLoaded', init);
