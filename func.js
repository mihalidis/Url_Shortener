
exports.hashCode = (num) => {

var hash = 0;
for(var i=0; i < num.length; i++){
	var character = num.charCodeAt(i);
	hash = ((hash<<5) - hash) + character;
	hash = hash & hash;
}
	return hash;
}