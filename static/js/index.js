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
    // console.log('Media stream created.');
    
    volume = audio_context.createGain();
    volume.gain.value = volumeLevel;
    input.connect(volume);
    volume.connect(audio_context.destination);
    // console.log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    // console.log('Recorder initialised.');
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
    for (var i = 0, l = parseInt(localStorage.recentHistorySetting); i < l; i++) {
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
        // console.log('Audio context set up.');
        // console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        console.warn('No web audio support in this browser!');
    }
    
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
                           console.warn('No live audio input: ' + e);
                           });
};

//Upload input value change
function upload_input_change(){
    formdata = new FormData();
    formdata.append("upload", this.files[0]);
    parseAudio(formdata);
    $(this).val("");
}

//Parse audio with Python
function parseAudio(audioFile) {
    openLoading();
    console.log("Start AJAX");
    var pythonAPI = window.location.href + "api/v1/uploadParse";
    $.ajax({
        type: "POST",
        url: pythonAPI,
        data: audioFile,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("AJAX Success.")
            console.log(response);
            insert_row(response);
            closeLoading();
        },
        error: function(error){
            console.log("AJAX Error.");
            console.log(error);
            closeLoading();
        }
    });
}

//Parse audio with Python
function recordAudio() {
    openLoading();

    document.getElementById("recordingTimer_p").style.visibility = "visible";
    document.getElementById("recordingTimer_p").style.display = "block";

    document.getElementById("loadingText_p").style.visibility = "hidden";
    document.getElementById("loadingText_p").style.display = "none";

    setInterval(function(){
        document.getElementById("recordingTimer_p").style.visibility = "hidden";
        document.getElementById("recordingTimer_p").style.display = "none";

        document.getElementById("loadingText_p").style.visibility = "visible";
        document.getElementById("loadingText_p").style.display = "block";
    }, 10000);

    var pythonAPI = window.location.href + "api/v1/audioRecord";
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=UTF-8",
        url: pythonAPI,
        success: function(response) {
            console.log("AJAX Success.")
            console.log(response);
            insert_row(response);
            closeLoading();
        },
        error: function(error){
            console.log("AJAX Error.");
            console.log(error);
            closeLoading();
        }
    });
}

function insert_row(text_input) {
	// Find a <table> element with id="myTable":
	var table = document.getElementById("recentTable");
    // Create ID for row
    var rowID = 1;
    if (table.rows.length - 1 > 0){
        var prevID = table.childNodes[3].childNodes[0].id;
        rowID = parseInt(prevID.substr(prevID.indexOf('_')+1)) + 1;
    }

    $("<tr></tr>").prependTo("table > tbody");
	// Modify recent row
	var row = table.childNodes[3].childNodes[0];
    row.id = "rowItem_" + rowID;
	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    // Hidden cell containing transcript text
    var cell5 = row.insertCell(4);
    cell5.className = "hidden";
    cell5.innerHTML = text_input;
    cell5.id = "transcriptCellItem_" + rowID;


	// Add some text to the new cells:
    var today = new Date();
    var dd  = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
	cell1.innerHTML = mm + '/' + dd + '/' + yyyy;
    cell1.style = 'font-size: 20px; font-weight: bold'
	cell2.innerHTML = '<input type="text" id="titleInputItem_' + rowID + '" value="EECS 481 L' + rowID + '"onfocusout="update_localStorage('+rowID+')" style="font-size: 20px; font-weight: bold"/>'
    // "EECS 481 L" + rowID;
    cell2.id = "titleCellItem_" + rowID;
    cell2.className = "cellTitle";
    // Cell btn and onclick ID to pass into download_func(row_num)
    
	cell3.innerHTML = '<button type="button" class="btn btn-block btn-primary" aria-label="Left Align" onclick="download_func(' + rowID + ')"><span class="glyphicon glyphicon-download" aria-hidden="true"></span></a>';
    cell4.innerHTML = '<div class="text-center"><button type="button" class="btn btn-warning" aria-label="Left Align" onclick="openTRWarning(' + rowID + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div> ';

    // Max table size set at LocalSettings. (TODO: Fix ids. Will indefinitely increase...)
    if (table.rows.length - 1 > parseInt(localStorage.recentHistorySetting)){
        table.deleteRow(table.rows.length - 1);
    }

    // Localstorage. Store  
    localStorage.setItem("tableData", table.innerHTML);
}

