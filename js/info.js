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
info.defaultv = {}
info.hashchange = function(){
    var that = this
    if( 'onhashchange' in window ) {
        window.onhashchange = function(){
            that._hash = location.hash.replace(/\#|\!/g, '')
            if ( !$('#'+that._hash).html() ) {
            	console.log("update "+that._hash)
              that.show()
            }
            return that._hash
        }
    }
}

/*defaultv
*/
info.show = function(){
  var that = this
	var lists = {
        students: ["CardNo", "StuName", "School", "TeacherName"],
        classes: ["ClassId", "ClassName", "CardNo", "StuName", "TeacherName", "Status"],
        charging: ["CardNo", "StuName"],
        attendence: ["CardNo", "StuName", "ClassId", "ClassName"]
  }
  var rhtml = '<form id="'+that._hash+'_form" class="form-inline"></form><hr/><div id="'+that._hash+'_result"></div>'
  if ( $.inArray(that._hash, ['students', 'classes'])>-1 ) {
    rhtml = '<p style="margin-top: 5px;">\
                <a href="add.html#' + that._hash + '"><i class="icon-plus-sign opacity-5"></i>\
                 添加' + that.pages[that._hash].title + '</a>\
            </p>' + rhtml
  }
  $('#'+that._hash).empty().html(rhtml)
	util.show_search({id:that._hash+"_form", lists:lists[that._hash], defaultv:that.defaultv})
  //调C#函数获取值，C#调forcs_back进行下一步操作
  forcs_back()
  return ;
}

/*info._hash
_ops:{
  thead: [],
  tbody: [[], []],  //要求表每一行第一位必须是id。
  page:{            //（可选）
    cur: 1,
    count: 11
  }
}
*/
function forcs_back(_opstring){
  var that = info;
  //var _ops = eval ("(" + _opstring + ")")
  _ops = {
    thead: ['id', 'name'],
    tbody: [[1,'dd'], [2,'22']],
    page:{            //（可选）
      cur: 1,
      count: 11
    }
  }
  var tdata = [],
      operate = {}
  var trlength = _ops.tbody.length
  for (var i=0; i<trlength; i++) {
    tdata.push('data-value="'+_ops.tbody[i][0]+'"')
  }
  switch ( that._hash ) {
    case 'students':
      operate = {classes: "查看参加课程", charging: "查看充值信息", attendence: "查看上课情况", StutoAccChar: "充值", StutoAccCon: "消费",
                StutoAdd: "修改学员信息", StutoSelect: "学员选课"}
    break; case 'classes':
      operate = {students: "查看学员信息", attendence: "查看上课情况"}
    break; case 'charging':
      operate = {students: "查看学员信息"}
    break;
  }
  if ( $.inArray(that._hash, ['students', 'classes', 'charging'])>-1 ) {
    util.show_table({id:that._hash+'_result', thead:_ops.thead, tdata:tdata, tbody: _ops.tbody, sort:[], operate:operate });
    if ( _ops.page ) {
      $('#'+that._hash+'_result').append('<div id="'+that._hash+'_page"></div>')
      util.show_pagination({id:that._hash+'_page', cur:_ops.page.cur, count:_ops.page.count});
    }   
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