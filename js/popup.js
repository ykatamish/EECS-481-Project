var dialog;


function showDialog(){
    var elem = document.getElementById("record_button");
    if (elem.value=="Start Recording") elem.value = "Stop Recording";
    else elem.value = "Start Recording";
}

//Navbar upload btn click
function upload_btn_click(){
    
}

function init() {
    clicker = document.querySelector('#record_button');
    clicker.addEventListener('click', showDialog, false);

    upload = document.querySelector('#upload_button');
    upload.addEventListener('click', upload_btn_click, false);
}
document.addEventListener('DOMContentLoaded', init);
