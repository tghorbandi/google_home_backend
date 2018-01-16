var compareIntentIdOLD = function(id) {
    var intents = {
        'intent0': function () {
            alert('Do code from intent s0');
            return 'intent0';
        },
        'intent1': function () {
            alert('Do code from intent s1');
            return 'intent1';
        },
        'intent2': function () {
            alert('Do code from intent s2');
            return 'intent2';
        }
    };
    return intents[id]();
}

compareIntentId('s2');


module.exports = {}
module.exports.compareIntentId = compareIntentId;