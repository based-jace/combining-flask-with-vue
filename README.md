Depending on your project's requirements, there are a few different ways to build a web application with Flask and Vue, 
and they each involve various levels of back-end/front-end separation.

In this tutorial we will take a look at three of them by analyzing the pros and cons of each, 
their best use cases, and how to set each of them up:
![Different Ways to Build a Web App with Flask and Vue](https://user-images.githubusercontent.com/32235747/83411003-07ab7b00-a3dd-11ea-9352-9f33b7b6e98a.png)

*Dependencies:*
1. Python v3.8
2. Flask v1.1

*Things you should already know:*
* How to use Flask
* How to use vue-cli

## Overview
1\) Importing Vue into Jinja templates

2\) Complete Separation of Flask and a Vue Single-Page Application (SPA)

2\.5) Complete Separation of Flask and a Vue Single-Page Application (SPA) with Server-Side Rendering (SSR) using Nuxt

3\) Partial separation using Flask blueprints

## 1) Importing Vue into Jinja templates

### Method Overview
Perhaps the easiest way to transition to using a front-end framework is this method. 
In many cases, when you're building a front-end for your web app, you design it around your framework. 
With this method, you'll actually be building your front-end your way and adding in reactive functionality
if and when you need it.

You can import the Vue library either through a CDN or by serving it yourself along with your app, 
while setting up and routing Flask as you would normally.

### Pros
* You can build your app your way instead of fitting it around Vue's foundation
* Search Engine Optimization (SEO) doesn't require any additional configuring
* You can take advantage of cookie-based authentication instead of token-based authentication.
This tends to be easier, as you're not dealing with asynchronous front-end/back-end communication

### Cons
* You have to import Vue on and set up each page individually -
this may result in a headache and lots of workarounds if you have a lot of them; 
this will make a true Single-Page Application (SPA) difficult at the very least

### Best For
* Small web apps literally using a single HTML page or two 
(as opposed to a Single-Page Application with its own Dynamic Routing - see method 2 for more info)
* Building functionality onto an already existing web app
* Adding bits of reactivity to an app without fully committing to a front-end framework
* Web apps that don't need to communicate as frequently to a back-end via AJAX

*Additional Dependencies:*

None as we'll be importing Vue via a Content Delivery Network (CDN)!

### Setup

This is the simplest setup of each of these methods. Create a folder to hold all of your app's code.
Inside of that folder, create an `app.py` file as you would normally:

```python
from flask import Flask, render_template # These are all we need for our purposes

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", **{'greeting': 'Hello from Flask!'})
```

We only need to import `Flask` and `render_template` from `flask`. 

The `greeting` variable will come up again in a second. 
We're going to use it to show how to render variables with both Jinja and Vue in the same file.

