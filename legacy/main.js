function main()
{
	setUnitLine(); //発車標の段数を設定する
	//updateNowTime(); //現在時刻表示を開始
}

//発車標の段数を設定する
function setUnitLine()
{
	//台数を読み込む
	var id = "unitCountInput";
	var index = document.getElementById(id).selectedIndex;
	unitSum = document.getElementById(id).options[index].value;
	
	//段数を読み込む
	var id = "lineCountInput";
	var index = document.getElementById(id).selectedIndex;
	lineSum = document.getElementById(id).options[index].value;
	
	//駅タイプを読み込む
	var id = "stationTypeInput";
	stationTypeIndex = document.getElementById(id).selectedIndex;
	
	//変数の初期化
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		updateZaisenCount[unit] = 0;
		updateZaisenTimeout[unit] = null;
		updateApproachingCount[unit] = 0;
		updateApproachingTimeout[unit] = null;
	}
	
	writeUnitHTML(); //筐体を段数分描く
	writeFormHTML(); //入力部を段数分つくる
	setDefaultData(); //デフォルトでデータをセットする
	readForm(); //入力を読み込む
	
	updateRemarks(); //備考表示更新
	intervalTimeSet(); //日本語と英語の交互表示スタート
	//updateNowTime(); //現在時刻表示を開始
	adjustSize(); //画像の大きさ変更
	
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		//updateStopSta(unit); //停車駅表示描画
		//StopStaColorAuto(unit); //種別から色を自動設定
		updateStatus(unit); //スクロール表示更新
		//updateRemarksLine(1, unit, 0); //お知らせ表示開始
		//updateInfo(unit); //備考欄のテロップ更新
		//updatePosition(unit); //在線位置表示を更新
		//updateLabel(unit);//筐体のラベルを更新する
	}
	//stopStaMovingAll(); //乗換表示アニメーション
	
}

//HTMLのLED部分出力 1台分のディスプレイの表示を書き出す処理
function writeUnitHTML()
{
	var out = "";
	out += "";
	out += "<div id='displayUnitDiv' style='position:relative; ' class='font_gothic' >";
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		//       
		out += "<div id='flameDivA"+unit+"' style='position:absolute; z-index:"+(unit*10)+"; cursor: move; ' onMousedown=dragOn('flameDivA"+unit+"') >";
		out += "      <div id='flameDiv0"+unit+"' style='position:absolute; border:solid 0px #fff; '>";
		out += "      <img id='unitBaseImg"+unit+"' src='img/unit-base.png' alt='' style='position:absolute; ' />";
		out += "      <img id='trackLabelImg"+unit+"' src='img/frutiger/2.png' alt='' style='position:absolute; ' />";
		
		//out += "      <img id='titleImg"+unit+"' src='img/label/title0.png' alt='' style='position:absolute; ' />";
		out += "        <div id='flameDiv1"+unit+"' style='position:absolute; background-color:#222; '>";
		out += "        <div id='flameDiv2"+unit+"' style='position:absolute; background-color:#000; '>";
		out += "";
		out += "";
		
		out += "      <img id='baseImg"+unit+"' src='img/base.jpg' alt='' style='position:absolute; ' />";
		out += "      <img id='titleImg"+unit+"' src='img/title-0.png' alt='' style='position:absolute; ' />";
		//out += "      <img id='headerImg"+unit+"' src='img/header-0.png' alt='' style='position:absolute; ' />";
		
		for(line = 0 ; line < lineSum ; line++)
		{
			out += "    <div id='lineContentsDiv"+unit+line+"' style='position:absolute; '>";
			
			//時刻以外
			for(c=0 ; c<contentsList.length ; c++)
			{
				//特情処理　表示対象以外の項目は、処理させない
				if(!contentsList[c][3][stationTypeIndex])
					continue;
				
				out += "  <img id='"+contentsList[c][0] + "Img"+unit+line+"' style='position:absolute;                       ' src='img/null.png' alt='' />";
			}
			//時刻
			for(i=0 ; i<timePosi.length ; i++)
			{
				out += "      <img id='"+timePosi[i][0]+"Img"+unit+line+"' src='img/null.png' alt='' style='position:absolute; ' />";
			}
			/*
			//備考
			if(remarksExist[line])
			{
				out += "        <div id='remarksADiv"+unit+line+"' style='position:absolute; background-color:#fff; '>";
				out += "          <div id='remarksBDiv"+unit+line+"' style='position:absolute; overflow:hidden; '>";
				out += "            <div id='remarksCDiv"+unit+line+"' class='font_gothic' style='position:absolute; color:#000; white-space: nowrap; '>";
				out += "            </div>";
				out += "          </div>";
				out += "        </div>";
			}
			*/
			
			out += "    </div>";
		}
		//最下段メッセージ表示
		//メインのスクロール表示
		out += "          <img id='messageBaseImg"+unit+"' src='img/null.png' alt='' style='position:absolute; ' />";
		out += "          <div id='messageDiv"+unit+"' style='position:absolute; color:"+messageDefaultColor+"; ' class='font_gothic'>";
		out += "          </div>";
		
		//在線位置　駅表示
		out += "          <div id='zaisenGroupDiv"+unit+"' style='position:absolute; '>";
		out += "          <img id='zaisenSta0Img"+unit+"' src='img/null.png' alt='' style='position:absolute; ' />"; //当駅
		out += "          <img id='zaisenSta1Img"+unit+"' src='img/null.png' alt='' style='position:absolute; ' />"; //1駅前
		out += "          <img id='zaisenSta2Img"+unit+"' src='img/null.png' alt='' style='position:absolute; ' />";
		out += "          <img id='zaisenSta3Img"+unit+"' src='img/null.png' alt='' style='position:absolute; ' />";
		//在線位置　列車表示
		for(pos=1 ; pos<=7 ; pos++)
		{
			out += "          <img id='zaisenTrain"+pos+"Img"+unit+"' src='img/null.png' alt='' style='position:absolute; z-index:2; ' />";
		}
		out += "          </div>";
		
		
		out += "        </div>";
		out += "        </div>";
		out += "      </div>";
		out += "</div>";
		out += "";
	}
	out += "</div>";
	
	var id = "displayMainDiv";
	document.getElementById(id).innerHTML = out;
	
}


