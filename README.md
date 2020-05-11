Depending on your project's requirements, there are a few different ways to build a web application with Flask and Vue, and they each involve various levels of back-end/front-end separation.

In this tutorial we will take a look at three of them by analyzing the pros and cons of each, their best use cases, and how to set each of them up.

<i>Dependencies:</i>
1. Python v3.8
2. Flask v1.1
3. Vue v2.6

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

You can import the Vue library either through a CDN or by serving it yourself along with your app, while setting up and routing Flask as you would normally.

### Pros
* You can build your app your way instead of fitting it around Vue's foundation
* Search Engine Optimization (SEO) doesn't require any additional configuring

### Cons
* You have to import Vue on and set up each page individually - this may result in a headache and lots of workarounds if you have a lot of them; this will make a true Single-Page Application (SPA) difficult at the very least

### Best For
* Small web apps literally using a single HTML page or two (as opposed to a Single-Page Application with its own Dynamic Routing - see method 2 for more info)
* Building functionality onto an already existing web app
* Adding bits of reactivity to an app without fully committing to a front-end framework

### Setup

## 2) Complete Separation of Flask and a Vue Single-Page Application (SPA)

### Method Overview
If you want to build a fully dynamic web app with a seamless User Experience (UX), you can completely separate 
your Flask back-end from your Vue front-end. This may take learning a whole new way of thinking when it comes
to web app design if you're not familiar with modern front-end frameworks. Because all rendering is done 
via JavaScript on the client-side, a huge dent will be put in your SEO. This side effect is negated 
if you're building an in-house or similar app that does not necessitate SEO.

You will generate an app using vue-cli from npm. You'll use Flask to create an Application Programming Interface (API) and send data requests to it from your Vue SPA.

### Pros
* Your back-end and front-end will be completely independent of each other - any changes you make to one will have no impact on the other; you could easily set up any other number of front-ends to interact with your Flask API
* Your front-end experience will be much smoother and more seamless

### Cons
* There is much more to set up and learn
* Deployment could be a headache
* SEO suffers without further intervention (see method 2.5 for more details)

### Best For
* Apps where UX is more important than SEO
* Back-ends that need to be accessible by multiple front-ends

### Setup

## 2.5) Complete Separation of Flask and a Vue Single-Page Application (SPA) with Server-Side Rendering (SSR) using Nuxt

### Method Overview
If SEO is as important to you as UX, you're going to want to implement SSR in some format. 
SSR makes it easier for search engines to navigate and index your web app, as you'll be able to give them
a form of your web app that doesn't require JavaScript to generate it. A Single-Page App with Server-Side Rendering is also called a Univeral App.

Although it's possible to implement SSR manually, we'll be using Nuxt in this tutorial; it greatly simplifies things. 

Just like in Method 2, your front-end and back-end will be completely separate, only you'll be using Nuxt instead of vue-cli.

### Pros
* All of the pros of method 2 with the addition of Server-Side Rendering

### Cons
* About as difficult to set up as method 2
* Even more to learn than method 2 as Nuxt is essentially just another layer on top of Vue

### Best For
* Apps where SEO is as important as UX

### Setup

## 3) Partial separation using Flask blueprints

### Method Overview

### Pros

### Cons

### Best For

### Setup













