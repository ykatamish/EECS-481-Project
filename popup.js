var dialog;


function showDialog(){

    var elem = document.getElementById("record_button");
    if (elem.value=="Start Recording") elem.value = "Stop Recording";
    else elem.value = "Start Recording";
}    
function init() {
    clicker = document.querySelector('#record_button');
    
    clicker.addEventListener('click', showDialog, false);
}    
document.addEventListener('DOMContentLoaded', init);