//Javascript name: My Date Time Picker਍⼀⼀䐀愀琀攀 挀爀攀愀琀攀搀㨀 ㄀㘀ⴀ一漀瘀ⴀ㈀　　㌀ ㈀㌀㨀㄀㤀ഀ
//Scripter: TengYong Ng਍⼀⼀圀攀戀猀椀琀攀㨀 栀琀琀瀀㨀⼀⼀眀眀眀⸀爀愀椀渀昀漀爀攀猀琀渀攀琀⸀挀漀洀ഀ
//Copyright (c) 2003 TengYong Ng਍⼀⼀䘀椀氀攀一愀洀攀㨀 䐀愀琀攀吀椀洀攀倀椀挀欀攀爀开挀猀猀⸀樀猀ഀ
//Version: 2.0.2਍⼀⼀ 一漀琀攀㨀 倀攀爀洀椀猀猀椀漀渀 最椀瘀攀渀 琀漀 甀猀攀 愀渀搀 洀漀搀椀昀礀 琀栀椀猀 猀挀爀椀瀀琀 椀渀 䄀一夀 欀椀渀搀 漀昀 愀瀀瀀氀椀挀愀琀椀漀渀猀 椀昀ഀ
//       header lines are left unchanged.਍⼀⼀䐀愀琀攀 挀栀愀渀最攀搀㨀 ㈀㐀ⴀ䐀攀挀ⴀ㈀　　㜀 戀礀 䈀甀爀最猀漀昀琀 ⠀䠀漀氀氀愀渀搀⤀ഀ
//Changed: Year picker as drop down. Code optimised. Tables filled with blank fields as needed.਍⼀⼀䬀渀漀眀渀 ⠀渀漀渀 昀愀琀愀氀⤀ 椀猀猀甀攀㨀 樀愀瘀愀猀挀爀椀瀀琀 爀攀洀愀椀渀猀 爀甀渀渀椀渀最 愀昀琀攀爀 洀漀渀琀栀 漀爀 礀攀愀爀 猀攀氀攀挀琀ഀ
//New Css style version added by Yvan Lavoie (Québec, Canada) 29-Jan-2009਍ഀ
//Global variables਍瘀愀爀 眀椀渀䌀愀氀㬀ഀ
var dtToday;਍瘀愀爀 䌀愀氀㬀ഀ
਍瘀愀爀 䴀漀渀琀栀一愀洀攀㬀ഀ
var WeekDayName1;਍瘀愀爀 圀攀攀欀䐀愀礀一愀洀攀㈀㬀ഀ
਍瘀愀爀 攀砀䐀愀琀攀吀椀洀攀㬀⼀⼀䔀砀椀猀琀椀渀最 䐀愀琀攀 愀渀搀 吀椀洀攀ഀ
var selDate;//selected date. version 1.7਍ഀ
var calSpanID = "calBorder"; // span ID ਍瘀愀爀 搀漀洀匀琀礀氀攀㴀渀甀氀氀㬀 ⼀⼀ 猀瀀愀渀 䐀伀䴀 漀戀樀攀挀琀 眀椀琀栀 猀琀礀氀攀 ഀ
var cnLeft="0";//left coordinate of calendar span਍瘀愀爀 挀渀吀漀瀀㴀∀　∀㬀⼀⼀琀漀瀀 挀漀漀爀搀椀渀愀琀攀 漀昀 挀愀氀攀渀搀愀爀 猀瀀愀渀ഀ
var xpos=0; // mouse x position਍瘀愀爀 礀瀀漀猀㴀　㬀 ⼀⼀ 洀漀甀猀攀 礀 瀀漀猀椀琀椀漀渀ഀ
var calHeight=0; // calendar height਍瘀愀爀 䌀愀氀圀椀搀琀栀㴀㈀　㠀㬀⼀⼀ 挀愀氀攀渀搀愀爀 眀椀搀琀栀ഀ
var CellWidth=30;// width of day cell.਍瘀愀爀 吀椀洀攀䴀漀搀攀㴀㈀㐀㬀⼀⼀ 吀椀洀攀䴀漀搀攀 瘀愀氀甀攀⸀ ㄀㈀ 漀爀 ㈀㐀ഀ
਍⼀⼀䌀漀渀昀椀最甀爀愀戀氀攀 瀀愀爀愀洀攀琀攀爀猀ഀ
਍⼀⼀瘀愀爀 圀椀渀搀漀眀吀椀琀氀攀㴀∀䐀愀琀攀吀椀洀攀 倀椀挀欀攀爀∀㬀⼀⼀䐀愀琀攀 吀椀洀攀 倀椀挀欀攀爀 琀椀琀氀攀⸀ഀ
var SpanBorderColor = "#cdcdcd";//span border color ਍瘀愀爀 匀瀀愀渀䈀最䌀漀氀漀爀 㴀 ∀⌀挀搀挀搀挀搀∀㬀⼀⼀猀瀀愀渀 戀愀挀欀最爀漀甀渀搀 挀漀氀漀爀ഀ
var WeekChar=2;//number of character for week day. if 2 then Mo,Tu,We. if 3 then Mon,Tue,Wed.਍瘀愀爀 䐀愀琀攀匀攀瀀愀爀愀琀漀爀㴀∀ⴀ∀㬀⼀⼀䐀愀琀攀 匀攀瀀愀爀愀琀漀爀Ⰰ 礀漀甀 挀愀渀 挀栀愀渀最攀 椀琀 琀漀 ∀ⴀ∀ 椀昀 礀漀甀 眀愀渀琀⸀ഀ
var ShowLongMonth=true;//Show long month name in Calendar header. example: "January".਍瘀愀爀 匀栀漀眀䴀漀渀琀栀夀攀愀爀㴀琀爀甀攀㬀⼀⼀匀栀漀眀 䴀漀渀琀栀 愀渀搀 夀攀愀爀 椀渀 䌀愀氀攀渀搀愀爀 栀攀愀搀攀爀⸀ഀ
var MonthYearColor="#3300cc";//Font Color of Month and Year in Calendar header.਍瘀愀爀 圀攀攀欀䠀攀愀搀䌀漀氀漀爀㴀∀⌀㤀㤀㤀㤀昀昀∀㬀⼀⼀䈀愀挀欀最爀漀甀渀搀 䌀漀氀漀爀 椀渀 圀攀攀欀 栀攀愀搀攀爀⸀ഀ
var SundayColor="#cccccc";//Background color of Sunday.਍瘀愀爀 匀愀琀甀爀搀愀礀䌀漀氀漀爀㴀∀⌀挀挀挀挀挀挀∀㬀⼀⼀䈀愀挀欀最爀漀甀渀搀 挀漀氀漀爀 漀昀 匀愀琀甀爀搀愀礀⸀ഀ
var WeekDayColor="white";//Background color of weekdays.਍瘀愀爀 䘀漀渀琀䌀漀氀漀爀㴀∀戀氀甀攀∀㬀⼀⼀挀漀氀漀爀 漀昀 昀漀渀琀 椀渀 䌀愀氀攀渀搀愀爀 搀愀礀 挀攀氀氀⸀ഀ
var TodayColor="#9999ff";//Background color of today.਍瘀愀爀 匀攀氀䐀愀琀攀䌀漀氀漀爀㴀∀⌀挀挀挀挀挀挀∀㬀⼀⼀䈀愀挀欀最爀漀渀搀 挀漀氀漀爀 漀昀 猀攀氀攀挀琀攀搀 搀愀琀攀 椀渀 琀攀砀琀戀漀砀⸀ഀ
var YrSelColor="#cc0033";//color of font of Year selector.਍瘀愀爀 䴀琀栀匀攀氀䌀漀氀漀爀㴀∀⌀挀挀　　㌀㌀∀㬀⼀⼀挀漀氀漀爀 漀昀 昀漀渀琀 漀昀 䴀漀渀琀栀 猀攀氀攀挀琀漀爀 椀昀 ∀䴀漀渀琀栀匀攀氀攀挀琀漀爀∀ 椀猀 ∀愀爀爀漀眀∀⸀ഀ
var ThemeBg="";//Background image of Calendar window.਍瘀愀爀 䌀愀氀䈀最䌀漀氀漀爀㴀∀∀㬀⼀⼀䈀愀挀欀最爀漀甀搀 挀漀氀漀爀 漀昀 䌀愀氀攀渀搀愀爀 眀椀渀搀漀眀⸀ഀ
var PrecedeZero=true;//Preceding zero [true|false]਍瘀愀爀 䴀漀渀搀愀礀䘀椀爀猀琀䐀愀礀㴀昀愀氀猀攀㬀⼀⼀琀爀甀攀㨀唀猀攀 䴀漀渀搀愀礀 愀猀 昀椀爀猀琀 搀愀礀㬀 昀愀氀猀攀㨀匀甀渀搀愀礀 愀猀 昀椀爀猀琀 搀愀礀⸀ 嬀琀爀甀攀簀昀愀氀猀攀崀  ⼀⼀愀搀搀攀搀 椀渀 瘀攀爀猀椀漀渀 ㄀⸀㜀ഀ
var UseImageFiles = true;//Use image files with "arrows" and "close" button਍⼀⼀甀猀攀 琀栀攀 䴀漀渀琀栀 愀渀搀 圀攀攀欀搀愀礀 椀渀 礀漀甀爀 瀀爀攀昀攀爀爀攀搀 氀愀渀最甀愀最攀⸀ഀ
var MonthName=["January", "February", "March", "April", "May", "June","July","August", "September", "October", "November", "December"];਍瘀愀爀 圀攀攀欀䐀愀礀一愀洀攀㄀㴀嬀∀匀甀渀搀愀礀∀Ⰰ∀䴀漀渀搀愀礀∀Ⰰ∀吀甀攀猀搀愀礀∀Ⰰ∀圀攀搀渀攀猀搀愀礀∀Ⰰ∀吀栀甀爀猀搀愀礀∀Ⰰ∀䘀爀椀搀愀礀∀Ⰰ∀匀愀琀甀爀搀愀礀∀崀㬀ഀ
਍瘀愀爀 圀攀攀欀䐀愀礀一愀洀攀㈀㴀嬀∀䴀漀渀搀愀礀∀Ⰰ∀吀甀攀猀搀愀礀∀Ⰰ∀圀攀搀渀攀猀搀愀礀∀Ⰰ∀吀栀甀爀猀搀愀礀∀Ⰰ∀䘀爀椀搀愀礀∀Ⰰ∀匀愀琀甀爀搀愀礀∀Ⰰ∀匀甀渀搀愀礀∀崀㬀ഀ
਍⼀⼀攀渀搀 䌀漀渀昀椀最甀爀愀戀氀攀 瀀愀爀愀洀攀琀攀爀猀ഀ
//end Global variable਍ഀ
// Default events configuration਍搀漀挀甀洀攀渀琀⸀漀渀洀漀甀猀攀搀漀眀渀 㴀 瀀椀挀欀䤀琀㬀ഀ
document.onmousemove = dragIt;਍搀漀挀甀洀攀渀琀⸀漀渀洀漀甀猀攀甀瀀 㴀 搀爀漀瀀䤀琀㬀ഀ
਍昀甀渀挀琀椀漀渀 一攀眀䌀猀猀䌀愀氀⠀瀀䌀琀爀氀Ⰰ瀀䘀漀爀洀愀琀Ⰰ瀀匀挀爀漀氀氀攀爀Ⰰ瀀匀栀漀眀吀椀洀攀Ⰰ瀀吀椀洀攀䴀漀搀攀Ⰰ瀀䠀椀搀攀匀攀挀漀渀搀猀⤀ 笀ഀ
	// get current date and time਍ऀ搀琀吀漀搀愀礀 㴀 渀攀眀 䐀愀琀攀⠀⤀㬀ഀ
	Cal=new Calendar(dtToday);਍ऀഀ
	if ((pShowTime!=null) && (pShowTime)) {਍ऀऀ䌀愀氀⸀匀栀漀眀吀椀洀攀㴀琀爀甀攀㬀ഀ
		if ((pTimeMode!=null) &&((pTimeMode=='12')||(pTimeMode=='24')))	{਍ऀऀऀ吀椀洀攀䴀漀搀攀㴀瀀吀椀洀攀䴀漀搀攀㬀ഀ
		}਍ऀऀ攀氀猀攀 吀椀洀攀䴀漀搀攀㴀✀㈀㐀✀㬀ഀ
਍        椀昀 ⠀瀀䠀椀搀攀匀攀挀漀渀搀猀℀㴀渀甀氀氀⤀ഀ
        {਍            椀昀 ⠀瀀䠀椀搀攀匀攀挀漀渀搀猀⤀ഀ
            {Cal.ShowSeconds=false;}਍            攀氀猀攀ഀ
            {Cal.ShowSeconds=true;}਍        紀ഀ
        else਍        笀ഀ
            Cal.ShowSeconds=false;਍        紀    ഀ
	}਍ऀ椀昀 ⠀瀀䌀琀爀氀℀㴀渀甀氀氀⤀ഀ
		Cal.Ctrl=pCtrl;਍ऀഀ
	if (pFormat!=null)਍ऀऀ䌀愀氀⸀䘀漀爀洀愀琀㴀瀀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀㬀ഀ
	else ਍ऀ    䌀愀氀⸀䘀漀爀洀愀琀㴀∀䴀䴀䐀䐀夀夀夀夀∀㬀ഀ
	਍ऀ椀昀 ⠀瀀匀挀爀漀氀氀攀爀℀㴀渀甀氀氀⤀ 笀ഀ
		if (pScroller.toUpperCase()=="ARROW") {਍ऀऀऀ䌀愀氀⸀匀挀爀漀氀氀攀爀㴀∀䄀刀刀伀圀∀㬀ഀ
		}਍ऀऀ攀氀猀攀 笀ഀ
			Cal.Scroller="DROPDOWN";਍ऀऀ紀ഀ
    }਍ऀ攀砀䐀愀琀攀吀椀洀攀㴀搀漀挀甀洀攀渀琀⸀最攀琀䔀氀攀洀攀渀琀䈀礀䤀搀⠀瀀䌀琀爀氀⤀⸀瘀愀氀甀攀㬀ഀ
	਍ऀ椀昀 ⠀攀砀䐀愀琀攀吀椀洀攀℀㴀∀∀⤀ऀ笀 ⼀⼀倀愀爀猀攀 攀砀椀猀琀椀渀最 䐀愀琀攀 匀琀爀椀渀最ഀ
		var Sp1;//Index of Date Separator 1਍ऀऀ瘀愀爀 匀瀀㈀㬀⼀⼀䤀渀搀攀砀 漀昀 䐀愀琀攀 匀攀瀀愀爀愀琀漀爀 ㈀ ഀ
		var tSp1;//Index of Time Separator 1਍ऀऀ瘀愀爀 琀匀瀀㄀㬀⼀⼀䤀渀搀攀砀 漀昀 吀椀洀攀 匀攀瀀愀爀愀琀漀爀 ㈀ഀ
		var strMonth;਍ऀऀ瘀愀爀 猀琀爀䐀愀琀攀㬀ഀ
		var strYear;਍ऀऀ瘀愀爀 椀渀琀䴀漀渀琀栀㬀ഀ
		var YearPattern;਍ऀऀ瘀愀爀 猀琀爀䠀漀甀爀㬀ഀ
		var strMinute;਍ऀऀ瘀愀爀 猀琀爀匀攀挀漀渀搀㬀ഀ
		var winHeight;਍ऀऀ⼀⼀瀀愀爀猀攀 洀漀渀琀栀ഀ
		Sp1=exDateTime.indexOf(DateSeparator,0)਍ऀऀ匀瀀㈀㴀攀砀䐀愀琀攀吀椀洀攀⸀椀渀搀攀砀伀昀⠀䐀愀琀攀匀攀瀀愀爀愀琀漀爀Ⰰ⠀瀀愀爀猀攀䤀渀琀⠀匀瀀㄀⤀⬀㄀⤀⤀㬀ഀ
		਍ऀऀ瘀愀爀 漀昀昀猀攀琀㴀瀀愀爀猀攀䤀渀琀⠀䌀愀氀⸀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀⸀氀愀猀琀䤀渀搀攀砀伀昀⠀∀䴀∀⤀⤀ⴀ瀀愀爀猀攀䤀渀琀⠀䌀愀氀⸀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀⸀椀渀搀攀砀伀昀⠀∀䴀∀⤀⤀ⴀ㄀㬀ഀ
		if ((Cal.Format.toUpperCase()=="DDMMYYYY") || (Cal.Format.toUpperCase()=="DDMMMYYYY")) {਍ऀऀऀ椀昀 ⠀䐀愀琀攀匀攀瀀愀爀愀琀漀爀㴀㴀∀∀⤀ 笀ഀ
				strMonth=exDateTime.substring(2,4+offset);਍ऀऀऀऀ猀琀爀䐀愀琀攀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀　Ⰰ㈀⤀㬀ഀ
				strYear=exDateTime.substring(4+offset,8+offset);਍ऀऀऀ紀ഀ
			else {਍ऀऀऀऀ猀琀爀䴀漀渀琀栀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀匀瀀㄀⬀㄀Ⰰ匀瀀㈀⤀㬀ഀ
				strDate=exDateTime.substring(0,Sp1);਍ऀऀऀऀ猀琀爀夀攀愀爀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀匀瀀㈀⬀㄀Ⰰ匀瀀㈀⬀㔀⤀㬀ഀ
			}਍ऀऀ紀ഀ
		else if ((Cal.Format.toUpperCase()=="MMDDYYYY") || (Cal.Format.toUpperCase()=="MMMDDYYYY")) {਍ऀऀऀ椀昀 ⠀䐀愀琀攀匀攀瀀愀爀愀琀漀爀㴀㴀∀∀⤀ 笀ഀ
				strMonth=exDateTime.substring(0,2+offset);਍ऀऀऀऀ猀琀爀䐀愀琀攀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀㈀⬀漀昀昀猀攀琀Ⰰ㐀⬀漀昀昀猀攀琀⤀㬀ഀ
				strYear=exDateTime.substring(4+offset,8+offset);਍ऀऀऀ紀ഀ
			else {਍ऀऀऀऀ猀琀爀䴀漀渀琀栀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀　Ⰰ匀瀀㄀⤀㬀ഀ
				strDate=exDateTime.substring(Sp1+1,Sp2);਍ऀऀऀऀ猀琀爀夀攀愀爀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀匀瀀㈀⬀㄀Ⰰ匀瀀㈀⬀㔀⤀㬀ഀ
			}਍ऀऀ紀ഀ
		else if ((Cal.Format.toUpperCase()=="YYYYMMDD") || (Cal.Format.toUpperCase()=="YYYYMMMDD")) {਍ऀऀऀ椀昀 ⠀䐀愀琀攀匀攀瀀愀爀愀琀漀爀㴀㴀∀∀⤀ 笀ഀ
				strMonth=exDateTime.substring(4,6+offset);਍ऀऀऀऀ猀琀爀䐀愀琀攀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀㘀⬀漀昀昀猀攀琀Ⰰ㠀⬀漀昀昀猀攀琀⤀㬀ഀ
				strYear=exDateTime.substring(0,4);਍ऀऀऀ紀ഀ
			else {਍ऀऀऀऀ猀琀爀䴀漀渀琀栀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀匀瀀㄀⬀㄀Ⰰ匀瀀㈀⤀㬀ഀ
				strDate=exDateTime.substring(Sp2+1,Sp2+3);਍ऀऀऀऀ猀琀爀夀攀愀爀㴀攀砀䐀愀琀攀吀椀洀攀⸀猀甀戀猀琀爀椀渀最⠀　Ⰰ匀瀀㄀⤀㬀ഀ
			}਍ऀऀ紀ഀ
		if (isNaN(strMonth))਍ऀऀऀ椀渀琀䴀漀渀琀栀㴀䌀愀氀⸀䜀攀琀䴀漀渀琀栀䤀渀搀攀砀⠀猀琀爀䴀漀渀琀栀⤀㬀ഀ
		else਍ऀऀऀ椀渀琀䴀漀渀琀栀㴀瀀愀爀猀攀䤀渀琀⠀猀琀爀䴀漀渀琀栀Ⰰ㄀　⤀ⴀ㄀㬀ऀഀ
		if ((parseInt(intMonth,10)>=0) && (parseInt(intMonth,10)<12))਍ऀऀऀ䌀愀氀⸀䴀漀渀琀栀㴀椀渀琀䴀漀渀琀栀㬀ഀ
		//end parse month਍ऀऀ⼀⼀瀀愀爀猀攀 䐀愀琀攀ഀ
		if ((parseInt(strDate,10)<=Cal.GetMonDays()) && (parseInt(strDate,10)>=1))਍ऀऀऀ䌀愀氀⸀䐀愀琀攀㴀猀琀爀䐀愀琀攀㬀ഀ
		//end parse Date਍ऀऀ⼀⼀瀀愀爀猀攀 礀攀愀爀ഀ
		YearPattern=/^\d{4}$/;਍ऀऀ椀昀 ⠀夀攀愀爀倀愀琀琀攀爀渀⸀琀攀猀琀⠀猀琀爀夀攀愀爀⤀⤀ഀ
			Cal.Year=parseInt(strYear,10);਍ऀऀ⼀⼀攀渀搀 瀀愀爀猀攀 礀攀愀爀ഀ
		//parse time਍ऀऀ椀昀 ⠀䌀愀氀⸀匀栀漀眀吀椀洀攀㴀㴀琀爀甀攀⤀ऀ笀ഀ
			//parse AM or PM਍ऀऀऀ椀昀 ⠀吀椀洀攀䴀漀搀攀㴀㴀㄀㈀⤀ 笀ഀ
				strAMPM=exDateTime.substring(exDateTime.length-2,exDateTime.length)਍ऀऀऀऀ䌀愀氀⸀䄀䴀漀爀倀䴀㴀猀琀爀䄀䴀倀䴀㬀ഀ
			}਍ऀऀऀ琀匀瀀㄀㴀攀砀䐀愀琀攀吀椀洀攀⸀椀渀搀攀砀伀昀⠀∀㨀∀Ⰰ　⤀ഀ
			tSp2=exDateTime.indexOf(":",(parseInt(tSp1)+1));਍ऀऀऀ椀昀 ⠀琀匀瀀㄀㸀　⤀ऀ笀ഀ
				strHour=exDateTime.substring(tSp1,(tSp1)-2);਍ऀऀऀऀ䌀愀氀⸀匀攀琀䠀漀甀爀⠀猀琀爀䠀漀甀爀⤀㬀ഀ
				strMinute=exDateTime.substring(tSp1+1,tSp1+3);਍ऀऀऀऀ䌀愀氀⸀匀攀琀䴀椀渀甀琀攀⠀猀琀爀䴀椀渀甀琀攀⤀㬀ഀ
				strSecond=exDateTime.substring(tSp2+1,tSp2+3);਍ऀऀऀऀ䌀愀氀⸀匀攀琀匀攀挀漀渀搀⠀猀琀爀匀攀挀漀渀搀⤀㬀ഀ
			}਍ऀऀ紀ऀഀ
	}਍ऀ猀攀氀䐀愀琀攀㴀渀攀眀 䐀愀琀攀⠀䌀愀氀⸀夀攀愀爀Ⰰ䌀愀氀⸀䴀漀渀琀栀Ⰰ䌀愀氀⸀䐀愀琀攀⤀㬀⼀⼀瘀攀爀猀椀漀渀 ㄀⸀㜀ഀ
	RenderCssCal(true);਍紀ഀ
