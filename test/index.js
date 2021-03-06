const redis = require('redis');
const assert = require('assert');
const Queue = require('../src');

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

let queue = null

describe('micro-q', () => {

    beforeEach((done) => {

        queue = new Queue({
            client: client,
            prefix: 'queue',
            key: 'bucket',
            ttl: 2
        });

        queue.empty(done);

    })

    it('should have main methods', () => {

        assert.ok(queue.size);
        assert.ok(queue.empty);
        assert.ok(queue.pop);
        assert.ok(queue.push);

    });

    it('should store items', (done) => {

        queue.push({
            a: 1
        }, (err) => {

            if (err) {
                return done(err);
            }

            queue.pop((err, item) => {

                if (err) {
                    return done(err);
                }

                assert.equal(item.a, 1);

                done();

            })

        });

    });

    it('should store zero', (done) => {

        queue.push(0, (err) => {

            if (err) {
                return done(err);
            }

            queue.pop((err, item) => {

                if (err) {
                    return done(err);
                }

                assert.strictEqual(item, 0);

                done();

            });

        });

    });

    it('should store false', (done) => {

        queue.push(false, (err) => {

            if (err) {
                return done(err);
            }

            queue.pop((err, item) => {

                if (err) {
                    return done(err);
                }

                assert.strictEqual(item, false)

                done();

            });

        });

    });

    it('should store null', (done) => {

        queue.push(null, (err) => {

            if (err) {
                return done(err);
            }

            queue.pop((err, item) => {

                if (err) {
                    return done(err);
                }

                assert.strictEqual(item, null);

                done();

            });

        });

    });

    it('should expire queue', function (done) {

        this.timeout(0);

        queue.push({
            a: 1
        }, (err) => {

            if (err) {
                return done(err);
            }

            setTimeout(() => {

                queue.pop((err, item) => {

                    if (err) {
                        return done(err);
                    }

                    assert.equal(item, null);

                    done();

                });

            }, 2500);

        });

    });

    it('should not expire queue', function (done) {

        this.timeout(0);

        queue = new Queue({
            client: client,
            prefix: 'queue',
            key: 'bucket',
            ttl: 0
        });

        queue.empty(done);

        queue.push({
            a: 1
        }, (err) => {

            if (err) {
                return done(err);
            }

            setTimeout(() => {

                queue.pop((err, item) => {

                    if (err) {
                        return done(err);
                    }

                    assert.equal(item.a, 1);

                    done();

                });

            }, 2500);

        });

    });

});