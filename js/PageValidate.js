
/**********************************************************************************************
| 验证属性格式：<.......... check_str="控件名称" check_type="验证类型" can_empty="true" show_span="显示提示信息SPAN的ID">
| **check_type不为空则需要验证；check_type为验证类型；can_empty为true表示可以为空，默认不能为空；
| **show_span为显示提示信息SPAN的ID，默认为span+控件ID，repeat为true表示可以重复；
|
| **如果无类型，不写check_type，验证类型包括如下：
|	  用户名：useremail
|	  密  码：password
|   确认密码：confirmpassword （当为这个类型的时候，得加上确认对象ID属性confirm_id="password"）
|	电话号码：telephone
|	  手机号：mobile
|     字符串：string,10,20（string）
|     整数型：integer,-111,120（integer）
|     浮点型：float,-2.1,10000（float）
|     日期型：date,2003年01月01日,2003年01月05日（date）
|     时间型：time,8:30,18:30（time）
|     邮  件：email
|     身份证：idcard
|     验证属性带逗号的表示最小值和最大值，如果不指定则不写，逗号不可以省略
| 作    者：周中华
| 创建日期：2006年07月05日
**********************************************************************************************/

//
var ErrorCssClass = "error_style";
var ErrorImage = "images/hand.gif";
var RightCssClass = "right_style";

