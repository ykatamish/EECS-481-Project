var audio_context,
recorder,
volume,
volumeLevel = 0,
currentEditedSoundIndex,
dialog;

function showDialog(){
    var elem = document.getElementById("record_button");
    if (elem.value=="Start Recording"){
        elem.value = "Stop Recording";
        recorder && recorder.record();
        console.log('Recording...');
    }
    else {
        elem.value = "Start Recording";
        recorder && recorder.stop();
        console.log('Stopped recording.');
        
        // create WAV download link using audio data blob
        createDownloadLink();
        
        recorder.clear();
    }
}
function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');
    
    volume = audio_context.createGain();
    volume.gain.value = volumeLevel;
    input.connect(volume);
    volume.connect(audio_context.destination);
    console.log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    console.log('Recorder initialised.');
}

function createDownloadLink() {
    currentEditedSoundIndex = -1;
    recorder && recorder.exportWAV(handleWAV.bind(this));
}

function handleWAV(blob) {
    var tableRef = document.getElementById('recordingslist');
    if (currentEditedSoundIndex !== -1) {
        $('#recordingslist tr:nth-child(' + (currentEditedSoundIndex + 1) + ')').remove();
    }
    
    var url = URL.createObjectURL(blob);
    var newRow   = tableRef.insertRow(currentEditedSoundIndex);
    newRow.className = 'soundBite';
    var audioElement = document.createElement('audio');
    var downloadAnchor = document.createElement('a');
    var editButton = document.createElement('button');
    
    audioElement.controls = true;
    audioElement.src = url;
    
    downloadAnchor.href = url;
    downloadAnchor.download = new Date().toISOString() + '.wav';
    downloadAnchor.innerHTML = 'Download';
    downloadAnchor.className = 'btn btn-primary';
    
    editButton.onclick = function(e) {
        $('.recorder.container').addClass('hide');
        $('.editor.container').removeClass('invisible');
        
        currentEditedSoundIndex = $(e.target).closest('tr').index();
        
        var f = new FileReader();
        f.onload = function(e) {
            audio_context.decodeAudioData(e.target.result, function(buffer) {
                                          console.warn(buffer);
                                          $('#audioLayerControl')[0].handleAudio(buffer);
                                          }, function(e) {
                                          console.warn(e);
                                          });
        };
        f.readAsArrayBuffer(blob);
    };
    editButton.innerHTML = 'Edit';
    editButton.className = 'btn btn-primary';
    
    var newCell = newRow.insertCell(-1);
    newCell.appendChild(audioElement);
    newCell = newRow.insertCell(-1);
    newCell.appendChild(downloadAnchor);
    newCell = newRow.insertCell(-1);
    newCell.appendChild(editButton);
    
    newCell = newRow.insertCell(-1);
    var toggler;
    for (var i = 0, l = 8; i < l; i++) {
        toggler = document.createElement('input');
        $(toggler).attr('type', 'checkbox');
        newCell.appendChild(toggler);
    }
}

window.onload = function init() {
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL;
        
        audio_context = new AudioContext();
        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        console.warn('No web audio support in this browser!');
    }
    
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
                           console.warn('No live audio input: ' + e);
                           });
};

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
    // document.getElementById("audioFile").src = URL.createObjectURL(this.files[0]);
    parseAudio(this.value);
}

//Parse audio with Python
function parseAudio(audioPath) {
    var pythonAPI = window.location.href + "api/v1/audioParse";
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        url: pythonAPI,
        data: JSON.stringify({ 
                "file": audioPath
            }),
        success: function(response) {
            console.log("AJAX Success.")
            console.log(response);
        },
        error: function(error){
            console.log("AJAX Error.");
            console.log(error);
        }
    });
}

function init() {
    clicker = document.querySelector('#record_button');
    clicker.addEventListener('click', showDialog, false);

    fileupload_input = document.querySelector('#fileUpload_input');
    fileupload_input.addEventListener('click', upload_input_click, false);
    fileupload_input.addEventListener('change', upload_input_change, false);
}
document.addEventListener('DOMContentLoaded', init);
