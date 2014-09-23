acc = {}
acc._hash = ""
acc._search = ""
acc.lastconsuming = {}
acc.infos = {}
acc.pages = {
  consuming: {
    title: "签到"
  },
  charging: {
    title: "充值"
  }
}
acc.hashchange = function(){
    var that = this
    if( 'onhashchange' in window ) {
        window.onhashchange = function(){
            $('#'+that._hash).hide()
            that._hash = location.hash.replace(/\#|\!/g, '')
            $('#'+that._hash).show()
            util.show_navbar({id:"navbar", page:that._hash})
            if ( !$('#'+that._hash).html() ) {
              that.show()
            }
            return that._hash
        }
    }
}

acc.show = function(){
  var that = this
  var rhtml = ''
  var inputs = {
    StuName:    {desc: '学生姓名',      disabled:true},
    ChargingHours:{desc: '充值金额'},
    ChargingMoney:{desc: '充值课时'},
    TicketId:   {desc: '票据号'},
    Hours:      {desc: '课时数',        disabled:true},
    StartTime:  {desc: '开始时间',      disabled:true},
    EndTime:    {desc: '结束时间',      disabled:true},
    Time:       {desc: '上课时间',      disabled:true} 
  }
  var ClassNames = {0:"xx", 1:"yy"}   //C#获得教师id和name,状态值
  var selects = {
    ClassId: {
        desc: '课程',
        options: ClassNames
    }
  }
  var lists = []
  var defaultv = {}, iclasses = [], haslastclass = false
  var dates = []
  if ( !that._search && $.isEmptyObject(that.infos) ) {
    rhtml = '<h3>'+that.pages[that._hash].title+'请刷卡</h3>'
  }else if ( $.isEmptyObject(that.infos) ){
    //调C#函数，将that._search内容传给后台，后台再调forcs_getinfo
    that._search = ''
    return;
  }else if ( that.infos.error ) {
    rhtml = '<h3>'+that.infos.error+'请重新刷卡</h3>'
  }else{
    switch ( that._hash ) {
      case 'consuming':
        that.infos = {
          StuId:1,
          StuName: "小分",
          classes: [
            {ClassId:1,
            ClassName:"算数",
            StartTime:"13-01-31",
            EndTime:"13-02-21",
            Time: "13-02-11",
            Hours: 1.5
            }
          ]
        }
        lists = ['StuName', 'ClassId', 'StartTime', 'EndTime', 'Time', 'Hours']
        iclasses = that.infos.classes
        if ( that.lastconsuming ) {
          for ( var j=0; j<iclasses.length; j++ ) {
            if ( iclasses[j].ClassId==that.lastconsuming.ClassId ) {haslastclass=true; break;}
          }  
        }
        if ( haslastclass ) {
          defaultv = {
            StuId: that.infos.StuId,
            StuName: that.infos.StuName,
            ClassId: iclasses[j].ClassId,
            StartTime: iclasses[j].StartTime,
            EndTime: iclasses[j].EndTime,
            Time: iclasses[j].Time,
            Hours: iclasses[j].Hours
          }
        }else{
          defaultv = {StuName: that.infos.StuName}
        }
      break; case 'charging':
        that.infos = {
          StuId:1,
          StuName: "小分"
        }
        lists = ['StuName', 'ClassSet', 'SetCount', 'ChargingMoney', 'ChargingHours', 'TicketId']
        defaultv = {
          StuId: that.infos.StuId,
          StuName: that.infos.StuName
        }
      break;
    }
    
    var tmp = ''
    var valuehtml = '', rhtml = ''
    rhtml = '<form class="form-horizontal" data-value="'+defaultv.StuId+'">'
    for (var k=0; k<lists.length; k++) {
      tmp = lists[k]
      if ( inputs[tmp] ) {
        if ( defaultv[tmp] ) {
          valuehtml = ' value="' + defaultv[tmp] + '"'
        }else{
          valuehtml = ""
        }
        rhtml += '<div class="control-group">\
                    <label class="control-label" for="' + that._hash + '_' + tmp + '_input">' + inputs[tmp].desc + '</label>\
                    <div class="controls">\
                      <input id="' + that._hash + '_' + tmp + '_input" name="' + tmp + '" type="' + (inputs[tmp].type||'text') +
                      '" placeholder="' + inputs[tmp].desc + '"' + valuehtml + (inputs[tmp].disabled?' disabled':'') + '>\
                    </div>\
                  </div>'
        if ( inputs[tmp].date ) {dates.push(tmp)}
        continue;
      }    
      if ( selects[tmp] ) {
        rhtml += '<div class="control-group">\
                    <label class="control-label" for="' + that._hash + '_' + tmp + '_select">' + selects[tmp].desc + '</label>\
                    <div class="controls">\
                      <select name="' + tmp + '" id="' + that._hash + '_' + tmp + '_select"><option value="">' + selects[tmp].desc + '</option>'
        for ( key in selects[tmp]["options"] ) {
          if ( defaultv[tmp] === key ) {
            rhtml += '<option value="' + key + '" selected="selected">' + selects[tmp]["options"][key] + '</option>'
          }else{
            rhtml += '<option value="' + key + '">' + selects[tmp]["options"][key] + '</option>'
          }
        } 
      }
      rhtml += '</select><span class="help-inline"></span></div></div>'
    }  
    rhtml += '<div class="control-group">\
                <div class="controls">\
                  <a class="btn btn-large btn-primary submit">'+that.pages[that._hash].title+'</a>\
              </div></div>'
    rhtml += '</form>'
  }
  var _el = $('#'+that._hash)
  _el.empty().html(rhtml)
  $('input, textarea').placeholder();
  
  !(function (infos){
    var iclasses = []
    $.extend(iclasses, infos.classes)

    _el.find('select').change(function(){
      var ClassId = parseInt($(this).val())
      for ( var j=0; j<iclasses.length; j++ ) {
        if ( iclasses[j].ClassId==ClassId ) {break;}
      } 
      _el.find('input[name="StartTime"]').val(iclasses[j].StartTime)
      _el.find('input[name="EndTime"]').val(iclasses[j].EndTime)
      _el.find('input[name="Time"]').val(iclasses[j].Time)
      _el.find('input[name="Hours"]').val(iclasses[j].Hours)
    });
    /*
    function spinnerchange(){
      var count = parseInt($(this).val())
      _el.find('input[name="ChargingMoney"]').val((parseFloat(that.infos.ClassSet.Money)*count) + '元')
      _el.find('input[name="ChargingHours"]').val((parseFloat(that.infos.ClassSet.Hours)*count) + '课时')
    }
    var spinneroption = {
      min: 1,
      step: 1,
      change: spinnerchange,
      stop: spinnerchange
    }
    _el.find('input[name="SetCount"]').spinner(spinneroption);
    for ( i=0; i<dates.length; i++ ) {
      var dateoption = {
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',
        defaultDate: 0
      }
      _el.find('input[name="'+dates[i]+'"]').datepicker(dateoption);
    }

    var Hoursoption = {
      min: 0.5,
      step: 0.5,
      value: defaultv.Hours
    }
    _el.find('input[name="Hours"]').spinner(Hoursoption);*/

    _el.find('a.submit').on('click', function(e){
      var that = acc
      var _el = $('#'+that._hash)
      var _ta = $(this)
      var StuId = parseInt($(this).siblings('form').attr('data-value'))
      var sendvalues = {}
      var error = false, returnerror = false
      if ( acc._hash === 'consuming' ) {
        var ClassId = _el.find('select[name="ClassId"]').val()
        sendvalues.ClassId = ClassId
        _ta.parents('form').find('input').each(function(index, element){
          if ( $(element).val() ) {
            sendvalues[element.name] = $(element).val()
            util.show_help({$th:$(element), iserror:false})
          }
        });
        if ( !ClassId ) {
          util.show_help({$th:_el.find('select[name="ClassId"]'), desc:'请选择课程', iserror:true})
          error = true
        }
        if ( !Time ) {
          util.show_help({$th:_el.find('input[name="Time"]'), desc:'请选择上课时间', iserror:true})
          error = true  
        }
        if ( error ){
          _el.find('form').effect('bounce', {}, 1000, function(){});
          return;
        }
        $.extend(that.lastconsuming, sendvalues)
      }else{
        _ta.parents('form').find('input').each(function(index, element){
          if ( $(element).val() ) {
            sendvalues[element.name] = $(element).val()
            util.show_help({$th:$(element), iserror:false})
          }else{
            util.show_help({$th:$(element), desc:'不能为空', iserror:true})
            error = true
          }
        });
        if ( error ){
          _el.find('form').effect('bounce', {}, 1000, function(){});
          return;
        }
      }
      //调C#函数提交
      if (returnerror) {  //C#返回值赋给returnerror。如果没有错返回false。有错返回{填错数据名：错误原因}
        for (var key in returnerror) {
          util.show_help({$th:_el.find('input[name="'+key+'"]'), desc:returnerror[key], iserror:true})
        }
        _el.find('form').effect('bounce', {}, 1000, function(){});
        return;
      }
      $(this).parents('form').effect('drop', {}, 1000, function(){
        window.location.href = 'account.html#'+that._hash
        that.infos = {}
        that.show()
      });
    });
  })(that.infos);
}

/*C#调该函数将信息传给前台,两种infos见63行和95行,如果查询出错或者无结果返回{error:"xxx出错"}
*/
function forcs_getinfo(){
  acc.infos = {}
  acc.show()
}

function forcs_refresh(){
  window.location.href = "account.html"
}

$(function() {
// Handler for .ready() called.

var that = acc
that._hash = location.hash.replace(/\#|\!/g, '')
that._search = location.search.replace(/\?/g, '')
util.get_user_center()
that.hashchange()
if ( !that._hash ) {
  util.set_hash('consuming')
  that._hash = 'consuming'
}
util.show_navbar({id:"navbar", page:that._hash})
$('#charging').hide()
$('#consuming').hide()
$('#'+that._hash).show()
that.show()

    var width = document.width || document.body.clientWidth || document.documentElement.clientWidth 
    var x = (width-1654)/2
    var y = 3308/width/width - 2/width
    var w = width/2
  $(document).mousemove(function(e){
    if ( e.pageX<w ) {
      $('div.background').css('background-position', ( x + y*(e.pageX-w)*(e.pageX-w) )+'px 35px')
    }else{
      $('div.background').css('background-position', ( x - y*(e.pageX-w)*(e.pageX-w) )+'px 35px')
    }
  });
});