//制御するフォームのHTMLを出力
function writeFormHTML()
{
	var out = "";
	out += "";
	out += " ";
	
	out += "<div id='' style=''>";
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		out += "<div style='float:left; margin:0px; padding:5px; border-right: solid 1px #999; border-bottom: solid 1px #999;'>";  //  border-bottom: solid 1px #999; 
		out += "【"+(unit+1)+"台目】";
		out += "　<select size='1' id='trackLabelInput"+unit+"' style='' onChange='readForm(); '>";
		for(i=1 ; i<10 ; i++)
		{
			out += "<option value=''>"+i+"番線</option>";
		}
		out += "</select> ";
		
		out += "　<select size='1' id='directionInput"+unit+"' style='' onChange='directionUpdate(); '>";
		out += "<option value=''>右側</option>";
		out += "<option value=''>左側</option>";
		out += "</select> ";
		
		out += "　<select size='1' id='backTitleInput"+unit+"' style='' onChange='readForm(); '>";
		for(i=0 ; i<backTitleList.length ; i++)
		{
			out += "<option value='' selected>"+backTitleList[i][0]+"</option>";
		}
		out += "</select> ";
		out += "<br />";
		
		for(line=0 ; line<lineSum ; line++)
		{
			out += "<div style='white-space: nowrap; '>";
			out += " "+(line+1)+"本目 ";
			
			//種別
			out += writeContentsInputHTML("type", unit, line);
			//時刻
			out += "<input id='departureHourInput"+unit+line+"' type='text' value='12' size='2' maxlength='2' style='text-align:right; ' onkeyup='readForm()' />";
			out += " : ";
			out += "<input id='departureMinuteInput"+unit+line+"' type='text' value='34' size='2' maxlength='2' style='text-align:right; ' onkeyup='readForm()' />";
			out += " ";
			out += "　";
			//行先
			out += writeContentsInputHTML("destinationA", unit, line);
			out += writeContentsInputHTML("destinationB", unit, line);
			//両数
			out += writeContentsInputHTML("carsCount", unit, line);
			//番線
			//out += writeContentsInputHTML("track", unit, line);
			//遅れ
			//out += writeContentsInputHTML("delay", unit, line);
			
			//発車直前
			//out += "<input id='departureBeforeInput"+unit+line+"' type='checkbox' value='' onclick='readForm(); updateBlinkInit(); updateBlink();'><label for='departureBeforeInput"+unit+line+"'>発車直前</label>　";
			//備考
			if(remarksExist)
			{
				out += "<br />";
				out += "　　<input id='remarks0Input"+unit+line+"' type='text' value='' size='100' />";
			}
			out += "";

			out += " ";
			out += "</div>";
		}
		//備考
		out += "<select size='1' id='messageTypeInput"+unit+"' style='' onChange='updateStatus("+unit+")'>";
		out += "<option value='' selected>通常表示</option>";
		out += "<option value='' >お知らせ表示</option>";
		out += "<option value='' >在線位置表示</option>";
		out += "<option value='' >接近表示</option>";
		out += "</select> ";
		out += "<input id='messageInput"+unit+"' type='text' value='' size='80' />";
		out += " <input type='button' id='movingStartButtom"+unit+"' value='反映' onclick='updateStatus("+unit+")' />　";
		out += "<br />";
		
		out += "";
		out += "<table>";
		out += "<tr>";
		//out += "<td>在線位置：</td>";
		
		//--------列車アイコン選択
		for(pos=7 ; pos>=1 ; pos--)
		{
			out += "<td>";
			out += "<select size='1' id='zaisenTrainInput"+unit+"_"+pos+"' style='' onChange='updateStatus("+unit+"); '>";
			for(i=0 ; i<zaisenTrainList.length ; i++)
			{
				out += "<option value='' selected>"+zaisenTrainList[i][0]+"</option>";
			}
			out += "</select> ＞ ";
			out += "</td>";
		}
		out += "<td>当駅</td>"; //最後に当駅の分を出力
		out += "</tr>";
		//--------駅選択
		for(pos=7 ; pos>=1 ; pos--)
		{
			if(pos%2 == 1) //奇数の場合は駅間なので表示物なし
			{
				out += "<td></td>";
			}
			else
			{
				out += "<td>";
				out += "<select size='1' id='zaisenStaInput"+unit+"_"+pos+"' style='' onChange='readForm();updateZaisenAll();'>";
				for(i=0 ; i<zaisenStaList.length ; i++)
				{
					out += "<option value='' selected>"+zaisenStaList[i][0]+"</option>";
				}
				out += "</select> ";
				out += "</td>";
			}
		}
		out += "<td></td>"; //最後に当駅の分を出力
		out += "</tr>";
		
		out += "</table>";
		
		
		
		//out += "　<input id='zaisenCheckbox"+unit+"1' type='checkbox' value='' onclick='updateStatus("+unit+")'><label for='zaisenCheckbox"+unit+"1'>＞＞</label>";
		
		//out += "<br />";
		/*//現在時刻
		out += "現在時刻 ";
		out += "<input id='nowTimeHourInput"+unit+"'   type='text' value='12' size='2' onkeyup='updateNowTime()' style='text-align:right;' />：";
		out += "<input id='nowTimeMinuteInput"+unit+"' type='text' value='34' size='2' onkeyup='updateNowTime()' style='text-align:right;' />";
		out += "　";
		out += "<input type='button' id='movingStartButtom"+unit+"' value='繰り上げアニメーション' onclick='movingStart("+unit+")' />　";
		*/
		out += "";
		out += "";
		
		　
		out += "</div>";
		out += "</div>";
		
		out += "";
	}
	out += "<br style='clear:both;' />";
	out += "";
	
	var id = "inputFormDiv";
	document.getElementById(id).innerHTML = out;
}

