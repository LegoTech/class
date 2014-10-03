stat = {}
stat._hash = ""
stat.defaultv = {}
stat.pages = {
  center: {
    title: "上课情况细则"
  },
  students: {
    title: "学生概览"
  },
	classes: {
		title: "课程概览"
	},
  teachers: {
    title: "教师概览"
  }
}
stat.hashchange = function(){
    var that = this
    if( 'onhashchange' in window ) {
        window.onhashchange = function(){
            that._hash = location.hash.replace(/\#|\!/g, '')
            if ( !$('#'+that._hash).html() ) {
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
stat.show_search = function(_ops){
  if ( !_ops.id || !_ops.lists.length ) return;
  _ops.defaultv = _ops.defaultv || {} 
  
  var rhtml = ''
  //默认type为text，不为text另外说明，默认placeholder为desc
  var inputs = {
    CardNo: {desc: '学员卡号'},
    StuId: {desc: '学员ID',},
    StuName: {desc: '学生姓名', autocomplete: true},
    ClassNo: {desc: '课程编号'},
    From: {desc: '起始时间', date: true},
    To: {desc: '终止时间', date: true}
  }
  var TeacherNames = {0:"xx", 1:"yy"}   //C#获得教师id和name,状态值
  var selects = {
    TeacherId: {
        desc: '教师姓名',
        options: TeacherNames
    }
  }
  var tmp = ""
  var autos = [], dates = []
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
      if ( inputs[tmp].date ) {dates.push(tmp)}
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
  for ( var i=0; i<dates.length; i++ ) {
    var dateoption = {
      changeMonth: true,
      changeYear: true,
      dateFormat: 'yy-mm-dd'
    }
    $("#"+_ops.id).find('input[name="'+dates[i]+'"]').datepicker(dateoption);
  } 
}

stat.show = function(){
  var that = stat
  var lists = {
        students: ["From", "To"],
        classes: [ "From", "To"],
        teachers: ["From", "To"],
        center: ["CardNo", "StuId", "StuName", "ClassNo", "TeacherId", "From", "To"]
  }
  var rhtml = '<form id="'+that._hash+'_form" class="form-inline"></form><hr/><div id="'+that._hash+'_result"></div>'
  $('#'+that._hash).empty().html(rhtml)
  var tmpdate = new Date()
  if (!that.defaultv.To) {
    that.defaultv.To = tmpdate.format("yyyy-MM-dd");
  }
  if (!that.defaultv.From) {
    tmpdate = tmpdate - 7*24*60*60*1000
    tmpdate = new Date(tmpdate)
    that.defaultv.From = tmpdate.format("yyyy-MM-dd");
  }
  that.show_search({id:that._hash+"_form", lists:lists[that._hash], defaultv:that.defaultv})
  //调C#函数获取值，C#调forcs_back进行下一步操作
  forcs_back()
}

/*_ops:{
  id:,                               //容器id
  categories: ['小芬', '小菲菲'],   //课程或学生或教师
  moneydata: [1000, 2000],    //钱数
  maxmoney: 2000,            //最大钱数
  hourdata: [13.4, 23],      //小时数
  maxhour: 23                 //最大小时数
}
*/
stat.show_chart = function(_ops){
  var moneyunit = _ops.maxmoney/_ops.maxhour, munit = ''
  if (1<moneyunit && moneyunit<10){
    moneyunit = 10
    munit = '十'
  }else if(10<moneyunit && moneyunit<100){
    moneyunit = 100
    munit = '百'
  }else if(100<moneyunit && moneyunit<1000){
    moneyunit = 1000
    munit = '千'
  }else if(1000<moneyunit && moneyunit<10000){
    moneyunit = 10000
    munit = '万'
  }
  var moneydata = _ops.moneydata 
  for (var i=0; i<moneydata.length; i++) {
    moneydata[i] = (0-moneydata[i])/moneyunit
  }
  $('#'+_ops.id).highcharts({
    chart: {
        type: 'bar'
    },
    xAxis: [{
        categories: _ops.categories,
        reversed: false
    }, { // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: _ops.categories,
        linkedTo: 0
    }],
    yAxis: {
        title: {
            text: null
        },
        labels: {
            formatter: function(){
                if (this.value<0){
                  return (0-this.value) + munit+'元';
                }else{
                  return this.value + '小时';
                }
            }
        },
        min: (0-_ops.maxmoney)/moneyunit,
        max: _ops.maxhour
    },
    
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    
    tooltip: {
        formatter: function(){
            if (this.point.y<0){
              return '<b>'+ this.point.category +'</b><br>' + Highcharts.numberFormat((0-this.point.y)*moneyunit, 1)+'元';
            }else{
              return '<b>'+ this.point.category +'</b><br>' + Highcharts.numberFormat(this.point.y, 1)+'小时';
            }
        }
    },
    
    series: [{
        name: '总金额',
        data: moneydata
    }, {
        name: '总课时',
        data: _ops.hourdata
    }]
  });
}

/*_ops:{    
//本店细则时返回detail，学生、课程、教师返回abstract。
如果detail返回多条，每页明细少一点
  detail:[],  
  abstract:{}
}
*/
function forcs_back(_opstring){
  var that = stat
  var _ops = {detail:[{
    sum: {
      time: 192,
      money: 2000000.01
    },
    thead: ['是否选定', 'id', 'name', '操作'],
    tbody: [[1,'dd', 1], [2,'22', 0]],
    page:{            //（可选）
      cur: 1,
      count: 11
    },      //可选
    errorinfo:""    //可选
  },{   
    condition: {          //可省略
      id: 12,
      name: '小芬',  
      desc: '学校：家里蹲大学  卡号：10293'
    },
    sum: {
      time: 192,
      money: 2000000.01
    },
    thead: ['是否选定', 'id', 'name', '操作'],
    tbody: [[1,'dd', 1], [2,'22', 0]],
    page:{            //（可选）
      cur: 1,
      count: 11
    },      //可选
    errorinfo:""    //可选
  }],abstract:{
    categories: ['小芬', '小菲菲'],   //课程或学生或教师
    moneydata: [1000.223111, 2000],    //钱数
    maxmoney: 2000,            //最大钱数
    hourdata: [13.4231, 23],      //小时数
    maxhour: 23                 //最大小时数
  }}    //eval方法解_opstring
  var rhtml = ''
  var detail = _ops.detail
  var abs = _ops.abstract
  if (that._hash === 'center') {
    var i = 0, l = detail.length, d = {}, options = {}
    var con = {}
    for (;i<l;i++){
      d = detail[i]
      con = d.condition
      rhtml += '\
        <div class="statunit">\
          <div class="row">\
            <div class="span4" style="position: relative;">'+             
              ( (con&&con.name)?'<h3>'+con.name+'</h3>':'') +
              ( (con&&con.desc)?'<p>'+con.desc+'</p>':'') +
              ( (l>1 && con)?'<a class="btn btn-success" data-type="searchById" data-value="'+con.id+'">选定该学生</a>':'') +
            '</div>\
            <div class="span4 sum"><span class="strong">'+ util.numformat(d.sum.time) +'</span>小时\
              <p class="muted">总课时</p>\
            </div>\
            <div class="span4 sum"><span class="strong">'+ util.numformat(d.sum.money) +'</span>￥\
              <p class="muted">总金额</p>\
            </div>\
          </div><hr/>\
          <div id="'+ that._hash+'_result_'+( (l>1 && con)?con.id:'') +'"></div>\
        </div>'  
    }
    $('#'+that._hash+'_result').html(rhtml)
    for (i=0;i<l;i++){
      d = detail[i]      
      options = {}
      $.extend(options, d)
      if (d.condition && d.condition.id) {
        options.id = that._hash+'_result_'+d.condition.id
      }else{
        options.id = that._hash+'_result_'
      }
      options = JSON.stringify(options)
      forcs_pageback(options)
    }
  }else{
    var options = {}
    $.extend(options, _ops.abstract)
    options.id = that._hash+'_result'
    $('#'+that._hash+'_result').addClass('highchartscontainer')
    that.show_chart(options)
  }
}

/*_ops:{
  id:,              //容器id
  thead: [],
  tbody: [[], []],  //要求表每一行第一位必须是id。
  page:{            //（可选）
    cur: 1,
    count: 11
  },
  errorinfo:""
}
*/
function forcs_pageback(_opstring){
  var that = stat;
  var _ops = eval ("(" + _opstring + ")")
  var tdata = []
  var trlength, selectop, idvalue
  for (var i=0; i<trlength; i++) {
    tdata.push(' data-type="trmenu" data-value="'+_ops.tbody[i][0]+'"')
  }
  if ( $.inArray(that._hash, ['students', 'classes', 'teachers', 'center'])>-1 ) {
    trlength = _ops.tbody.length
    for (var i=0; i<trlength; i++) {
      idvalue = _ops.tbody[i].shift()
      tdata.push(' data-type="trmenu" data-value="'+idvalue+'"')
    }
    util.show_table({id:_ops.id, thead:_ops.thead, tdata:tdata, tbody:_ops.tbody, sort:[], callback:that.show_menu });
    if ( _ops.page ) {
      $('#'+_ops.id).append('<div id="'+_ops.id+'_page" data-valueid="'+_ops.id.split('_result_')[1]+'"></div>')
      util.show_pagination({id:_ops.id+'_page', cur:_ops.page.cur, count:_ops.page.count});
    }
    if (_ops.errorinfo) { $('#'+_ops.id).prepend('<div class="hero-unit"><h4>'+_ops.errorinfo+'</h4></div>') }
  }
}

function forcs_refresh(){
  window.location.href = "stat.html"
}

$(function() {
// Handler for .ready() called.

var that = stat
util.check_auth("stat")
that.hashchange()
util.show_navbar({id:"navbar", page:"stat"})
util.show_tab({tid:"myTab", cid:"myTabContent", pages:that.pages, 
			prename:'<i class="icon-chevron-right"></i>', dosethash:true})

});

$(document).on('click', function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    var _ta = $(target)
    var that = stat
    if ( !_ta.attr('data-type') ) {
      _ta = _ta.parents('[data-type]')
    }
    var type = _ta.attr('data-type')
    if ( !type ) { return; }
    util.stopDefault(e)
    var value = _ta.attr('data-value')
    var valueid, eleid, _ancestor  //page
    switch ( type ) {
      case 'search':
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
        _ancestor = _ta.parents('[data-valueid]')
        valueid = _ancestor.attr('data-valueid')
        eleid = _ancestor[0].id
        //调C#函数获取值，C#调forcs_pageback进行下一步操作, value是第几页，valueid是id，eleid是容器id
      break; case 'searchById':
        if (value) {that.defaultv.StuId = value}
        //调C#函数获取值，C#调forcs_back进行下一步操作
      break;
    }
});