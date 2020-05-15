const apiEndpoint = '/api_v1/';

const vm = new Vue({
    el: '#vm',
    delimiters: ['[[', ']]'],
    data: {
        greeting: 'Hello, Vue!',
        flaskGreeting: 'flaskGreeting'
    },
    created: async function(){
        const gResponse = await fetch(apiEndpoint + 'greeting');
        const gObject = await gResponse.json();
        this.flaskGreeting = gObject.greeting;
    }
})
