add = {}
add._hash = ""
/*students, classes与info.js保持一致
*/
add.pages = {
	students: {
		title: "学员信息"
	},
	classes: {
		title: "课程信息"
	},
    users: {
        title: "用户信息"
    }
}

$(function() {
// Handler for .ready() called.

var that = add
that._hash = location.hash.replace(/\#/g, '')
util.get_user_center()
if ( !that._hash || !that.pages[that._hash] || !util.user.isadmin ) {
	window.location.href = "info.html"
}




});