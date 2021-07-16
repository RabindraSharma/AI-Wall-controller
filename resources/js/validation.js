/*-----------------Scenario form validation message & Headers------*/

const ScenarioName ='Scenario Name Required'+'<sup> *</sup>';
const ScenarioLayout = 'Select at least one layouts'+'<sup> *</sup>';

const header = {
    "accept": "application/json",
    "Access-Control-Allow-Origin":"*",
    "Authorization" : "Basic " + window.btoa(sessionStorage.getItem('token')) 
  };
/*--- Close here Scenario & headers ----------*/
 
 
/*---------Intrusion Source Validation message --------------*/
const IntrusionNameError = 'Name Required'+'<sup> *</sup>';
const IntrusionUrlError = 'Url Required'+'<sup> *</sup>';
const IntrusionSpeedError = 'Speed Required'+'<sup> *</sup>';
const IntrusionFrameError = 'Frame Required'+'<sup> *</sup>';
const IntrusionPlaySoundError = 'Sound Required'+'<sup> *</sup>';


/*------Close Intrusion Source here ---------------*/


/*--------------Non Recurance Schedule --------------*/


/*--------------Non reccurence schedule closed here!-----------------*/

/*----------Slider Constat urls -------------------*/

const userUrls = 'https://localhost:8469/user';
const downloadUrls = 'https://localhost:8469/download';
const listdisplays = '/app/gui/users/displays/list';

const activeLayout ='https://172.0.1:8998/overlay/activelayout';