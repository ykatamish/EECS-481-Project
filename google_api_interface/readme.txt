NOTE: this requires python 2.7

Download the sdk file for the website: https://cloud.google.com/sdk/

Depending on your brower, you might need to unzip the file.

After unzipping the file, run:
$./install.sh
in the file that was just unzipped.

After that, run the command:
$gcloud init

It will ask you a series of questions, for the first one, type in:
n
for the second one, type in:
Y
for the last one, simply press enter (i.e leave it blank)

You will need to restart your shell in order to have gcloud installed.
$gcloud init

It will ask you to log in, press 
Y
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
You will be asked to authorize the account one more time