// Update local storage after a title edit is made
function update_localStorage(item_id) {

    // Update HTML cell value
    document.getElementById("titleCellItem_"+item_id).value
    var cell2 = document.getElementById("titleCellItem_"+item_id)
    cell2.innerHTML = '<input type="text" id="titleInputItem_' + item_id + '" value="' + document.getElementById("titleInputItem_"+item_id).value + '"onfocusout="update_localStorage(' + item_id + ')"/>'
    
    // Push to local storage
    var table = document.getElementById("recentTable");
    localStorage.setItem("tableData", table.innerHTML);
}

// Delete a specific table row. Warns user and updates local storage
function delete_row(item_id){
    var deleteIndex = $("tr").index($("#rowItem_" + $(this).val()));
    var table = document.getElementById("recentTable");
    table.deleteRow(deleteIndex);

     // Push to local storage
    localStorage.setItem("tableData", table.innerHTML);

    closeTRWarning();
}

// Erase table contents
function eraseTable() {
    var table = document.getElementById("recentTable");
    while (table.rows.length > 1){
        table.deleteRow(table.rows.length - 1);
    }
    localStorage.clear();
    closeAlert();
}

// Open history alert to clear table
function openAlert() {
    // console.log($("#settingsTableCount").val());
    document.getElementById("deleteHistory_alert").style.visibility = "visible";
    document.getElementById("deleteHistory_alert").style.display = "block";
}

// Open history alert to clear table
function closeAlert() {
    document.getElementById("deleteHistory_alert").style.visibility = "hidden";
    document.getElementById("deleteHistory_alert").style.display = "none";
}


// Open modal history alert to clear table
function openModalWarning() {
    // console.log($("#settingsTableCount").val());
    document.getElementById("reduceHistory_alert").style.visibility = "visible";
    document.getElementById("reduceHistory_alert").style.display = "block";
}

// Open modal history alert to clear table
function closeModalWarning() {
    document.getElementById("reduceHistory_alert").style.visibility = "hidden";
    document.getElementById("reduceHistory_alert").style.display = "none";
}

// Open alert to clear table
function openLoading() {
    document.getElementById("ajaxloading_alert").style.visibility = "visible";
    document.getElementById("ajaxloading_alert").style.display = "block";
}

// Open alert to clear table
function closeLoading() {
    document.getElementById("ajaxloading_alert").style.visibility = "hidden";
    document.getElementById("ajaxloading_alert").style.display = "none";
}

// Open alert to clear table
function openTRWarning(rowID) {
    document.getElementById("deleteTR_alert").style.visibility = "visible";
    document.getElementById("deleteTR_alert").style.display = "block";
    $("#eraseTR").val(rowID);
}

// Open alert to clear table
function closeTRWarning() {
    document.getElementById("deleteTR_alert").style.visibility = "hidden";
    document.getElementById("deleteTR_alert").style.display = "none";
}

function download_func(row_num) {
    var content = document.getElementById("transcriptCellItem_" + row_num).innerHTML;
    var title = (document.getElementById("titleInputItem_" + row_num).value).replace(/ /g,"_");
  	// Export as .txt
    if ($("#option1").is(':checked')){
        var dl = document.createElement('a');
        // File of title is Cell Title with underscores instead of spaces. TODO: Regex to remove all illegal characters
        dl.setAttribute('download', title + ".txt");
        dl.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content));
        dl.click();
    }
    // Export as .docx
    else if ($("#option2").is(':checked')){
        var converted = htmlDocx.asBlob(content);
        saveAs(converted, title + '.docx');
    }
    // Export as .pdf
    else if ($("#option3").is(':checked')){
        // Export as PDF using jsPDF. Splits text into array based on page width before exporting
        // to allow for text wrapping.
        var doc = new jsPDF();
        var pdfText = [$("#titleInputItem_" + row_num).val(), ""];
        var content = doc.splitTextToSize(content, 200);
        for (var i = 0; i < content.length; i++)
            pdfText.push(content[i]);
        doc.text(10, 10, pdfText);
        doc.save(title + ".pdf");
    }
};