//特定のセレクトボックスHTMLを出力する
function writeContentsInputHTML(object, unit, line)
{
	var out = "";
	for(c=0 ; c<contentsList.length ; c++)
	{
		if(contentsList[c][0] == object)
		{
			//特情処理　表示対象以外の項目は、処理させない
			if(!contentsList[c][3][stationTypeIndex])
				continue;
			
			out += " <select size='1' id='"+contentsList[c][0]+"Input"+unit+line+"' style='' onChange='readForm()'>";
			dataList = contentsList[c][1];
			for(j=0 ; j<dataList.length ; j++)
			{
				out += "<option value='"+c+"'>"+dataList[j][0]+"</option>";
			}
			out += "</select> ";
			return out;
		}
	}
	return out;
}


//デフォルトでの列車データをセットする、引数numに0だったら、ランダム、1か2か3だったらデフォルトデータ挿入
function setDefaultData()
{
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		for(line=0 ; line<lineSum ; line++)
		{
			///////今より少し進んだ時刻を計算
			var nowDate = new Date(); //現在日時
			var baseSecond = nowDate.getTime(); //秒に変換
			baseSecond += line*runningInterval*60*1000 + Math.floor(Math.random() * (runningInterval*0.8)*60*1000) ; //運転間隔
			nowDate.setTime(baseSecond); //Date型に変換
			var hour = nowDate.getHours(); //時
			var minute = nowDate.getMinutes(); //分
			
			var id = "departureHourInput"+unit+line;
			document.getElementById(id).value = hour;
			
			var id = "departureMinuteInput"+unit+line;
			document.getElementById(id).value = minute;
			
			//========ドロップダウンリストにランダムな値をセットする
			for(c=0 ; c<contentsList.length ; c++)
			{
				//特情処理　表示対象以外の項目は、処理させない
				if(!contentsList[c][3][stationTypeIndex])
					continue;
				
				var id = contentsList[c][0]+"Input"+unit+line;
				var randomNum = Math.floor(Math.random() * (document.getElementById(id).options.length - 1));
				document.getElementById(id).options[randomNum].selected = true;
			}
			
			/*
			//備考
			if(remarksExist)
			{
				var randomList = defaultRemarks0List;
				var randomNum = Math.floor(Math.random() * randomList.length);
				var id = "remarks0Input"+unit+line;
				document.getElementById(id).value = randomList[randomNum];
				
				var randomList = defaultRemarks1List;
				var randomNum = Math.floor(Math.random() * randomList.length);
				var id = "remarks1Input"+unit+line;
				document.getElementById(id).value = randomList[randomNum];
			}
			
			//========特情処理
			if(sampleSetFlag)
			{
				//遅れありは1/2で、他の1/2は遅れなしにする
				if(Math.random() < 1/2)
				{
					//遅れ
					var id = "delayInput"+unit+line;
					var randonList = ["----"];
					var randomNum = getRandomItem(randonList, delayList);
					document.getElementById(id).options[randomNum].selected = true;
				}

				
				//米原方面
				if(unit % labelTitleNum == 0)
				{
					//種別
					var id = "typeInput"+unit+line;
					var randonList = ["普通","快速","特別快速","新快速"];
					var randomNum = getRandomItem(randonList, typeList);
					document.getElementById(id).options[randomNum].selected = true;
					//行き先
					var id = "destinationInput"+unit+line;
					var randonList = ["岐阜","大垣","米原"];
					var randomNum = getRandomItem(randonList, destinationList);
					document.getElementById(id).options[randomNum].selected = true;
					//番線
					var id = "trackInput"+unit+line;
					var randonList = ["4番線"];
					var randomNum = getRandomItem(randonList, trackList);
					document.getElementById(id).options[randomNum].selected = true;
				}
				//豊橋方面
				if(unit % labelTitleNum == 1)
				{
					//種別
					var id = "typeInput"+unit+line;
					var randonList = ["普通","快速","特別快速","新快速"];
					var randomNum = getRandomItem(randonList, typeList);
					document.getElementById(id).options[randomNum].selected = true;
					//行き先
					var id = "destinationInput"+unit+line;
					var randonList = ["浜松","豊橋","岡崎"];
					var randomNum = getRandomItem(randonList, destinationList);
					document.getElementById(id).options[randomNum].selected = true;
					//番線
					var id = "trackInput"+unit+line;
					var randonList = ["3番線"];
					var randomNum = getRandomItem(randonList, trackList);
					document.getElementById(id).options[randomNum].selected = true;
				}
				//名古屋方面
				if(unit % labelTitleNum == 2)
				{
					//種別
					var id = "typeInput"+unit+line;
					var randonList = ["普通","快速","特急しなの25号"];
					var randomNum = getRandomItem(randonList, typeList);
					document.getElementById(id).options[randomNum].selected = true;
					//行き先
					var id = "destinationInput"+unit+line;
					var randonList = ["名古屋"];
					var randomNum = getRandomItem(randonList, destinationList);
					document.getElementById(id).options[randomNum].selected = true;
					//番線
					var id = "trackInput"+unit+line;
					var randonList = ["2番線"];
					var randomNum = getRandomItem(randonList, trackList);
					document.getElementById(id).options[randomNum].selected = true;
				}
				//中津川方面
				if(unit % labelTitleNum == 3)
				{
					//種別
					var id = "typeInput"+unit+line;
					var randonList = ["普通","快速","特急しなの25号"];
					var randomNum = getRandomItem(randonList, typeList);
					document.getElementById(id).options[randomNum].selected = true;
					//行き先
					var id = "destinationInput"+unit+line;
					var randonList = ["高蔵寺","多治見","瑞浪","中津川","長野"];
					var randomNum = getRandomItem(randonList, destinationList);
					document.getElementById(id).options[randomNum].selected = true;
					//番線
					var id = "trackInput"+unit+line;
					var randonList = ["1番線"];
					var randomNum = getRandomItem(randonList, trackList);
					document.getElementById(id).options[randomNum].selected = true;
					
				}
			}
			*/
		}
		//番線ラベル
		var id = "trackLabelInput"+unit;
		var randomNum = unit % 9;
		document.getElementById(id).options[randomNum].selected = true;
		
		//向き
		var id = "directionInput"+unit;
		var randomNum = (unit+1) % 2;
		document.getElementById(id).options[randomNum].selected = true;
		
		//方面表記
		var id = "backTitleInput"+unit;
		//var randomNum = unit % backTitleList.length;
		var randomNum = Math.floor(Math.random() * (document.getElementById(id).options.length - 1));
		document.getElementById(id).options[randomNum].selected = true;
		
		//お知らせ
		var randomNum = Math.floor(Math.random() * defaultTelopList.length);
		var id = "messageInput"+unit;
		document.getElementById(id).value = defaultTelopList[randomNum];
		
		//在線位置 列車アイコン 前駅のみ列車あり
		var id = "zaisenTrainInput"+unit+"_2";
		var randomNum = 1;
		document.getElementById(id).options[randomNum].selected = true;
		
		var id = "zaisenTrainInput"+unit+"_5";
		var randomNum = 1;
		document.getElementById(id).options[randomNum].selected = true;
		
		//在線位置 駅選択
		var id = "zaisenStaInput"+unit+"_6";
		var randomNum = 3;
		document.getElementById(id).options[randomNum].selected = true;
		
		var id = "zaisenStaInput"+unit+"_4";
		var randomNum = 4;
		document.getElementById(id).options[randomNum].selected = true;
		
		var id = "zaisenStaInput"+unit+"_2";
		var randomNum = 5;
		document.getElementById(id).options[randomNum].selected = true;
		
		
		/*
		//現在時刻
		var nowDate = new Date(); //現在日時
		var baseSecond = nowDate.getTime(); //秒に変換
		nowDate.setTime(baseSecond); //Date型に変換
		var hour = nowDate.getHours(); //時
		var minute = nowDate.getMinutes(); //分
		
		var id = "nowTimeHourInput"+unit;
		document.getElementById(id).value = hour;
		
		var id = "nowTimeMinuteInput"+unit;
		document.getElementById(id).value = minute;
		*/
	}
}


