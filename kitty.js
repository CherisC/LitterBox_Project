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