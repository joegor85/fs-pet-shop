const petRegExp = /^\/pets\/(.*)$/;
let regex = "/pets/somerandomtext".match(petRegExp);
console.log(regex);
console.log(petRegExp.test("/else/somerandomtext"));