// Modifies maximum allowed rows in primary table
function changeTableSize(){
    localStorage.setItem("recentHistorySetting", $("#settingsTableCount").val());
    closeModalWarning();
    var table = document.getElementById("recentTable");
    while (table.rows.length - 1 > parseInt(localStorage.recentHistorySetting)){
        table.deleteRow(table.rows.length - 1);
    }
    localStorage.setItem("tableData", table.innerHTML);
}

// Hashing function
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


// Sets a cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Get cookie by string
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function init() {
    // Saves export settings
   $("input[name=options]:radio").change(function () {
        localStorage.setItem("exportSetting", this.id);
    });

     // Saves recent history settings
   $("#settingsTableCount").change(function () {
        if ($("#settingsTableCount")[0].checkValidity()){
            if (parseInt(localStorage.recentHistorySetting) > $("#settingsTableCount").val())
                openModalWarning()
            else
                localStorage.setItem("recentHistorySetting", $("#settingsTableCount").val());
        }
        else{
            $("#settingsTableCount").val(8);
            localStorage.setItem("recentHistorySetting", $("#settingsTableCount").val());
        }    
    });

    clicker = document.querySelector('#record_button');
    clicker.addEventListener('click', recordAudio, false);

    fileupload_input = document.querySelector('#fileUpload_input');
    fileupload_input.addEventListener('change', upload_input_change, false);

    ERASETABLE = document.querySelector('#eraseTable');
    ERASETABLE.addEventListener('click', eraseTable, false);

    deleteTR = document.querySelector('#eraseTR');
    deleteTR.addEventListener('click', delete_row, false);
    endTRAlert1 = document.querySelector('#x_tr_cancel');
    endTRAlert1.addEventListener('click', closeTRWarning, false);
    endTRAlert2 = document.querySelector('#TRCancel_btn');
    endTRAlert2.addEventListener('click', closeTRWarning, false);

    startAlert = document.querySelector('#clear_button');
    startAlert.addEventListener('click', openAlert, false);

    endAlert1 = document.querySelector('#historyCancel_btn');
    endAlert1.addEventListener('click', closeAlert, false);
    endAlert2 = document.querySelector('#x_cancel');
    endAlert2.addEventListener('click', closeAlert, false);

    DECREASETABLE = document.querySelector('#proceedTable');
    DECREASETABLE.addEventListener('click', changeTableSize, false);
    endAlert1 = document.querySelector('#table_cancel');
    endAlert1.addEventListener('click', closeModalWarning, false);
    endAlert2 = document.querySelector('#x_cancel_modal');
    endAlert2.addEventListener('click', closeModalWarning, false);

    if (typeof(Storage) !== "undefined") {
        if (localStorage.length > 0){
            $("#recentTable").html(localStorage.tableData); 
            // Restore export setting
            if (localStorage.getItem("exportSetting") !== null)
                $("#"+localStorage.exportSetting + "_label").button('toggle');
            else
                $("#option1_label").button('toggle');
            // Recent history table setting
            if (localStorage.getItem("recentHistorySetting") !== null)
                $("#settingsTableCount").val(parseInt(localStorage.recentHistorySetting));
            else{
                $("#settingsTableCount").val(8);
                localStorage.setItem("recentHistorySetting", 8);
            }
                
        }  
    } else {
        console.log("Sorry! No Web Storage support...");
    }

    var aboutModal = (window.location.href.hashCode()).toString();
    if (getCookie(aboutModal) == ""){
        $('#aboutModal').modal('toggle');
        setCookie(aboutModal, "true", 1000)
    }
}
document.addEventListener('DOMContentLoaded', init);