਍昀甀渀挀琀椀漀渀 刀攀渀搀攀爀䌀猀猀䌀愀氀⠀戀一攀眀䌀愀氀⤀ 笀ഀ
	if (typeof bNewCal == "undefined" || bNewCal != true) {bNewCal = false;}਍ऀ瘀愀爀 瘀䌀愀氀䠀攀愀搀攀爀㬀ഀ
	var vCalData;਍ऀ瘀愀爀 瘀䌀愀氀吀椀洀攀㴀∀∀㬀ഀ
	var i;਍ऀ瘀愀爀 樀㬀ഀ
	var SelectStr;਍ऀ瘀愀爀 瘀䐀愀礀䌀漀甀渀琀㴀　㬀ഀ
	var vFirstDay;਍ऀ挀愀氀䠀攀椀最栀琀 㴀 　㬀 ⼀⼀ 爀攀猀攀琀 琀栀攀 眀椀渀搀漀眀 栀攀椀最栀琀 漀渀 爀攀昀爀攀猀栀ഀ
	਍ऀ⼀⼀ 匀攀琀 琀栀攀 搀攀昀愀甀氀琀 挀甀爀猀漀爀 昀漀爀 琀栀攀 挀愀氀攀渀搀愀爀ഀ
	winCalData="<span style='cursor:auto;'>\n";਍ऀഀ
	if (ThemeBg==""){CalBgColor="bgcolor='"+WeekDayColor+"'"}਍        ഀ
	vCalHeader="<table "+CalBgColor+" background='"+ThemeBg+"' border=1 cellpadding=1 cellspacing=1 width='200' valign='top'>\n";਍ऀ⼀⼀吀愀戀氀攀 昀漀爀 䴀漀渀琀栀 ☀ 夀攀愀爀 匀攀氀攀挀琀漀爀ഀ
	vCalHeader+="<tr>\n<td colspan='7'>\n<table border=0 width=200 cellpadding=0 cellspacing=0>\n<tr>\n";਍ഀ
	//******************Month and Year selector in dropdown list************************਍ऀ椀昀 ⠀䌀愀氀⸀匀挀爀漀氀氀攀爀㴀㴀∀䐀刀伀倀䐀伀圀一∀⤀ 笀ഀ
		vCalHeader+="<td align='center'><select name=\"MonthSelector\" onChange=\"javascript:Cal.SwitchMth(this.selectedIndex);RenderCssCal();\">\n";਍ऀऀ昀漀爀 ⠀椀㴀　㬀椀㰀㄀㈀㬀椀⬀⬀⤀ 笀ഀ
			if (i==Cal.Month)਍ऀऀऀऀ匀攀氀攀挀琀匀琀爀㴀∀匀攀氀攀挀琀攀搀∀㬀ഀ
			else਍ऀऀऀऀ匀攀氀攀挀琀匀琀爀㴀∀∀㬀ഀ
			    vCalHeader+="<option "+SelectStr+" value="+i+">"+MonthName[i]+"</option>\n";਍ऀऀ紀ഀ
		vCalHeader+="</select></td>\n";਍ऀऀ⼀⼀夀攀愀爀 猀攀氀攀挀琀漀爀ഀ
		vCalHeader+="<td align='center'><select name=\"YearSelector\" size=\"1\" onChange=\"javascript:Cal.SwitchYear(this.value);RenderCssCal();\">\n";਍ऀऀ昀漀爀 ⠀椀 㴀 ㄀㤀㔀　㬀 椀 㰀 ⠀搀琀吀漀搀愀礀⸀最攀琀䘀甀氀氀夀攀愀爀⠀⤀ ⬀ 㔀⤀㬀椀⬀⬀⤀ऀ笀ഀ
			if (i==Cal.Year)਍ऀऀऀऀ匀攀氀攀挀琀匀琀爀㴀∀匀攀氀攀挀琀攀搀∀㬀ഀ
			else਍ऀऀऀऀ匀攀氀攀挀琀匀琀爀㴀∀∀㬀ऀഀ
			vCalHeader+="<option "+SelectStr+" value="+i+">"+i+"</option>\n";਍ऀऀ紀ഀ
		vCalHeader+="</select></td>\n";਍ऀऀ挀愀氀䠀攀椀最栀琀 ⬀㴀 ㌀　㬀ഀ
	}਍ऀ⼀⼀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀䔀渀搀 䴀漀渀琀栀 愀渀搀 夀攀愀爀 猀攀氀攀挀琀漀爀 椀渀 搀爀漀瀀搀漀眀渀 氀椀猀琀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀ഀ
	//******************Month and Year selector in arrow*********************************਍ऀ攀氀猀攀 椀昀 ⠀䌀愀氀⸀匀挀爀漀氀氀攀爀㴀㴀∀䄀刀刀伀圀∀⤀ऀഀ
  {	਍    椀昀 ⠀唀猀攀䤀洀愀最攀䘀椀氀攀猀⤀ഀ
    {਍  ऀऀ瘀䌀愀氀䠀攀愀搀攀爀⬀㴀∀㰀琀搀㸀㰀椀洀最 漀渀洀漀甀猀攀搀漀眀渀㴀✀樀愀瘀愀猀挀爀椀瀀琀㨀䌀愀氀⸀䐀攀挀夀攀愀爀⠀⤀㬀刀攀渀搀攀爀䌀猀猀䌀愀氀⠀⤀㬀✀ 猀爀挀㴀✀⸀⸀⼀最昀砀⼀挀愀氀开昀愀猀琀爀攀瘀攀爀猀攀⸀最椀昀✀ 眀椀搀琀栀㴀✀㄀㌀✀ 栀攀椀最栀琀㴀✀㤀✀ 漀渀洀漀甀猀攀漀瘀攀爀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ 　⤀✀ 漀渀洀漀甀猀攀漀甀琀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ ㄀⤀✀ 猀琀礀氀攀㴀✀戀漀爀搀攀爀㨀㄀瀀砀 猀漀氀椀搀 眀栀椀琀攀✀㸀㰀⼀琀搀㸀尀渀∀㬀⼀⼀夀攀愀爀 猀挀爀漀氀氀攀爀 ⠀搀攀挀爀攀愀猀攀 ㄀ 礀攀愀爀⤀ഀ
  		vCalHeader+="<td><img onmousedown='javascript:Cal.DecMonth();RenderCssCal();' src='../gfx/cal_reverse.gif' width='13' height='9' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td>\n";//Month scroller (decrease 1 month)਍  ऀऀ瘀䌀愀氀䠀攀愀搀攀爀⬀㴀∀㰀琀搀 眀椀搀琀栀㴀✀㜀　─✀ 挀氀愀猀猀㴀✀挀愀氀刀✀㸀㰀昀漀渀琀 挀漀氀漀爀㴀✀∀⬀夀爀匀攀氀䌀漀氀漀爀⬀∀✀㸀∀⬀䌀愀氀⸀䜀攀琀䴀漀渀琀栀一愀洀攀⠀匀栀漀眀䰀漀渀最䴀漀渀琀栀⤀⬀∀ ∀⬀䌀愀氀⸀夀攀愀爀⬀∀㰀⼀昀漀渀琀㸀㰀⼀琀搀㸀尀渀∀⼀⼀䴀漀渀琀栀 愀渀搀 夀攀愀爀ഀ
  		vCalHeader+="<td><img onmousedown='javascript:Cal.IncMonth();RenderCssCal();' src='../gfx/cal_forward.gif' width='13' height='9' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td>\n";//Month scroller (increase 1 month)਍  ऀऀ瘀䌀愀氀䠀攀愀搀攀爀⬀㴀∀㰀琀搀㸀㰀椀洀最 漀渀洀漀甀猀攀搀漀眀渀㴀✀樀愀瘀愀猀挀爀椀瀀琀㨀䌀愀氀⸀䤀渀挀夀攀愀爀⠀⤀㬀刀攀渀搀攀爀䌀猀猀䌀愀氀⠀⤀㬀✀ 猀爀挀㴀✀⸀⸀⼀最昀砀⼀挀愀氀开昀愀猀琀昀漀爀眀愀爀搀⸀最椀昀✀ 眀椀搀琀栀㴀✀㄀㌀✀ 栀攀椀最栀琀㴀✀㤀✀ 漀渀洀漀甀猀攀漀瘀攀爀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ 　⤀✀ 漀渀洀漀甀猀攀漀甀琀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ ㄀⤀✀ 猀琀礀氀攀㴀✀戀漀爀搀攀爀㨀㄀瀀砀 猀漀氀椀搀 眀栀椀琀攀✀㸀㰀⼀琀搀㸀尀渀∀㬀⼀⼀夀攀愀爀 猀挀爀漀氀氀攀爀 ⠀椀渀挀爀攀愀猀攀 ㄀ 礀攀愀爀⤀ഀ
  	    calHeight += 22;਍ऀ  紀ഀ
	  else਍ऀ  笀ഀ
	  	vCalHeader+="<td><span id='dec_year' title='reverse year' onmousedown='javascript:Cal.DecYear();RenderCssCal();' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white; color:"+YrSelColor+"'>-</span></td>";//Year scroller (decrease 1 year)਍ऀ  ऀ瘀䌀愀氀䠀攀愀搀攀爀⬀㴀∀㰀琀搀㸀㰀猀瀀愀渀 椀搀㴀✀搀攀挀开洀漀渀琀栀✀ 琀椀琀氀攀㴀✀爀攀瘀攀爀猀攀 洀漀渀琀栀✀ 漀渀洀漀甀猀攀搀漀眀渀㴀✀樀愀瘀愀猀挀爀椀瀀琀㨀䌀愀氀⸀䐀攀挀䴀漀渀琀栀⠀⤀㬀刀攀渀搀攀爀䌀猀猀䌀愀氀⠀⤀㬀✀ 漀渀洀漀甀猀攀漀瘀攀爀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ 　⤀✀ 漀渀洀漀甀猀攀漀甀琀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ ㄀⤀✀ 猀琀礀氀攀㴀✀戀漀爀搀攀爀㨀㄀瀀砀 猀漀氀椀搀 眀栀椀琀攀✀㸀☀氀琀㬀㰀⼀猀瀀愀渀㸀㰀⼀琀搀㸀尀渀∀㬀⼀⼀䴀漀渀琀栀 猀挀爀漀氀氀攀爀 ⠀搀攀挀爀攀愀猀攀 ㄀ 洀漀渀琀栀⤀ഀ
  		vCalHeader+="<td width='70%' class='calR'><font color='"+YrSelColor+"'>"+Cal.GetMonthName(ShowLongMonth)+" "+Cal.Year+"</font></td>\n"//Month and Year਍  ऀऀ瘀䌀愀氀䠀攀愀搀攀爀⬀㴀∀㰀琀搀㸀㰀猀瀀愀渀 椀搀㴀✀椀渀挀开洀漀渀琀栀✀ 琀椀琀氀攀㴀✀昀漀爀眀愀爀搀 洀漀渀琀栀✀ 漀渀洀漀甀猀攀搀漀眀渀㴀✀樀愀瘀愀猀挀爀椀瀀琀㨀䌀愀氀⸀䤀渀挀䴀漀渀琀栀⠀⤀㬀刀攀渀搀攀爀䌀猀猀䌀愀氀⠀⤀㬀✀ 漀渀洀漀甀猀攀漀瘀攀爀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ 　⤀✀ 漀渀洀漀甀猀攀漀甀琀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ ㄀⤀✀ 猀琀礀氀攀㴀✀戀漀爀搀攀爀㨀㄀瀀砀 猀漀氀椀搀 眀栀椀琀攀✀㸀☀最琀㬀㰀⼀猀瀀愀渀㸀㰀⼀琀搀㸀尀渀∀㬀⼀⼀䴀漀渀琀栀 猀挀爀漀氀氀攀爀 ⠀椀渀挀爀攀愀猀攀 ㄀ 洀漀渀琀栀⤀ഀ
  		vCalHeader+="<td><span id='inc_year' title='forward year' onmousedown='javascript:Cal.IncYear();RenderCssCal();'  onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white; color:"+YrSelColor+"'>+</span></td>\n";//Year scroller (increase 1 year)਍  ऀ    挀愀氀䠀攀椀最栀琀 ⬀㴀 ㈀㈀㬀ഀ
	  }਍ऀ紀ഀ
	vCalHeader+="</tr>\n</table>\n</td>\n</tr>\n"਍  ⼀⼀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀䔀渀搀 䴀漀渀琀栀 愀渀搀 夀攀愀爀 猀攀氀攀挀琀漀爀 椀渀 愀爀爀漀眀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀⨀ഀ
	//Calendar header shows Month and Year਍ऀ椀昀 ⠀⠀匀栀漀眀䴀漀渀琀栀夀攀愀爀⤀☀☀⠀䌀愀氀⸀匀挀爀漀氀氀攀爀㴀㴀∀䐀刀伀倀䐀伀圀一∀⤀⤀ 笀ഀ
		vCalHeader+="<tr><td colspan='7' class='calR'>\n<font color='"+MonthYearColor+"'>"+Cal.GetMonthName(ShowLongMonth)+" "+Cal.Year+"</font>\n</td></tr>\n";਍ऀ    挀愀氀䠀攀椀最栀琀 ⬀㴀 ㄀㤀㬀ഀ
	}਍ऀ⼀⼀圀攀攀欀 搀愀礀 栀攀愀搀攀爀ഀ
	vCalHeader+="<tr bgcolor="+WeekHeadColor+">\n";਍ऀ瘀愀爀 圀攀攀欀䐀愀礀一愀洀攀㴀渀攀眀 䄀爀爀愀礀⠀⤀㬀⼀⼀䄀搀搀攀搀 瘀攀爀猀椀漀渀 ㄀⸀㜀ഀ
	if (MondayFirstDay==true)਍ऀऀ圀攀攀欀䐀愀礀一愀洀攀㴀圀攀攀欀䐀愀礀一愀洀攀㈀㬀ഀ
	else਍ऀऀ圀攀攀欀䐀愀礀一愀洀攀㴀圀攀攀欀䐀愀礀一愀洀攀㄀㬀ഀ
	for (i=0;i<7;i++) {਍ऀऀ瘀䌀愀氀䠀攀愀搀攀爀⬀㴀∀㰀琀搀 眀椀搀琀栀㴀✀∀⬀䌀攀氀氀圀椀搀琀栀⬀∀✀ 挀氀愀猀猀㴀✀挀愀氀吀䐀✀㸀㰀昀漀渀琀 挀漀氀漀爀㴀✀眀栀椀琀攀✀㸀∀⬀圀攀攀欀䐀愀礀一愀洀攀嬀椀崀⸀猀甀戀猀琀爀⠀　Ⰰ圀攀攀欀䌀栀愀爀⤀⬀∀㰀⼀昀漀渀琀㸀㰀⼀琀搀㸀尀渀∀㬀ഀ
	}਍ऀ挀愀氀䠀攀椀最栀琀 ⬀㴀 ㄀㤀㬀ഀ
	vCalHeader+="</tr>\n";	਍ऀ⼀⼀䌀愀氀攀渀搀愀爀 搀攀琀愀椀氀ഀ
	CalDate=new Date(Cal.Year,Cal.Month);਍ऀ䌀愀氀䐀愀琀攀⸀猀攀琀䐀愀琀攀⠀㄀⤀㬀ഀ
	vFirstDay=CalDate.getDay();਍ऀ⼀⼀䄀搀搀攀搀 瘀攀爀猀椀漀渀 ㄀⸀㜀ഀ
	if (MondayFirstDay==true) {਍ऀऀ瘀䘀椀爀猀琀䐀愀礀ⴀ㴀㄀㬀ഀ
		if (vFirstDay==-1)਍ऀऀऀ瘀䘀椀爀猀琀䐀愀礀㴀㘀㬀ഀ
	}਍ऀ⼀⼀䄀搀搀攀搀 瘀攀爀猀椀漀渀 ㄀⸀㜀ഀ
	vCalData="<tr>";਍ऀ挀愀氀䠀攀椀最栀琀 ⬀㴀 ㄀㤀㬀ഀ
	for (i=0;i<vFirstDay;i++) {਍ऀऀ瘀䌀愀氀䐀愀琀愀㴀瘀䌀愀氀䐀愀琀愀⬀䜀攀渀䌀攀氀氀⠀⤀㬀ഀ
		vDayCount=vDayCount+1;਍ऀ紀ഀ
	//Added version 1.7਍ऀ昀漀爀 ⠀樀㴀㄀㬀樀㰀㴀䌀愀氀⸀䜀攀琀䴀漀渀䐀愀礀猀⠀⤀㬀樀⬀⬀⤀ 笀ഀ
		var strCell;਍ऀऀ椀昀⠀⠀瘀䐀愀礀䌀漀甀渀琀─㜀㴀㴀　⤀☀☀⠀樀 㸀 ㄀⤀⤀ 笀ഀ
			vCalData=vCalData+"\n<tr>";਍ऀऀ紀ഀ
		vDayCount=vDayCount+1;਍ऀऀ椀昀 ⠀⠀樀㴀㴀搀琀吀漀搀愀礀⸀最攀琀䐀愀琀攀⠀⤀⤀☀☀⠀䌀愀氀⸀䴀漀渀琀栀㴀㴀搀琀吀漀搀愀礀⸀最攀琀䴀漀渀琀栀⠀⤀⤀☀☀⠀䌀愀氀⸀夀攀愀爀㴀㴀搀琀吀漀搀愀礀⸀最攀琀䘀甀氀氀夀攀愀爀⠀⤀⤀⤀ഀ
			strCell=GenCell(j,true,TodayColor);//Highlight today's date਍ऀऀ攀氀猀攀 笀ഀ
			if ((j==selDate.getDate())&&(Cal.Month==selDate.getMonth())&&(Cal.Year==selDate.getFullYear())) { //modified version 1.7਍ऀऀऀऀ猀琀爀䌀攀氀氀㴀䜀攀渀䌀攀氀氀⠀樀Ⰰ琀爀甀攀Ⰰ匀攀氀䐀愀琀攀䌀漀氀漀爀⤀㬀ഀ
			}਍ऀऀऀ攀氀猀攀 笀ऀഀ
				if (MondayFirstDay==true) {਍ऀऀऀऀऀ椀昀 ⠀瘀䐀愀礀䌀漀甀渀琀─㜀㴀㴀　⤀ഀ
						strCell=GenCell(j,false,SundayColor);਍ऀऀऀऀऀ攀氀猀攀 椀昀 ⠀⠀瘀䐀愀礀䌀漀甀渀琀⬀㄀⤀─㜀㴀㴀　⤀ഀ
						strCell=GenCell(j,false,SaturdayColor);਍ऀऀऀऀऀ攀氀猀攀ഀ
						strCell=GenCell(j,null,WeekDayColor);					਍ऀऀऀऀ紀 ഀ
				else {਍ऀऀऀऀऀ椀昀 ⠀瘀䐀愀礀䌀漀甀渀琀─㜀㴀㴀　⤀ഀ
						strCell=GenCell(j,false,SaturdayColor);਍ऀऀऀऀऀ攀氀猀攀 椀昀 ⠀⠀瘀䐀愀礀䌀漀甀渀琀⬀㘀⤀─㜀㴀㴀　⤀ഀ
						strCell=GenCell(j,false,SundayColor);਍ऀऀऀऀऀ攀氀猀攀ഀ
						strCell=GenCell(j,null,WeekDayColor);਍ऀऀऀऀ紀ഀ
			}		਍ऀऀ紀ऀऀऀऀऀऀഀ
		vCalData=vCalData+strCell;਍ഀ
		if((vDayCount%7==0)&&(j<Cal.GetMonDays())) {਍ऀऀऀ瘀䌀愀氀䐀愀琀愀㴀瘀䌀愀氀䐀愀琀愀⬀∀尀渀㰀⼀琀爀㸀∀㬀ഀ
			calHeight += 19;਍ऀऀ紀ഀ
	}਍ऀ⼀⼀ 昀椀渀椀猀栀 琀栀攀 琀愀戀氀攀 瀀爀漀瀀攀爀ഀ
	if(!(vDayCount%7) == 0) {਍ऀऀ眀栀椀氀攀⠀℀⠀瘀䐀愀礀䌀漀甀渀琀 ─ 㜀⤀ 㴀㴀 　⤀ 笀ഀ
			vCalData=vCalData+GenCell();਍ऀऀऀ瘀䐀愀礀䌀漀甀渀琀㴀瘀䐀愀礀䌀漀甀渀琀⬀㄀㬀ഀ
		}਍ऀ紀ഀ
	vCalData=vCalData+"\n</tr>";਍ऀഀ
	//Time picker਍ऀ椀昀 ⠀䌀愀氀⸀匀栀漀眀吀椀洀攀⤀ ഀ
	{਍ऀऀ瘀愀爀 猀栀漀眀䠀漀甀爀㬀ഀ
		var ShowArrows=false;਍ऀऀ瘀愀爀 䠀漀甀爀䌀攀氀氀圀椀搀琀栀㴀∀㌀㔀瀀砀∀㬀 ⼀⼀挀攀氀氀 眀椀搀琀栀 眀椀琀栀 猀攀挀漀渀搀猀⸀ഀ
		showHour=Cal.getShowHour();਍ऀऀഀ
		if (Cal.ShowSeconds==false && TimeMode==24 ) ਍        笀ഀ
		   ShowArrows=true;਍ऀऀ   䠀漀甀爀䌀攀氀氀圀椀搀琀栀㴀∀㄀　瀀砀∀㬀ഀ
		}਍ऀऀഀ
		vCalTime="\n<tr>\n<td colspan='7' align='center'><center>\n<table border='0' width='199px' cellpadding='0' cellspacing='2'>\n<tr>\n<td height='5px' width='"+HourCellWidth+"'>&nbsp;</td>\n";਍ऀऀഀ
		if (ShowArrows && UseImageFiles) ਍ऀऀ笀   ഀ
            vCalTime+="<td align='center'><table cellspacing='0' cellpadding='0' style='line-height:0pt'><tr><td><img onmousedown='javascript:Cal.SetHour(Cal.Hours + 1);RenderCssCal();' src='../gfx/cal_plus.gif' width='13' height='9' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td></tr><tr><td><img onmousedown='javascript:Cal.SetHour(Cal.Hours - 1);RenderCssCal();' src='../gfx/cal_minus.gif' width='13' height='9' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td></tr></table></td>\n"; ਍ऀऀ紀ഀ
		਍ऀऀ瘀䌀愀氀吀椀洀攀⬀㴀∀㰀琀搀 愀氀椀最渀㴀✀挀攀渀琀攀爀✀ 眀椀搀琀栀㴀✀㈀㈀瀀砀✀㸀㰀椀渀瀀甀琀 琀礀瀀攀㴀✀琀攀砀琀✀ 渀愀洀攀㴀✀栀漀甀爀✀ 洀愀砀氀攀渀最琀栀㴀㈀ 猀椀稀攀㴀㄀ 猀琀礀氀攀㴀尀∀圀䤀䐀吀䠀㨀 ㈀㈀瀀砀尀∀ 瘀愀氀甀攀㴀∀⬀猀栀漀眀䠀漀甀爀⬀∀ 漀渀䌀栀愀渀最攀㴀尀∀樀愀瘀愀猀挀爀椀瀀琀㨀䌀愀氀⸀匀攀琀䠀漀甀爀⠀琀栀椀猀⸀瘀愀氀甀攀⤀尀∀㸀∀㬀ഀ
		vCalTime+="</td><td align='center'>:</td><td align='center' width='22px'>";਍ऀऀ瘀䌀愀氀吀椀洀攀⬀㴀∀㰀椀渀瀀甀琀 琀礀瀀攀㴀✀琀攀砀琀✀ 渀愀洀攀㴀✀洀椀渀甀琀攀✀ 洀愀砀氀攀渀最琀栀㴀㈀ 猀椀稀攀㴀㄀ 猀琀礀氀攀㴀尀∀圀䤀䐀吀䠀㨀 ㈀㈀瀀砀尀∀ 瘀愀氀甀攀㴀∀⬀䌀愀氀⸀䴀椀渀甀琀攀猀⬀∀ 漀渀䌀栀愀渀最攀㴀尀∀樀愀瘀愀猀挀爀椀瀀琀㨀䌀愀氀⸀匀攀琀䴀椀渀甀琀攀⠀琀栀椀猀⸀瘀愀氀甀攀⤀尀∀㸀∀㬀ഀ
		਍ऀऀ椀昀 ⠀䌀愀氀⸀匀栀漀眀匀攀挀漀渀搀猀⤀ 笀ഀ
			vCalTime+="</td><td align='center'>:</td><td align='center' width='22px'>";਍ऀऀऀ瘀䌀愀氀吀椀洀攀⬀㴀∀㰀椀渀瀀甀琀 琀礀瀀攀㴀✀琀攀砀琀✀ 渀愀洀攀㴀✀猀攀挀漀渀搀✀ 洀愀砀氀攀渀最琀栀㴀㈀ 猀椀稀攀㴀㄀ 猀琀礀氀攀㴀尀∀圀䤀䐀吀䠀㨀 ㈀㈀瀀砀尀∀ 瘀愀氀甀攀㴀∀⬀䌀愀氀⸀匀攀挀漀渀搀猀⬀∀ 漀渀䌀栀愀渀最攀㴀尀∀樀愀瘀愀猀挀爀椀瀀琀㨀䌀愀氀⸀匀攀琀匀攀挀漀渀搀⠀瀀愀爀猀攀䤀渀琀⠀琀栀椀猀⸀瘀愀氀甀攀Ⰰ㄀　⤀⤀尀∀㸀∀㬀ഀ
		}਍ऀऀ椀昀 ⠀吀椀洀攀䴀漀搀攀㴀㴀㄀㈀⤀ 笀ഀ
			var SelectAm =(Cal.AMorPM=="AM")? "Selected":"";਍ऀऀऀ瘀愀爀 匀攀氀攀挀琀倀洀 㴀⠀䌀愀氀⸀䄀䴀漀爀倀䴀㴀㴀∀倀䴀∀⤀㼀 ∀匀攀氀攀挀琀攀搀∀㨀∀∀㬀ഀ
            ਍            瘀䌀愀氀吀椀洀攀⬀㴀∀㰀⼀琀搀㸀㰀琀搀㸀∀㬀ഀ
			vCalTime+="<select name=\"ampm\" onChange=\"javascript:Cal.SetAmPm(this.options[this.selectedIndex].value);\">\n";਍ऀऀऀ瘀䌀愀氀吀椀洀攀⬀㴀∀㰀漀瀀琀椀漀渀 ∀⬀匀攀氀攀挀琀䄀洀⬀∀ 瘀愀氀甀攀㴀尀∀䄀䴀尀∀㸀䄀䴀㰀⼀漀瀀琀椀漀渀㸀∀㬀ഀ
			vCalTime+="<option "+SelectPm+" value=\"PM\">PM<option>";਍ऀऀऀ瘀䌀愀氀吀椀洀攀⬀㴀∀㰀⼀猀攀氀攀挀琀㸀∀㬀ഀ
		}਍ऀऀ椀昀 ⠀匀栀漀眀䄀爀爀漀眀猀 ☀☀ 唀猀攀䤀洀愀最攀䘀椀氀攀猀⤀ 笀ഀ
		   vCalTime+="</td>\n<td align='center'><table cellspacing='0' cellpadding='0' style='line-height:0pt'><tr><td><img onmousedown='javascript:Cal.SetMinute(parseInt(Cal.Minutes,10) + 1);RenderCssCal();' src='../gfx/cal_plus.gif' width='13px' height='9px' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td></tr><tr><td><img onmousedown='javascript:Cal.SetMinute(parseInt(Cal.Minutes,10) - 1);RenderCssCal();' src='../gfx/cal_minus.gif' width='13px' height='9px' onmouseover='changeBorder(this, 0)' onmouseout='changeBorder(this, 1)' style='border:1px solid white'></td></tr></table>"; ਍ऀऀ紀ഀ
		vCalTime+="</td>\n<td align='right' valign='bottom' width='"+HourCellWidth+"'>";਍ऀऀഀ
	}਍ऀ攀氀猀攀ഀ
		{vCalTime+="\n<tr>\n<td colspan='7' align='right'>";}਍ऀ椀昀 ⠀唀猀攀䤀洀愀最攀䘀椀氀攀猀⤀ഀ
	{਍        瘀䌀愀氀吀椀洀攀⬀㴀∀㰀椀洀最 漀渀洀漀甀猀攀搀漀眀渀㴀✀樀愀瘀愀猀挀爀椀瀀琀㨀挀氀漀猀攀眀椀渀⠀尀∀∀ ⬀ 䌀愀氀⸀䌀琀爀氀 ⬀ ∀尀∀⤀㬀✀ 猀爀挀㴀✀⸀⸀⼀最昀砀⼀挀愀氀开挀氀漀猀攀⸀最椀昀✀ 眀椀搀琀栀㴀✀㄀㘀✀ 栀攀椀最栀琀㴀✀㄀㐀✀ 漀渀洀漀甀猀攀漀瘀攀爀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ 　⤀✀ 漀渀洀漀甀猀攀漀甀琀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ ㄀⤀✀ 猀琀礀氀攀㴀✀戀漀爀搀攀爀㨀㄀瀀砀 猀漀氀椀搀 眀栀椀琀攀✀㸀㰀⼀琀搀㸀∀㬀ഀ
    }਍    攀氀猀攀ഀ
    {਍        瘀䌀愀氀吀椀洀攀⬀㴀∀㰀猀瀀愀渀 椀搀㴀✀挀氀漀猀攀开挀愀氀✀ 琀椀琀氀攀㴀✀挀氀漀猀攀✀ 漀渀洀漀甀猀攀搀漀眀渀㴀✀樀愀瘀愀猀挀爀椀瀀琀㨀挀氀漀猀攀眀椀渀⠀尀∀∀ ⬀ 䌀愀氀⸀䌀琀爀氀 ⬀ ∀尀∀⤀㬀✀ 漀渀洀漀甀猀攀漀瘀攀爀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ 　⤀✀ 漀渀洀漀甀猀攀漀甀琀㴀✀挀栀愀渀最攀䈀漀爀搀攀爀⠀琀栀椀猀Ⰰ ㄀⤀✀ 猀琀礀氀攀㴀✀戀漀爀搀攀爀㨀㄀瀀砀 猀漀氀椀搀 眀栀椀琀攀㬀 昀漀渀琀ⴀ昀愀洀椀氀礀㨀 䄀爀椀愀氀㬀昀漀渀琀ⴀ猀椀稀攀㨀 ㄀　瀀琀㬀✀㸀砀㰀⼀猀瀀愀渀㸀㰀⼀琀搀㸀∀㬀ഀ
    }਍ഀ
    vCalTime+="</tr>\n</table></center>\n</td>\n</tr>";਍    挀愀氀䠀攀椀最栀琀 ⬀㴀 ㌀㄀㬀ऀഀ
	vCalTime+="\n</table>\n</span>";਍    ऀഀ
    //end time picker਍    瘀愀爀 昀甀渀挀䌀愀氀戀愀挀欀㴀∀昀甀渀挀琀椀漀渀 挀愀氀氀戀愀挀欀⠀椀搀Ⰰ 搀愀琀甀洀⤀ 笀尀渀∀㬀ഀ
    funcCalback+=" var CalId = document.getElementById(id); CalId.value=datum;\n";਍    昀甀渀挀䌀愀氀戀愀挀欀⬀㴀∀ 椀昀 ⠀䌀愀氀⸀匀栀漀眀吀椀洀攀⤀ 笀尀渀∀㬀ഀ
    funcCalback+=" CalId.value+=' '+Cal.getShowHour()+':'+Cal.Minutes;\n";਍    昀甀渀挀䌀愀氀戀愀挀欀⬀㴀∀ 椀昀 ⠀䌀愀氀⸀匀栀漀眀匀攀挀漀渀搀猀⤀尀渀  䌀愀氀䤀搀⸀瘀愀氀甀攀⬀㴀✀㨀✀⬀䌀愀氀⸀匀攀挀漀渀搀猀㬀尀渀∀㬀ഀ
    funcCalback+=" if (TimeMode==12)\n  CalId.value+=' '+Cal.getShowAMorPM();\n";	਍    昀甀渀挀䌀愀氀戀愀挀欀⬀㴀∀紀尀渀 䌀愀氀䤀搀⸀昀漀挀甀猀⠀⤀㬀 尀渀 眀椀渀䌀愀氀⸀猀琀礀氀攀⸀瘀椀猀椀戀椀氀椀琀礀㴀✀栀椀搀搀攀渀✀㬀尀渀紀尀渀∀㬀ഀ
	਍ऀ⼀⼀ 搀攀琀攀爀洀椀渀攀猀 椀昀 琀栀攀爀攀 椀猀 攀渀漀甀最栀 猀瀀愀挀攀 琀漀 漀瀀攀渀 琀栀攀 挀愀氀 愀戀漀瘀攀 琀栀攀 瀀漀猀椀琀椀漀渀 眀栀攀爀攀 椀琀 椀猀 挀愀氀氀攀搀ഀ
	if (ypos > calHeight) {਍ऀ   礀瀀漀猀 㴀 礀瀀漀猀 ⴀ 挀愀氀䠀攀椀最栀琀㬀 ഀ
	}਍ऀ椀昀 ⠀眀椀渀䌀愀氀 㴀㴀 甀渀搀攀昀椀渀攀搀⤀ 笀ഀ
	   var headID = document.getElementsByTagName("head")[0];਍ऀ   ഀ
	   // add javascript function to the span cal਍       瘀愀爀 攀 㴀 搀漀挀甀洀攀渀琀⸀挀爀攀愀琀攀䔀氀攀洀攀渀琀⠀∀猀挀爀椀瀀琀∀⤀㬀ഀ
       e.type = "text/javascript";਍       攀⸀氀愀渀最甀愀最攀 㴀 ∀樀愀瘀愀猀挀爀椀瀀琀∀㬀ഀ
       e.text = funcCalback;਍       栀攀愀搀䤀䐀⸀愀瀀瀀攀渀搀䌀栀椀氀搀⠀攀⤀㬀ഀ
	   ਍ऀ   ⼀⼀ 愀搀搀 猀琀礀氀攀猀栀攀攀琀 琀漀 琀栀攀 猀瀀愀渀 挀愀氀ഀ
	   var cssStr = ".calTD {font-family: verdana; font-size: 12px; text-align: center;}\n";਍ऀ   挀猀猀匀琀爀⬀㴀 ∀⸀挀愀氀刀 笀昀漀渀琀ⴀ昀愀洀椀氀礀㨀 瘀攀爀搀愀渀愀㬀 昀漀渀琀ⴀ猀椀稀攀㨀 ㄀㈀瀀砀㬀 琀攀砀琀ⴀ愀氀椀最渀㨀 挀攀渀琀攀爀㬀 昀漀渀琀ⴀ眀攀椀最栀琀㨀 戀漀氀搀㬀 挀漀氀漀爀㨀 爀攀搀㬀紀∀ഀ
	   var style = document.createElement("style");਍       猀琀礀氀攀⸀琀礀瀀攀 㴀 ∀琀攀砀琀⼀挀猀猀∀㬀ഀ
       style.rel = "stylesheet";਍       椀昀⠀猀琀礀氀攀⸀猀琀礀氀攀匀栀攀攀琀⤀ 笀 ⼀⼀ 䤀䔀ഀ
          style.styleSheet.cssText = cssStr;਍        紀 ഀ
	   else { // w3c਍          瘀愀爀 挀猀猀吀攀砀琀 㴀 搀漀挀甀洀攀渀琀⸀挀爀攀愀琀攀吀攀砀琀一漀搀攀⠀挀猀猀匀琀爀⤀㬀ഀ
          style.appendChild(cssText);਍ऀऀ紀ഀ
       headID.appendChild(style);਍ऀ   ഀ
	   // create the outer frame that allows the cal. to be moved਍ऀ   瘀愀爀 猀瀀愀渀 㴀 搀漀挀甀洀攀渀琀⸀挀爀攀愀琀攀䔀氀攀洀攀渀琀⠀∀猀瀀愀渀∀⤀㬀ഀ
       span.id = calSpanID;਍ഀ
	   with (span.style) {position = "absolute"; left = (xpos+8)+'px'; top = (ypos-8)+'px'; width = CalWidth; border = "solid 2pt " + SpanBorderColor; padding = "0pt"; cursor = "move"; backgroundColor = SpanBgColor; zIndex = 100;}਍ഀ
       document.body.appendChild(span)਍       眀椀渀䌀愀氀㴀搀漀挀甀洀攀渀琀⸀最攀琀䔀氀攀洀攀渀琀䈀礀䤀搀⠀挀愀氀匀瀀愀渀䤀䐀⤀㬀ഀ
    }਍    攀氀猀攀 笀ഀ
	  winCal.style.visibility = "visible";਍ऀ  眀椀渀䌀愀氀⸀猀琀礀氀攀⸀䠀攀椀最栀琀 㴀 挀愀氀䠀攀椀最栀琀㬀ഀ
