# micro-redis-queue
Simple micro queue for redis

[![Build Status](https://travis-ci.org/syd619/micro-redis-queue.svg?branch=master)](https://travis-ci.org/syd619/micro-redis-queue)
[![npm version](https://badge.fury.io/js/micro-redis-queue.svg)](https://badge.fury.io/js/micro-redis-queue)
[![Known Vulnerabilities](https://snyk.io/test/github/syd619/micro-redis-queue/badge.svg?targetFile=package.json)](https://snyk.io/test/github/syd619/micro-redis-queue?targetFile=package.json)

## Installation

``` bash
$ npm install micro-redis-queue
```

## Description

Simple micro fifo queue for redis. You can push, pop, empty and get the size of your queue.

## Usage

```javascript
const redis = require('redis');
const Queue = require('micro-redis-queue');

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
})

// default settings
const queue = new Queue({
    client: client,     // redis client
    prefix: 'queue',    // queue key prefix
    key: 'bucket',      // queue key
    ttl: 900,           // queue ttl (0 will never expire)
    replacer: null      // optional method used for serialization, see 1
    reviver: null       // optional method used for de-serialization, see 2
});

// 1 - replacer -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
// 2 - reviver -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

// add items in queue
queue.push({name:'John'}, (err) => {

    if (err) {
        console.error(err);
    } else {
        // do your thing...
    }

});

// retrieve item from queue
queue.pop((err, item) => {

    if (err) {
        console.error(err);
    } else if (item) {
        console.log('Hello', item.name);    // Hello John
    } else {
        // do your other thing....
    }

});

// get size of queue
queue.size((err, len) => {

    if (err) {
        console.error(err);
    } else {
        console.log('queue has', len, 'items');
    }

});

// empty queue and remove from redis
queue.empty((err) => {

    if (err) {
        console.error(err);
    } else {
        // do your thing...
    }

});

// Static serialization and de-serialization methods used
Queue.serialize = (obj, replacer) => {}     // replacer declared in options
Queue.deserialize = (str, reviver) => {}    // reviver declared in options

```

## License

(The MIT License)

Copyright (c) 2019 Panagiotis Raditsas

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.