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
              that.show({hash:that._hash, defaultv:{}})
            }
            return that._hash
        }
    }
}
/*
_ops:{
    hash: "",           //页面
    defaultv: {}         //搜索值
}
*/
info.show = function(_ops){
  var that = this
  _ops.hash = _ops.hash || that._hash
  _ops.defaultv = _ops.defaultv || {}
	var lists = {
        students: ["CardNo", "StuName", "School", "TeacherName"],
        classes: ["ClassId", "ClassName", "CardNo", "StuName", "TeacherName", "Status"],
        charging: ["CardNo", "StuName"],
        attendence: ["CardNo", "StuName", "ClassId", "ClassName"]
  }
  var rhtml = '<form id="'+_ops.hash+'_form" class="form-inline"></form><hr/><div id="'+_ops.hash+'_result"></div>'
  if ( $.inArray(_ops.hash, ['students', 'classes'])>-1 ) {
    rhtml = '<p style="margin-top: 5px;">\
                <a href="add.html#' + _ops.hash + '"><i class="icon-plus-sign opacity-5"></i>\
                 添加' + that.pages[_ops.hash].title + '</a>\
            </p>' + rhtml
  }
  $('#'+_ops.hash).empty().html(rhtml)
	util.show_search({id:_ops.hash+"_form", lists:lists[_ops.hash], defaultv:_ops.defaultv})
  //调C#函数获取值，C#调forcs_back进行下一步操作
}

/*info._hash
*/
function forcs_back(_opstring){
  var that = info;
  var _ops = eval ("(" + _opstring + ")")
  if ( $.inArray(that._hash, ['students', 'classes', 'charging']) ) {
    util.show_table()
  }else{}
	
}

/*info
*/
function forcs_refresh(){
  var that = info
  util.get_user_center()
  util.show_navbar({id:"navbar", page:"info"})
  that.show({hash:that._hash, defaultv:{}})  
}


$(function() {
// Handler for .ready() called.


util.get_user_center()
info.hashchange()
util.show_navbar({id:"navbar", page:"info"})
util.show_tab({tid:"myTab", cid:"myTabContent", pages:info.pages, 
			prename:'<i class="icon-chevron-right"></i>', dosethash:true})
util.get_autoarr()

});

$(document).on('click', function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    var _ta = $(target)

    
});