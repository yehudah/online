import {request} from './request';
import sha1 from 'crypto-js/sha1';

export class user {

    constructor() {
        this.request = new request();
    }

    async login(e) {
        e.preventDefault();

        const form = e.target;
        const name = form.querySelector('.name').value;
        const email = form.querySelector('.email').value;

        sessionStorage.setItem('name', name );
        sessionStorage.setItem('email', email );
        sessionStorage.setItem('hash', sha1(name + email) );
        sessionStorage.setItem('EntranceTime', Date.now().toString() );
        sessionStorage.setItem('LastUpdate', Date.now().toString() );

        const response = await this.request.postData('server.php', { name, email, action: 'login'} );

        if ( response.success ) {
            this.showDashboard();
            this.heartbeat();
        }
    }

    async updateStatus() {
        sessionStorage.setItem('LastUpdate', Date.now().toString() );

        const name = sessionStorage.getItem('name' );
        const email = sessionStorage.getItem('email' );

        const response = await this.request.postData('server.php', { name, email, action: 'updateStatus'} );
        const result = await this.request.postData('server.php', { action: 'getRecords'} );

        for (const property in result.response) {
            const item = result.response[property];

            for (const val in item) {
                switch (val) {
                    case 'LastUpdate':
                        let wrap = document.getElementById(item['hash']);
                        let element = wrap.querySelector('.card-status');
                        let status = element.innerHTML;
                        let newStatus = result.currentTime - item[val] > 3 ? 'OFFLINE' : 'ONLINE';

                        if ( status !== newStatus ) {
                            element.innerHTML = element.innerHTML.replaceAll(status, newStatus );
                        }

                        break;
                }
            }
        }
    }

    isLoggedIn() {
        return sessionStorage.getItem('name' );
    }

    async showDashboard(loginForm = false) {
        if (loginForm) {
            loginForm.remove();
        }

        let dashboard = document.getElementById('dashboard' );
        document.getElementById('app').innerHTML = dashboard.innerHTML.replace('{{name}}',sessionStorage.getItem('name' ) );

        const result = await this.request.postData('server.php', { action: 'getRecords'} );
        const userCard = document.getElementById('userCard').innerHTML;

        let html = '';
        for (const property in result.response) {
            const item = result.response[property];
            let iteHtml = userCard;

            for (const val in item) {
                switch (val) {
                    case 'Name':
                        iteHtml = iteHtml.replace('{{Name}}', item[val]);
                        break;
                    case 'LastUpdate':
                        console.log(result.response);
                        iteHtml = iteHtml.replace('{{Status}}', result.currentTime - item[val] > 3 ? 'OFFLINE' : 'ONLINE' );
                        break;
                    case 'hash':
                        iteHtml = iteHtml.replaceAll('{{hash}}', item[val] );
                        break;
                }
            }

            html += iteHtml;
        }

        document.querySelector('.users').innerHTML = html;
        document.querySelectorAll('.fetch-user-info').forEach(function (element){
             let self = this;
             element.addEventListener('click', async function(e) {
                 e.preventDefault();

                 const hash = element.dataset.hash;
                 const result = await self.request.postData('server.php', { hash, action: 'getUserInfo'} );

                 let html = '<ul>';
                 for (const property in result.response) {
                     if ( property === 'hash' ) {
                         continue;
                     }
                     html += `<li><strong>${property}:</strong> ${result.response[property]}</li>`;
                 }
                 html += '</ul>';

                 const tooltip = this.querySelector('.tooltip');
                 const tooltipActives = document.querySelectorAll('.tooltip.active');
                 const toolTipText = tooltip.querySelector('.tooltiptext');

                 if (tooltipActives) {
                     tooltipActives.forEach(function(tooltipActive) {
                         if (tooltipActive === tooltip) {
                             return;
                         }
                         tooltipActive.classList.remove('active');
                     });
                 }

                 toolTipText.innerHTML = html;
                 tooltip.classList.toggle('active');
             })
        }.bind(this) );
    }

    heartbeat() {

        setInterval(function () {
            this.updateStatus();

        }.bind(this), 3000);
    }
}