਍ऀ  ⼀⼀ 猀攀琀 琀栀攀 瀀漀猀椀琀椀漀渀 昀漀爀 愀 渀攀眀 挀愀氀攀渀搀愀爀 漀渀氀礀ഀ
	  if(bNewCal==true){਍ऀ     眀椀渀䌀愀氀⸀猀琀礀氀攀⸀氀攀昀琀 㴀 ⠀砀瀀漀猀⬀㠀⤀⬀✀瀀砀✀㬀ഀ
	     winCal.style.top = (ypos-8)+'px';਍ऀ   紀ഀ
	}਍ऀ眀椀渀䌀愀氀⸀椀渀渀攀爀䠀吀䴀䰀㴀眀椀渀䌀愀氀䐀愀琀愀 ⬀ 瘀䌀愀氀䠀攀愀搀攀爀 ⬀ 瘀䌀愀氀䐀愀琀愀 ⬀ 瘀䌀愀氀吀椀洀攀㬀ഀ
	return true;਍紀ഀ
਍昀甀渀挀琀椀漀渀 䜀攀渀䌀攀氀氀⠀瀀嘀愀氀甀攀Ⰰ瀀䠀椀最栀䰀椀最栀琀Ⰰ瀀䌀漀氀漀爀⤀ 笀 ⼀⼀䜀攀渀攀爀愀琀攀 琀愀戀氀攀 挀攀氀氀 眀椀琀栀 瘀愀氀甀攀ഀ
	var PValue;਍ऀ瘀愀爀 倀䌀攀氀氀匀琀爀㬀ഀ
	var vColor;਍ऀ瘀愀爀 瘀䠀䰀猀琀爀㄀㬀⼀⼀䠀椀最栀䰀椀最栀琀 猀琀爀椀渀最ഀ
	var vHlstr2;਍ऀ瘀愀爀 瘀吀椀洀攀匀琀爀㬀ഀ
	਍ऀ椀昀 ⠀瀀嘀愀氀甀攀㴀㴀渀甀氀氀⤀ഀ
		PValue="";਍ऀ攀氀猀攀ഀ
		PValue=pValue;਍ऀഀ
	if (pColor!=null)਍ऀऀ瘀䌀漀氀漀爀㴀∀戀最挀漀氀漀爀㴀尀∀∀⬀瀀䌀漀氀漀爀⬀∀尀∀∀㬀ഀ
	else਍ऀऀ瘀䌀漀氀漀爀㴀䌀愀氀䈀最䌀漀氀漀爀㬀ഀ
	    if ((pHighLight!=null)&&(pHighLight)) {਍ऀऀ   瘀䠀䰀猀琀爀㄀㴀∀㰀昀漀渀琀 挀氀愀猀猀㴀✀挀愀氀刀✀㸀∀㬀瘀䠀䰀猀琀爀㈀㴀∀㰀⼀昀漀渀琀㸀∀㬀ഀ
		 }਍ऀ    攀氀猀攀 笀ഀ
		   vHLstr1="";vHLstr2="";਍ऀऀ 紀ഀ
	if (Cal.ShowTime) {਍ऀऀ瘀吀椀洀攀匀琀爀㴀✀ ✀⬀䌀愀氀⸀䠀漀甀爀猀⬀✀㨀✀⬀䌀愀氀⸀䴀椀渀甀琀攀猀㬀ഀ
		if (Cal.ShowSeconds)਍ऀऀऀ瘀吀椀洀攀匀琀爀⬀㴀✀㨀✀⬀䌀愀氀⸀匀攀挀漀渀搀猀㬀ഀ
		if (TimeMode==12)਍ऀऀऀ瘀吀椀洀攀匀琀爀⬀㴀✀ ✀⬀䌀愀氀⸀䄀䴀漀爀倀䴀㬀ഀ
	}	਍ऀ攀氀猀攀ഀ
		vTimeStr="";		਍ऀ椀昀 ⠀倀嘀愀氀甀攀℀㴀∀∀⤀ഀ
		PCellStr="\n<td "+vColor+" class='calTD' style='cursor: pointer;' onClick=\"javascript:callback('"+Cal.Ctrl+"','"+Cal.FormatDate(PValue)+"');\">"+vHLstr1+PValue+vHLstr2+"</td>";਍ऀ攀氀猀攀ഀ
		PCellStr="\n<td "+vColor+" class='calTD'>&nbsp;</td>";਍ऀ爀攀琀甀爀渀 倀䌀攀氀氀匀琀爀㬀ഀ
}਍ഀ
function Calendar(pDate,pCtrl) {਍ऀ⼀⼀倀爀漀瀀攀爀琀椀攀猀ഀ
	this.Date=pDate.getDate();//selected date਍ऀ琀栀椀猀⸀䴀漀渀琀栀㴀瀀䐀愀琀攀⸀最攀琀䴀漀渀琀栀⠀⤀㬀⼀⼀猀攀氀攀挀琀攀搀 洀漀渀琀栀 渀甀洀戀攀爀ഀ
	this.Year=pDate.getFullYear();//selected year in 4 digits਍ऀ琀栀椀猀⸀䠀漀甀爀猀㴀瀀䐀愀琀攀⸀最攀琀䠀漀甀爀猀⠀⤀㬀ഀ
	਍ऀ椀昀 ⠀瀀䐀愀琀攀⸀最攀琀䴀椀渀甀琀攀猀⠀⤀㰀㄀　⤀ഀ
		this.Minutes="0"+pDate.getMinutes();਍ऀ攀氀猀攀ഀ
		this.Minutes=pDate.getMinutes();਍ऀഀ
	if (pDate.getSeconds()<10)਍ऀऀ琀栀椀猀⸀匀攀挀漀渀搀猀㴀∀　∀⬀瀀䐀愀琀攀⸀最攀琀匀攀挀漀渀搀猀⠀⤀㬀ഀ
	else		਍ऀऀ琀栀椀猀⸀匀攀挀漀渀搀猀㴀瀀䐀愀琀攀⸀最攀琀匀攀挀漀渀搀猀⠀⤀㬀ഀ
		਍ऀ琀栀椀猀⸀䴀礀圀椀渀搀漀眀㴀眀椀渀䌀愀氀㬀ഀ
	this.Ctrl=pCtrl;਍ऀ琀栀椀猀⸀䘀漀爀洀愀琀㴀∀搀搀䴀䴀礀礀礀礀∀㬀ഀ
	this.Separator=DateSeparator;਍ऀ琀栀椀猀⸀匀栀漀眀吀椀洀攀㴀昀愀氀猀攀㬀ഀ
	this.Scroller="DROPDOWN";਍ऀ椀昀 ⠀瀀䐀愀琀攀⸀最攀琀䠀漀甀爀猀⠀⤀㰀㄀㈀⤀ഀ
		this.AMorPM="AM";਍ऀ攀氀猀攀ഀ
		this.AMorPM="PM";਍ऀ琀栀椀猀⸀匀栀漀眀匀攀挀漀渀搀猀㴀琀爀甀攀㬀ऀऀഀ
}਍ഀ
function GetMonthIndex(shortMonthName) {਍ऀ昀漀爀 ⠀椀㴀　㬀椀㰀㄀㈀㬀椀⬀⬀⤀ 笀ഀ
		if (MonthName[i].substring(0,3).toUpperCase()==shortMonthName.toUpperCase()) ਍ऀऀ   笀爀攀琀甀爀渀 椀㬀紀ഀ
	}਍紀ഀ
