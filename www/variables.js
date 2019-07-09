var text = {
  'intro' : {
    'EN' : `This election dashboard introduces Myanmar's first complete
    dataset of election results compiled by the Tech for Change team at Phandeeyar.
    The data is available for download under a Creative Commons license. The user
    is welcome to explore the data using our dashboard.`,

    'MM' : `ယခုတွေ့ရှိရသော အင်တာနက်စာမျက်နှာသည် ဖန်တီးရာ တက်ခ်ဖော်ချိန်းအဖွဲ့မှ စုစည်းထားသော
    မြန်မာနိုင်ငံ၏ ပထမဦးဆုံး ပြည့်ဝစုံလင်သော ရွေးကောက်ပွဲရလဒ်ဒေတာများကို မိတ်ဆက်ဖော်ပြသော
    စာမျက်နှာဖြစ်ပါသည်။`
  },
};


var yearSelect = '2010';

var yearS = 'yr';
var year4const = "yr2010";
var house4const = null;
var constSelect = null;
var yrData = null; 
var piChartData = {};


var yearInfo = {'2015': [{'Held on':'8 Nov 2015','Available seats':'1557','President':'Htin Kyaw', 'link':'https://en.wikipedia.org/wiki/Htin_Kyaw','sauce':'https://en.wikipedia.org/wiki/2015_Myanmar_general_election'}],
                '2010':[{'Held on':'7 Nov 2010','Available seats':'1544','President':'Thein Sein', 'link':'https://en.wikipedia.org/wiki/Thein_Sein','sauce':'https://en.wikipedia.org/wiki/2010_Myanmar_general_election'}],
                '2012':[{'Held on':'1 April 2012','Available seats':'48','President':'Thein Sein', 'link':'https://en.wikipedia.org/wiki/Thein_Sein','sauce':'https://en.wikipedia.org/wiki/2012_Myanmar_by-elections'}],
                '2017':[{'Held on':'1 Apr 2017','Available seats':'19','President':'Htin Kyaw', 'link':'https://en.wikipedia.org/wiki/Htin_Kyaw','sauce':'https://en.wikipedia.org/wiki/2017_Myanmar_by-elections'}],
                '2018':[{'Held on':'3 Nov 2018','Available seats':'13','President':'Win Myint', 'link':'https://en.wikipedia.org/wiki/Win_Myint_(politician,_born_1951)','sauce':'https://en.wikipedia.org/wiki/2018_Myanmar_by-elections'}]};

var candidateData = {"2010":[{"candidates":1084,"partyAbb":"USDP"},{"candidates":975,"partyAbb":"NUP"},{"candidates":158,"partyAbb":"NDF"},{"candidates":153,"partyAbb":"SNDP"},{"candidates":78,"partyAbb":"Inde"},{"candidates":48,"partyAbb":"DPM"},{"candidates":38,"partyAbb":"CPP"},{"candidates":33,"partyAbb":"AMRDP"},{"candidates":29,"partyAbb":"KPP"},{"candidates":27,"partyAbb":"88GSY"}],"2012":[{"candidates":45,"partyAbb":"USDP"},{"candidates":44,"partyAbb":"NLD"},{"candidates":22,"partyAbb":"NUP"},{"candidates":11,"partyAbb":"NDF"},{"candidates":7,"partyAbb":"Inde"},{"candidates":4,"partyAbb":"UPP"},{"candidates":3,"partyAbb":"DPMNS"},{"candidates":3,"partyAbb":"MNC"},{"candidates":3,"partyAbb":"NNDP"},{"candidates":3,"partyAbb":"UDP"}],"2015":[{"candidates":1092,"partyAbb":"USDP"},{"candidates":1091,"partyAbb":"NLD"},{"candidates":743,"partyAbb":"NUP"},{"candidates":349,"partyAbb":"NDP"},{"candidates":282,"partyAbb":"Inde"},{"candidates":282,"partyAbb":"MFDP"},{"candidates":262,"partyAbb":"NDF"},{"candidates":190,"partyAbb":"SNDP"},{"candidates":147,"partyAbb":"SNLD"},{"candidates":112,"partyAbb":"KPP"}],"2017":[{"candidates":19,"partyAbb":"NLD"},{"candidates":18,"partyAbb":"USDP"},{"candidates":7,"partyAbb":"Inde"},{"candidates":7,"partyAbb":"SNDP"},{"candidates":7,"partyAbb":"SNLD"},{"candidates":6,"partyAbb":"NDP"},{"candidates":5,"partyAbb":"NDF"},{"candidates":4,"partyAbb":"DP"},{"candidates":3,"partyAbb":"NUP"},{"candidates":2,"partyAbb":"LNDP"}],"2018":[{"candidates":12,"partyAbb":"NLD"},{"candidates":9,"partyAbb":"USDP"},{"candidates":6,"partyAbb":"Inde"},{"candidates":4,"partyAbb":"PLP"},{"candidates":3,"partyAbb":"ALD"},{"candidates":3,"partyAbb":"MPDP"},{"candidates":3,"partyAbb":"NUDP"},{"candidates":3,"partyAbb":"UEPFDP"},{"candidates":2,"partyAbb":"CLD"},{"candidates":2,"partyAbb":"DPM"}]};