//指定されたリストの中からランダムに要素を選択する
function getRandomItem(chooseList, allList)
{
	var randomNum = Math.floor( Math.random() * chooseList.length);
	var ItemText = chooseList[randomNum];
	for(i=0 ; i<allList.length ; i++)
	{
		if(allList[i][0] == ItemText)
			return i;
	}
	return 0;
}



var formInputData = [];
var zaisenStaData = [];

//フォームから入力を読み込む
function readForm()
{	
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		formInputData[unit] = [];
		for(line=0 ; line<lineSum ; line++)
		{
			formInputData[unit][line] = [];

			//================ドロップダウンリストから選択状態を読み込み
			for(c=0 ; c<contentsList.length ; c++)
			{
				//特情処理　表示対象以外の項目は、処理させない
				if(!contentsList[c][3][stationTypeIndex])
					continue;
				
				var id = contentsList[c][0] + "Input"+unit+line;
				formInputData[unit][line][c] = document.getElementById(id).selectedIndex;
			}
			
			//================テキストボックスから読み込み
			//時
			var id = "departureHourInput"+unit+line;
			formInputData[unit][line][c] = document.getElementById(id).value;
			formInputData[unit][line][c] = inputTextNumCheck(formInputData[unit][line][c], "null"); //値が数値かどうかチェック
			c++;
			//分
			var id = "departureMinuteInput"+unit+line;
			formInputData[unit][line][c] = document.getElementById(id).value;
			formInputData[unit][line][c] = inputTextNumCheck(formInputData[unit][line][c], "null"); //値が数値かどうかチェック
			c++;
		}
		//在線位置の駅
		zaisenStaData[unit] = [];
		var id = "zaisenStaInput"+unit+"_6";
		zaisenStaData[unit][6] = document.getElementById(id).selectedIndex;
		var id = "zaisenStaInput"+unit+"_4";
		zaisenStaData[unit][4] = document.getElementById(id).selectedIndex;
		var id = "zaisenStaInput"+unit+"_2";
		zaisenStaData[unit][2] = document.getElementById(id).selectedIndex;
	}
	updateLED();
}




//LEDの画像を変更する
var typeUpdateLEDCount = 0;
var destinationUpdateLEDCount = 0;
var cycle = 0;
var mainLang = 0;

