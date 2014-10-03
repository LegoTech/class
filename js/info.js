info = {}
info.pages = {
	students: {
		title: "学员信息",
    auth: ["operator", "master", "teacher", "boss"]
	},
	classes: {
		title: "课程信息",
    auth: ["operator", "master", "teacher", "boss"]
	},
  charging: {
    title: "充值信息",
    auth: ["operator", "master", "boss"]
  },
  timetable: {
    title: "课程安排",
    auth: ["teacher", "operator", "boss"]
  },
  selectclasses: {
    title: "学生选课",
    hidden: true,
    auth: ["operator"]
  },
  selectstudents: {
    title: "课程报名",
    hidden: true,
    auth: ["operator"]
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
    CardNo: {desc: '学员卡号'},
    StuId: {desc: '学员ID',},
    StuName: {desc: '学生姓名', autocomplete: true},
    School: {desc: '学校'},
    ClassId: {desc: '课程ID',},
    ClassNo: {desc: '课程编号'},
    ClassName: {desc: '课程名', autocomplete: true}
  }
  var TeacherNames = {0:"xx", 1:"yy"},   //C#获得教师id和name,状态值
      Status = {0:"开始", 1:"结束" }
  var selects = {
    TeacherId: {
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
      rhtml += '<div class="input-prepend"' + (inputs[tmp].hidden?'style="display:none"':'') + '>\
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

  $('input, textarea').placeholder();
  for ( var i=0; i<autos.length; i++ ) {
    $("#"+_ops.id).find('input[name="'+autos[i]+'"]').autocomplete({
      source: util.autoarr[autos[i]]
    });
  }
}

info.show = function(){
  var that = info
  if ( $.inArray(util.user.auth, that.pages[that._hash].auth)===-1 ) {
    $('#'+that._hash).empty().html('你进入了错误的位置')
    setTimeout(util.back_info(), 50000)
    return;
  }
	var lists = {
        students: ["CardNo", "StuId", "StuName", "School", "TeacherId", "ClassId", "ClassNo", "ClassName"],
        classes: ["ClassId", "ClassNo", "ClassName", "CardNo", "StuId", "StuName", "TeacherId", "Status"],
        charging: ["CardNo", "StuId", "StuName"],
        selectstudents: ["CardNo", "StuId", "StuName", "School"],
        selectclasses: ["ClassId", "ClassNo", "ClassName", "TeacherId", "Status"],
        timetable: []
  }
  var rhtml = '<form id="'+that._hash+'_form" class="form-inline"></form><hr/><div id="'+that._hash+'_result"></div>'
  if ( $.inArray(that._hash, ['students', 'classes', 'timetable'])>-1 && util.user.auth === "operator" ) {
    rhtml = '<p style="margin-top: 5px;">\
                <a href="#add_' + that._hash + '_modal" data-toggle="modal"><i class="icon-plus-sign opacity-5"></i>\
                 添加' + that.pages[that._hash].title + '</a>\
            </p>' + rhtml
  }
  if ( that.pages[that._hash].hidden ) {
    //select-title加js，慎改
    rhtml = '<h2 class="select-title">'+ that.pages[that._hash].title +'<small></small></h2>' + rhtml
  }
  $('#'+that._hash).empty().html(rhtml)
  if ( util.user.auth === "operator" ) {
    util.show_modal({id:'add_students_modal', clickback:info.show})
    util.show_modal({id:'add_classes_modal', clickback:info.show})
    util.show_modal({id:'add_timetable_modal', clickback:info.show})
  }
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
  _el.find('.tr-ops tbody').mousedown(function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    var _ta = $(target)
    if ( !_ta.attr('data-type') ) {
      _ta = _ta.parents('[data-type]')
    }
    util.stopDefault(e)
    $('ul.rightmenu').remove()    
    var that = info
    var value = _ta.attr('data-value')
    if ( !value || $.isEmptyObject(_ops.operate) ) return;
    var rhtml = '<ul class="dropdown-menu rightmenu" style="positon:absolute;display:block;left:' +
                e.pageX + 'px;top:' + e.pageY + 'px;">'
    for ( key in _ops.operate ) {
      rhtml += '<li data-type="opmenu" data-value="' + value + '" data-op="' + key + '">\
                  <a href="javascript(0);">' + _ops.operate[key] + '</a></li>'
    }
    rhtml += '<ul/>'
    _el.append(rhtml)
  });
}

/*_ops:{
  id:'',                //容器
  type:'',              //classes or students
  datas:[]            //数据
}
*/
info.show_calender = function(_ops){
  var _el = $('#'+_ops.id)
  _el.empty().html('<div class="calender"></div>')
  var dateoptions= {
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    maxDate: 0/*,
    beforeShowDay:*/ 
  }
  _el.find('.calender').datepicker(dateoptions);
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
    thead: ['是否选定', 'id', 'name', '操作'],
    tbody: [[1,'dd', 1], [2,'22', 0]],
    page:{            //（可选）
      cur: 1,
      count: 11
    },
    studentinfo:{
      StuName: '小分',
      CardNo: 11
    },   //如果是selectclasses
    classinfo:{
      ClassName: '橡皮泥',
      ClassId: 21
    }      //如果是selectstudents
  }
  var tdata = [],
      operate = {}
  var trlength, selectop, idvalue
  for (var i=0; i<trlength; i++) {
    tdata.push(' data-type="trmenu" data-value="'+_ops.tbody[i][0]+'"')
  }
  switch ( that._hash ) {
    case 'students':
      switch ( util.user.auth ) {
        case 'operator':
          operate = {classes: "查看参加课程", charging: "查看充值信息", AccCharging: "充值", AccConsuming: "签到",
                  update: "修改学员信息", selectclasses: "学员选课"}
        break; case 'teacher': case 'master': case 'boss':
          operate = {classes: "查看参加课程", charging: "查看充值信息"}
        break;
      } 
    break; case 'classes':
      switch ( util.user.auth ) {
        case 'operator':
          operate = {students: "查看学员信息", update: "修改课程信息", selectstudents: "课程报名", addtimetable: "添加到课程安排"}
        break; case 'teacher': case 'master': case 'boss':
          operate = {students: "查看学员信息"}
        break;
      }       
    break; case 'charging':
      switch ( util.user.auth ) {
        case 'operator':
          operate = {students: "查看学员信息", AccCharging: "充值", AccConsuming: "签到"}
        break; case 'master': case 'boss':
          operate = {students: "查看学员信息"}
        break;
      } 
    break; case 'timetable':
      switch ( util.user.auth ) {
        case 'operator':
          operate = {update: "修改本次上课情况", "delete": "删除本次课程"}
        break; 
      }  
    break;
  }
  if ( $.inArray(that._hash, ['students', 'classes', 'charging', 'timetable'])>-1 ) {
    trlength = _ops.tbody.length
    for (var i=0; i<trlength; i++) {
      idvalue = _ops.tbody[i].shift()
      tdata.push(' data-type="trmenu" data-value="'+idvalue+'"')
    }
    util.show_table({id:that._hash+'_result', thead:_ops.thead, tdata:tdata, tbody:_ops.tbody, sort:[], operate:operate, callback:that.show_menu });
    if ( _ops.page ) {
      $('#'+that._hash+'_result').append('<div id="'+that._hash+'_page"></div>')
      util.show_pagination({id:that._hash+'_page', cur:_ops.page.cur, count:_ops.page.count});
    }   
  }else if ( $.inArray(that._hash, ['selectstudents', 'selectclasses'])>-1 ) {
    if ( that._hash === 'selectclasses' ) {
      $('#selectclasses .select-title small').html(_ops.studentinfo.CardNo + ' ' + _ops.studentinfo.StuName)
    }else{
      $('#selectstudents .select-title small').html(_ops.classinfo.ClassId + ' ' + _ops.classinfo.ClassName)
    }
    trlength = _ops.tbody.length
    for (var i=0; i<trlength; i++) {
      selectop = _ops.tbody[i].pop()
      if ( parseInt(selectop)===1 ) {
        _ops.tbody[i].push('<a href="#" class="btn btn-mini" data-type="cancle" data-value="'+_ops.tbody[i][0]+
                            '"><i class="icon-remove-sign"></i> 退出</a><span class="shelp"></span>')
        _ops.tbody[i].shift() 
        _ops.tbody[i].unshift('<span class="label label-success">已选</span>')
      }else{
        _ops.tbody[i].push('<a href="#" class="btn btn-success btn-mini" data-type="select" data-value="'+_ops.tbody[i][0]+
                            '"><i class="icon-plus-sign icon-white"></i> 参与</a><span class="shelp"></span>')
        _ops.tbody[i].shift() 
        _ops.tbody[i].unshift('<span class="label">未选</span>')
      }  
    }
    util.show_table({id:that._hash+'_result', thead:_ops.thead, tdata:[], tbody:_ops.tbody, sort:[]});
    if ( _ops.page ) {
      $('#'+that._hash+'_result').append('<div id="'+that._hash+'_page"></div>')
      util.show_pagination({id:that._hash+'_page', cur:_ops.page.cur, count:_ops.page.count});
    }
  }
}