var parliData = {'2010':[{'id':'NLD','seats':0},{'id':'USDP','seats':58},{'id':'Others','seats':17},{'id':'Military','seats':25}],
                '2012':[{'id':'NLD','seats':3},{'id':'USDP','seats':55},{'id':'Others','seats':17},{'id':'Military','seats':25}],
                 '2015':[{'id':'NLD','seats':59},{'id':'USDP','seats':6},{'id':'Others','seats':10},{'id':'Military','seats':25}],
                 '2017':[{'id':'NLD','seats':58},{'id':'USDP','seats':6},{'id':'Others','seats':11},{'id':'Military','seats':25}],
                 '2018':[{'id':'NLD','seats':58},{'id':'USDP','seats':6},{'id':'Others','seats':11},{'id':'Military','seats':25}],
                }    

//----------------------------------------------------------------------
//Table and drop down variables

var ddYearSelect = 'yr2010';
var ddHouseSelect = Object.keys(elect[ddYearSelect])[0];
var ddStateSelect = [...new Set(elect[ddYearSelect][ddHouseSelect].map(x => x.name_st))][0];

//var ddStatesLoc = [];

//----------------------------------------------------------------------
var statesLoc = [];
var j = 0;
for(var i = 0; i < elect[ddYearSelect][ddHouseSelect].length; i++){
    if(elect[ddYearSelect][ddHouseSelect].map(x => x.name_st)[i] == ddStateSelect) {
        statesLoc[j] = i;
        j++;
    }
}

var NewStateData = [];
for (var i = 0; i < statesLoc.length; i++) {
    NewStateData [i] = elect[ddYearSelect][ddHouseSelect][statesLoc[i]];
}
//----------------------------------------------------------------------
var ddConstSelect = [...new Set(NewStateData.map(x => x.const_name))][0];
var constLoc = [];
j = 0;
for(var i = 0;i < NewStateData.length; i++) {
    if(NewStateData.map(x => x.const_name)[i] == ddConstSelect) {
        constLoc[j] = i;
        j++;
    }
}
var constTable = [];
for (var i = 0; i <constLoc.length; i++) {
    constTable [i] = NewStateData[constLoc[i]];
}


//----------------------------------------------------------------------
//Drop down variables
var years = Object.keys(elect);
var houses = Object.keys(elect[ddYearSelect]);
var states = [...new Set(elect[ddYearSelect][ddHouseSelect].map(x => x.name_st))];
var consts = [...new Set(NewStateData.map(x => x.const_name))];
//----------------------------------------------------------------------

  var houseNameTranslate = {
      'amyotha' : 'Amyotha',
      'pyithu' : 'Pyithu',
      'sr' : 'State/Region'
  };


var colNameTranslate = {
    'name_st' : 'State name',
    'const_code' : 'Constituency code',
    'const_name' : 'Constituency name',
    'candidate_name.my' : 'Candidate name',
    'party_name.en' : 'Party Name',
    'votes.total_valid' : 'Total votes'
}

