# waffle-warehouse

The waffle warehouse service.

At the moment this contains a ReactJS app that, when a button is pressed,
queries the server for the current time and then displays the time.  The root
site (the React app) is itself served from the same server.

See the Makefile for basic structure.  Make builds both the ReactJS and golang
components.

Run as ./waffle-warehouse
Browse localhost:1323
