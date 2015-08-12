# JS Development

Unless a third-party external library (stored in /js/libs), only fully commented JS files should go in the framework respository. However, it is recommended that the require.js [optimization tool](http://requirejs.org/docs/optimization.html) be utilized during the build/deploy process to optimize these files.

## The Problem

Working with a large number of javascript files is cumbersome. There are libraries, plugins, code snippets, etc., and it can be difficult to make sure they are all included in the right order and in the right place. We've all seen an error like, `jQuery is not defined` when debugging code on some HTML page.

## The Solution

`Require.js` is a dependency management library that allows a developer to asynchronously load a group of files and execute a callback whenever that group has finished loading. As an example, if we have a script that is dependent upon jQuery, we can load jQuery along with that dependent file and execute the code once loading is complete.

## Configuration
I'm going to let you "RTFM" on this one, as the [Requirejs configuration documentation](http://requirejs.org/docs/start.html) page is very helpful!

## How it works

There are two main pieces to Require.js, `require()` and `define()`.

### Require()

Using `require()` we establish what I like to call a dependency group, or a group of files that are dependent on something else being available for them to work appropriately. Using our jQuery example, we can setup a dependency group such as this:

    require(['jquery', 'someFileDependentOnJquery'], function($, thatFile) {
       // You can now use anything dependent on jQuery reliably
    });
    
This will load both jQuery and `someFileDependentOnJquery` asynchronously, then fire the callback once both have been loaded. By doing this, we alleviate the performance bottlenecks of loading scripts sequentially if they were included on the page, as well as preventing issues that would arise if "someFileDepedentOnJquery" were loaded too soon. So we can not only use jQuery within the callback, but also any code included in "someFileDepedentOnJquery" that relies on jQuery.

### Define()

Using `define()`, we can create the 'modules' that `require()` is loading so that you can use that code. Consider these 'modules' like pieces of packaged functionality that you want to use.

To define a module, you can use the most basic example like the one below.

    define("someFileDependentOnJquery", function() {
    
      var code = {
       init: function() {
        // put init code here
       },
       changeBGColor: function() {
        $('html').css('background', '#000')
       }
      };
      
      return code
      
    });
    
Whenever `require()` makes a call to the above module, it is looking for the value that is returned. In this example, we return `var code`, which has some methods associated with it. Therefore, we can use these methods within `require()`, like so:
    
    require(['jquery', 'someFileDependentOnJquery'], function($, thatFile) {
    
       /*
        * Loading the 'someFileDependentOnJquery' module, it returns the code
        * we mentioned above. We reference that code in the callback as 'thatFile',
        * so we have access to those methods.
       */
       
       thatFile.changeBGColor(); // will change the background color
    });
    
Confusing? You'll get it, don't worry. All of the example code in this repository has a metric shit-ton of comments in it that explains everything line by line.

## Optimization

You can actually include all the code you write as-is and it will work fine. However, for production-level code there is an optimization step you can take to minify, concatenate, and uglify the JS so it is the smallest payload possible.
If you aren't up to speed with your developer-fu, the following documentation involving the node build process may be a bit overwhelming. If you're used to working with Node Package Manager and the command line, you're the one that should follow the [requirejs optimization documentation](http://requirejs.org/docs/optimization.html) and handle this process for the team.
