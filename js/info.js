info = {}
info.pages = {
	students: {
		title: "学员信息"
	},
	classes: {
		title: "课程信息"
	},
    charging: {
        title: "充值信息"
    },
    attendence: {
        title: "上课情况"
    },
}
info._hash = ""
info.hashchange = function(){
    var that = this
    if( 'onhashchange' in window ) {
        window.onhashchange = function(){
            that._hash = location.hash.replace(/\#|\!/g, '')
            if ( !$('#'+that._hash).html() ) {
            	console.log("update "+that._hash)
            }
            return that._hash
        }
    }
}
info.show = {}
/*
_ops:{
    hash: "",           //页面
    defaultv: {}         //搜索值
}
*/
info.show = function(_ops){
	var lists = {
        students: ["CardNo", "StuName", "School", "TeacherName"],
        classes: ["ClassId", "ClassName", "CardNo", "StuName", "TeacherName", "Status"],
        charging: ["CardNo", "StuName"],
        attendence: ["CardNo", "StuName", "ClassId", "ClassName"]
    }
    var rhtml = '<form id="'+_ops.hash+'_form"></form><div id="'+_ops.hash+'_result"></div>'
    $('#'+_ops.hash).empty().html(rhtml)
	util.show_search({id:_ops.hash+"_form", lists:lists[_ops.hash], defaultv:defaultv})
}
info.show.studentsback = function(_ops){
	util.show_table()
}

$(function() {
// Handler for .ready() called.


util.get_user()
info.hashchange()
util.show_navbar({id:"navbar", page:"info"})
util.show_tab({tid:"myTab", cid:"myTabContent", pages:info.pages, 
			prename:'<i class="icon-chevron-right"></i>', dosethash:true})



});

$(document).on('click', function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    var _ta = $(target)

    
});