function ValidateFactory(srcElement) {// 当控件失去焦点时调用，用于及时验证控件
	// 得到验证控件
	//var srcElement = event.srcElement;
	var srcID = srcElement.id;
	
	var srcValue = Trim(srcElement.value);
	var showSpanID = Trim(srcElement.show_span); //得到要显示提示信息SPAN的ID
	if (showSpanID == undefined || showSpanID.length == 0) {
		showSpanID = "span"+srcID;
	}
	
	//得到要显示提示信息SPAN
	var showSpan = document.getElementById(showSpanID);
	var checkType = "";
	if (srcElement.attributes["check_type"]) {
		checkType = Trim(srcElement.attributes["check_type"].nodeValue);
	}
	
	var checkFlag = true;
	if ((srcElement.attributes["can_empty"] == null || srcElement.attributes["can_empty"].nodeValue != "true") && srcValue.length == 0) {
		showSpan.title = "［"+srcElement.attributes["check_str"].nodeValue+"］不能为空，请重新输入！";
		if (showSpan.innerHTML.indexOf(ErrorImage) == -1) {
			showSpan.innerHTML = "<IMG align=absmiddle src='"+ErrorImage+"'>&nbsp;"+showSpan.innerHTML
		}
		showSpan.className = ErrorCssClass;
		checkFlag = false;
	}
	
	else if (srcElement.attributes["can_empty"] != null && srcElement.attributes["can_empty"].nodeValue == "true" && srcValue.length == 0) {
	}
	
	else if (checkType == "useremail") {
		var tempArr = ValidateUserEmail(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType == "password") {
		var tempArr = ValidatePassword(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType == "confirmpassword") {
		var tempArr = ValidateConfirmPassword(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType == "telephone") {
		var tempArr = ValidateTelephone(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType == "mobile") {
		var tempArr = ValidateMobile(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType == "email") {
		var tempArr = ValidateEmail(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType == "idcard") {
		var tempArr = ValidateIdcard(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType.indexOf("string") == 0) {
		var tempArr = ValidateString(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType.indexOf("float") == 0) {
		var tempArr = ValidateFloat(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType.indexOf("integer") == 0) {
		var tempArr = ValidateInteger(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType.indexOf("date") == 0) {
		var tempArr = ValidateDate(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	else if (checkType.indexOf("time") == 0) {
		var tempArr = ValidateTime(srcElement);
		if (tempArr[0] == "false") {
			SetErrorSpan(showSpan,tempArr[1]);
			checkFlag = false;
		}
	}
	
	if (checkFlag) {
		showSpan.title = "";
		if (showSpan.innerHTML.indexOf(ErrorImage) != -1) {
			showSpan.innerHTML = showSpan.innerHTML.substring(showSpan.innerHTML.indexOf(">")+7);
		}
		showSpan.className = RightCssClass;
	}
	
}

// 验证页面函数
function ValidatePage(form) {	
	var objs = form.elements;
	var obj = null;
	var jumpFromFor = true;
	for (j=0; j<objs.length; j++) {
		if (objs[j].attributes["check_str"] != null) {
			obj = objs[j];
			var checkType = "";
			if (obj.attributes["check_type"]) {
				checkType = Trim(obj.attributes["check_type"].nodeValue);
			}
			var showSpanID = "";
			if (obj.attributes["show_span"]) {
				showSpanID = Trim(obj.attributes["show_span"].nodeValue); //得到要显示提示信息SPAN的ID
			}
			if (showSpanID == "") {
				showSpanID = "span"+obj.id;
			}
			var showSpan = document.getElementById(showSpanID); //得到要显示提示信息SPAN
			
			if (obj.value.length==0) {
				if (obj.attributes["can_empty"] == null || obj.attributes["can_empty"].nodeValue!="true") {
					showSpan.title = "［"+obj.attributes["check_str"].nodeValue+"］不能为空，请重新输入！";
					if (showSpan.innerHTML.indexOf(ErrorImage) == -1) {
						showSpan.innerHTML = "<IMG align=absmiddle src='"+ErrorImage+"'>&nbsp;"+showSpan.innerHTML
					}
					showSpan.className = ErrorCssClass;
					jumpFromFor = false;
				}
			}
			else {
				
				// if (checkType == "username") {
					// var tempArr = ValidateUserName(obj);
					// if (tempArr[0] == "false") {
						// SetErrorSpan(showSpan,tempArr[1]);
						// jumpFromFor = false;
					// }
				// }
				if (checkType == "useremail") {
					var tempArr = ValidateUserEmail(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType == "password") {
					var tempArr = ValidatePassword(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType == "confirmpassword") {
					var tempArr = ValidateConfirmPassword(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType == "telephone") {
					var tempArr = ValidateTelephone(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType == "mobile") {
					var tempArr = ValidateMobile(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType == "email") {
					var tempArr = ValidateEmail(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType == "idcard") {
					var tempArr = ValidateIdcard(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType.indexOf("string") == 0) {
					var tempArr = ValidateString(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType.indexOf("float") == 0) {
					var tempArr = ValidateFloat(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType.indexOf("integer") == 0) {
					var tempArr = ValidateInteger(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType.indexOf("date") == 0) {
					var tempArr = ValidateDate(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
				else if (checkType.indexOf("time") == 0) {
					var tempArr = ValidateTime(obj);
					if (tempArr[0] == "false") {
						SetErrorSpan(showSpan,tempArr[1]);
						jumpFromFor = false;
					}
				}
			}
		}
	}
	
	return jumpFromFor;
}

function SetErrorSpan(span,errorMessage) {
	span.title = errorMessage;
	if (span.innerHTML.indexOf(ErrorImage) == -1) {
		span.innerHTML = "<IMG align=absmiddle src='"+ErrorImage+"'>&nbsp;"+span.innerHTML;
	}
	span.className = ErrorCssClass;
}

function ValidateUserEmail(obj) {// 用户名验证
	var tempArr = new Array("true","");
	var srcValue = Trim(obj.value);

	// if(IsEmail(srcValue) == false) {
		// tempArr[0] = "false";
		// tempArr[1] = "无效邮箱地址，请重新输入！";
		// return tempArr;
	// }
	
	if(srcValue.length <= 0) {
		tempArr[0] = "false";
		tempArr[1] = "用户名不能为空。";
		return tempArr;
	}
	else {
		//定义要处理数据的页面
		var weburl = "/includes/ajax/common.asp?type=checkusername&email="+srcValue;
		var response = httpRequest("get",null,weburl);
		if(response == "true") {
			tempArr[0] = "false";
			tempArr[1] = "该用户名已经被注册过了。";
			return tempArr;
		}
	}
	
	return tempArr;
}

// 密码验证
function ValidatePassword(obj) {	
	var tempArr = new Array("true","");
	var srcValue = Trim(obj.value);	
				
	if(srcValue.length <= 0) {
		tempArr[0] = "false";
		tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］密码不能为空，至少六位。";
		return tempArr;
	}
	else if(srcValue.length < 6 || srcValue.length > 40) {
		tempArr[0] = "false";
		tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］至少六位。";
		return tempArr;
	}
	return tempArr;
}

// 确认密码验证
function ValidateConfirmPassword(obj) {	
	var tempArr = new Array("true","");
	var srcValue = Trim(obj.value);
				 	
	var confirmValue = document.getElementById(Trim(obj.attributes["confirm_id"].nodeValue)).value;
			
	if(srcValue != confirmValue) {
		tempArr[0] = "false";
		tempArr[1] = "二次输入的密码不一致。";
		return tempArr;
	}
	return tempArr;
}


function ValidateTelephone(obj) {	// 电话验证
	var tempArr = new Array("true","");
	var srcValue = Trim(obj.value);
			
	if(IsTel(srcValue) == false) {
		tempArr[0] = "false";
		tempArr[1] = "电话格式不对";
		return tempArr;
	}
	return tempArr;
}


function ValidateMobile(obj) {	// 手机验证
	var tempArr = new Array("true","");
	var srcValue = Trim(obj.value);
		
	if(IsMobile(srcValue) == false) {
		tempArr[0] = "false";
		tempArr[1] = "［手机号］格式不对，请重新输入。";
		return tempArr;
	}
	else {/*
		if (obj.repeat != "true" || (obj.repeatid!=null && obj.repeatid!="")) {
			//定义要处理数据的页面
			var weburl = "../include/Ajax.aspx?gettype=isexistmobile&mobile="+srcValue;
			if (obj.repeatid!=null && obj.repeatid!="") {
				weburl += "&repeatid="+obj.repeatid;
			}

			//初始化个xmlhttp对象        
			var xmlhttp = XMLHttpFactory();
			//提交数据，第一个参数最好为get，第三个参数最好为true
			xmlhttp.open("get",weburl,true);       
			
			xmlhttp.onreadystatechange = function()//如果已经成功的返回了数据
			{            
				if(xmlhttp.readyState == 4 )//4代表成功返回数据
				{               
					var isExist = xmlhttp.responseText;//得到服务器返回的数据								
					if(isExist == "true") {
						tempArr[0] = "false";
						tempArr[1] = "<font color='#336699'>您输入的[手机号]已经存在。</font>";
						return tempArr;
					}                         
				}                   
			}
			//发送数据，请注意顺序和参数，参数一定为null或者""
			xmlhttp.send(null);
		}*/
	}
	return tempArr;
}

// 邮箱验证
function ValidateEmail(obj) {	
	var tempArr = new Array("true","");
	var srcValue = Trim(obj.value);

	if(IsEmail(srcValue) == false) {
		tempArr[0] = "false";
		tempArr[1] = "邮箱地址无效，请重新输入！";
		return tempArr;
	}
	else {/*
		if (obj.repeat != "true" || (obj.repeatid!=null && obj.repeatid!="")) {
			//定义要处理数据的页面
			var weburl = "../include/Ajax.aspx?gettype=isexistemail&email="+srcValue;    
			if (obj.repeatid!=null && obj.repeatid!="") {
				weburl += "&repeatid="+obj.repeatid;
			}

			//初始化个xmlhttp对象
			var xmlhttp = XMLHttpFactory();
			//提交数据，第一个参数最好为get，第三个参数最好为true
			xmlhttp.open("get",weburl,true);
			
			xmlhttp.onreadystatechange = function()//如果已经成功的返回了数据
			{            
				if(xmlhttp.readyState == 4 )//4代表成功返回数据
				{
					var isExist = xmlhttp.responseText;//得到服务器返回的数据
					if(isExist == "true") {
						tempArr[0] = "false";
						tempArr[1] = "<font color='#336699'>您输入["+obj.attributes["check_str"].nodeValue+"]已经存在。</font>";
						return tempArr;
					}
				}
			}
			//发送数据，请注意顺序和参数，参数一定为null或者""
			xmlhttp.send(null);
		}*/
	}
	return tempArr;
}

// 身份证
function ValidateIdcard(obj) {
	var tempArr = new Array("true","");
	var srcValue = Trim(obj.value);
	if(srcValue == 15) {
		if (!(/^([0-9]){15,15}$/.test(obj.value))) {
			tempArr[0] = "false";
			tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］无效！";
			return tempArr;
		}
	}
	else if(srcValue == 18) {
		if (!(/^([0-9]){17,17}([0-9xX]){1,1}$/.test(obj.value))) {
			tempArr[0] = "false";
			tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］无效！";
			return tempArr;
		}
	}
	return tempArr;
}

// 字符串
function ValidateString(obj) {
	var tempArr = new Array("true","");

	var length = obj.value.length;
	
	var arr = obj.attributes["check_type"].nodeValue.split(",");
	var smallLength = parseInt(arr[1]);
	var bigLength= parseInt(arr[2]);
	
	if(length < smallLength)
	{
		tempArr[0] = "false";
		tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］长度不能小于 "+smallLength+"，请重新输入！";
		return tempArr;
	}
	if(length > bigLength)
	{
		tempArr[0] = "false";
		tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］长度不能大于"+bigLength+"，请重新输入！";
		return tempArr;
	}
	return tempArr;
}

// 浮点型
function ValidateFloat(obj) {
	var tempArr = new Array("true","");

	if(!(/^([-]){0,1}([0-9]){1,}([.]){0,1}([0-9]){0,}$/.test(obj.value))) 
	{
		tempArr[0] = "false";
		tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］是无效的实数，请重新输入！";
		return tempArr;
	}
	var floatValue = parseFloat(obj.value);
	var arr = obj.attributes["check_type"].nodeValue.split(",");
	if (arr.length == 3) {
		var smallFloat = parseFloat(arr[1]);
		var bigFloat = parseFloat(arr[2]);
		if(floatValue<smallFloat)
		{
			tempArr[0] = "false";
			tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］必须大于 "+smallFloat+"，请重新输入！";
			return tempArr;
		}
		if(floatValue > bigFloat)
		{
			tempArr[0] = "false";
			tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］必须小于 "+bigFloat+"，请重新输入！";
			return tempArr;
		}
	}
	return tempArr;
}

// 整数型
function ValidateInteger(obj) {
	var tempArr = new Array("true","");

	if(!(/^([-]){0,1}([0-9]){1,}$/.test(obj.value)))
	{
		tempArr[0] = "false";
		tempArr[1]=  "［"+obj.attributes["check_str"].nodeValue+"］是无效的整数，请重新输入！";
		return tempArr;
	}
	var integerValue = parseInt(obj.value);
	var arr = obj.attributes["check_type"].nodeValue.split(",");
	if (arr.length == 3) {
		var smallInteger = parseInt(arr[1]);
		var bigInteger = parseInt(arr[2]);
		if(integerValue<smallInteger)
		{
			tempArr[0] = "false";
			tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］必须大于 "+smallInteger+"，请重新输入！";
			return tempArr;
		}
		if(integerValue > bigInteger)
		{
			tempArr[0] = "false";
			tempArr[1] = "［"+obj.attributes["check_str"].nodeValue+"］必须小于 "+bigInteger+"，请重新输入！";
			return tempArr;
		}
	}
	return tempArr;
}

// 日期型
function ValidateDate(obj) {
	var tempArr = new Array("true","");
	
	if(!(/^([0-9]){4,4}-([0-9]){2,2}-([0-9]){2,2}$/.test(obj.value)))
	{
		tempArr[0] = "false";
        tempArr[1] = "无效的日期，请按格式 \"YYYY-MM-DD\"输入！";
		return tempArr;
	}
	var arr = obj.value.match(/\d+/g);
	year = Number(arr[0]);
	month = Number(arr[1]);
	day = Number(arr[2]);
	var monthDay = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	if(year%400==0||(year%4==0&&year%100!=0))	monthDay[1] = 29;
	if(year<0 || month<0 || month>12 || day>31 ||day>monthDay[month-1])
	{
		tempArr[0] = "false";
		tempArr[1] = "无效的日期，请重新输入！";
		return tempArr;
	}
	arr = obj.attributes["check_type"].nodeValue.split(",");
	if (arr.length == 3) {
		if(arr[1].length>0)
		{
			var arr2 = arr[1].match(/\d+/g);
			var smallYear = Number(arr2[0]);
			var smallMonth = Number(arr2[1]);
			var smallDay = Number(arr2[2]);
			if(smallYear>year || (smallYear==year&&smallMonth>month) || (smallYear==year&&smallMonth==month&&smallDay>day))
			{
				tempArr[0] = "false";
				tempArr[1] = "日期必须大于 "+arr[1]+"，请重新输入！";
				return tempArr;
			}
		}
		
		if(arr[2].length>0)
		{
			arr2 = arr[2].match(/\d+/g);
			var bigYear = Number(arr2[0]);
			var bigMonth = Number(arr2[1]);
			var bigDay = Number(arr2[2]);
			if(bigYear<year || (bigYear==year&&bigMonth<month) || (bigYear==year&&bigMonth==month&&bigDay<day))
			{
				tempArr[0] = "false";
				tempArr[1] = "日期必须小于 "+arr[2]+"，请重新输入！";
				return tempArr;
			}
		}
	}
	return tempArr;
}

// 时间型
function ValidateTime(obj) {
	var tempArr = new Array("true","");

	if(!(/^([0-9]){1,2}:([0-9]){1,2}$/.test(obj.value))) 
	{
		tempArr[0] = "false";
		tempArr[1] = "无效的时间，请按格式\"hh:mm\"输入！";
		return tempArr;
	}
	var arr = obj.value.match(/\d+/g);
	hour = Number(arr[0]);
	minute = Number(arr[1]);
	if(hour<0 || hour>=24 || minute <0 || minute>=60)
	{
		tempArr[0] = "false";
		tempArr[1] = "无效的时间，请按格式\"hh:mm\"输入！";
		return tempArr;
	}
	arr = obj.attributes["check_type"].nodeValue.split(",");
	if (arr.length == 3) {
		if(arr[1].length>0)
		{
			var arr2 = arr[1].match(/\d+/g);
			var smallHour = Number(arr2[0]);
			var smallMinute = Number(arr2[1]);
			if(smallHour>hour || (smallHour==hour&&smallMinute>minute))
			{
				tempArr[0] = "false";
				tempArr[1] = "时间必须大于"+arr[1]+"，请重新输入！";
				return tempArr;
			}
		}
		
		if(arr[2].length>0)
		{	
			arr2 = arr[2].match(/\d+/g);
			var bigHour = Number(arr2[0]);
			var bigMinute = Number(arr2[1]);
			if(bigHour<hour || (bigHour==hour&&bigMinute<minute))
			{
				tempArr[0] = "false";
				tempArr[1] = "时间必须小于"+arr[2]+"，请重新输入！";
				return tempArr;
			}
		}
	}
	return tempArr;
}
