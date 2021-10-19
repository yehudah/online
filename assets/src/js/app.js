import {user} from './user';

(function() {
    let userHandler = new user();
    let app = document.getElementById('app');
    let login = document.getElementById('login' );
    let clone = login.content.cloneNode(true);

    app.appendChild(clone);

    let loginForm = document.querySelector('form.login' );
    if ( ! userHandler.isLoggedIn() ) {
        loginForm.addEventListener('submit', e => userHandler.login(e), false );
    } else {
        userHandler.showDashboard(loginForm);
        userHandler.heartbeat();
    }

})();
