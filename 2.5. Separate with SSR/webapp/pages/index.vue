<template>
  <div class="container">
    <p>{{ greeting }}</p>
	<p>{{ flaskGreeting }}</p>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
	components: {
		Logo
	},
	data: function(){
		return {
			greeting: 'Hello, Vue!',
			flaskGreeting: ''
		}
	},
	created: async function(){
		const gResponse = await fetch("http://localhost:5000/greeting");
		const gObject = await gResponse.json();
		this.flaskGreeting = gObject.greeting;
	}
}
</script>

<style>

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
