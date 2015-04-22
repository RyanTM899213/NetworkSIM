# incRDT: A simple replicated integer counter data type

A Counter object has two public methods:

    var c = new Counter();
    c.dec();    // increment the counter
    c.val();    // read the counter value


The Counter object will be created for you and automatically replicated at each
device object from the `deviceIterator` you passed in to the module's `init`
method. There is no need to create Counter objects by yourself. In fact, the
Counter constructor function is not even exported.

You should use the device object's `accessRDT` method to grab the copy of a
Counter that is created for you. Read the `network_topology.js` file and check
the interface of `Device`.