Calendar.prototype.GetMonthIndex=GetMonthIndex;਍ഀ
function IncYear() {਍ऀ䌀愀氀⸀夀攀愀爀⬀⬀㬀紀ഀ
	Calendar.prototype.IncYear=IncYear;਍ഀ
function DecYear() {਍ऀ䌀愀氀⸀夀攀愀爀ⴀⴀ㬀紀ഀ
	Calendar.prototype.DecYear=DecYear;਍ഀ
function IncMonth() {	਍ऀ䌀愀氀⸀䴀漀渀琀栀⬀⬀㬀ഀ
	if (Cal.Month>=12) {਍ऀऀ䌀愀氀⸀䴀漀渀琀栀㴀　㬀ഀ
		Cal.IncYear();਍ऀ紀ഀ
}਍䌀愀氀攀渀搀愀爀⸀瀀爀漀琀漀琀礀瀀攀⸀䤀渀挀䴀漀渀琀栀㴀䤀渀挀䴀漀渀琀栀㬀ഀ
਍昀甀渀挀琀椀漀渀 䐀攀挀䴀漀渀琀栀⠀⤀ 笀ऀഀ
	Cal.Month--;਍ऀ椀昀 ⠀䌀愀氀⸀䴀漀渀琀栀㰀　⤀ 笀ഀ
		Cal.Month=11;਍ऀऀ䌀愀氀⸀䐀攀挀夀攀愀爀⠀⤀㬀ഀ
	}਍紀ഀ
Calendar.prototype.DecMonth=DecMonth;਍ऀഀ
function SwitchMth(intMth) {਍ऀ䌀愀氀⸀䴀漀渀琀栀㴀椀渀琀䴀琀栀㬀紀ഀ
	Calendar.prototype.SwitchMth=SwitchMth;਍ഀ
function SwitchYear(intYear) {਍ऀ䌀愀氀⸀夀攀愀爀㴀椀渀琀夀攀愀爀㬀紀ഀ
	Calendar.prototype.SwitchYear=SwitchYear;਍ഀ
function SetHour(intHour) {	਍ऀ瘀愀爀 䴀愀砀䠀漀甀爀㬀ഀ
	var MinHour;਍ऀ椀昀 ⠀吀椀洀攀䴀漀搀攀㴀㴀㈀㐀⤀ 笀ഀ
		MaxHour=23;MinHour=0}਍ऀ攀氀猀攀 椀昀 ⠀吀椀洀攀䴀漀搀攀㴀㴀㄀㈀⤀ 笀ഀ
		MaxHour=12;MinHour=1}਍ऀ攀氀猀攀ഀ
		alert("TimeMode can only be 12 or 24");		਍ऀ瘀愀爀 䠀漀甀爀䔀砀瀀㴀渀攀眀 刀攀最䔀砀瀀⠀∀帀尀尀搀尀尀搀∀⤀㬀ഀ
	var SingleDigit=new RegExp("\\d");਍ऀഀ
	if ((HourExp.test(intHour) || SingleDigit.test(intHour)) && (parseInt(intHour,10)>MaxHour)) {਍ऀ    椀渀琀䠀漀甀爀 㴀 䴀椀渀䠀漀甀爀㬀ഀ
	}਍ऀ攀氀猀攀 椀昀 ⠀⠀䠀漀甀爀䔀砀瀀⸀琀攀猀琀⠀椀渀琀䠀漀甀爀⤀ 簀簀 匀椀渀最氀攀䐀椀最椀琀⸀琀攀猀琀⠀椀渀琀䠀漀甀爀⤀⤀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀䠀漀甀爀Ⰰ㄀　⤀㰀䴀椀渀䠀漀甀爀⤀⤀ 笀ഀ
		intHour = MaxHour;਍ऀ紀ഀ
	਍ऀ椀昀 ⠀匀椀渀最氀攀䐀椀最椀琀⸀琀攀猀琀⠀椀渀琀䠀漀甀爀⤀⤀ 笀ഀ
		intHour="0"+intHour+"";	਍ऀ紀ഀ
	਍ऀ椀昀 ⠀䠀漀甀爀䔀砀瀀⸀琀攀猀琀⠀椀渀琀䠀漀甀爀⤀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀䠀漀甀爀Ⰰ㄀　⤀㰀㴀䴀愀砀䠀漀甀爀⤀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀䠀漀甀爀Ⰰ㄀　⤀㸀㴀䴀椀渀䠀漀甀爀⤀⤀ 笀ऀഀ
		if ((TimeMode==12) && (Cal.AMorPM=="PM")) {਍ऀऀऀ椀昀 ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀䠀漀甀爀Ⰰ㄀　⤀㴀㴀㄀㈀⤀ഀ
				Cal.Hours=12;਍ऀऀऀ攀氀猀攀ऀഀ
				Cal.Hours=parseInt(intHour,10)+12;਍ऀऀ紀ऀഀ
		else if ((TimeMode==12) && (Cal.AMorPM=="AM")) {਍ऀऀऀ椀昀 ⠀椀渀琀䠀漀甀爀㴀㴀㄀㈀⤀ഀ
				intHour-=12;਍ऀऀऀ䌀愀氀⸀䠀漀甀爀猀㴀瀀愀爀猀攀䤀渀琀⠀椀渀琀䠀漀甀爀Ⰰ㄀　⤀㬀ഀ
		}਍ऀऀ攀氀猀攀 椀昀 ⠀吀椀洀攀䴀漀搀攀㴀㴀㈀㐀⤀ഀ
			Cal.Hours=parseInt(intHour,10);	਍ऀ紀ഀ
}਍䌀愀氀攀渀搀愀爀⸀瀀爀漀琀漀琀礀瀀攀⸀匀攀琀䠀漀甀爀㴀匀攀琀䠀漀甀爀㬀ഀ
਍昀甀渀挀琀椀漀渀 匀攀琀䴀椀渀甀琀攀⠀椀渀琀䴀椀渀⤀ 笀ഀ
	var MaxMin=59;਍ऀ瘀愀爀 䴀椀渀䴀椀渀㴀　㬀ഀ
	var SingleDigit=new RegExp("\\d");਍ऀ瘀愀爀 匀椀渀最氀攀䐀椀最椀琀㈀㴀渀攀眀 刀攀最䔀砀瀀⠀∀帀尀尀搀笀㄀紀␀∀⤀㬀ഀ
	var MinExp=new RegExp("^\\d{2}$");਍ऀഀ
	if ((MinExp.test(intMin) || SingleDigit.test(intMin)) && (parseInt(intMin,10)>MaxMin)) {਍ऀऀ椀渀琀䴀椀渀 㴀 䴀椀渀䴀椀渀㬀ഀ
	}਍ऀ攀氀猀攀 椀昀 ⠀⠀䴀椀渀䔀砀瀀⸀琀攀猀琀⠀椀渀琀䴀椀渀⤀ 簀簀 匀椀渀最氀攀䐀椀最椀琀⸀琀攀猀琀⠀椀渀琀䴀椀渀⤀⤀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀䴀椀渀Ⰰ㄀　⤀㰀䴀椀渀䴀椀渀⤀⤀ऀ笀ഀ
		intMin = MaxMin;਍ऀ紀ഀ
	var strMin = intMin + "";਍ऀ椀昀 ⠀匀椀渀最氀攀䐀椀最椀琀㈀⸀琀攀猀琀⠀椀渀琀䴀椀渀⤀⤀ 笀ഀ
		strMin="0"+strMin+"";਍ऀ紀 ഀ
	if ((MinExp.test(intMin) || SingleDigit.test(intMin)) ਍ऀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀䴀椀渀Ⰰ㄀　⤀㰀㴀㔀㤀⤀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀䴀椀渀Ⰰ㄀　⤀㸀㴀　⤀⤀ 笀ഀ
	 	Cal.Minutes=strMin;਍ऀ紀ഀ
}਍䌀愀氀攀渀搀愀爀⸀瀀爀漀琀漀琀礀瀀攀⸀匀攀琀䴀椀渀甀琀攀㴀匀攀琀䴀椀渀甀琀攀㬀ഀ
਍昀甀渀挀琀椀漀渀 匀攀琀匀攀挀漀渀搀⠀椀渀琀匀攀挀⤀ 笀ऀഀ
	var MaxSec=59;਍ऀ瘀愀爀 䴀椀渀匀攀挀㴀　㬀ഀ
	var SingleDigit=new RegExp("\\d");਍ऀ瘀愀爀 匀椀渀最氀攀䐀椀最椀琀㈀㴀渀攀眀 刀攀最䔀砀瀀⠀∀帀尀尀搀笀㄀紀␀∀⤀㬀ഀ
	var SecExp=new RegExp("^\\d{2}$");਍ऀഀ
	if ((SecExp.test(intSec) || SingleDigit.test(intSec)) && (parseInt(intSec,10)>MaxSec)) {਍ऀऀ椀渀琀匀攀挀 㴀 䴀椀渀匀攀挀㬀ഀ
	}਍ऀ攀氀猀攀 椀昀 ⠀⠀匀攀挀䔀砀瀀⸀琀攀猀琀⠀椀渀琀匀攀挀⤀ 簀簀 匀椀渀最氀攀䐀椀最椀琀⸀琀攀猀琀⠀椀渀琀匀攀挀⤀⤀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀匀攀挀Ⰰ㄀　⤀㰀䴀椀渀匀攀挀⤀⤀ऀ笀ഀ
		intSec = MaxSec;਍ऀ紀ഀ
	var strSec = intSec + "";਍ऀ椀昀 ⠀匀椀渀最氀攀䐀椀最椀琀㈀⸀琀攀猀琀⠀椀渀琀匀攀挀⤀⤀ 笀ഀ
		strSec="0"+strSec+"";਍ऀ紀 ഀ
	if ((SecExp.test(intSec) || SingleDigit.test(intSec)) ਍ऀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀匀攀挀Ⰰ㄀　⤀㰀㴀㔀㤀⤀ ☀☀ ⠀瀀愀爀猀攀䤀渀琀⠀椀渀琀匀攀挀Ⰰ㄀　⤀㸀㴀　⤀⤀ 笀ഀ
	 	Cal.Seconds=strSec;਍ऀ紀ഀ
}਍䌀愀氀攀渀搀愀爀⸀瀀爀漀琀漀琀礀瀀攀⸀匀攀琀匀攀挀漀渀搀㴀匀攀琀匀攀挀漀渀搀㬀ഀ
਍昀甀渀挀琀椀漀渀 匀攀琀䄀洀倀洀⠀瀀瘀愀氀甀攀⤀ 笀ഀ
	this.AMorPM=pvalue;਍ऀ椀昀 ⠀瀀瘀愀氀甀攀㴀㴀∀倀䴀∀⤀ 笀ഀ
		this.Hours=(parseInt(this.Hours,10))+12;਍ऀऀ椀昀 ⠀琀栀椀猀⸀䠀漀甀爀猀㴀㴀㈀㐀⤀ഀ
			this.Hours=12;਍ऀ紀ऀഀ
	else if (pvalue=="AM")਍ऀऀ琀栀椀猀⸀䠀漀甀爀猀ⴀ㴀㄀㈀㬀ऀഀ
}਍䌀愀氀攀渀搀愀爀⸀瀀爀漀琀漀琀礀瀀攀⸀匀攀琀䄀洀倀洀㴀匀攀琀䄀洀倀洀㬀ഀ
਍昀甀渀挀琀椀漀渀 最攀琀匀栀漀眀䠀漀甀爀⠀⤀ 笀ഀ
	var finalHour;਍    椀昀 ⠀吀椀洀攀䴀漀搀攀㴀㴀㄀㈀⤀ 笀ഀ
    	if (parseInt(this.Hours,10)==0) {਍ऀऀऀ琀栀椀猀⸀䄀䴀漀爀倀䴀㴀∀䄀䴀∀㬀ഀ
			finalHour=parseInt(this.Hours,10)+12;	਍ऀऀ紀ഀ
		else if (parseInt(this.Hours,10)==12) {਍ऀऀऀ琀栀椀猀⸀䄀䴀漀爀倀䴀㴀∀倀䴀∀㬀ഀ
			finalHour=12;਍ऀऀ紀ऀऀഀ
		else if (this.Hours>12)	{਍ऀऀऀ琀栀椀猀⸀䄀䴀漀爀倀䴀㴀∀倀䴀∀㬀ഀ
			if ((this.Hours-12)<10)਍ऀऀऀऀ昀椀渀愀氀䠀漀甀爀㴀∀　∀⬀⠀⠀瀀愀爀猀攀䤀渀琀⠀琀栀椀猀⸀䠀漀甀爀猀Ⰰ㄀　⤀⤀ⴀ㄀㈀⤀㬀ഀ
			else਍ऀऀऀऀ昀椀渀愀氀䠀漀甀爀㴀瀀愀爀猀攀䤀渀琀⠀琀栀椀猀⸀䠀漀甀爀猀Ⰰ㄀　⤀ⴀ㄀㈀㬀ऀഀ
		}਍ऀऀ攀氀猀攀 笀ഀ
			this.AMorPM="AM";਍ऀऀऀ椀昀 ⠀琀栀椀猀⸀䠀漀甀爀猀㰀㄀　⤀ഀ
				finalHour="0"+parseInt(this.Hours,10);਍ऀऀऀ攀氀猀攀ഀ
				finalHour=this.Hours;	਍ऀऀ紀ഀ
	}਍ऀ攀氀猀攀 椀昀 ⠀吀椀洀攀䴀漀搀攀㴀㴀㈀㐀⤀ 笀ഀ
		if (this.Hours<10)਍ऀऀऀ昀椀渀愀氀䠀漀甀爀㴀∀　∀⬀瀀愀爀猀攀䤀渀琀⠀琀栀椀猀⸀䠀漀甀爀猀Ⰰ㄀　⤀㬀ഀ
		else	਍ऀऀऀ昀椀渀愀氀䠀漀甀爀㴀琀栀椀猀⸀䠀漀甀爀猀㬀ഀ
	}਍ऀ爀攀琀甀爀渀 昀椀渀愀氀䠀漀甀爀㬀ഀ
}				਍䌀愀氀攀渀搀愀爀⸀瀀爀漀琀漀琀礀瀀攀⸀最攀琀匀栀漀眀䠀漀甀爀㴀最攀琀匀栀漀眀䠀漀甀爀㬀ऀऀഀ
਍昀甀渀挀琀椀漀渀 最攀琀匀栀漀眀䄀䴀漀爀倀䴀⠀⤀ 笀ഀ
	return this.AMorPM;	਍紀ऀऀऀऀഀ
Calendar.prototype.getShowAMorPM=getShowAMorPM;		਍ഀ
function GetMonthName(IsLong) {਍ऀ瘀愀爀 䴀漀渀琀栀㴀䴀漀渀琀栀一愀洀攀嬀琀栀椀猀⸀䴀漀渀琀栀崀㬀ഀ
	if (IsLong)਍ऀऀ爀攀琀甀爀渀 䴀漀渀琀栀㬀ഀ
	else਍ऀऀ爀攀琀甀爀渀 䴀漀渀琀栀⸀猀甀戀猀琀爀⠀　Ⰰ㌀⤀㬀ഀ
}਍䌀愀氀攀渀搀愀爀⸀瀀爀漀琀漀琀礀瀀攀⸀䜀攀琀䴀漀渀琀栀一愀洀攀㴀䜀攀琀䴀漀渀琀栀一愀洀攀㬀ഀ
਍昀甀渀挀琀椀漀渀 䜀攀琀䴀漀渀䐀愀礀猀⠀⤀ 笀 ⼀⼀䜀攀琀 渀甀洀戀攀爀 漀昀 搀愀礀猀 椀渀 愀 洀漀渀琀栀ഀ
	var DaysInMonth=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];਍ऀ椀昀 ⠀琀栀椀猀⸀䤀猀䰀攀愀瀀夀攀愀爀⠀⤀⤀ 笀ഀ
		DaysInMonth[1]=29;਍ऀ紀ऀഀ
	return DaysInMonth[this.Month];	਍紀ഀ
