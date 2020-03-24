window.addEventListener("DOMContentLoaded", event => {
  console.log("DOM fully loaded and parsed");

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        const main = document.getElementById("main");
        main.innerHTML = `<div class="container">
                <div class="welcome">
                    <h1 class="greeting">Welcome</h1>
                    <div><img src="${authResult.user.photoURL}" /></div>
                    <div id="userInfo">${authResult.user.displayName}</div>
                </div>
                <div class="logout">
                    <button class="login-page" onlick="LoginPage">Logout</button>
                </div>
            </div>`;

        return false;
      },
      uiShown: function() {
        document.getElementById("loader").style.display = "none";
      }
    },
    signInFlow: "popup",

    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    tosUrl: "<your-tos-url>",
    privacyPolicyUrl: "<your-privacy-policy-url>"
  };
  ui.start("#firebaseui-auth-container", uiConfig);
});

//this calls the change function when the page is loaded, so there's an image and text.
document.addEventListener("DOMContentLoaded", change());

//random number generator to pull from the cat facts API array
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//this runs when the button is clicked
document.getElementById("generate").addEventListener("click", change);

//the change function stores an image from one API and a cat fact from another into an array (response)
//it also renders the HTML
function change() {
  console.log(this);
  // var generateButton = document.getElementById('generate');
  this.innerHTML = "Here kitty kitty...";
  var settings = {
    headers: {
      "x-rapidapi-host": "brianiswu-cat-facts-v1.p.rapidapi.com",
      "x-rapidapi-key": "ab8f11c763msh6e47770ac1769d9p1b47e5jsn785c37c09dbc"
    }
  };
  Promise.all([
    axios.get("https://api.thecatapi.com/v1/images/search"),
    axios.get("https://brianiswu-cat-facts-v1.p.rapidapi.com/facts", settings)
  ]).then(response => {
    console.log(response);
    var catImgUrl = response[0].data[0].url;
    var index = randomNumber(0, response[1].data.all.length);
    var catFact = response[1].data.all[index].text;
    console.log({ img: catImgUrl, fact: catFact });
    this.innerHTML = "New Cat";

    catPic = document.getElementById(catBox);
    catBox.innerHTML = `
      <div class="container"> 
        <div class="row">
            <div class="col">
            
            </div>
            <div class="col">
            <img src="${catImgUrl}" alt="catImage">
            <style>
            <h3>${catFact}</h3>
            </div>
            <div class="col">
              
            </div>
        </div>
      </div>

            `;
  });
}