var tabLabelTranslate = {
'amyotha' :'အမျိုးသားလွှတ်တော်',
'pyithu': 'ပြည်သူ့လွှတ်တော်',
'sr' : 'တိုင်းဒေသကြီးလွှတ်တော်'
};


var partyAbb = {"Party":["Peace and Diversity Party","Modern People's Party","National Democratic Force","Union Solidarity And Development Party","National Unity Party (NUP)","Kayin People's Party","National Political Alliances League","Independent Candidates","Union Of Myanmar Federation Of National Politics","Democracy And Peace Party","Democratic Party (Myanmar)","88 Generation Student Youths (Union Of Myanmar)","Chin Progressive Party","Chin National Party","Mro Or Khami National Solidarity Organization (MKNSO)","United Democracy Party","Shan Nationalities Democratic Party","Unity Democracy Party of Kachin State","Kayan National Party","Phalon-Sawaw Democratic Party","All Mon Region Democracy Party","United Democratic Party","Wunthanu NLD (The Union Of Myanmar)","National Democratic Party For Development","Rakhine Nationals Development Party","Rakhine State National Force Of Myanmar","Kaman National Progressive Party","Union Democracy Party","Wa National Unity Party","Lahu National Development Party","Wa Democratic Party","Kokang Democracy And Unity Party","Ta-Aung (Palaung) National Party","Pa-O National Organization (PNO)","Inn National Development Party","Kayin People\u0119s Party","Rakhine Nationals Progressive Party","National Unity Party","Khami National Development Party","Rakhine State National Force","Mro or Khami National Solidarity Organization","Unity and Democracy Party of Kachin State","Independent","Ethnic National Development Party","Kayin People\u2019s Party","New Era People\u2019s Party","Difference and Peace Party","Shan Nationals Democratic Party","Kayin State Democracy and Development Party","Taaung (Palaung) National Party","PaO National Organization","National Development and Peace Party","Rakhine Nationalities Development Party","Election Cancelled","United Democracy Party (Kachin State)","National League for Democracy","Union Democratic Party","National Political Alliance League","Unity and Peace Party","All Mon Regions Democracy Party","Democracy Party For Myanmar New Society","Myanmar National Congress","New National Democracy Party","Modern People Party","Myanmar Farmers Development Party","Karen People's Party","Chin National Democratic Party","Chin League for Democracy","National Development Party","Mon National Party","Phlone-Sawaw Democratic Party","Federal Union Party (FUP)","Eastern Shan State Development Democratic Party","Akha National Development Party","Shan Nationalities League for Democracy","People\u2019s Party of Myanmar Farmers and Workers","Peace & Diversity Party","New Society Party","Myanmar New Society Democratic Party","Arakan Patriot Party","Arakan National Party","Rakhine State National United Party","Ta'ang (Palaung) National Party","Karen National Party","Zomi Congress for Democracy","Danu National Democracy Party","Confederate Farmers Party","Shan State Kokang Democratic Party","Lhaovo National Unity and Development Party","Dawei Nationalities Party","Shan-ni and Northern Shan Ethnics Solidarity Party","National Unity Congress Party","Lisu National Development Party","Kachin State Democracy Party (KSDP)","Kachin National Congress for Democracy","Kachin Democratic Party","Asho Chin National Party","Democratic Party for a New Society","Pa-O National Organization","Union Pa-O National Organization","Inn National League","Zo National Region Development Party","Union Farmer Force Party","All Nationals' Democracy Party Kayah State","Kayah Unity Democracy Party","Danu National Organization Party","Tai-Leng Nationalities Development Party","New Era Union Party","Khumi (Khami) National Party","National Prosperity Party","Guiding Star Party","Karen Democratic Party","Mro National Development Party","Kaman National Development Party","Negotiation, Stability and Peace Party","Mro National Democracy Party","Women Party (Mon)","Public Contribute Students Democracy Party","National Democratic Party for Development (NDPD)","88 Generation Democracy Party","Unity and Democracy Party of Kachin State (UDPKS)","Kayin Unity Democratic Party","Kayin State Democracy and Development Party (KSDDP)","88 Generation Student Youths(Union Of Myanmar)","89 Generation Student Youths(Union Of Myanmar)","90 Generation Student Youths(Union Of Myanmar)","91 Generation Student Youths(Union Of Myanmar)","92 Generation Student Youths(Union Of Myanmar)","93 Generation Student Youths(Union Of Myanmar)","Mro Nationality Party","Daingnet Ethnics Development Party","94 Generation Student Youths(Union Of Myanmar)","95 Generation Student Youths(Union Of Myanmar)","Democracy and Human Rights Party","\u101c\u1030\u1019\u103b\u102d\u102f\u1038\u1015\u1031\u102b\u1004\u103a\u1038\u1005\u102f\u1036\u1012\u102e\u1019\u102d\u102f\u1000\u101b\u1031\u1005\u102e\u1015\u102b\u1010\u102e(\u1000\u101a\u102c\u1038\u1015\u103c\u100a\u103a\u1014\u101a\u103a)","101 Generation Student Youths(Union Of Myanmar)","103 Generation Student Youths(Union Of Myanmar)","Bamar People\u2019s Party","Wun Thar Nu Democratic Party","People Democracy Party","96 Generation Student Youths(Union Of Myanmar)","99 Generation Student Youths(Union Of Myanmar)","102 Generation Student Youths(Union Of Myanmar)","100 Generation Student Youths(Union Of Myanmar)","104 Generation Student Youths(Union Of Myanmar)","105 Generation Student Youths(Union Of Myanmar)","97 Generation Student Youths(Union Of Myanmar)","98 Generation Student Youths(Union Of Myanmar)","Democratic Party","Union Farmer-Labor Force Party","All Nationals' Democracy Party(Kayah State)","Wa Liberal Democratic Development Party","Chin National Demcratic Party","Public of Labour Party","Arakan League for Democracy","Union Ethnic People's Federal Democracy Party","Myanmar People's Democratic Party","National United Democratic Party","Myanmar Farmers' Development Party","Union Solidarity and Development Party","National Democratic Party for Development","Union of Myanmar Federation of National Politics"],"Abb":["PDP","MPP","NDF","USDP","NUP","KPP","NPAL","Inde","UMFNP","DPP","DPM","88GSY","CPP","CNP","MKNSO","UDP","SNDP","UDPKS","KNP","PSDP","AMRDP","UDP","WNLD","NDPD","RNDP","RSNFM","KNPP","UDP","WNUP","LNDP","WDP","KDUP","TNP","PNO","INDP","KPP","RNPP","NUP","KNDP","RSNF","MKNSO","UDPKS","Inde","ENDP","KPP","NEPP","DPP","SNDP","KSDDP","TNP","PNO","NDPP","RNDP","null","UDP","NLD","UDP","NPAL","UPP","AMRDP","DPMNS","MNC","NNDP","MPP","MFDP","KPP","CNDP","CLD","NDP","MNP","PSDP","FUP","ESSDDP","ANDP","SNLD","PPMFW","PDP","NSP","MNSDP","APP","ANP","RSNUP","TNP","KNP","ZCD","DNDP","CFP","SSKDP","LNUDP","DNP","SNSESP","NUCP","LNDP","KSDP","KNCD","KDP","ACNP","DPNS","PNO","UPNO","INL","ZNRDP","UFFP","ANDPKS","KUDP","DNOP","TNDP","NEUP","KNP","NPP","GSP","KDP","MNDP","KNDP","NSPP","MNDP","WP","PCSDP","NDPD","88GDP","UDPKS","KUDP","KSDDP","88GSY","89GSY","90GSY","91GSY","92GSY","93GSY","MNP","DEDP","94GSY","95GSY","DHRP","EDP","101GSY","103GSY","BPP","WTNDP","PDP","96GSY","99GSY","102GSY","100GSY","104GSY","105GSY","97GSY","98GSY","DP","UFLFP","ANDP","WLDDP","CNDP","PLP","ALD","UEPFDP","MPDP","NUDP","MFDP","USDP","NDPD","UMFNP"]};

var totalVotes = null;







///https://opendevelopmentmyanmar.net/dataset/?id=election-result-data











                     