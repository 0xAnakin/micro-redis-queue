const defaults = {
    client: null,
    key: 'default',
    prefix: 'queue',
    ttl: 900,
    replacer: null,
    reviver: null
};

const noop = () => {};

class Queue {

    constructor(options = {}) {

        this.options = {
            ...defaults,
            ...options
        };

        if (!this.options.client) {
            throw new Error('You must provide a valid redis client. Check redis & redis-clustr modules.');
        }

        if (typeof this.options.prefix !== 'string' || !this.options.prefix.trim().length) {
            throw new Error('You must provide a valid queue key prefix.');
        }

        if (typeof this.options.key !== 'string' || !this.options.key.trim().length) {
            throw new Error('You must provide a valid queue key.');
        }

        if (!Number.isInteger(this.options.ttl) || this.options.ttl < 0) {
            throw new Error('You must provide a valid integer ttl greater than -1.');
        }

        this.key = `${this.options.prefix}:${this.options.key}`;

    }

    get client() {
        return this.options.client;
    }

    size(callback = noop) {
        this.client.llen(this.key, callback);
    }

    empty(callback = noop) {
        this.client.ltrim(this.key, 1, 0, callback);
    }

    pop(callback = noop) {

        this.client.lpop(this.key, (err, res) => {

            if (err) {
                callback(err);
            } else {

                callback(null, Queue.deserialize(res, this.options.reviver));

                if (this.options.ttl) {

                    this.client.expire(this.key, this.options.ttl, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });

                }

            }

        });

    }

    push(item, callback = noop) {

        this.client.rpush(this.key, Queue.serialize(item, this.options.replacer), (err, res) => {

            if (err) {
                callback(err);
            } else {

                callback(null, res);

                if (this.options.ttl) {

                    this.client.expire(this.key, this.options.ttl, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });

                }

            }

        });

    }

}

Queue.serialize = function (obj, replacer) {
    return (replacer instanceof Function) ? JSON.stringify(obj, replacer) : JSON.stringify(obj);
}

Queue.deserialize = function (str, reviver) {
    return (reviver instanceof Function) ? JSON.parse(str, reviver) : JSON.parse(str);
}

module.exports = Queue;