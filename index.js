var app = firebase.initializeApp(firebaseConfig);
var db = app.firestore();

var catsRef = db.collection("Cats");

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
    const myLitterBoxButton = document.getElementById('litter-box');
    const addCatButton = document.getElementById('add-cat');
    if (user) {
      // User is signed in.
      if(myLitterBoxButton){
        myLitterBoxButton.style.display = 'inline-block';
      }
      if(signInButton){
        signInButton.innerHTML = 'Sign Out';
        signInButton.addEventListener('click', function(){
          firebase.auth().signOut().then(() =>{
              this.innerHTML = 'Sign In'
          })
        })
      }
      if(addCatButton) {
        addCatButton.disabled = false;
        addCatButton.addEventListener("click", function() {
          addCatToDatabase(user);
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
    localStorage.setItem("retrievedImage", catImgUrl);
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
            <img id="cat-image" src="${catImgUrl}" class="rounded mx-auto d-block" alt="catImage">
            <h3 class="text-center">${catFact}</h3>
            </div>
            <div class="col">
            </div>
        </div>
      </div>

            `;
            return catImgUrl;
  }).then(function(img) {
      // query database on page load and load comments if picture has been
      // commented on before 
      queryDatabase(img).then(function(data) {
	    if(data.docs.length) {
		  displayComments(data.docs[0].id);
	}
})
  });
}


// Code to load comments from searched image



function queryDatabase(imageUrl) {
	var promise = new Promise(function(resolve, reject) {
		catsRef.where("imageUrl", "==", imageUrl)
    	.get()
    	.then(function(querySnapshot) {
			resolve(querySnapshot)
        /* querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        }); */
    	})
    	.catch(function(error) {
        	reject("Error getting documents: ", error);
		});
	});
	return promise;
}

function displayComments(docID) {
	catsRef.doc(docID).get()
	.then(function(doc) {
		var commentsHTML = doc.data().comments.map(function(comment) {
			return `<div class="comment">${comment}
			</div>`;
		});
		document.getElementById('comments').innerHTML = commentsHTML.join('');
	});
}

function addCatToDatabase(user) {
  catsRef.add({
      imageUrl: document.getElementById("cat-image").getAttribute("src"),
      comments: [],
      userID: user.uid
  }).then(function(docRef) {
    console.log("Added cat to database");
      displayComments(docRef.id);
  }).catch(function(error) {
      console.error("Error adding document: ", error);
      return error;
  });
}