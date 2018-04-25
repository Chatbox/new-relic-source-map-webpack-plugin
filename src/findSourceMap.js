"use strict";
module.exports = children => {
   return children.reduce((m, i) => {
      let sourceMapPartials = [];

       if(i._value) {
          sourceMapPartials = i._value.split("sourceMappingURL=");
       } else {
          sourceMapPartials = i.split("sourceMappingURL=");
       }

       if (typeof i === "string" && sourceMapPartials.length > 1) {
          m = i.split("sourceMappingURL=")[1];
       }
       return m;
    }, '');
};