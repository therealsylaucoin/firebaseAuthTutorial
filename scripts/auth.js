//add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');//reference to the function
    addAdminRole( {email: adminEmail} ).then(
        result => console.log(result)
    );
})

//listen for auth status change (is user logged in?)
auth.onAuthStateChanged(user => {
    // setupUI(user);
    if (user) {
        //check if user is admin (claim)
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        })
        // if user is logged in - get data
        //instead of .get.then, use .onSnapshot (proper to firebase) this will make it update in realtime
        db.collection('Guides').onSnapshot((snapshot) => {
        setupGuides(snapshot.docs);
        }, err => { //instead of .catch
            console.log(err);
        })
    } else {
        //if user is logged out, call the setupGuides function with an empty array, so that we get no data
        setupUI(user);
        setupGuides([]);
    }
});


//create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('Guides').add({
        //same as:
        //Title: createForm['title'].value,
        Title: createForm.title.value,
        Content: createForm.content.value
    }).then(() => {
        //reset the form and close the modal
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }, err => { console.log(err.message)})
})


//signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get the user info(email and password)
    //use bracket notation to get ids
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //signup user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        //use doc instead of add, that way we can control the id
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        });
        
    }).then(() => {
        //close the signup modal and reset form
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    });
});


//signout user
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})


//log in
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get the user info(email and password)
    //use bracket notation to get ids
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    //login user
    auth.signInWithEmailAndPassword(email, password)
        .then((cred) => {
        //close the login modal and reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
        // console.log(cred.user);
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    })
})


const resetPasswordFunction = () => {
    const email = document.querySelector('#login-email').value;

    auth.sendPasswordResetEmail(email)
    .then(() => {console.log('Password email sent')
    })
}


const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', resetPasswordFunction);