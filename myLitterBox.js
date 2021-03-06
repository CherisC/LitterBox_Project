 // Initialize Firebase
 var app = firebase.initializeApp(firebaseConfig);
 var db = app.firestore();
 
 var catsRef = db.collection("Cats");
 var clickedImage;
 
 var currentUser;
firebase.auth().onAuthStateChanged(function(user) {
    const signInButton = document.getElementById('sign-in');
    if (user) {
    // User is signed in.
   currentUser = user;
   
    // query database on page load and load comments if picture has been
    // commented on before 
    if(signInButton){
        signInButton.innerHTML = 'Sign Out';
        signInButton.addEventListener('click', function(){
          firebase.auth().signOut().then(() =>{
              this.innerHTML = 'Log In'
          })
        })
      }
    queryDatabase(currentUser).then(function(data) {
    if(data.docs.length) {
      var imageArray = [];
      var documentArray = [];
      data.forEach(function(doc) {
          imageArray.push(doc.data().imageUrl);
          documentArray.push(doc.id);
        });
        displayLitterBox(imageArray, documentArray);
        displayComments(documentArray);
        }
    })
  }
});
 

 function displayLitterBox(imageArray, documentArray) {
     var index = 0;
     var displayedImages = imageArray.map(function(image) {
        return `
        <div>
            <img src="${image}" width="200" height="200" onclick="commentOnImage('${documentArray[index]}')">
            <div id="img-${documentArray[index++]}"></div>
        </div>
        `
     })
    
     document.getElementById("innerContainer").innerHTML = displayedImages.join("");
 }
 
 function queryDatabase(currentUser) {
     var promise = new Promise(function(resolve, reject) {
         catsRef.where("userID", "==", currentUser.uid)
         .get()
         .then(function(querySnapshot) {
             resolve(querySnapshot)
         })
         .catch(function(error) {
             reject("Error getting documents: ", error);
         });
     });
     return promise;
 }
 
//  function addCatToDatabase(data) {
//      catsRef.add({
//          fact: data.fact,
//          imageUrl: data.imageUrl,
//          name: data.name,
//          comments: [data.comment],
//          userID: currentUser.uid
//      }).then(function(docRef) {
//          displayComments(docRef.id);
//      }).catch(function(error) {
//          console.error("Error adding document: ", error);
//          return error;
//      });
//  }
 
 function addComments(docID, comment) {
     // Atomically add a new region to the "regions" array field.
     catsRef.doc(docID).update({
     comments: firebase.firestore.FieldValue.arrayUnion(comment)
     });
     displayComments([docID]);
 }
 
 function displayComments(documentArray) {
    documentArray.forEach(function(document) {
        displayComment(document);
    });
 }
 
 
  function displayComment(docID) {
        catsRef.doc(docID).get()
        .then(function(doc) {
         var commentsHTML = doc.data().comments.map(function(comment) {
             return `<div class="LitterBox-comment">${comment}
             </div>`;
         });
         document.getElementById(`img-${docID}`).innerHTML = commentsHTML.join('');
     });
 }
 
 var prevClickedImg;
 function commentOnImage(imgID) {
      
    clickedImage = imgID;
    // adding border to image when clicked
    event.target.style = "border: solid black 5px";
    // prevClickedImg while not have a value first time so this if statement will not
    // run. after first time this function runs prevClickedImg will store the img element
    // of previously clicked on image. In the if statement the style is set to empty to remove
    // border.
    if(prevClickedImg) {
        prevClickedImg.style = "";
    }
    prevClickedImg = event.target;
 }
 var commentForm = document.getElementById('commentForm');
 
 commentForm.addEventListener('submit', function(event) {
     event.preventDefault();
     console.log(event);
     var commentText = event.target.elements.commentText.value;
     if (commentText == '') {
         return;
     }
     
     addComments(clickedImage, commentText);
              event.target.elements.commentText.value = "";
 });