Next, we'll create a `templates` folder to hold our HTML file. Inside of that folder, create `index.html`.
In the body of our HTML file, create a container div with an id of `vm` 
(it can actually be anything, but this will make it consistent with Vue's JavaScript object naming standard).

Within the div, create two `p` tags. These are going to contain placeholders for our Flask and Vue variables.

One of the divs should contain the word 'greeting' surrounded by braces: `{{ greeting }}`.\
The other should contain 'greeting' surrounded by brackets: `[[ greeting ]]`.

If you don't use separate delimiters, with the default setup Flask will replace both greetings with whatever
variable you pass with it (i.e. "Hello from Flask!").

Here's what we have so far:

```html
<body>
<!-- The id 'vm' is just for consistency - it can be anything you want -->
    <div id="vm"> 
        <p>{{ greeting }}</p>
        <p>[[ greeting ]]</p>
    </div>
</body>
```

Before the end of the body tag, we're going to import Vue from the official CDN.\
Here's the link from the official [documentation](https://vuejs.org/v2/guide/installation.html):
`"https://cdn.jsdelivr.net/npm/vue/dist/vue.js"`

We're also going to import a script that we're about to create. We'll import it how we would normally with Jinja.
Here's how our final `index.html` body will look with our imports:
```html
<body>
<!-- The id 'vm' is just for consistency - it can be anything you want -->
    <div id="vm">
        <p>{{ greeting }}</p>
        <p>[[ greeting ]]</p>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="{{ url_for('static', filename='index.js') }}"></script>
</body>
```

Going up a directory, create a `static` folder. This will hold our JavaScript code. Enter the folder.
Create a new JavaScript file: `index.js`. 

In this file, we'll create our Vue context. Because it's already imported, we don't have to do it again here.
We're going to set our instance's `el` as `'#vm'` and `delimiters` as '[[' and ']]'.

*In reality, we can use anything we want as our delimiters. In fact, if it's your preference, you can change the
delimiters for your Jinja templates in Flask instead if you'd like. I just find this much simpler.*

```javascript
const vm = new Vue({ // Again, vm is our Vue instance's name for consistency.
    el: '#vm',
    delimiters: ['[[', ']]']
})
```

Finally, we're also going to add a data element with the key/value of `greeting`: `'Hello, Vue!'`:

```javascript
const vm = new Vue({ // Again, vm is our Vue instance's name for consistency.
    el: '#vm',
    delimiters: ['[[', ']]'],
    data: {
        greeting: 'Hello, Vue!'
    }
})
```

And now we're done with that file. Your final folder structure should look something like:
```
Root
│   app.py
│
├───static
│       index.js
│
└───templates
        index.html
```

Now we can go back to our root folder and run `app.py` with `flask run`.
The first and second line should have been replaced by Flask and Vue, respectively.

That's it! Method 1 is down. You can mix and match JSON endpoints and HTML endpoints as you please,
but be aware that this can get really ugly really quickly. For a more manageable alternative, see method 3.

*Note*: with each additional HTML page, you will have to either import the same
js file and account for variables and elements that may not apply to it or create a new
Vue object for each page. A true SPA will be difficult, but not impossible -- theoretically you could
write a tiny JavaScript library that will asynchronously grab html pages/elements served by Flask.
I've actually done this before, but it's a big hassle, and it's honestly not worth it --
especially considering JavaScript will not run script tags imported this way.

*If you'd like to check out my implementation of this method, you can find it on 
[my github](https://github.com/based-jace/load-script-async).
The library takes a given chunk of HTML and replaces the specified HTML on the page with it.
If the given HTML contains no `<script>` elements (it checks using regex), it simply uses HTMLElement.innerHTML
to replace it. If it does contain `<script>` elements, it recursively adds the nodes, 
recreating any `<script>` nodes that come up, allowing your JavaScript to run.*

*Using something like this in combination with the History API can help you build a small SPA with a very tiny
file size. You can even create your own Server-Side Rendering functionality by serving full HTML pages
when arriving at your site initially, but serving partial pages if through an AJAX request. 
You can learn more about Server-Side Rendering in methods 2 and 2.5.*

## 2) Complete Separation of Flask and a Vue Single-Page Application (SPA)

### Method Overview
If you want to build a fully dynamic web app with a seamless User Experience (UX), you can completely separate 
your Flask back-end from your Vue front-end. This may take learning a whole new way of thinking when it comes
to web app design if you're not familiar with modern front-end frameworks. 

Developing your app as a SPA may put a dent in your SEO. In the past this hit would be much more dramatic, but updates
to how Googlebot indexes sites have negated this at least somewhat
(it may, however, still have a greater impact on non-Google search engines that don't render JavaScript 
or those that snapshot your page(s) too early - the latter shouldn't happen if your website is well-optimized).

In this method, you will generate an app using vue-cli from npm. 
You'll use Flask to create an Application Programming Interface (API) and send data requests to it from your Vue SPA.

*For more information on SEO in modern SPAs, 
[this post](https://medium.com/@l.mugnaini/spa-and-seo-is-googlebot-able-to-render-a-single-page-application-1f74e706ab11)
on Medium shows how Googlebot indexes JavaScript-rendered sites.
Additionally, [this post](https://www.smashingmagazine.com/2019/05/vue-js-seo-reactive-websites-search-engines-bots/)
talks in-depth about the same thing along with other helpful tips, 
such those concerning SEO on other search engines*

### Pros
* Your back-end and front-end will be completely independent of each other - 
any changes you make to one will have no impact on the other; 
you could easily set up any other number of front-ends to interact with your Flask API
* Your front-end experience will be much smoother and more seamless

### Cons
* There is much more to set up and learn
* Deployment could be a headache
* SEO might suffer without further intervention (see method 2.5 for more details)
* Authentication is much more involved, 
as you'll have to keep passing your auth token (JWT or Paseto) to your back-end

### Best For
* Apps where UX is more important than SEO
* Back-ends that need to be accessible by multiple front-ends

*Additional Dependencies:*
1. npm v6.15
2. vue v2.6
3. Flask-Cors v3.0

*Note: Deployment and containerization are outside of the scope of this post,
but it's not terribly difficult to Dockerize this setup*

### Setup

Because we're completely separating Vue from Flask, this method requires a bit more setup.
We're also going to need to enable Cross-Origin Resource Sharing (CORS) in Flask, since
our back-end and front-end are going to be served on separate ports. To accomplish this quickly
and easily, we're going to be using the Flask-Cors Python package.

*For security reasons, modern web browsers do not allow client-side JavaScript to access resources
(such as JSON data) from an origin differing from the origin your script is on 
unless they include a specific response header letting the browser know it's okay.*

If you haven't yet installed Flask-Cors, do so with pip. 

Let's start with our Flask API.

First, create a folder to hold the code for your project. 
Inside, create a folder called `api`.

Go into the folder, and create an `app.py` file.
Open the file with your favorite text editor. This time we'll need to import `Flask` from `flask`
and `CORS` from `flask_cors`. 

Our `app.py` file for this method is going to look a bit simpler than in the last method. 

Next, we'll create our Flask app object: `app = Flask(__name__)`.
Because we're using `flask_cors` to enable cross-origin resource sharing,
we're next going to wrap our app object (without setting a new variable) with `CORS`: `CORS(app)`.
That's all we have to do to enable CORS on all of our routes for any origin.

*Note: Although this is fine for demonstration purposes, you probably aren't going to want just
any app or website to be able to access your API. In that case you can use the kwarg 'origins'
with the CORS function to add a list of acceptable origins. i.e. `CORS(app, origins=["origin1", "origin2"])`*

Lastly, we're going to create a single greeting route at `/greeting` to return a JSON object with a single key/value:
`{'greeting': 'Hello from Flask!'}`.

Here's what we should have ended up with:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/greeting")
def greeting():
    return {'greeting': 'Hello from Flask!'}
```

That's all we need to do with Python.

Next, we'll set up our Vue webapp. From a terminal, open your project's root folder.
Using vue-cli, create a vue project called "webapp" (`vue create webapp`). You can use pretty much
whatever options you like, though if you're using class-based components in typescript,
the syntax will look a bit different.

When your project is finished being created, go into its folder. Change into `src`, then open `App.vue`.

Since we're just seeing how Vue and Flask can interact with each other, at the top of the page,
delete all elements within the div with the id of `app`. You should just be left with:

```html
<template>
<div id="app">
</div>
</template>
```

Within `#app`, create two `p` elements. The content of the first should be `{{ greeting }}`.\
The content of the second should be `{{ flaskGreeting }}`.

Your final HTML should be as such:

```html
<template>
<div id="app">
    <p>{{ greeting }}</p>
    <p>{{ flaskGreeting }}</p>
</div>
</template>
```

In our `script`, we're going to add logic to show a purely client-side greeting (`greeting`)
and a greeting pulled from our API (`flaskGreeting`).

Within our Vue object (it begins with `export default`), create a `data` key. Make it a function that returns an object.
Within this object, create two more keys: `greeting` and `flaskGreeting`. `greeting`'s value should just be "Hello, Vue!".
You can give `flaskGreeting` anything you want (this will be overwritten asynchronously).

Here's what we have so far:

```javascript
export default {
    name: 'App',
    components: {
        HelloWorld
    },
    data: function(){
        return {
            greeting: 'Hello, Vue!',
            flaskGreeting: ""
        }
    }
}
```

Finally, let's give our Vue object a `created` lifecycle hook. This hook will only be run once the DOM is loaded
and our Vue object is created. This allows us to use the DOM, the `fetch` API, and interact with Vue without anything
clashing:

```javascript
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
```

Looking at the code, we're `await`ing a response to our API's 'greeting' endpoint (`http://localhost:5000/greeting`),
`await`ing that response's asynchronous `.json()` response, and setting our Vue object's
`flaskGreeting` variable to the returned JSON object's value for its `greeting` key.

*For those unfamiliar with JavaScript's relatively new `Fetch` API, it's basically a native AXIOS killer
(at least as far as the client-side is concerned -- it is not supported by Node, but it will be by Deno).
Additionally, if you're like consistency, you can also check out this library: 
https://www.npmjs.com/package/isomorphic-fetch in order to use Fetch on the server-side.*

And we're finished. Now because, again, our front-end and back-end are separate,
we'll need to run both of our apps separately. 

Let's open our project's root folder in two separate folders. 
In the first, we're going to change into our `api` directory, then run `flask run`.
If all goes well, our Flask API should be running.

In our second terminal, we'll change into our `webapp` directory, then run `npm run serve`.

Once our web app is up, we should be able to access it from `localhost:8080`. If
everything works, you should be greeted twice: Once by Vue, and again from your Flask API.

Your final file tree should look like:

```
Root
│   app.py
│
├───api
│       app.py
│
└───webapp
        ... {{ Vue project }}
```

## 2.5) Complete Separation of Flask and a Vue Single-Page Application (SPA) with Server-Side Rendering (SSR) using Nuxt

### Method Overview
If SEO is as important to you as UX, you might want to implement SSR in some format. 
SSR makes it easier for search engines to navigate and index your web app, as you'll be able to give them
a form of your web app that doesn't require JavaScript to generate. 
It can also make it quicker for users to interact with your app, 
as much of your initial content will be rendered before it's sent to your user.
In other words, your user is not having to wait for all of your content to load asynchronously.

*Note: A Single-Page App with Server-Side Rendering is also called a Univeral App.*

Although it's possible to implement SSR manually, we'll be using Nuxt in this tutorial; it greatly simplifies things. 

Just like in Method 2, your front-end and back-end will be completely separate, 
only you'll be using Nuxt instead of vue-cli.

*Note: Although you can manually manage server-side rendering without Nuxt, it makes it a lot easier*

### Pros
* All of the pros of method 2 with the addition of Server-Side Rendering

### Cons
* About as difficult to set up as method 2
* Even more to learn than method 2 as Nuxt is essentially just another layer on top of Vue

### Best For
* Apps where SEO is as important as UX

*Additional Dependencies:*
1. npm v6.15
2. vue v2.6

### Setup

This is going to be very similar to the last method. Follow along with its setup until
you have created your API.

Once your API is finished, within a terminal, 
`cd` into your root folder and run the command `npx create-nuxt-app webapp`.
This will let you interactively generate a nuxt project without installing anything globally.

Again, any options should be fine here. 

Once your project is done being generated, dive into your new `webapp` folder. Go into `pages`,
then open `index.vue`. Similarly to method 2, delete everything within the `div` that has the class
`container`. Inside, create two `p` tags with the same vars as the last method:\
`{{ greeting }}` and `{{ flaskGreeting }}`

It should look like this:

```html
<template>
  <div class="container">
    <p>{{ greeting }}</p>
	<p>{{ flaskGreeting }}</p>
  </div>
</template>
```

And now for our script. We're going to do the same thing as the last method:
* Add a `data` key that returns an object with the variables `greeting` and `flaskGreeting`
* Add a `created` lifecycle hook with the same code as in method 2
  * `await` `fetch` to get the JSON greeting from our API (on port 5000 unless you changed it)
  * `await` the `json()` method to asynchronously get our JSON data from our API's response
  * Set our Vue instance's `flaskGreeting` to the `greeting` key from our response's JSON object

Minus the missing `name` and a different generated component, our Vue object should look the same:

```javascript
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
```

Running our app and api is going to be very similar to the last method as well.
Open two terminals. With the first, change into `api` and run the command `run flask`.
With the second, change into `webapp`, but this time run `npm run dev` to start
a development server for your Nuxt project. 

*In production you can either run 
`npm run build`, then `npm run start` to start a production server.*

Nuxt defaults to using port `3000` instead of `8080`.

Our final tree:

```
Root
│   app.py
│
├───api
│       app.py
│
└───webapp
        ... {{ Nuxt project }}
```

### BONUS: Vue vs Nuxt SEO Comparison
I mentioned the benefits of SEO earlier in this post, but just to show you what I meant,
I ran both web apps as-is, and grabbed the Lighthouse SEO scores for both.

With no changes to either app, here's what we have:
![Lighthouse SEO Scores for our Vue and Nuxt Spps](https://user-images.githubusercontent.com/32235747/83606977-11012880-a540-11ea-9a11-e89703395e6d.png)


Again, there are things you can do to improve your pure Vue SEO score.
Lighthouse in Chrome's dev tools mention adding a meta description and a valid robots.txt, but
with no additional intervention, Nuxt gave us a perfect SEO score.

Additionally, you can actually physically see the difference between the SSR that Nuxt does and
vanilla Vue's completely asynchronous approach. If you run both apps at the same time, 
then go to their respective origins, localhost:8080 and localhost:3000,
the Vue app's initial greeting happens milliseconds after you get the response,
whereas Nuxt's is served with its initial greeting already-rendered.

For more information on the differences between Nuxt and Vue, you can check out
[these](https://www.bornfight.com/blog/nuxt-js-over-vue-js-when-should-you-use-it-and-why/)
[posts](https://blog.logrocket.com/how-nuxt-js-solves-the-seo-problems-in-vue-js/).

## 3) Partial separation using Flask blueprints

### Method Overview
Perhaps you already have a small API developed and you want to build a web app as more of a means to an end 
rather than as the main event, such as a prototype to demonstrate functionality to your employer
or client (you can always replace this or hand it off to a front-end developer later on). 
Or maybe you just don't want to deal with the potential frustration that could result 
when deploying completely separate front-ends and back-ends. In that case you could sort-of meet in the middle 
by keeping your Flask API, but building on a Vue front-end with its own Flask blueprint.

This will look a lot like method 1, but the code will be more organized.

### Pros
* No need to build a complex front-end if it isn't necessary
* Similar to method 1 with the added benefit of better code organization
* You can always expand the front-end and back-end as needed later on

### Cons
* Workarounds might be necessary to allow a full SPA
* Accessing the API might be slightly more annoying from a separate front-end (such as a mobile app)
as the front-end and back-end are not completely separate

### Best For
* Projects where functionality is more important than UI
* You're building a front-end onto an already-existing Flask API
* Small web apps that are made up of only a couple of HTML pages

*Additional Dependencies:*

Similarly to method 1, we will be using a Vue CDN.

### Setup

Like each other method, create a new folder to house your code. 
Inside of it, create two folders: `api` and `client`. 
Intuitively, these will contain the blueprints for our api and client, respectively.

Additionally, we'll create our `app.py` here. This is the only method where our `app.py` will look
noticeably different from the other methods. This is because, rather than creating any routes in this file,
they will be distinctly separated. 

We'll come back to this later.

Let's dive into our `api` folder. Create a file called `api.py`. This will contain all of the code associated
with our API. Additionally, because we will be accessing this file/folder as a module, create an `__init__.py` file.

Because we're going to be working with blueprints, this is going to look a lot like creating a regular Flask app,
only we're importing and using `Blueprint` from `flask` instead of `Flask`:

```python
from flask import Blueprint

api_bp = Blueprint('api_bp', __name__) # "API Blueprint"

@api_bp.route("/greeting") # Blueprints don't use the Flask "app" context. They use their own blueprint's
def greeting():
    return {'greeting': 'Hello from Flask!'}
```

Blueprint's first argument is for Flask's routing system. The second, `__name__`,
is equivalent to a Flask app's first argument.

And that's it with our API blueprint.

Okay. Let's go back up, then dive into the `client` folder we created earlier. 
This one's going to be a little more involved than our API blueprint, 
but no more complicated than a regular Flask app.

Again, like a regular Flask app, inside this folder, create a `static` folder and a `templates` folder.
Create a file called `client.py` and enter it.

From `flask`, we're again going to import `Blueprint`, but also `render_template`. 
That's because this blueprint is going to serve to route and render our web app.

Like our `api.py` file, we create a `Blueprint` variable. In this case, we're calling it `client_bp`.

This time, though, we have to pass in a few more arguments. 
Regular Flask apps are smart enough to know where our `templates` and `static` folders are,
but Flask blueprints are not. We'll also have to tell it where our blueprint's `static` endpoint should be.
Intuitively, this is because if we have multiple blueprints and one or more `static` folders that have
files of the same name in them, Flask will be confused and not know which file to serve.

Visually, here's what it should look like:

```python
client_bp = Blueprint('client_bp', __name__, # 'Client Blueprint'
    template_folder='templates', # Required for our purposes
    static_folder='static', # Again, this is required
    static_url_path='/client/static' # Flask will be confused if you don't do this
)
```

We'll then route "/" to render `index.html` (we're about to create it) on our new blueprint.

Here's what our file should end up looking like:

```python
from flask import Blueprint, render_template

client_bp = Blueprint('client_bp', __name__, # 'Client Blueprint'
    template_folder='templates', # Required for our purposes
    static_folder='static', # Again, this is required
    static_url_path='/client/static' # Flask will be confused if you don't do this
)

@client_bp.route('/')
def index():
    return render_template('index.html')
```

Excellent. Our client blueprint is now finished. Exit the file, go into the blueprint's `templates` folder,
and create an `index.html` with an html `body` that is identical to the one we created in method 1, scripts and all:

```html
<body>
<!-- The id 'vm' is just for consistency - it can be anything you want -->
    <div id="vm">
        <p>{{ greeting }}</p>
        <p>[[ greeting ]]</p>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="{{ url_for('static', filename='index.js') }}"></script>
</body>
```

Now, since we're going to do all of our actual data/component rendering from Vue, replace
`{{ greeting }}` with `[[ greeting ]]` and the next line's `[[ greeting ]]` with `[[ flaskGreeting ]]`.

*If you noticed we're using brackets instead of braces, 
it's because we need to change our delimiters again to keep Flask from catching them first.*

The first line will be rendered by Vue as soon as it's ready, 
while the second line will be taken from a Flask response that we'll request asynchronously.

Lastly, replace `url_for('static'` with `url_for('client_bp.static'`. This is, again, so Flask knows
that we need our client blueprint's static folder, not our root static folder.

Our `<body>` should look like this:

```html
<body>
    <div id="vm" class="container">
        <p>[[ greeting ]]</p>
        <p>[[ flaskGreeting ]]</p>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.11"></script>
    <script src="{{ url_for('client_bp.static', filename='index.js') }}"></script>
</body>
```

Done. Exit this file, go up a level, then enter our `static` folder. 
We're finally going to create our Vue context. In a new file called `index.js`,
create a variable called `apiEndpoint` and set it to `api_v1`. This just makes everything a little more
DRY if we decide to change our endpoint later on:

```javascript
const apiEndpoint = '/api_v1/';
```

*Note: we haven't created the logic for our endpoint yet. That will come in the last step.*

Next, we're going to start our Vue context by making it identical to the context in method 1:

```javascript
const vm = new Vue({
    el: '#vm',
    delimiters: ['[[', ']]'],
    data: {
        greeting: 'Hello, Vue!'
    }
})
```

Because we're also going to pull a greeting from our API, create a data placeholder called 'flaskGreeting'.
Give it a value of anything you want. I'm giving mine the empty string: `''` (this will be quickly replaced anyway).

Let's give our Vue object a `created` lifecycle hook. Let's also make it asynchronous:

```javascript
const apiEndpoint = '/api_v1/';

const vm = new Vue({
    el: '#vm',
    delimiters: ['[[', ']]'],
    data: {
        greeting: 'Hello, Vue!',
        flaskGreeting: ''
    },
    created: async function(){
        const gResponse = await fetch(apiEndpoint + 'greeting');
        const gObject = await gResponse.json();
        this.flaskGreeting = gObject.greeting;
    }
})
```

Looking at the code, we're `await`ing a response from our API's 'greeting' endpoint (`/api_v1/greeting`),
`await`ing that response's asynchronous `.json()` response, and setting our Vue object's
`flaskGreeting` variable to the returned JSON object's value for its `greeting` key. It's
basically a mashup between the Vue objects from methods 1 and 2.

Excellent. Only one thing left to do: let's put everything together in that initial `app.py` file we created
at the beginning.

Go back to our project's root folder and open the file. All we need from `flask` is `Flask`. 
But this time, since we're using blueprints, we'll also need to import those
(using Python module syntax) so Flask knows to use them:

```python
from flask import Flask
from api.api import api_bp
from client.client import client_bp
```

Create a Flask app as you would normally, but don't create any routes (not that you aren't allowed to,
we just don't need any for our purposes as we'll just be using the routes from our blueprints).
Instead, we're just going to register our blueprints using `app.register_blueprint()`.

*I gave my API blueprint a url_prefix to ensure all of its routes would be accessed after 'api_v1'*

Our final `app.py` should look like:

```python
from flask import Flask
from api.api import api_bp
from client.client import client_bp

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix='/api_v1')
app.register_blueprint(client_bp)
```

Final file tree:
```
Root
│   app.py
│
├───api
│       api.py
│       __init__.py
│
└───client
    │   client.py
    │   __init__.py
    │
    ├───static
    │       index.js
    │
    └───templates
            index.html
```

And that's it! If you run your new webapp/api with `flask run` you should be greeted twice:
once by Vue itself, and again by a response from your Flask API.

## Summary

There are many, many different ways to build a web app using Vue and Flask.
Hopefully this gives you an idea about how to build yours.