//LEDの画像を変更する
function updateLED()
{
	cycle = updateLEDCount % cycleSum;
	lang = langList[cycle];
	mainLang = lang;
	
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		for(line=0 ; line<lineSum ; line++)
		{
			
			//================画像を変更する
			for(c=0 ; c<contentsList.length ; c++)
			{
				//特情処理　表示対象以外の項目は、処理させない
				if(!contentsList[c][3][stationTypeIndex])
					continue;
				
				var index = formInputData[unit][line][c];
				var listData = contentsList[c][1];
				
				//番線は「-lang」つけない、それ以外はつける
				if(contentsList[c][0] == "track")
					var src = "img/" + listData[index][1] + ".png";
				else
					var src = "img/" + listData[index][1] + "-" + lang + ".png";
				
				var id = contentsList[c][0] + "Img" + unit+line;
				document.getElementById(id).src = src;
			}
			
			//================時刻を変更する
			//時
			var departureHourBuff = formInputData[unit][line][c];
			var id = "timeNum3Img" + unit+line;
			document.getElementById(id).src = "img/num/" + digitDivision(departureHourBuff,   10, "null") + ".png";
			var id = "timeNum2Img" + unit+line;
			document.getElementById(id).src = "img/num/" + digitDivision(departureHourBuff,   1, 0) + ".png";
			c++;
			//分
			var departureMinuteBuff = formInputData[unit][line][c];
			var id = "timeNum1Img" + unit+line;
			document.getElementById(id).src = "img/num/" + digitDivision(departureMinuteBuff,   10, 0) + ".png";
			var id = "timeNum0Img" + unit+line;
			document.getElementById(id).src = "img/num/" + digitDivision(departureMinuteBuff,   1, 0) + ".png";
			c++;
			
			//コロンの有無
			if(departureHourBuff == "null" && departureMinuteBuff == "null")
				var src = "img/null.png"; //コロンなし
			else
				var src = "img/num/colon.png"; //コロンあり
			var id = "timeNumColonImg" + unit+line;
			document.getElementById(id).src = src;
			
		}
		//番線ラベルを変更
		var id = "trackLabelInput"+unit;
		var trackLabelIndex = document.getElementById(id).selectedIndex;
		var id = "trackLabelImg" + unit;
		document.getElementById(id).src = "img/frutiger/"+(trackLabelIndex+1)+".png";
		//方面表記を変更
		var id = "backTitleInput"+unit;
		var backTitleIndex = document.getElementById(id).selectedIndex;
		var id = "titleImg" + unit;
		document.getElementById(id).src = "img/title/"+backTitleList[backTitleIndex][1]+"-" + lang + ".png";
		
		
	}
	
	updateApproachingAll(); //接近表示の日本語英語も切り替える
}

//言語表示切り替え間隔の設定
var updateLEDCount = 0;
function intervalTimeSet()
{
	//表示更新
	updateLED();
	
	//次の更新設定
	if(updateLEDCount % cycleSum == 0)
		var nextTime = document.getElementById("intervalInput0").value * 1;
	if(updateLEDCount % cycleSum == 1)
		var nextTime = document.getElementById("intervalInput1").value * 1;
	
	nextTime = inputTextNumCheck(nextTime, 1); //入力された値のチェック
	nextTime *= 1000;
	
	clearTimeout(LEDUpdateTimeout);
	LEDUpdateTimeout = setTimeout("updateLEDCount++; intervalTimeSet();", nextTime);
}
var LEDUpdateTimeout;





//備考表示の更新
function updateRemarks()
{
	if(!remarksExist)
		return;
	
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		for(line=0 ; line<lineSum ; line++)
		{
			updateRemarksCount[0][unit][line] = 0;
			updateRemarksLine(0, unit, line);
		}
	}
}




function updateStatusAll()
{
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		updateStatus(unit);
	}
}


//表示更新
var statusData = [];
function updateStatus(unit)
{
	clearTimeout(updateZaisenTimeout[unit]); //在線表示切替タイマーをストップ
	clearTimeout(updateApproachingTimeout[unit]); //接近表示切替タイマーをストップ
	
	//========フォームから設定読み込み
	//状態
	var id = "messageTypeInput"+unit;
	statusData[unit] = document.getElementById(id).selectedIndex;
	
	//在線位置画像の表示有無
	if(statusData[unit] == 2)
	{
		var id = "zaisenGroupDiv" + unit;
		document.getElementById(id).style.zIndex = 1;
	}
	else
	{
		var id = "zaisenGroupDiv" + unit;
		document.getElementById(id).style.zIndex = -1;
	}
	
	
	//========通常表示
	if(statusData[unit] == 0)
	{
		var id = "messageBaseImg" + unit;
		document.getElementById(id).style.zIndex = -1;
		var id = "messageDiv" + unit;
		document.getElementById(id).style.zIndex = -1;
		var id = "messageDiv" + unit;
		document.getElementById(id).innerHTML = "";
	}
	//========お知らせ表示
	else if(statusData[unit] == 1)
	{
		var id = "messageBaseImg" + unit;
		document.getElementById(id).style.zIndex = 1;
		document.getElementById(id).src = "img/message-base.jpg";
		var id = "messageDiv" + unit;
		document.getElementById(id).style.zIndex = 1;

		//テロップ文章を読み込み
		var id = "messageInput"+unit;
		var message = document.getElementById(id).value;
		//テロップのスピード--------------------------------
		var scrollamount = (baseScrollamount + scrollamountAdjust) * zoom * 1.3;
		//1未満になった場合は1にする
		if(scrollamount < 1)
			scrollamount = 1;
		
		//文字数があふれる場合にスクロールとする--------------------------------
		//横幅
		var scrollWidth = messageDivPosi[2];
		
		if(getFullCharaLength(message) * messageDivPosi[4] < scrollWidth)
			var marqueeFlag = false;
		else
			var marqueeFlag = true;
		
		var out = "";
		//テロップ表示に反映--------------------------------
		if(marqueeFlag)
			out += "    <marquee scrollamount='"+scrollamount+"' loop='' >";
		out += message;
		if(marqueeFlag)
			out += "    </marquee>";
		out += "";
		out += "";
		out += "";
		
		var id = "messageDiv" + unit;
		document.getElementById(id).innerHTML = out;
		//var id = "messageMaskDiv" + unit;
		//document.getElementById(id).style.zIndex = 4;
	}
	//========在線位置表示
	else if(statusData[unit] == 2)
	{
		var id = "messageBaseImg" + unit;
		document.getElementById(id).style.zIndex = 1;
		document.getElementById(id).src = "img/zaisen/base.png";
		var id = "messageDiv" + unit;
		document.getElementById(id).style.zIndex = -1;
		var id = "messageDiv" + unit;
		document.getElementById(id).innerHTML = "";
		
		//在線位置 列車アイコン読み込み
		for(pos=1 ; pos<=7 ; pos++)
		{
			var id = "zaisenTrainInput"+unit+"_"+pos;
			zaisenTrainIndex = document.getElementById(id).selectedIndex;
			
			if(pos%2 == 0)
				var imgType = "0"; //駅停車中の画像
			else
				var imgType = "1"; //駅間用の画像
			
			//画像を反映
			var id = "zaisenTrain"+pos+"Img"+unit;
			if(zaisenTrainList[zaisenTrainIndex][1] == "null")
				document.getElementById(id).src = "img/null.png";
			else
				document.getElementById(id).src = "img/"+zaisenTrainList[zaisenTrainIndex][1]+"-"+imgType+".jpg";
		}
		
		//在線位置の日本語英語を切り替える
		updateZaisen(unit);
		
		//updateLED();
	}
	//========接近表示
	else if(statusData[unit] == 3)
	{
		var id = "messageBaseImg" + unit;
		document.getElementById(id).style.zIndex = 1;
		//document.getElementById(id).src = "img/approaching-0.png";
		var id = "messageDiv" + unit;
		document.getElementById(id).style.zIndex = -1;
		var id = "messageDiv" + unit;
		document.getElementById(id).innerHTML = "";
		
		//点滅は　0.8秒点灯、0.5秒消灯の繰り返し
		//接近点滅表示を開始する
		updateApproaching(unit);
		
	}
	adjustSize();
}

