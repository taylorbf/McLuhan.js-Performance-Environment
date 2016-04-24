# McLuhan.js Interface

A live coding environment for performing net art with remote browsers using McLuhan.js.

This project investigates a new performance paradigm: a performer creates net art actions in the browsers of remote viewers around the world.

## Setup


### Installation

Install [node.js]().

Clone this repository.

In Terminal, navigate to the folder of this repository and run `npm install`

### Starting the server

In Terminal, navigate to the folder of this repository and run `node server.js`

The live coding performance page is at `localhost:8080/controller.html`

The audience client page is at `localhost:8080/client.html`

For a remote audience to view this work, you will either need to host your project on Heroku or another platform for runnign node apps, or open your IP to the public through your router.


# Tutorial

The documentation here conveys basic use patterns and methods.

**API: For a full list of methods and descriptions, see the [cheatsheet]()**


## Wall Object

A wall is a collection of browser windows that coordinate their contents. It is the central structural object of the library, because it creates a space for other materials to be added.

Create a wall (collection of browser windows):

`wall()`

With no argument, it creates one new browser window in a random location. 

A few predefined window configurations are available. This creates four new browser windows in a line:

`wall("line")`

Once a wall is created, it becomes the implied context for future methods. Therefore, writing `move()` is equal to calling `wall.move()`

##### Wall Methods:

Move the wall by an x/y amount

`move(100,50)`

Resize all windows to a specific w/h

`size(100,100)`

Scroll each window to an x/y coordinate

`scroll(50,50)`

Scroll each window equal to its x/y coordinate on the desktop. This can create an interesting illusion of 'seeing through' the wall to a website behind it.

`xray()`

Hide and show the collection of browser windows:

`hide()`

`show()`

Refresh all windows in the wall:

`refresh()`

Empty all content from a Wall:

`empty()`

Destroy the wall and return all windows to the window stack

`kill()`

And more. See the API linked to above.

## Media

In the wall, media can be added through short methods like `see()` and `hear()`

#### Referencing Media

When a piece of media is added via a line of code, that line of code will be given a corresponding line number in the live coding environment. That line number can be used as a reference for future actions on the media component. This way, the performer does not need write variables like `a = see()` because they are auto-generated

### Examples

#### Video

Create a new video element in all browser windows of a Wall. This will load the file *media/waves.mp4*

1 ~ `see("waves")`

Make the video loop from 1 sec to 2 sec

`1 skip(1,2)`

#### Audio

Create a new audio element in all browser windows of a Wall. This will load the file *media/piano.mp3*

1 ~ `hear("piano")`

Make the video loop from 1 sec to 2 sec

`1 skip(1,2)`

#### Text

Create a new text element in all browser windows of a Wall.

`write("Hello World")`







## Global (non-Wall) Media

### Speech Synthesis

We offer a built-in text-to-speech system.

`siri.say("Hello World")`

Our TTS is connected to a global audio effects chain

This is not a property of a Wall; it is only one voice and is envoked by a global `siri.say` method.


### Phone

`phone.dialtone.start()`

`phone.dial(9)`


## Global Audio

### Generators

#### sine

#### noise

### Effects

#### bandpass

#### delay

#### reverb

#### volume


## Helper functions

#### r() and rf()

random integer and random float functions

#### pick()

#### bounce()


## Shorthands

#### @

`@ N` will make the line of code repeat at N milliseconds. 

Example: scramble (random scroll) the wall every 50 ms.

`scramble() @ 50`


#### -l

Loop

Example: create 20 audio players.

`-l 20 hear("piano")`


#### &&

Call two methods at once

`scramble() && show()`


#### ||

Call one method or another

`hide() || show() @ 100`


