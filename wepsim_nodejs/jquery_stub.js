function makeJqObj()
{
    return {
        attr: function()
        {
            return makeJqObj();
        },
        html: function()
        {
            return makeJqObj();
        },
        text: function(v)
        {
            return arguments.length ? makeJqObj() : '';
        },
        val: function(v)
        {
            return arguments.length ? makeJqObj() : '';
        },
        find: function()
        {
            return makeJqObj();
        },
        on: function()
        {
            return makeJqObj();
        },
        off: function()
        {
            return makeJqObj();
        },
        trigger: function()
        {
            return makeJqObj();
        },
        addClass: function()
        {
            return makeJqObj();
        },
        removeClass: function()
        {
            return makeJqObj();
        },
        toggleClass: function()
        {
            return makeJqObj();
        },
        append: function()
        {
            return makeJqObj();
        },
        prepend: function()
        {
            return makeJqObj();
        },
        appendTo: function()
        {
            return makeJqObj();
        },
        remove: function()
        {
            return makeJqObj();
        },
        empty: function()
        {
            return makeJqObj();
        },
        hide: function()
        {
            return makeJqObj();
        },
        show: function()
        {
            return makeJqObj();
        },
        css: function()
        {
            return makeJqObj();
        },
        data: function()
        {
            return makeJqObj();
        },
        each: function(fn)
        {
            return makeJqObj();
        },
        ready: function(fn)
        {
            return makeJqObj();
        },
        modal: function()
        {
            return makeJqObj();
        },
        alert: function()
        {
            return makeJqObj();
        },
        carousel: function()
        {
            return makeJqObj();
        },
        filter: function()
        {
            return makeJqObj();
        },
        length: 0,
        0:      null,
    };
}

var $ = function(sel)
{
    return makeJqObj();
};

$.ajax = function()
{
    return { then: function()
    {
        return $;
    }, fail: function()
    {
        return $;
    }, always: function()
    {
        return $;
    } };
};
$.getJSON = function()
{
    return { then: function()
    {
        return $;
    }, fail: function()
    {
        return $;
    }, always: function()
    {
        return $;
    } };
};
$.get = function()
{
    return { then: function()
    {
        return $;
    }, fail: function()
    {
        return $;
    }, always: function()
    {
        return $;
    } };
};
$.post = function()
{
    return { then: function()
    {
        return $;
    }, fail: function()
    {
        return $;
    }, always: function()
    {
        return $;
    } };
};
$.Deferred = function()
{
    var dfd = {
        resolve: function()
        {
            return dfd;
        },
        reject: function()
        {
            return dfd;
        },
        promise: function()
        {
            return dfd;
        },
        then: function()
        {
            return dfd;
        },
        done: function()
        {
            return dfd;
        },
        fail: function()
        {
            return dfd;
        },
        always: function()
        {
            return dfd;
        },
    };
    return dfd;
};
$.when = function()
{
    return { then: function()
    {
        return $;
    }, done: function()
    {
        return $;
    }, fail: function()
    {
        return $;
    } };
};
$.param = function()
{
    return '';
};
$.each = function(obj, fn)
{
    return obj;
};
$.extend = Object.assign;

export default $;
export { $ as jQuery };
