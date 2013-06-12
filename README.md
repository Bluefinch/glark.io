#glark.io#

[![Build Status](https://travis-ci.org/Bluefinch/glark.io.png)](https://travis-ci.org/Bluefinch/glark.io)

glark.io is an emanation of the incrediblissime [Codiad](https://github.com/Codiad/Codiad). While we are moving to rewrite Codiad using the [angularjs](http://angularjs.org) framework, we thought that we needed an intermediary project to practice it. In short, glark.io will be a kind of notepad in the browser. 

##Architecture outline##
The _glark_ directory will contain the client side code, an editor based on our Codiad and Ace experience. This editor will be served by the server side code, located inside the _cabble_ directory. This server side should be using [nodejs](http://nodejs.org).

##License###
glark.io is distributed under the terms of the [Affero GPL license](http://www.gnu.org/licenses/why-affero-gpl.html).

_Status:_ Alpha state, main editing features are here. The [glarkconnector](https://github.com/Bluefinch/glarkconnector) stuff works.
