NOTE: this requires python 2.7, pip

Download the sdk file for the website: https://cloud.google.com/sdk/

Depending on your brower, you might need to unzip the file.

Run all of the below commands while in the Python/Flask virtual environment.

After unzipping the file, run:
$./install.sh
in the file that was just unzipped.

After that, run the command:
$gcloud init

It will ask you a series of questions, for the first one, type in:
Do you want to help improve the Google Cloud SDK?
n
for the second one, type in:
Modify profile to update your $PATH and enable shell command completion?
Y
for the last one, simply press enter (i.e leave it blank)
Enter a path to an rc file to update, or leave blank to use 
[/Users/.../.bash_profile]:

You will need to restart your shell in order to have gcloud installed.
$gcloud init

It will ask you to log in, press Y
You must log in to continue. Would you like to log in (Y/n)?  

It will redirect you to a google login page on your default browser, the credentials are:
email: brad.481.project@gmail.com
password: brad_chesney
after that, you will need to authorize the account.

You will then move outside of the directory:
$cd ..
and then run this command:
$gcloud beta auth application-default login
Press 
Y
You will be asked to authorize the account one more time.

You will need to install the python google cloud libraries, which are:
$pip install --upgrade google-cloud-speech
$pip install --upgrade google-cloud-storage

Commands may require sudo:
$sudo -H pip install --ignore-installed six  --upgrade google-cloud-speech
$sudo -H pip install --ignore-installed six  --upgrade google-cloud-storage

If, while trying to run the above commands, you receive and error similar to
" MARKER_EXPR = originalTextFor(MARKER_EXPR())("marker")
TypeError: __call__() takes exactly 2 arguments (1 given)"

try running the command 

$pip install setuptools==33.1.1


You will also need to install SoX and then drag the executible into the same folder as the python code. The link to download is: https://sourceforge.net/projects/sox/files/sox/



You will need to export the credentials: (put in the path in the correct area)
export GOOGLE_APPLICATION_CREDENTIALS=[PUT IN THE PATH HERE]credentials_key.json


If, while running the application, you get an error similar to
Undefined error: 'Module_six_moves_urllib_parse' object has no attribute 'urlencode'

run the command
$export PYTHONPATH=/Library/Python/2.7/site-packages

You'll need to add that line to you ~/.bashrc file to ensure it's set for each terminal window.
Which you can do by running the command
$nano ~/.bashrc

now copy and paste 
PYTHONPATH=/Library/Python/2.7/site-packages
and save the file




