function introJs() {
    return {
        start: function() { return this; },
        goToStep: function() { return this; },
        exit: function() { return this; },
        onchange: function() { return this; },
        onbeforechange: function() { return this; },
        oncomplete: function() { return this; },
        onexit: function() { return this; },
        refresh: function() { return this; },
        setOption: function() { return this; },
        addStep: function() { return this; },
        addSteps: function() { return this; },
    };
}

export default introJs;
export { introJs };