var updateZaisenCount = [];
var updateZaisenTimeout = [];

//在線位置の日本語英語を切り替える
function updateZaisenAll()
{
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		updateZaisen(unit);
	}
}

//在線位置の日本語英語を切り替える
function updateZaisen(unit)
{
	//在線表示中でなければ処理スキップ
	if(statusData[unit] != 2)
		return;
	
	var lang = updateZaisenCount[unit] % 2;
	
	var id = "zaisenSta0Img" + unit;
	document.getElementById(id).src = "img/zaisen/this-570-" + lang + ".png";
	
	var index = zaisenStaData[unit][2];
	var id = "zaisenSta1Img" + unit;
	document.getElementById(id).src = "img/"+zaisenStaList[index][1]+"-" + lang + ".png";
	
	var index = zaisenStaData[unit][4];
	var id = "zaisenSta2Img" + unit;
	document.getElementById(id).src = "img/"+zaisenStaList[index][1]+"-" + lang + ".png";
	
	var index = zaisenStaData[unit][6];
	var id = "zaisenSta3Img" + unit;
	document.getElementById(id).src = "img/"+zaisenStaList[index][1]+"-" + lang + ".png";
	
	//次の更新設定
	if(updateZaisenCount[unit] % 2 == 0)
		var nextTime = document.getElementById("zaisenIntervalInput0").value * 1;
	if(updateZaisenCount[unit] % 2 == 1)
		var nextTime = document.getElementById("zaisenIntervalInput1").value * 1;
	
	nextTime = inputTextNumCheck(nextTime, 1); //入力された値のチェック
	nextTime *= 1000;
	
	clearTimeout(updateZaisenTimeout[unit]);
	updateZaisenTimeout[unit] = setTimeout("updateZaisenCount["+unit+"]++; updateZaisen("+unit+");", nextTime);
}


var updateApproachingCount = [];
var updateApproachingTimeout = [];

//接近表示開始
function updateApproachingAll()
{
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		updateApproaching(unit);
	}
}

//接近表示開始
function updateApproaching(unit)
{
	//接近表示中でなければ処理スキップ
	if(statusData[unit] != 3)
		return;
	
	if(updateApproachingCount[unit] % 2 == 0) //点灯
	{
		var id = "messageBaseImg" + unit;
		document.getElementById(id).src = "img/approaching-"+mainLang+".png";
	}
	else //消灯
	{
		var id = "messageBaseImg" + unit;
		document.getElementById(id).src = "img/black.png";
	}
	
	//次の更新設定
	if(updateApproachingCount[unit] % 2 == 0)
		var nextTime = document.getElementById("approachingIntervalInput0").value * 1;
	if(updateApproachingCount[unit] % 2 == 1)
		var nextTime = document.getElementById("approachingIntervalInput1").value * 1;
	
	nextTime = inputTextNumCheck(nextTime, 1); //入力された値のチェック
	nextTime *= 1000;
	
	clearTimeout(updateApproachingTimeout[unit]);
	updateApproachingTimeout[unit] = setTimeout("updateApproachingCount["+unit+"]++; updateApproaching("+unit+");", nextTime);
}


