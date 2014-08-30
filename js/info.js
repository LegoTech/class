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

/*
_ops:{
  id:'',    //容器form
  lists: [],  //内容
  defaultv:{}  //默认值  
}
*/
info.show_search = function(_ops){
  if ( !_ops.id || !_ops.lists.length ) return;
  _ops.defaultv = _ops.defaultv || {} 
  var rhtml = ''
  //默认type为text，不为text另外说明，默认placeholder为desc
  var inputs = {
    CardNo: {
       desc: '学员卡号'
    },
    StuName: {
        desc: '学生姓名',
        autocomplete: true
    },
    School: {
        desc: '学校'
    },
    ClassId: {
        desc: '课程编号'
    },
    ClassName: {
        desc: '课程名',
        autocomplete: true
    }
  }
  var TeacherNames = {0:"xx", 1:"yy"},   //C#获得教师id和name,状态值
      Status = {0:"开始", 1:"结束" }
  var selects = {
    TeacherName: {
        desc: '教师姓名',
        options: TeacherNames
    },
    Status: {
        desc: '状态',
        options: Status
    }
  }
  var tmp = ""
  var autos = []
  var valuehtml = ""
  for (var k=0; k<_ops.lists.length; k++) {
    tmp = _ops.lists[k]
    if ( inputs[tmp] ) {
      if ( _ops.defaultv[tmp] ) {
        valuehtml = ' value="' + _ops.defaultv[tmp] + '"'
      }else{
        valuehtml = ""
      }
      rhtml += '<div class="input-prepend">\
                  <span class="add-on add-on-info">' + inputs[tmp].desc + '</span>\
                  <input name="' + tmp + '" type="' + (inputs[tmp].type||'text') +
                  '" placeholder="' + inputs[tmp].desc + '"' + valuehtml +'>\
                </div>'
      if ( inputs[tmp].autocomplete ) {autos.push(tmp)}
      continue;
    }    
    if ( selects[tmp] ) {
      rhtml += '<div class="input-prepend">\
                  <span class="add-on add-on-info">' + selects[tmp].desc + '</span>\
                  <select name="' + tmp + '"><option value="">' + selects[tmp].desc + '</option>'
      for ( key in selects[tmp]["options"] ) {
        if ( _ops.defaultv[tmp] === key ) {
          rhtml += '<option value="' + key + '" selected="selected">' + selects[tmp]["options"][key] + '</option>'
        }else{
          rhtml += '<option value="' + key + '">' + selects[tmp]["options"][key] + '</option>'
        }      
      }
      rhtml += '</select></div>'
    }
  }
  rhtml += '<a data-type="search" class="btn btn-success">搜索</a>'
  $("#"+_ops.id).empty().html(rhtml)
  for ( var i=0; i<autos.length; i++ ) {
    $("#"+_ops.id).find('input[name="'+autos[i]+'"]').autocomplete({
      source: util.autoarr[autos[i]]
    });
  }
}

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
	info.show_search({id:that._hash+"_form", lists:lists[that._hash], defaultv:that.defaultv})
  //调C#函数获取值，C#调forcs_back进行下一步操作
  forcs_back()
}

/*_ops:{
  id:'',                //容器
  operate: {},            //操作（可选）
}
*/
info.show_menu = function(_ops){
  var _el = $('#'+_ops.id)
  _el.find('.tr-ops tbody tr').mousedown(function(event){
    util.stopDefault(event)
    $('ul.rightmenu').remove()
    var $th = $(this)
    var value = $th.attr('data-value')
    if ( !value ) return;
    var rhtml = '<ul class="dropdown-menu rightmenu" style="positon:absolute;display:block;left:' +
                event.pageX + 'px;top:' + event.pageY + 'px;">'
    for ( key in _ops.operate ) {
      rhtml += '<li data-type="opmenu" data-value="' + value + '" data-op="' + key + '">\
                  <a>' + _ops.operate[key] + '</a></li>'
    }
    rhtml += '<ul/>'
    _el.append(rhtml)
  });


}

/*_ops:{
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
    tdata.push(' data-value="'+_ops.tbody[i][0]+'"')
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
    util.show_table({id:that._hash+'_result', thead:_ops.thead, tdata:tdata, tbody:_ops.tbody, sort:[], operate:operate, callback:that.show_menu });
    if ( _ops.page ) {
      $('#'+that._hash+'_result').append('<div id="'+that._hash+'_page"></div>')
      util.show_pagination({id:that._hash+'_page', cur:_ops.page.cur, count:_ops.page.count});
    }   
  }else{}

	
}

info.claer_defaultv = function(){
  info.defaultv = {}  
}

function forcs_refresh(){
  window.location.href = "info.html"
}


$(function() {
// Handler for .ready() called.
util.get_user_center()
info.hashchange()
util.show_navbar({id:"navbar", page:"info"})
util.show_tab({tid:"myTab", cid:"myTabContent", pages:info.pages, 
			prename:'<i class="icon-chevron-right"></i>', dosethash:true, clickback:info.claer_defaultv})
util.get_autoarr()

});

$(document).on('click', function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    var _ta = $(target)
    var that = info
    if ( !_ta.attr('data-type') ) {
      _ta = _ta.parents('[data-type]')
    }
    var type = _ta.attr('data-type')
    var value = _ta.attr('data-value')
    if ( type !== 'opmenu' ) {
      $('ul.rightmenu').remove()
    }
    switch ( type ) {
      case 'search':
        that.defaultv = {}
        _ta.parents('form').find(':input').each(function(index, element){
          if ( $(element).val() ) {
            that.defaultv[element.name] = $(element).val()
          }
        });
        _ta.parents('form').find('select').each(function(index, element){
          if ( $(element).val() ) {
            that.defaultv[element.name] = $(element).val()
          }
        });
        that.show()
      break; case 'page':
        //C#
      break;
    }

    
});