 // Initialize Firebase
 var app = firebase.initializeApp(firebaseConfig);
 var db = app.firestore();
 
 var catsRef = db.collection("Cats");
 
 // query database on page load and load comments if picture has been
 // commented on before 
 queryDatabase().then(function(data) {
     if(data.docs.length) {
         displayComments(data.docs[0].id);
     }
 })
 
 function queryDatabase() {
     var promise = new Promise(function(resolve, reject) {
         catsRef.where("imageUrl", "==", "www.google.com")
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
 
 function addCatToDatabase(data) {
     catsRef.add({
         fact: data.fact,
         imageUrl: data.imageUrl,
         name: data.name,
         comments: [data.comment]
     }).then(function(docRef) {
         displayComments(docRef.id);
     }).catch(function(error) {
         console.error("Error adding document: ", error);
         return error;
     });
 }
 
 function addComments(docID, comment) {
     // Atomically add a new region to the "regions" array field.
     catsRef.doc(docID).update({
     comments: firebase.firestore.FieldValue.arrayUnion(comment)
     });
     displayComments(docID);
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
 
 
 var commentForm = document.getElementById('commentForm');
 
 commentForm.addEventListener('submit', function(event) {
     event.preventDefault();
     console.log(event);
     var commentText = event.target.elements.commentText.value;
     if (commentText == '') {
         return;
     }
 
     var data = {
         fact: "cats are cool",
         imageUrl: "www.google.com",
         name: "fifo",
         comment: commentText
     }
 
     queryDatabase().then(function(queryResult) {
         if(queryResult.docs.length === 0) {
             addCatToDatabase(data);
         } else {
             addComments(queryResult.docs[0].id, data.comment);
         }
     })
     
      /* if(!returnedQuery) {
         addCatToDatabase("cats are cool", "www.google.com", "fifo", commentText);
      } else {
         console.log(returnedQuery);
      } */
      
 });