//画像の大きさ変更
function adjustSize()
{
	if(zoom < 0.005)
		zoom = 0.005;
		
	////////筐体関係
	var id = "displayUnitDiv";
	document.getElementById(id).style.left   = zoom*0 + "px";
	document.getElementById(id).style.top    = zoom*0 + "px";
	//document.getElementById(id).style.width = zoom*3600 + "px";
	document.getElementById(id).style.height = zoom*displayUnitDivHeight + "px";
	
	var unit = 0;
	for(unit = 0 ; unit < unitSum ; unit++)
	{
		////////筐体関係
		var id = "flameDivA"+unit;
		document.getElementById(id).style.left  = zoom*(50+unit*unitLeftOffset) + "px";
		document.getElementById(id).style.top   = zoom*0 + "px";
		document.getElementById(id).style.width = zoom*unitLeftOffset + "px";
		//document.getElementById(id).style.height = zoom*1250 + "px";
		
		
		for(c = 0 ; c < imgData.length ; c++)
		{
			var id = imgData[c][0] + unit;
			document.getElementById(id).style.left   = zoom * imgData[c][1] + "px";
			document.getElementById(id).style.top    = zoom * imgData[c][2] + "px";
			document.getElementById(id).style.width  = zoom * imgData[c][3] + "px";
			document.getElementById(id).style.height = zoom * imgData[c][4] + "px";
		}
		for(line = 0 ; line < lineSum ; line++)
		{
			var id = "lineContentsDiv" + unit + line;
			document.getElementById(id).style.left   = zoom * lineDivPosi[line][0] + "px";
			document.getElementById(id).style.top    = zoom * lineDivPosi[line][1] + "px";
			document.getElementById(id).style.width  = zoom * lineDivPosi[line][2] + "px";
			document.getElementById(id).style.height = zoom * lineDivPosi[line][3] + "px";
			
			for(c = 0 ; c < contentsList.length ; c++)
			{
				//特情処理　表示対象以外の項目は、処理させない
				if(!contentsList[c][3][stationTypeIndex])
					continue;
				
				var id =contentsList[c][0] + "Img" + unit + line;
				document.getElementById(id).style.left   = zoom * contentsList[c][2][0] + "px";
				document.getElementById(id).style.top    = zoom * contentsList[c][2][1] + "px";
				document.getElementById(id).style.width  = zoom * contentsList[c][2][2] + "px";
				document.getElementById(id).style.height = zoom * contentsList[c][2][3] + "px";
			}
			
			//時刻
			for(i=0 ; i<timePosi.length ; i++)
			{
				var id = timePosi[i][0] + "Img" + unit + line;
				document.getElementById(id).style.left   = zoom * timePosi[i][1][0] + "px";
				document.getElementById(id).style.top    = zoom * timePosi[i][1][1] + "px";
				document.getElementById(id).style.width  = zoom * timePosi[i][1][2] + "px";
				document.getElementById(id).style.height = zoom * timePosi[i][1][3] + "px";
			}
			
			//備考
			if(remarksExist[line])
			{
				var id = "remarksADiv" + unit + line;
				document.getElementById(id).style.left          = zoom * remarksDivPosi[0] + "px";
				document.getElementById(id).style.top           = zoom * remarksDivPosi[1] + "px";
				document.getElementById(id).style.width         = zoom * remarksDivPosi[2] + "px";
				document.getElementById(id).style.height        = zoom * remarksDivPosi[3] + "px";
				document.getElementById(id).style.fontSize      = zoom * remarksDivPosi[4] + "px";
				document.getElementById(id).style.letterSpacing = zoom * remarksDivPosi[5] + "px";
				
				var id = "remarksBDiv" + unit + line;
				document.getElementById(id).style.left          = zoom * 15 + "px";
				document.getElementById(id).style.top           = zoom *(fontTop[24] + 40)  + "px";
				document.getElementById(id).style.width         = zoom * (remarksDivPosi[2] - 15*2) + "px";
				document.getElementById(id).style.height        = zoom * remarksDivPosi[3] + "px";
				//document.getElementById(id).style.fontSize      = zoom * remarksDivPosi[4] + "px";
				//document.getElementById(id).style.letterSpacing = zoom * remarksDivPosi[5] + "px";
				
			}
			/*
			//時刻土台や番線土台
			for(c = 0 ; c<lineImgParts.length ; c++)
			{
				var id = lineImgParts[c][0] + "Img" + unit + line;
				document.getElementById(id).style.left   = zoom * lineImgParts[c][1] + "px";
				document.getElementById(id).style.top    = zoom * lineImgParts[c][2] + "px";
				document.getElementById(id).style.width  = zoom * lineImgParts[c][3] + "px";
				document.getElementById(id).style.height = zoom * lineImgParts[c][4] + "px";
			}
			*/
			
		}
		
		var id = "messageDiv" + unit;
		//document.getElementById(id).style.left          = zoom * messageDivPosi[0] + "px";
		document.getElementById(id).style.top           = zoom *(messageDivPosi[1] + fontTop[24]) + "px";
		//document.getElementById(id).style.width         = zoom * messageDivPosi[2] + "px";
		//document.getElementById(id).style.height        = zoom * messageDivPosi[3] + "px";
		document.getElementById(id).style.fontSize      = zoom * messageDivPosi[4] + "px";
		document.getElementById(id).style.letterSpacing = zoom * messageDivPosi[5] + "px";
	}
	
	directionUpdate(); //筐体の向き更新
}


/*
//現在時刻表示を更新
function updateNowTime()
{
	for(unit=0 ; unit<unitSum ; unit++)
	{
		//時
		var id = "nowTimeHourInput"+unit;
		var nowTimeHour = document.getElementById(id).value;
		nowTimeHour = inputTextNumCheck(nowTimeHour, "null"); //値が数値かどうかチェック
		c++;
		//分
		var id = "nowTimeMinuteInput"+unit;
		var nowTimeMinute = document.getElementById(id).value;
		nowTimeMinute = inputTextNumCheck(nowTimeMinute, "null"); //値が数値かどうかチェック
		
		
		//================時刻を変更する
		//時
		var id = "nowTimeNum3Img" + unit;
		document.getElementById(id).src = "img/num/" + digitDivision(nowTimeHour,   10, "null") + ".png";
		var id = "nowTimeNum2Img" + unit;
		document.getElementById(id).src = "img/num/" + digitDivision(nowTimeHour,   1, 0) + ".png";
		c++;
		//分
		var id = "nowTimeNum1Img" + unit;
		document.getElementById(id).src = "img/num/" + digitDivision(nowTimeMinute,   10, 0) + ".png";
		var id = "nowTimeNum0Img" + unit;
		document.getElementById(id).src = "img/num/" + digitDivision(nowTimeMinute,   1, 0) + ".png";
		c++;
		
		//コロンの有無
		if(nowTimeHour == "null" && nowTimeMinute == "null")
		{
			var id = "nowTimeColonImg" + unit;
			document.getElementById(id).src = "img/null.png"; //コロンなし
		}
		else
		{
			var id = "nowTimeColonImg" + unit;
			document.getElementById(id).src = "img/num/colon.png"; //コロンあり
		}
	}
}
*/


