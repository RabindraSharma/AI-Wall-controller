/*--------------- Add User Form -----------------*/

const usernameError = 'User Name should not be blank!'+'<sup> *</sup>';
const passwordError = 'password should not be blank!'+'<sup> *</sup>';

const adminError = 'Sorry!,Please use other usename expect admin';

const header = {
    "accept": "application/json",
    "Access-Control-Allow-Origin":"*",
    "Authorization" : "Basic " + window.btoa(sessionStorage.getItem('token')) 
  };

 /* ----------- Add Role Form -----------------*/
 
 const roleError = 'This field is required'+'<sup> *</sup>';


 /* ------------ Map User & role Form -----------------*/

 const userError = 'User Name Required'+'<sup>*</sup>';
 const mapRoleError = 'Role Name Required'+'<sup>*</sup>';

 /* ------------- Map Role to source ---------------*/

 const mapRoleNameError = 'Role Name Required'+'<sup> *</sup>';
 const mapSourceNameError ='Source Name Required'+'<sup> *</sup>';

 /* ----------- Mapped Display zone form ------------*/

 const mappeddispRoleError = 'Role Name Required'+'<sup> *</sup>';
 const mappedToZoneError = 'Display Zone Required'+'<sup> *</sup>';

 
