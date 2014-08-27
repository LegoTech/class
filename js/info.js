$(function() {
// Handler for .ready() called.
info = {}
info.pages = {
	student: {
		title: "学生信息"
	}
}

util.get_user()
util.show_navbar({id:"navbar", page:"info"})


});