window.addEventListener("DOMContentLoaded", event => {
    console.log("DOM fully loaded and parsed");
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        var uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                  return true;
              },
              uiShown: function() {
                document.getElementById('loader').style.display = 'none';
              }
            },
            signInFlow: 'popup',
            signInSuccessUrl: 'myLitterBox.html',
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

  //Code for auth flow
  firebase.auth().onAuthStateChanged(function(user) {
    const signInButton = document.getElementById('sign-in');
    if (user) {
      // User is signed in.
      if(signInButton){
        signInButton.innerHTML = 'Sign Out';
        signInButton.addEventListener('click', function(){
          firebase.auth().signOut().then(() =>{
              this.innerHTML = 'Sign In'
          })
        })
      }
      // Once this fires it means we have successfully found a user and we should be on our myLitterBox.html page now.
      //We will target the container inside of our dashboard using this line.
      var dashboardContainer = document.getElementById('myLitterBox');
      if (dashboardContainer) {
        // If we made it here we are both on the correct HTML paged and we found the container that is inside of our dashboard.html
        var userHTML = `<h1>Hello, ${user.displayName}</h1>
                <p>Welcome to your litter box!</p>
        `
        dashboardContainer.innerHTML = userHTML;
      }
    } else {
      // No user is signed in. So we add an event listener to the sign in button to open our sign in modal.
      if(signInButton){
        signInButton.addEventListener('click', function(event){
          const modal = document.getElementById('modal');
          modal.style.display = 'flex'
        })
      }
    }




  // Code to open & close sign in Modal in HOMEPAGE.
  const modal = document.getElementById('modal');
  if(modal){
    modal.addEventListener('click', function(event){
      if(event.target == modal || document.getElementById('close')){
        modal.style.display = 'none'
      }
    })
  }
  });