info.claer_defaultv = function(){
  info.defaultv = {}  
}

function forcs_refresh(){
  window.location.href = "info.html"
}


$(function() {
// Handler for .ready() called.
document.oncontextmenu=function(){return false;};
util.check_auth("info")
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
    if ( $.inArray(type, ['opmenu', 'trmenu'])==-1 ) {
      $('ul.rightmenu').remove()
    }
    if ( !type ) { return; }
    util.stopDefault(e)
    var value = _ta.attr('data-value')
    var op = '',          //opmenu
        doornot = false,  //opmenu
        defaultvkey = '', //opmenu
        error,            //select, cancle
        StuIdtmp, ClassIdtmp  //search
    switch ( type ) {
      case 'search':
        if ( $.inArray(that._hash, ['selectstudents', 'selectclasses'])>-1 ) {
          StuIdtmp = that.defaultv.StuId
          ClassIdtmp = that.defaultv.ClassId
        }else{
          StuIdtmp = undefined
          ClassIdtmp = undefined
        }
        that.defaultv = {
          StuId: StuIdtmp,
          ClassId: ClassIdtmp
        }
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
        //调C#函数获取值，C#调forcs_back进行下一步操作
      break; case 'opmenu':
        op = _ta.attr('data-op')
        switch ( that._hash ) {
          case 'students': case 'charging':
            defaultvkey = 'StuId'
          break; case 'classes':
            defaultvkey = 'ClassId'
          break; case 'timetable':
            defaultvkey = 'TimetableId'
          break;
        }
        if ( $.inArray(op, ['students', 'classes', 'charging', 'selectclasses', 'selectstudents'])>-1 ) {
          that.defaultv = {}
          defaultvkey && (that.defaultv[defaultvkey] = value)
          $('#'+op).html() && (doornot = true)
          util.set_hash(op)
          that._hash = op
          $('#myTab').find('a[href="#'+op+'"]').tab('show')
          doornot && that.show()
        }else{
          switch ( op ) {
            case 'update':
              util.show_modal({id:'update_'+that._hash+'_modal', valueid:value, clickback:info.show})
              $('#update_'+that._hash+'_modal').modal('show')
            break; case 'AccCharging':
              window.location.href = 'account.html?' + defaultvkey + '=' + value + '#charging'
            break; case 'AccConsuming':
              window.location.href = 'account.html?' + defaultvkey + '=' + value + '#consuming'
            break; case 'delete':
              //调用C#，从本周课程中删除该条目
            break; case 'addtimetable':
              util.show_modal({id:'add_timetable_modal', valueid:value, clickback:info.show})
              $('#add_timetable_modal').modal('show')
            break;
          }
        }
      break; case 'select':
        //调C#函数选课, that._hash是selectclasses,selectstudents
        //selectclasses: that.defaultv.StuId是学生, value是选定课程的id
        //selectstudents: that.defaultv.ClassId是课程, value是选定学生的id
        //如果出错返回"XXX操作失败",成功返回false
        error = false;
        if ( error ) {
          _ta.siblings('span.shelp').html(error)
        }else{
          _ta.removeClass('btn-success').attr('data-type', 'cancle').html('<i class="icon-remove-sign"></i> 退出')
          _ta.parents('td').siblings('td').find('span.label').addClass('label-success').html('已选')
          _ta.parents('tr').find('td').effect('highlight', {}, 500)
        }
      break; case 'cancle':
        //调C#函数退课
        error = false;
        if ( error ) {
          _ta.siblings('span.shelp').html(error)
        }else{
          _ta.addClass('btn-success').attr('data-type', 'select').html('<i class="icon-plus-sign icon-white"></i> 参与')
          _ta.parents('td').siblings('td').find('span.label').removeClass('label-success').html('未选')
          _ta.parents('tr').find('td').effect('highlight', {}, 500)
        }
      break;
    }
});