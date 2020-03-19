window.addEventListener("DOMContentLoaded", event => {
    console.log("DOM fully loaded and parsed");
  
  
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        var uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                const main = document.getElementById('main');
                main.innerHTML=`<div class="container">
                <div class="welcome">
                    <h1 class="greeting">Welcome</h1>
                    <div><img src="${authResult.user.photoURL}" /></div>
                    <div id="userInfo">${authResult.user.displayName}</div>
                </div>
                <div class="logout">
                    <button class="login-page" onlick="LoginPage">Logout</button>
                </div>
            </div>`
              
                  return false;
              },
              uiShown: function() {
                document.getElementById('loader').style.display = 'none';
              }
            },
            signInFlow: 'popup',
           
            signInOptions: [
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              firebase.auth.TwitterAuthProvider.PROVIDER_ID,
              firebase.auth.GithubAuthProvider.PROVIDER_ID
                         ],
            tosUrl: '<your-tos-url>',
            privacyPolicyUrl: '<your-privacy-policy-url>'
          };
    ui.start('#firebaseui-auth-container', uiConfig);
    
  });