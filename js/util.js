util = {
    pages:{
        info: {
            title: "信息",
            url: "info.html"
        },
        charging: {
            title: "充值",
            url: "account.html#charging",
            auth: ["operator"]
        },
        consuming: {
            title: "签到",
            url: "account.html#consuming",
            auth: ["operator"]
        },
        stat: {
            title: "统计",
            url: "stat.html",
            auth: ["master", "boss"]
        },
        admin: {
            title: "管理",
            url: "admin.html",
            auth: ["master", "boss"]
        }
    },
    user:{
        name: "Username",
        auth: "operator"
    },
    center:{
        cur: 0,
        desc: {0: "xx店", 1:"yy"}
    },
    autoarr:{
        StuName: [],
        ClassName: []
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

util.numformat = function(s, n){   
   n = (n > 0 && n <= 20 ? n : 3);   
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
   var l = s.split(".")[0].split("").reverse(),   
   r = s.split(".")[1];   
   t = "";   
   for(i = 0; i < l.length; i ++ )   
   {   
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
   }   
   return t.split("").reverse().join("") + "." + r;   
} 

util.stopDefault = function(e){ 
    //阻止默认浏览器动作(W3C) 
    if ( e && e.preventDefault ) {
        e.preventDefault(); 
    //IE中阻止函数器默认动作的方式 
    }else{
        window.event.returnValue = false; 
    }
    return false; 
}

util.get_user_center = function(){
  //C#获取user信息,center信息
}

util.check_auth = function(pagekey){
  var that = this
  if (!that.user.auth) {
    that.get_user_center()
  }
  if (!that.user.auth) {
    $(document.body).html("<h1>出错了！读取不到用户权限</h1>")
    setTimeout(that.back_info(), 50000)
  }
  if ( that.pages[pagekey].auth && $.inArray(that.user.auth, that.pages[pagekey].auth)===-1 ){
    $(document.body).html("<h1>你进入了错误的位置</h1>")
    setTimeout(that.back_info(), 50000)
  }
  return true;
}

util.back_info = function(){
  window.location.href = "info.html"
}

util.get_autoarr = function(){
  //C#获取autoarr数据
}

util.set_hash = function(e){
    return location.hash = e||''
}

/*
_ops:{
    id:'',          //容器
    page:''         //页面    
}
util.pages, util.user, util.center
*/
util.show_navbar = function(_ops){
    var rhtml = '', chtml=''
    var that = this
    var ct = that.center
    chtml += '<li class="dropdown">\
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">'
                + ct.desc[ct.cur] +'<b class="caret"></b></a>\
                <ul class="dropdown-menu">'
    for ( key in ct.desc ) {
      if ( parseInt(key) === ct.cur ) {
        chtml += '<li class="active">\
                    <a data-type="center" data-value="' + key + '" href="#">' + ct.desc[key] + '</a>\
                  </li>'
      }else{
        chtml += '<li>\
                    <a data-type="center" data-value="' + key + '" href="#">' + ct.desc[key] + '</a>\
                  </li>'
      }
    }
    chtml += '</ul>\
            </li>'
    rhtml = '<div class="navbar-inner">\
        <div class="container-fluid">\
          <span class="brand">lego Tech</span>\
          <div class="nav-collapse collapse">\
            <ul class="nav pull-right">\
              <li class="dropdown">\
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">'
                + that.user.name +'<b class="caret"></b></a>\
                <ul class="dropdown-menu">\
                  <li>\
                    <a href="#user_modal" data-toggle="modal">修改密码</a>\
                  </li>\
                  <li>\
                    <a data-type="signout">注销！</a>\
                  </li>\
                </ul>\
              </li>' + chtml +
            '</ul>\
            <ul class="nav">'
    for ( key in that.pages ) {
        if ( that.pages[key].auth && $.inArray(that.user.auth, that.pages[key].auth)===-1 )  {continue;}
        if ( key === _ops.page ) {
            rhtml += '<li class="active">'
            document.title = that.pages[key].title
        }else{
            rhtml += '<li>'
        }
        rhtml += '<a href="'+that.pages[key].url+'">'+that.pages[key].title+'</a></li>'
    }
    rhtml += '</ul>\
          </div><!--/.nav-collapse -->\
        </div>\
      </div>'
    var _el = $('#'+_ops.id)
    _el.addClass('navbar navbar-inverse navbar-fixed-top').empty().html(rhtml)
    $('.dropdown-toggle').dropdown()
    that.show_modal({id:'user_modal'})
    _el.find('ul.pull-right').find('a').on('click', function(e){
      var type = $(this).attr('data-type')
      if ( !type ) return true;
      switch ( type ){
        case 'signout':
          //C#注销函数，由C#跳到login
        break; case 'center':
          var value = $(this).attr('data-value')
          if ( value === that.center.cur ) {return true;}
          //C#修改center，刷新页面forcs_refresh
          //要求每个页面都有forcs_refresh函数
        break;
      }
    });
}

/*
_ops:{
    tid:'',             //tab容器
    cid:'',             //content容器
    pages:{},           //页面
    prename:"",         //a标签内容（可选）
    dosethash:true,      //是否触发sethash
    clickback: function        //（可选）
}
util.set_hash
*/
util.show_tab = function(_ops){
  if ( !_ops.tid || !_ops.cid || !_ops.pages ) return;
    var that = this
    var _tel = $('#'+_ops.tid)
    var _cel = $('#'+_ops.cid)
    _ops.prename = _ops.prename || ""
    var thtml='', chtml=''
    for ( key in _ops.pages ) {
        if ( _ops.pages[key].hidden ) {
            thtml += '<li style="display:none;"><a href="#' + key + '" data-toggle="tab">' + 
                    _ops.prename + _ops.pages[key].title + '</a></li>'
        }else{
            thtml += '<li><a href="#' + key + '" data-toggle="tab">' + 
                    _ops.prename + _ops.pages[key].title + '</a></li>'
        }
        chtml += '<div class="tab-pane" id="' + key + '"></div>'
    }
    _tel.empty().html(thtml)
    _cel.addClass("tab-content").empty().html(chtml)
    _tel.find('a').click(function (e) {
      $(this).tab('show')
      if (_ops.dosethash ) {
        util.set_hash(this.hash.substring(1))
      }
      if ( _ops.clickback && (typeof _ops.clickback === 'function') ){
        return _ops.clickback(_ops)
      }
    });
    var af = _tel.find('a:first')
    af.tab('show')
    if (_ops.dosethash ) {
        util.set_hash(af[0].hash.substring(1))
    }
}

/*
_ops:{
	id:'',			          //容器
	thead: [],
	twidth: [],              //（可选）
	tdata: [],		           //行标志，字符串
	tbody: [],		           //数据
	sort: [],                  //(可选)
	operate: {},	          //操作（可选）
	callback: function        //（可选）
}
*/
util.show_table = function(_ops){
	var r = '', len = '', caret = ''
    if( _ops.thead ){
        caret = ' <b class="caret"></b>'
        len = _ops.thead.length
        r = '<thead><tr>'
        for(var j=0;j<len;j++){
            if( !_ops.thead[j] ) _ops.thead[j] = ''
            r += '<th width="'+(_ops.twidth?_ops.twidth[j]:'')+'">'+_ops.thead[j]+caret+'</th>'
        }
        r += '</tr></thead>'
    }else{
        len = _ops.tbody[0].length
    }
 	if( _ops.tbody ){
        r += '<tbody>'
        for(var i=0;i<_ops.tbody.length;i++){
            r += '<tr'+(_ops.tdata?_ops.tdata[i]:'')+'>'
            for(var j=0;j<len;j++){
                if( !_ops.tbody[i][j] ) _ops.tbody[i][j] = ''
                r += '<td>'+_ops.tbody[i][j]+'</td>'
            }
            r += '</tr>'
        }
        r += '</tbody>'
    }

    var _el = $('#'+_ops.id)

    _el.empty().html('<table class="table table-striped table-bordered table-hover '+(_ops.operate?' tr-ops':'')+(_ops.sort?' tablesort':'')+'">'+r+'</table>')

    var _table = _el.find('.tablesort')
    _ops.sort && _table.tablesorter({sortList: _ops.sort})

    if ( _ops.callback && (typeof _ops.callback === 'function') ){
        return _ops.callback(_ops)
    }
}

/*
_ops:{
  id:"", 
  cur:1,
  count:12
}
*/
util.show_pagination = function(_ops){
  var rhtml = '<div class="pagination">\
                <ul>'
  if ( _ops.cur===1 ) {
    rhtml += '<li class="disabled"><span>&laquo;</span></li>'
  }else{
    rhtml += '<li data-type="page" data-value="'+(_ops.cur-1)+'"><a href="#">&laquo;</a></li>'
  }
  for (var i=1; i<=_ops.count; i++) {
    if ( _ops.cur===i ){
      rhtml += '<li class="active"><span>'+i+'</span></li>'
    }else{
      rhtml += '<li data-type="page" data-value="'+i+'"><a href="#">'+i+'</a></li>'
    }
  }
  if ( _ops.cur===_ops.count ) {
    rhtml += '<li class="disabled"><span>&raquo;</span></li>'
  }else{
    rhtml += '<li data-type="page" data-value="'+(_ops.cur+1)+'"><a href="#">&raquo;</a></li>'
  }
  rhtml +=  '</ul>\
          </div>'
  $('#'+_ops.id).empty().html(rhtml)
}

/*_ops:{
  id:'',               //容器
  valueid: 1,            //如果是更新，读取数据
  valueno: "",          //课程编号for课程安排
  clickback: function     //（可选）
}
*/
util.show_modal = function(_ops){
  var _el = $('#'+_ops.id)
  var that = this
  //inputs,默认type为text，不为text另外说明，默认placeholder为desc
  //autocomplete, date, spinner为bool
  var inputs = {
    CardNo:     {desc: '学员卡号'},
    StuId:      {desc: '学生ID',        hidden: true},
    StuName:    {desc: '学生姓名',      autocomplete: true},
    School:     {desc: '学校'},
    ClassId:    {desc: '课程ID',        hidden: true},
    ClassNo:    {desc: '课程编号'},
    ClassName:  {desc: '课程名',        autocomplete: true},
    Birth:      {desc: '生日',          date: true},
    Address:    {desc: '地址'},
    Parents:    {desc: '家长'},
    Phone:      {desc: '电话'},
    WeekTime:   {desc: '每周上课'},
    Time:       {desc: '上课时间',      timepicker:true},
    PerHours:   {desc: '单次课时数',    spinner:true},
    Hours:      {desc: '总课时数',      spinner:true},
    StartTime:  {desc: '开始时间',      date:true},
    EndTime:    {desc: '结束时间',      date:true},
    OriPassword:{desc: '原始密码',      type:'password'},
    NewPassword:{desc: '新密码',        type:'password'},
    RePassword: {desc: '确认密码',      type:'password'},
    "Date":     {desc: '上课日期',      date: true},
    TimetableId:{desc: '课程表ID',      hidden: true}
  }
  var TeacherNames = {0:"xx", 1:"yy"},   //C#获得教师id和name,状态值
      Status = {0:"开始", 1:"结束" },
      ClassTypeName = {0:"xx", 1:"yy"}
  var selects = {
    TeacherId: {
        desc: '教师姓名',
        options: TeacherNames
    },
    Status: {
        desc: '状态',
        options: Status
    },
    ClassType: {
        desc: '课程类型',
        options: ClassTypeName
    }
  }
  var btns = {
    Compelete: {
        desc: '补全课程信息',
        "class" : 'modal_compelete'
    }
  }
  var title = '', lists = [], disablelists = [], defaultv = {}, content = ''
  switch ( _ops.id ) {
    case 'user_modal':
      title = '修改密码'
      lists = ['OriPassword', 'NewPassword', 'RePassword']
    break; case 'add_students_modal':
      title = '添加学员'
      lists = ['CardNo', 'StuName', 'Birth', "School", 'Address', 'Parents', 'Phone']
    break; case 'add_classes_modal':
      title = '添加课程'
      lists = ['ClassName', 'ClassNo', 'TeacherId', 'WeekTime', 'Time', 'PerHours', 'Hours', 'StartTime', 'EndTime']
      disablelists = ['Time']
    break; case 'add_timetable_modal':
      title = '添加课程安排'
      if ( _ops.valueid || _ops.valueno ) {
        defaultv = {}   //C#查数据。参数是_ops.valueid,_ops.valueno 对应课程id和课程编号。两者有一不为空
        switch ( parseInt(defaultv.Status) ) {
          case 0:             //未进行。注意！这个Status要根据是否一个星期内开始修正！！
            content = '课程尚未开始，不能添加课程安排'
          break; case 1:      //进行中
            lists = ['ClassNo', 'Compelete', 'TeacherId', 'Time', 'PerHours', 'Date']
            disablelists = ['Time']
          break; case 2:      //已结束
            content = '课程已结束，不能添加课程安排'
          break; default:
            return;
          break;
        }
      }else{
        lists = ['ClassNo', 'Compelete', 'TeacherId', 'Time', 'PerHours', 'Date']
        disablelists = ['Time']
      }
    break; case 'update_students_modal':
      if ( _ops.valueid ) {
        defaultv = {}   //C#查数据
      }
      title = '修改学员信息'
      lists = ['StuId', 'CardNo', 'StuName', 'Birth', "School", 'Address', 'Parents', 'Phone']
      disablelists = ['StuId']
    break; case 'update_classes_modal':
      if ( _ops.valueid ) {
        defaultv = {}   //C#查数据。此处id为classesID或classesNo？！
      }
      title = '修改课程信息'
      switch ( parseInt(defaultv.Status) ) {
        case 0:             //未进行
          lists = ['ClassId', 'ClassName', 'ClassNo', "TeacherId", 'WeekTime', 'Time', 'PerHours', 'Hours', 'StartTime', 'EndTime']
          disablelists = ['ClassId', 'Time']
        break; case 1:      //进行中
          lists = ['ClassName', 'ClassNo',  "TeacherId", 'WeekTime', 'Time', 'PerHours', 'Hours', 'StartTime', 'EndTime', 'ClassId']
          disablelists = ['ClassId', 'StartTime', 'Time']
        break; case 2:      //已结束
          content = '课程已结束，不能修改课程信息'
        break; default:
          return;
        break;
      }
    break; case 'update_timetable_modal':
      if ( _ops.valueid ) {
        defaultv = {}   //C#查数据。此处id为timetableID
      }
      title = '修改课程安排'
      lists = ['ClassNo', 'TeacherId', 'Time', 'PerHours', 'Date', 'TimetableId'],
      disablelists = ['Time', 'TimetableId'] 
    break; default:
      return;
    break;
  }
  
  var tmp = ''
  var autos = [], dates = [], spinners = [], timepickers = []
  var valuehtml = '', rhtml = '', timehtml = ''
  for (var k=0; k<lists.length; k++) {
    tmp = lists[k]
    if ( inputs[tmp] ) {
      if ( defaultv[tmp] ) {
        valuehtml = ' value="' + defaultv[tmp] + '"'
      }else{
        valuehtml = ""
      }
      var checkboxhtml = ''
      if ( tmp === 'WeekTime' ) {
        var enumWeek = ['其他', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
        var WeekTimeCode = []
        if (defaultv.WeekTime) {
          WeekTimeCode = defaultv.WeekTime.split('::')[1]
          if ( WeekTimeCode ) {
            WeekTimeCode = WeekTimeCode.split('')
            for ( var n=0; n<WeekTimeCode.length; n++) {
              WeekTimeCode[n] = parseInt(WeekTimeCode[n])
            }
            defaultv.WeekTime = null
          }else{
            WeekTimeCode = [0]
          }
        }   
        for ( var q=0; q<enumWeek.length; q++) {
          checkboxhtml += '<label class="checkbox inline">\
                              <input type="checkbox" value="'+q+'" name="checkweektime"'+
                              ($.inArray(q, WeekTimeCode)>-1?'checked':'')+'> ' +
                          enumWeek[q] + '</label>'
        }
        checkboxhtml += '<br/>'
      }
      if ( inputs[tmp].timepicker ) {
        timehtml = '<div id="'+_ops.id+'_'+tmp+'_timepicker">从 <span class="hour" data-type="from"></span>时<span class="minute" data-type="from"></span>分\
                    <br/>到 <span class="hour" data-type="to"></span>时<span class="minute" data-type="to"></span>分</div>'
      }else{
        timehtml = ''
      }
      rhtml += '<div class="control-group"' + (inputs[tmp].hidden?'style="display:none"':'') + '>\
                  <label class="control-label" for="' + _ops.id + '_' + tmp + '_input">' + inputs[tmp].desc + '</label>\
                  <div class="controls">'+
                    checkboxhtml +
                    '<input id="' + _ops.id + '_' + tmp + '_input" name="' + tmp + '" type="' + (inputs[tmp].type||'text') +
                    '" placeholder="' + (inputs[tmp].place ? inputs[tmp].place : inputs[tmp].desc) + '"' + valuehtml + ($.inArray(tmp, disablelists)>-1?' disabled':'') + '>\
                    <span class="help-inline"></span>' + timehtml +
                  '</div>\
                </div>'
      if ( inputs[tmp].autocomplete ) {autos.push(tmp)}
      if ( inputs[tmp].date ) {dates.push(tmp)}
      if ( inputs[tmp].spinner ) {spinners.push(tmp)}
      if ( inputs[tmp].timepicker ) {timepickers.push(tmp)}
      continue;
    }    
    if ( selects[tmp] ) {
      rhtml += '<div class="control-group">\
                  <label class="control-label" for="' + _ops.id + '_' + tmp + '_select">' + selects[tmp].desc + '</label>\
                  <div class="controls">\
                    <select name="' + tmp + '" id="' + _ops.id + '_' + tmp + '_select"><option value="">' + selects[tmp].desc + '</option>'
      for ( key in selects[tmp]["options"] ) {
        if ( defaultv[tmp] === key ) {
          rhtml += '<option value="' + key + '" selected="selected">' + selects[tmp]["options"][key] + '</option>'
        }else{
          rhtml += '<option value="' + key + '">' + selects[tmp]["options"][key] + '</option>'
        }      
      }
      rhtml += '</select><span class="help-inline"></span></div></div>'
    }
    if ( btns[tmp] ) {
      rhtml += '<div class="control-group">\
                  <div class="controls">\
                    <a class="btn btn-primary ' + btns[tmp]["class"] + '">' + btns[tmp].desc + '</a>\
                  </div></div>'
    }
  }
  if ( content )  {rhtml = content}

  var chtml = '<div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                <h3 id="myModalLabel">' + title + '</h3>\
              </div>\
              <div class="modal-body">\
                <form class="form-horizontal">'+ rhtml +'</form>\
              </div>\
              <div class="modal-footer">\
                <a class="btn" data-dismiss="modal">关闭</a>\
                <a class="btn btn-primary modal_savechange">保存</a>\
              </div>\
            </div>'
  _el.empty().html(chtml)

  $('input, textarea').placeholder();
  for ( var i=0; i<autos.length; i++ ) {
    $("#"+_ops.id).find('input[name="'+autos[i]+'"]').autocomplete({
      source: that.autoarr[autos[i]]
    });
  }
  for ( i=0; i<dates.length; i++ ) {
    var dateoption = {
      changeMonth: true,
      changeYear: true,
      dateFormat: 'yy-mm-dd'
    }
    $("#"+_ops.id).find('input[name="'+dates[i]+'"]').datepicker(dateoption);
  }
  for ( i=0; i<spinners.length; i++ ) {
    var spinneroption = {
      min: 0,
      step: 0.5
    }
    $("#"+_ops.id).find('input[name="'+spinners[i]+'"]').spinner(spinneroption);
  }
  for ( i=0; i<timepickers.length; i++ ) {
    var hourval=8, minuteval=0
    var houroption = {
      min: 6,
      max: 23,
      range: "min",
      value: hourval
    }
    var tmpname = timepickers[i]
    var tmpjqfinder = '#'+_ops.id+' '+'input[name="'+timepickers[i]+'"]'
    houroption.slide = function(event, ui){
      var type = $(ui.handle).parents('span').attr("data-type")
      var _ops = {}
      _ops.jqfinder =  tmpjqfinder
      if (type === 'from'){
        _ops.hfrom = ui.value
      }else{
        _ops.hto = ui.value
      }
      that.timepicker_input(_ops)
    }
    var minuteoption = {
      min: 0,
      max: 59,
      range: "min",
      value: minuteval
    }
    minuteoption.slide = function(event, ui){
      var type = $(ui.handle).attr("data-type")
      var _ops = {}
      _ops.jqfinder =  tmpjqfinder
      if (type === 'from'){
        _ops.mfrom = ui.value
      }else{
        _ops.mto = ui.value
      }
      that.timepicker_input(_ops)
      return true;
    }
    $("#"+_ops.id+"_"+timepickers[i]+"_timepicker").find('span.hour').slider(houroption);
    $("#"+_ops.id+"_"+timepickers[i]+"_timepicker").find('span.minute').slider(minuteoption);
    if ( !$("#"+_ops.id).find('input[name="'+timepickers[i]+'"]').val().length ){
      var timepickerval = that.time_format(hourval)+':'+that.time_format(minuteval)+'-'+that.time_format(hourval)+':'+that.time_format(minuteval) ;
      $("#"+_ops.id).find('input[name="'+timepickers[i]+'"]').val(timepickerval)
    } 
  }
  if (_el.find('[name="checkweektime"]:checked').val()!=='0'){
    _el.find('input[name="WeekTime"]').hide()
  }
  _el.find(':checkbox').click(function(){
    var _th = $(this)
    if ( _th.val()==='0' && _th.attr("checked") ) {
      _el.find(':checkbox').attr('checked', false)
      _th.attr('checked', true)
      _el.find('input[name="WeekTime"]').show()
    }else if ( _th.val()==='0' && !_th.attr("checked") ) {
      _el.find('input[name="WeekTime"]').hide()
    }else if ( _th.val()>0 && _th.attr("checked") ) {
      _el.find(':checkbox[value=0]').attr('checked', false)
      _th.attr('checked', true)
      _el.find('input[name="WeekTime"]').hide()
    }
  });

  _el.find('a.modal_savechange').click(function(){
    var inputs = _el.find('input')
    var selects = _el.find('select')
    if ( !inputs.length && !selects.length ) {
      _el.modal('hide')
      return ;
    }
    var noerror = that.valid({inputs:inputs, selects:selects})
    var defaultv = {}
    noerror && (defaultv = noerror)
    var valuestring = JSON.stringify(defaultv)
    var haserror = false
    var inputtmp
    noerror && ( haserror = eval("(" + test() + ")") )   //C#提交valuestring，返回错误列表{key:desc}或者false.WeekTime如果是1~7数字连起来，以::开头,否则直接返回描述。修改课程时从后台取信息也使用这个格式给我
    if ( noerror && !haserror ) {
      _el.find('form').effect('drop', {}, 500, function(){
        _el.modal('hide')
        setTimeout(function(){
          if ( _ops.clickback && (typeof _ops.clickback === 'function') ){
            return _ops.clickback(_ops)
          }
        },2000)
      })     
    }else{
      for ( key in haserror ) {
        inputtmp = $('#' + _ops.id + '_' + key + '_input')
        if ( !inputtmp.length ) {
          inputtmp = $('#' + _ops.id + '_' + key + '_select')
        }
        if ( !inputtmp.length ) {
          continue;
        }
        that.show_help({$th:inputtmp, desc:haserror[key], iserror:true})
      }
      _el.find('form').effect('bounce', {}, 300)
    }
  });

  _el.find('a.modal_compelete').click(function(){
    var no = _el.find('input[name="ClassNo"]').val()
    util.show_modal({id:'add_timetable_modal', valueno:no, clickback:info.show})
  });
}

/*_ops{
  jqfinder:'',
  hfrom:1,
  mfrom:0,
  hto:2,
  mto:0
}
*/
util.timepicker_input = function(_ops){
  var value = $(_ops.jqfinder).val()
  var times = value.split('-')
  var hfrom, hto, mfrom, mto
  hfrom = typeof(_ops.hfrom)!=='undefined' ? this.time_format(_ops.hfrom) : times[0].split(':')[0]
  mfrom = typeof(_ops.mfrom)!=='undefined' ? this.time_format(_ops.mfrom) : times[0].split(':')[1]
  hto = typeof(_ops.hto)!=='undefined' ? this.time_format(_ops.hto) : times[1].split(':')[0]
  mto = typeof(_ops.mto)!=='undefined' ? this.time_format(_ops.mto) : times[1].split(':')[1]
  value =  hfrom+':'+mfrom+'-'+hto+':'+mto
  $(_ops.jqfinder).val(value)
}

util.time_format = function(data){
  var n = parseInt(data)
  if (n < 10) { 
    return '0'+n ; 
  }else{
    return String(n);
  }
}

function test(){
  alert("Oh, please, I'm here...")
  return "false"
}

/*_ops:{
  $th: $(),
  desc: '',
  iserror: true
}
仅限有<span class="help-inline"></span>使用
*/
util.show_help = function(_ops){
  if ( _ops.iserror ) {
    _ops.$th.siblings('span.help-inline').empty().append(_ops.desc + ' ')
    _ops.$th.parents('.control-group').removeClass('success').addClass('error')
  }else{
    _ops.$th.siblings('span.help-inline').empty()
    _ops.$th.parents('.control-group').removeClass('error').addClass('success')
  }
}

/*_ops:{
  inputs: [],
  selects: []
}
仅限有<span class="help-inline"></span>使用
*/
util.valid = function(_ops){
    var error_num = 0, iserror = false 
        that = this
    var sqlbad_pattern = new RegExp(/select|update|delete|exec|count|=|;|%/i),
        pwd_pattern = new RegExp(/^[\w]+$/),
        tel_pattern = new RegExp(/^[0-9+-]+$/),
        number_pattern = new RegExp(/^[\d]+$/),
        date_pattern = new RegExp(/\b\d{4}[\/-]\d{1,2}[\/-]\d{1,2}\b/);

    var defaultv = {}
    var $th, val, 
        npwd = _ops.inputs.filter('[name="NewPassword"]').val(),
        weektime = '', CenterId = ''
    _ops.inputs.filter('[name="checkweektime"]:checked').each(function(){
      weektime += $(this).val()
    });
    _ops.inputs.filter('[name="CenterId"]:checked').each(function(){
      CenterId += $(this).val() + ','
    });
    _ops.inputs.each(function(index, element){
      iserror = false
      $th = $(element)
      val = $th.val()
      if ( $th.attr('type')==='checkbox' ) {
        return;
      }else if ( $th.attr('name')==='WeekTime' ) {
        if ( weektime!=='0' ) {
          weektime = '::'+weektime;
          that.show_help({$th:$th, iserror:false})
          return;
        }
      }
      if ( !val ) {
          that.show_help({$th:$th, desc:'不能为空', iserror:true})
          error_num++; iserror = true
          return ;
      }
      if ( val.length>50 ) {
        that.show_help({$th:$th, desc:'输入过长', iserror:true})
        error_num++; iserror = true
      }
      if ( sqlbad_pattern.test(val) ) {
        that.show_help({$th:$th, desc:'请不要输入特殊字符和SQL关键字', iserror:true})
        error_num++; iserror = true
      }
      switch (element.name) {
        case 'NewPassword':
          if ( val.length<6 ) {
            that.show_help({$th:$th, desc:'密码至少为六位', iserror:true})
            error_num++; iserror = true
          }
          if(!pwd_pattern.test(val)){
            that.show_help({$th:$th, desc:'密码只能由字母、数字、下划线组成', iserror:true})
            error_num++; iserror = true
          }
        break; case 'RePassword':
          if ( npwd!=undefined && npwd!=val ){
            that.show_help({$th:$th, desc:'确认密码与新密码不相同', iserror:true})
            error_num++; iserror = true
          }
        break; case 'Phone':
          if(!tel_pattern.test(val)){
            that.show_help({$th:$th, desc:'号码错误', iserror:true})
            error_num++; iserror = true
          }
        break; case 'StuId': case 'CardNo': case 'ClassId': case 'TimetableId':
          if(!number_pattern.test(val)){
            that.show_help({$th:$th, desc:'只能为数字', iserror:true})
            error_num++; iserror = true
          }
        break; case 'Birth': case 'StartTime': case 'EndTime': case 'Date':
          if(!date_pattern.test(val)){
            that.show_help({$th:$th, desc:'日期格式应为yyyy-mm-dd', iserror:true})
            error_num++; iserror = true
          }
        break; 
      }

      if ( !iserror ) {
        that.show_help({$th:$th, iserror:false})
        defaultv[element.name] = val
        defaultv.WeekTime = defaultv.WeekTime || weektime
      }
    });
    _ops.selects.each(function(index, element){
      $th = $(element)
      val = $th.val()
      if ( !val ) {
        that.show_help({$th:$th, desc:'不能为空', iserror:true})
        error_num++;
        return;
      }

      that.show_help({$th:$th, iserror:false})
      defaultv[element.name] = val
    });
    if ( _ops.inputs.filter('[name="CenterId"]').length ){
      $th = $(_ops.inputs.filter('[name="CenterId"]')[0])
      if ( CenterId.length===0 ) {
        that.show_help({$th:$th, desc:'请选择中心', iserror:true})
        error_num++;
      }else{
        defaultv.CenterId = CenterId
        that.show_help({$th:$th, iserror:false})
      }
    }
    if ( error_num ) return false;
    return defaultv
}

$(function() {
// Handler for .ready() called.
var options = {show:false}
$('div.modal').modal(options)
});