//素材集に全てのパーツを表示する
function readAllPartsImg()
{
	var langText = ["ja", "en"];

	var out = "";
	out += "";
	out += "<div>";
	//out += "<div style='background-color:#000'>";

	//種別
	for(i=0 ; i<typeList.length-1 ; i++)
	{
		out += "<img src='img/"+typeList[i][1]+"-0.png' alt='' height='50' style='background-color:#000' /> ";
		out += "<img src='img/"+typeList[i][1]+"-1.png' alt='' height='50' style='background-color:#000' /> ";
	}
	out += "<br /> ";
	//行先
	for(i=0 ; i<destinationAList.length-1 ; i++)
	{
			out += "<img src='img/"+destinationAList[i][1]+"-0.png' alt='' height='50' style='background-color:#000; ' /> ";
			out += "<img src='img/"+destinationAList[i][1]+"-1.png' alt='' height='50' style='background-color:#000; ' /> ";
	}
	out += "<br /> ";
	//行先
	for(i=0 ; i<destinationBList.length-1 ; i++)
	{
			out += "<img src='img/"+destinationBList[i][1]+"-0.png' alt='' height='50' style='background-color:#000; ' /> ";
			out += "<img src='img/"+destinationBList[i][1]+"-1.png' alt='' height='50' style='background-color:#000; ' /> ";
	}
	out += "<br /> ";
	//両数
	for(i=0 ; i<carsCountList.length-1 ; i++)
	{
			out += "<img src='img/"+carsCountList[i][1]+"-0.png' alt='' height='50' style='background-color:#000; ' /> ";
			out += "<img src='img/"+carsCountList[i][1]+"-1.png' alt='' height='50' style='background-color:#000; ' /> ";
	}
	out += "<br /> ";

	//数字
	for(i=0 ; i<10 ; i++)
	{
		out += "<img src='img/num/"+i+".png' alt='' height='50' style='background-color:#000' /> ";
	}
	out += "<img src='img/num/colon.png' alt='' height='50' style='background-color:#000' />";
	out += "<br />";
	out += "</div>";
	
	//方面ラベル
	for(i=0 ; i<backTitleList.length-0 ; i++)
	{
			out += "<img src='img/title/"+backTitleList[i][1]+"-0.png' alt='' height='50' style='background-color:#000; ' /> ";
			out += "<img src='img/title/"+backTitleList[i][1]+"-1.png' alt='' height='50' style='background-color:#000; ' /> ";
	}
	out += "<br /> ";
	//在線位置の列車アイコン
	for(i=0 ; i<zaisenTrainList.length-1 ; i++)
	{
			out += "<img src='img/"+zaisenTrainList[i][1]+"-0.jpg' alt='' height='50' style='background-color:#000; ' /> ";
			out += "<img src='img/"+zaisenTrainList[i][1]+"-1.jpg' alt='' height='50' style='background-color:#000; ' /> ";
	}
	out += "<br /> ";
	//在線位置の駅
	for(i=0 ; i<zaisenStaList.length-1 ; i++)
	{
			out += "<img src='img/"+zaisenStaList[i][1]+"-0.png' alt='' height='50' style='background-color:#000; ' /> ";
			out += "<img src='img/"+zaisenStaList[i][1]+"-1.png' alt='' height='50' style='background-color:#000; ' /> ";
	}
	out += "<br /> ";
	out += "<img src='img/base.jpg' alt='' width='500' style='background-color:#000' /> ";
	out += "<br />";

	document.getElementById("partsListDiv").innerHTML = out;
}



//表示を初期化（裏に消えている場合があるので表に出す）
function updateBlinkInit()
{
	for(unit=0 ; unit<unitSum ; unit++)
	{
		for(line=0 ; line<lineSum ; line++)
		{
			var id = "lineContentsDiv" + unit+line;
			document.getElementById(id).style.zIndex = 1;
		}
	}
}


//発車直前の点滅表示　3秒点灯、1秒消灯の繰り返し
var blinkCount = 0;
var updateBlinkTimeout;
function updateBlink()
{
	//偶数の場合、点灯
	//奇数の場合、消灯
	if(blinkCount % 2 == 0)
	{
		var interval = 3000;
	}
	else
	{
		var interval = 1000;
	}
	
	var checkFlag = false; //1つでもチェック入ってたらtrueにする
	for(unit=0 ; unit<unitSum ; unit++)
	{
		for(line=0 ; line<lineSum ; line++)
		{
			//発車直前のチェックボックス
			var id = "departureBeforeInput"+unit+line;
			departureBefore = document.getElementById(id).checked;
			
			if(departureBefore)
			{
				checkFlag = true;
				if(departureBefore && blinkCount % 2 == 1)
					var zIndex = -1;
				else
					var zIndex = 1;
				var id = "lineContentsDiv" + unit+line;
				document.getElementById(id).style.zIndex = zIndex;
			}
		}
	}
	//全部チェックボックス入ってなかった場合は、繰り返さない
	if(!checkFlag)
		return;
	
	clearTimeout(updateBlinkTimeout);
	updateBlinkTimeout = setTimeout("blinkCount++; updateBlink();", interval);
}

//筐体の向き更新
function directionUpdate()
{
	var unit = 0;
	for(unit=0 ; unit<unitSum ; unit++)
	{
		//方面表記を変更
		var id = "directionInput"+unit;
		var directionIndex = document.getElementById(id).selectedIndex;
		
		var id = "trackLabelImg" + unit;
		var c = 2;
		var adjust = [0, -4150];
		document.getElementById(id).style.left   = zoom * (imgData[c][1] + adjust[directionIndex]) + "px";
		
		var id = "flameDiv1" + unit;
		var c = 3;
		var adjust = [0, 1000];
		document.getElementById(id).style.left   = zoom * (imgData[c][1] + adjust[directionIndex]) + "px";
	}
}
