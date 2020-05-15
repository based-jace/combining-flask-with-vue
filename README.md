Depending on your project's requirements, there are a few different ways to build a web application with Flask and Vue, 
and they each involve various levels of back-end/front-end separation.

In this tutorial we will take a look at three of them by analyzing the pros and cons of each, 
their best use cases, and how to set each of them up.

*Dependencies:*
1. Python v3.8
2. Flask v1.1

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

### Cons
* You have to import Vue on and set up each page individually -
this may result in a headache and lots of workarounds if you have a lot of them; 
this will make a true Single-Page Application (SPA) difficult at the very least

### Best For
* Small web apps literally using a single HTML page or two 
(as opposed to a Single-Page Application with its own Dynamic Routing - see method 2 for more info)
* Building functionality onto an already existing web app
* Adding bits of reactivity to an app without fully committing to a front-end framework
* Projects that don't need the functionality/headache of a backend

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

We only need to import Flask and render_template from flask. 

The `greeting` variable will come up again in a second. 
We're going to use it to show how to render variables with both Jinja and Vue in the same file.

Next, we'll create a `templates` folder to hold our HTML file. Inside of that folder, create `index.html`.
In the body of our HTML file, create a container div with an id of `vm` 
(it can actually be anything, but this will make it consistent with Vue's JavaScript object naming standard).

Within the div, create two `p` tags. These are going to contain placeholders for our Flask and Vue variables.
One of the divs should contain the word 'greeting' surrounded by braces: `{{ greeting }}`.\
The other should contain 'greeting' surrounded by brackets: `[[ greeting ]]`.

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

In reality, we can use anything we want as our delimiters. In fact, if it's your preference, you can change the
delimiters for your Jinja templates in Flask instead if you'd like. I just find this much simpler.

```javascript
const vm = new Vue({ // Again, vm is our Vue instance's name for consistency.
    el: '#vm',
    delimiters: ['[[', ']]']
})
```

Finally, we're also going to add a data element `greeting` as `'Hello, Vue!'`:

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

## 2) Complete Separation of Flask and a Vue Single-Page Application (SPA)

### Method Overview
If you want to build a fully dynamic web app with a seamless User Experience (UX), you can completely separate 
your Flask back-end from your Vue front-end. This may take learning a whole new way of thinking when it comes
to web app design if you're not familiar with modern front-end frameworks. Because all rendering is done 
via JavaScript on the client-side, a huge dent will be put in your SEO. This side effect is negated 
if you're building an in-house or similar app that does not necessitate SEO.

You will generate an app using vue-cli from npm. 
You'll use Flask to create an Application Programming Interface (API) and send data requests to it from your Vue SPA.

### Pros
* Your back-end and front-end will be completely independent of each other - 
any changes you make to one will have no impact on the other; 
you could easily set up any other number of front-ends to interact with your Flask API
* Your front-end experience will be much smoother and more seamless

### Cons
* There is much more to set up and learn
* Deployment could be a headache
* SEO suffers without further intervention (see method 2.5 for more details)

### Best For
* Apps where UX is more important than SEO
* Back-ends that need to be accessible by multiple front-ends

*Additional Dependencies:*
1. npm v6.15
2. vue v2.6

### Setup

## 2.5) Complete Separation of Flask and a Vue Single-Page Application (SPA) with Server-Side Rendering (SSR) using Nuxt

### Method Overview
If SEO is as important to you as UX, you're going to want to implement SSR in some format. 
SSR makes it easier for search engines to navigate and index your web app, as you'll be able to give them
a form of your web app that doesn't require JavaScript to generate it. 

*Note: A Single-Page App with Server-Side Rendering is also called a Univeral App. *

Although it's possible to implement SSR manually, we'll be using Nuxt in this tutorial; it greatly simplifies things. 

Just like in Method 2, your front-end and back-end will be completely separate, 
only you'll be using Nuxt instead of vue-cli.

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
3. nuxt v2.12

### Setup

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

Let's dive into our `api` folder. Create a file called `api.py`. This we'll contain all of the code associated
with our API Additionally, because we will be accessing this file/folder as a module, create an `__init__.py`.

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

And that's it with our API blueprint. Super simple, right?

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
but Flask blueprints do not. We'll also have to tell it where our blueprint's `static` endpoint should be.
Intuitively, this is because if we have multiple blueprints and we have one or more `static` folders that have
files of the same name in them, Flask will be confused and not know which file to serve.

Visually, here's what it should look like:

```python
client_bp = Blueprint('client_bp', __name__, # 'Client Blueprint'
    template_folder='templates', # Required for our purposes
    static_folder='static', # Again, this is required
    static_url_path='/client/static' # Flask will be confused if you don't do this
)
```

Route "/" to render `index.html` (we're about to create it) on our new blueprint.

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
and create an `index.html` with a `<body>` that is identical to the one we created in method 1, scripts and all:

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
Give it a value of anything you want. I'm giving mine `'flaskGreeting'` (this will be quickly replaced anyway).

Let's give our Vue object a `created` lifecycle hook. Let's also make it asynchronous:

```javascript
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
```

Looking at the code, we're `await`ing a response to our API's 'greeting' endpoint (`/api_v1/greeting`),
`await`ing that response's asynchronous `.json()` response, and setting our Vue object's
`flaskGreeting` variable to the returned JSON object's value for its `greeting` key.

*For those unfamiliar with JavaScript's relatively new `Fetch` API, it's basically a native AXIOS killer
(at least as the client-side is concerned -- it's not supported by Node, but it will be by Deno).*

Altogether:

```javascript
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
```

Excellent. Only one thing left to do: let's put everything together in that initial `app.py` file we created
at the beginning of this method.

Go back to our project's route folder and open the file. All we need from `flask` is `Flask`. 
But this time, since we're using blueprints, we'll need to import them too 
(using Python module syntax) so Flask knows to use them:

```python
from flask import Flask
from api.api import api_bp
from client.client import client_bp
```

Create a Flask app as you would normally, but don't create any routes (not that you aren't allowed to,
we just don't need any for our purposes as we'll just be using the routes from our blueprints).
Instead, we're just going to register our blueprints using `app.register_blueprint`.

Our final `app.py` should look like:

```python
from flask import Flask
from api.api import api_bp
from client.client import client_bp

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix='/api_v1')
app.register_blueprint(client_bp)
```

And that's it! Run our new webapp/api with `flask run` and you should be greeted twice:
once by Vue itself, and again by a response from your Flask API.

## Summary