Calendar.prototype.GetMonDays=GetMonDays;਍ഀ
function IsLeapYear() {਍ऀ椀昀 ⠀⠀琀栀椀猀⸀夀攀愀爀─㐀⤀㴀㴀　⤀ 笀ഀ
		if ((this.Year%100==0) && (this.Year%400)!=0) {਍ऀऀऀ爀攀琀甀爀渀 昀愀氀猀攀㬀ഀ
		}਍ऀऀ攀氀猀攀 笀ഀ
			return true;਍ऀऀ紀ഀ
	}਍ऀ攀氀猀攀 笀ഀ
		return false;਍ऀ紀ഀ
}਍䌀愀氀攀渀搀愀爀⸀瀀爀漀琀漀琀礀瀀攀⸀䤀猀䰀攀愀瀀夀攀愀爀㴀䤀猀䰀攀愀瀀夀攀愀爀㬀ഀ
਍昀甀渀挀琀椀漀渀 䘀漀爀洀愀琀䐀愀琀攀⠀瀀䐀愀琀攀⤀ഀ
{਍ऀ瘀愀爀 䴀漀渀琀栀䐀椀最椀琀㴀琀栀椀猀⸀䴀漀渀琀栀⬀㄀㬀ഀ
	if (PrecedeZero==true) {਍ऀऀ椀昀 ⠀瀀䐀愀琀攀㰀㄀　⤀ഀ
			pDate="0"+pDate;਍ऀऀ椀昀 ⠀䴀漀渀琀栀䐀椀最椀琀㰀㄀　⤀ഀ
			MonthDigit="0"+MonthDigit;਍ऀ紀ഀ
਍ऀ椀昀 ⠀琀栀椀猀⸀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀㴀㴀∀䐀䐀䴀䴀夀夀夀夀∀⤀ഀ
		return (pDate+DateSeparator+MonthDigit+DateSeparator+this.Year);਍ऀ攀氀猀攀 椀昀 ⠀琀栀椀猀⸀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀㴀㴀∀䐀䐀䴀䴀䴀夀夀夀夀∀⤀ഀ
		return (pDate+DateSeparator+this.GetMonthName(false)+DateSeparator+this.Year);਍ऀ攀氀猀攀 椀昀 ⠀琀栀椀猀⸀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀㴀㴀∀䴀䴀䐀䐀夀夀夀夀∀⤀ഀ
		return (MonthDigit+DateSeparator+pDate+DateSeparator+this.Year);਍ऀ攀氀猀攀 椀昀 ⠀琀栀椀猀⸀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀㴀㴀∀䴀䴀䴀䐀䐀夀夀夀夀∀⤀ഀ
		return (this.GetMonthName(false)+DateSeparator+pDate+DateSeparator+this.Year);਍ऀ攀氀猀攀 椀昀 ⠀琀栀椀猀⸀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀㴀㴀∀夀夀夀夀䴀䴀䐀䐀∀⤀ഀ
		return (this.Year+DateSeparator+MonthDigit+DateSeparator+pDate);਍ऀ攀氀猀攀 椀昀 ⠀琀栀椀猀⸀䘀漀爀洀愀琀⸀琀漀唀瀀瀀攀爀䌀愀猀攀⠀⤀㴀㴀∀夀夀夀夀䴀䴀䴀䐀䐀∀⤀ഀ
		return (this.Year+DateSeparator+this.GetMonthName(false)+DateSeparator+pDate);	਍ऀ攀氀猀攀ऀऀऀऀऀഀ
		return (pDate+DateSeparator+(this.Month+1)+DateSeparator+this.Year);਍紀ഀ
Calendar.prototype.FormatDate=FormatDate;਍ऀഀ
function closewin(id) {਍   瘀愀爀 䌀愀氀䤀搀 㴀 搀漀挀甀洀攀渀琀⸀最攀琀䔀氀攀洀攀渀琀䈀礀䤀搀⠀椀搀⤀㬀ഀ
   CalId.focus();਍   眀椀渀䌀愀氀⸀猀琀礀氀攀⸀瘀椀猀椀戀椀氀椀琀礀㴀✀栀椀搀搀攀渀✀㬀ഀ
 }਍ഀ
function changeBorder(element, col) {਍  椀昀 ⠀挀漀氀 㴀㴀 　⤀ 笀ഀ
    element.style.borderColor = "black";਍    攀氀攀洀攀渀琀⸀猀琀礀氀攀⸀挀甀爀猀漀爀 㴀 ∀瀀漀椀渀琀攀爀∀㬀ഀ
  }਍  攀氀猀攀 笀ഀ
    element.style.borderColor = "white";਍    攀氀攀洀攀渀琀⸀猀琀礀氀攀⸀挀甀爀猀漀爀 㴀 ∀愀甀琀漀∀㬀ഀ
  }਍紀ഀ
਍昀甀渀挀琀椀漀渀 瀀椀挀欀䤀琀⠀攀瘀琀⤀ 笀ഀ
   // accesses the element that generates the event and retrieves its ID਍   椀昀 ⠀眀椀渀搀漀眀⸀愀搀搀䔀瘀攀渀琀䰀椀猀琀攀渀攀爀⤀ 笀 ⼀⼀ 眀㌀挀ഀ
	  var objectID = evt.target.id;਍      椀昀 ⠀漀戀樀攀挀琀䤀䐀⸀椀渀搀攀砀伀昀⠀挀愀氀匀瀀愀渀䤀䐀⤀ ℀㴀 ⴀ㄀⤀笀ഀ
         var dom = document.getElementById(objectID);਍         挀渀䰀攀昀琀㴀攀瘀琀⸀瀀愀最攀堀㬀ഀ
         cnTop=evt.pageY;਍ഀ
         if (dom.offsetLeft){਍           挀渀䰀攀昀琀 㴀 ⠀挀渀䰀攀昀琀 ⴀ 搀漀洀⸀漀昀昀猀攀琀䰀攀昀琀⤀㬀 挀渀吀漀瀀 㴀 ⠀挀渀吀漀瀀 ⴀ 搀漀洀⸀漀昀昀猀攀琀吀漀瀀⤀㬀ഀ
          }਍       紀ഀ
	  // get mouse position on click਍ऀ  砀瀀漀猀 㴀 ⠀攀瘀琀⸀瀀愀最攀堀⤀㬀ഀ
	  ypos = (evt.pageY);਍ऀ紀   ഀ
   else { // IE਍ऀ  瘀愀爀 漀戀樀攀挀琀䤀䐀 㴀 攀瘀攀渀琀⸀猀爀挀䔀氀攀洀攀渀琀⸀椀搀㬀ഀ
      cnLeft=event.offsetX;਍      挀渀吀漀瀀㴀⠀攀瘀攀渀琀⸀漀昀昀猀攀琀夀⤀㬀ഀ
	  // get mouse position on click਍ऀ  瘀愀爀 搀攀 㴀 搀漀挀甀洀攀渀琀⸀搀漀挀甀洀攀渀琀䔀氀攀洀攀渀琀㬀ഀ
      var b = document.body;਍      砀瀀漀猀 㴀 攀瘀攀渀琀⸀挀氀椀攀渀琀堀 ⬀ ⠀搀攀⸀猀挀爀漀氀氀䰀攀昀琀 簀簀 戀⸀猀挀爀漀氀氀䰀攀昀琀⤀ ⴀ ⠀搀攀⸀挀氀椀攀渀琀䰀攀昀琀 簀簀 　⤀㬀ഀ
      ypos = event.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0);਍    紀ഀ
   // verify if this is a valid element to pick  ਍   椀昀 ⠀漀戀樀攀挀琀䤀䐀⸀椀渀搀攀砀伀昀⠀挀愀氀匀瀀愀渀䤀䐀⤀ ℀㴀 ⴀ㄀⤀笀ഀ
      domStyle = document.getElementById(objectID).style;਍    紀ഀ
   if (domStyle) { ਍      搀漀洀匀琀礀氀攀⸀稀䤀渀搀攀砀 㴀 ㄀　　㬀ഀ
      return false;਍    紀ഀ
   else {਍      搀漀洀匀琀礀氀攀 㴀 渀甀氀氀㬀ഀ
      return;਍    紀ഀ
 }਍ഀ
function dragIt(evt) {਍   椀昀 ⠀搀漀洀匀琀礀氀攀⤀ 笀ഀ
      if (window.Event) {਍         搀漀洀匀琀礀氀攀⸀氀攀昀琀 㴀 ⠀攀瘀琀⸀挀氀椀攀渀琀堀ⴀ挀渀䰀攀昀琀 ⬀ 搀漀挀甀洀攀渀琀⸀戀漀搀礀⸀猀挀爀漀氀氀䰀攀昀琀⤀⬀✀瀀砀✀㬀ഀ
         domStyle.top = (evt.clientY-cnTop + document.body.scrollTop)+'px';਍       紀 ഀ
      else {਍         搀漀洀匀琀礀氀攀⸀氀攀昀琀 㴀 ⠀攀瘀攀渀琀⸀挀氀椀攀渀琀堀ⴀ挀渀䰀攀昀琀 ⬀ 搀漀挀甀洀攀渀琀⸀戀漀搀礀⸀猀挀爀漀氀氀䰀攀昀琀⤀⬀✀瀀砀✀㬀 ഀ
         domStyle.top = (event.clientY-cnTop + document.body.scrollTop)+'px';਍       紀ഀ
    } ਍ 紀ഀ
਍昀甀渀挀琀椀漀渀 搀爀漀瀀䤀琀⠀⤀ 笀ഀ
   if (domStyle) { ਍      搀漀洀匀琀礀氀攀⸀稀䤀渀搀攀砀 㴀 　㬀ഀ
      domStyle = null;਍    紀ഀ
 }