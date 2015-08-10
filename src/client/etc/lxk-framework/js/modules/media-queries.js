define(["variables"], function(variables){
  return {
    setMediaQuery: function(breakpoint){
      var mediaQuery = "",
        digital = "only screen",
        greaterThan = "min-width",
        lessThan = "max-width",
        lessThanSmall = "(" + lessThan + ": " + variables.breakpoints.small + ")",
        greaterThanSmall = "(" + greaterThan + ": " + variables.breakpoints.small + ")",
        lessThanMedium = "(" + lessThan + ": " + variables.breakpoints.medium + ")",
        greaterThanMedium = "(" + greaterThan + ": " + variables.breakpoints.medium + ")",
        lessThanLarge = "(" + lessThan + ": " + variables.breakpoints.large + ")",
        greaterThanLarge = "(" + greaterThan + ": " + variables.breakpoints.large + ")";

      switch(breakpoint){
        case "mobile":
          mediaQuery = digital + " and " + lessThanSmall;
        break;
        case "gt-mobile":
          mediaQuery = digital + " and " + greaterThanSmall;
        break;
        case "tablet":
          mediaQuery = digital + " and " + greaterThanSmall + " and " + lessThanMedium;
        break;
        case "gt-tablet":
          mediaQuery = digital + " and " + greaterThanMedium;
        break;
        case "lt-laptop":
          mediaQuery = digital + " and " + lessThanMedium;
        break;
        case "laptop":
          mediaQuery = digital + " and " + greaterThanMedium + " and " + lessThanLarge;
        break;
        case "lt-desktop":
          mediaQuery = digital + " and " + lessThanLarge;
        break;
        case "desktop":
          mediaQuery = digital + " and " + greaterThanLarge;
        break;
        default:
          mediaQuery = breakpoint;
      }

      return mediaQuery;
    }
  }
});
