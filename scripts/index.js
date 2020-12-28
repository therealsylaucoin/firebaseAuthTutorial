const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

//show diff menu based on user status
const setupUI = (user) => {
    if (user) {
        if (user.admin){
            adminItems.forEach(item => 
                item.style.display = 'block');
        }
        //account info INCLUDING the bio
        db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
            <div>Logged in as ${user.email}</div>
            <div>${doc.data().bio}</div>
            <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
            `;
            accountDetails.innerHTML = html;
        })
        //toggle UI elements
        loggedInLinks.forEach(link => link.style.display = 'block');
        loggedOutLinks.forEach(link => link.style.display = 'none');
    } else {
        //hide account info
        accountDetails.innerHTML = '';
        adminItems.forEach(item => 
            item.style.display = 'none'
        );
        //toggle UI elements
        loggedInLinks.forEach(link => link.style.display = 'none');
        loggedOutLinks.forEach(link => link.style.display = 'block');
    }
}

//setup the guides
const setupGuides = (data) => {
    //check if theres data, if not log user message
    if (data.length){
    let html = '';
    data.forEach(doc => {
        const guide = doc.data();
        const li = `
        <li>
            <div class="collapsible-header grey lighten-4">${guide.Title}</div>
            <div class="collapsible-body white">${guide.Content}</div>
        </li>
        `;
        html += li;
    })
        guideList.innerHTML = html;
    } else {
        guideList.innerHTML = `<h5>Log in to view guides.</h5>`;
    }
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

});