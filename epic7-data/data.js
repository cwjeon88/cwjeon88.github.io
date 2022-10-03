// json, hero list from epic7 DB
var g_hero_list;

// json, meta of g_hero_list from epic7 DB
var g_meta;

// json, hero's detail information include camping from epic7 DB
var g_heroes = [];

// string, hero's id that has no detail data in epic7 DB
var g_invalid_heroes = [];

// convenient mappinng between character's name and data
var g_mapping = {};

// string table
var g_string_table = {};

function start() 
{
    load_string_table();
    
    // console.log( 'test wanda in string table: ' + g_string_table['heroes']['Wanda'] );
    document.getElementById("p_info").innerText = "Retrieving data from E7 Database API";

    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            parse( this.responseText );
        }
        else
        {
            document.getElementById("p_info").innerText =
                " readyState: " + this.readyState +
                " status: " + this.status;
        }
    };
    
    xhttp.open("GET", "https://api.epicsevendb.com/hero", true);
    xhttp.send();
}

async function parse( raw )
{
    var datasheet = JSON.parse( raw );    
    g_hero_list = datasheet.results;
    
    // get meta information
    g_meta = datasheet['meta'];
    
    // query each hero
    for ( idx = 0; idx < g_hero_list.length; idx ++ )
    {        
        parse_hero( g_hero_list[idx] );
        await sleep(100);
    }
}

function parse_hero( item )
{
    var url = "https://api.epicsevendb.com/hero/" + item.id;    
    var xhttp = new XMLHttpRequest();
    var running = true;
    
    document.getElementById("p_info").innerText = "Get:" + url + " starting";

    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 ) 
        {
            var id = this.responseURL.substring(this.responseURL.lastIndexOf('/') + 1);
            
            if ( this.status == 200 )
            {
                var datasheet = JSON.parse( this.responseText );
                var result = (datasheet.results)[0];
                // {"_id":"alencia","id":"c1100","name":"Alencia",
                //  "moonlight":false,"rarity":5,"attribute":"wind","role":"warrior","zodiac":"crab",
                var hero = { "_id": result._id, "id": result.id, "name": result.name, 
                             "rarity": result.rarity, "attribute": result.attribute, 
                             "role": result.role,
                             "camping": result.camping, "calculatedStatus": result.calculatedStatus };
                             
                g_heroes.push( hero );
                
                if ( !( result.name in g_string_table['heroes'] ))
                {
                    console.log( 'warning: missing ' + result.name + ' in string table, create an entry' );
                    g_string_table[ result.name ] = result.name;
                }
            }
            else
            {
                g_invalid_heroes.push( id );
            }
                        
            if ( id == g_hero_list[g_hero_list.length - 1].id )
            {
                // create convenient mapping
                for ( idx = 0; idx < g_heroes.length; idx ++ ) 
                {
                    var name = g_heroes[idx].name;
                    g_mapping[name] = g_heroes[idx];
                }
                
                // create results
                var json = {};
                json['heroes'] = g_heroes;
                json['invalid_heroes'] = g_invalid_heroes;
                json['meta'] = g_meta;
                
                // dump result
                result_text = 
                    JSON.stringify( json, null, 4 ) + '\n\n' +
                    JSON.stringify( g_string_table, null, 4 );
                         
                document.getElementById("p_info").innerText = result_text;
                
                console.log( result_text );
            }
        }
    };
    
    xhttp.open("GET", url, true);
    xhttp.send();
}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function load_string_table()
{
    g_string_table = 
    {
        "heroes": {
            "Achates": "아카테스",
            "Adin" : "아딘",
            "Adlay": "아들라이",
            "Adventurer Ras": "모험가 라스",
            "Ainos": "아이노스",
            "Ains": "에인즈",
            "Aither": "아이테르",
            "Alencia": "알렌시아",
            "Alexa": "알렉사",
            "All-Rounder Wanda": "만능해결사 완다",
            "Ambitious Tywin": "야심가 타이윈",
            "Angel of Light Angelica" : "빛의 천사 안젤리카",
            "Angelic Montmorancy": "수호천사 몽모랑시",
            "Angelica": "안젤리카",
            "Apocalypse Ravi": "화란의 라비",
            "Aramintha": "아라민타",
            "Arbiter Vildred": "집행관 빌트레드",
            "Archdemon's Shadow": "마신의 그림자",
            "Aria": "아리아",
            "Armin": "아밍",
            "Arowell": "아로웰",
            "Assassin Cartuja": "암살자 카르투하",
            "Assassin Cidd": "암살자 시더",
            "Assassin Coli": "암살자 콜리",
            "Auxiliary Lots": "보조형 랏츠",
            "Azalea": "아젤리아",
            "Baal & Sezan": "바알&세잔",
            "Bad Cat Armin": "배드캣 아밍",
            "Baiken": "바이켄",
            "Basar": "바사르",
            "Bask": "바스크",
            "Batisse": "바터스",
            "Belian" : "벨리안",
            "Bellona": "벨로나",
            "Benevolent Romann": "자애의 로만",
            "Blaze Dingo": "열화의 딩고",
            "Blood Blade Karin": "혈검 카린",
            "Blood Moon Haste": "적월의 귀족 헤이스트",
            "Bomb Model Kanna": "카논",
            "Briar Witch Iseria": "잿빛 숲의 이세리아",
            "Butcher Corps Inquisitor": "도살부대원",
            "Camilla" : "카밀라",
            "Captain Rikoris": "선봉대장 리코리스",
            "Carmainerose": "카마인로즈",
            "Carrot": "캐롯",
            "Cartuja": "카르투하",
            "Cecilia": "세실리아",
            "Celeste": "셀레스트",
            "Celestial Mercedes": "외우주의 메르세데스",
            "Celine": "셀린",
            "Cerise": "세리스",
            "Cermia": "체르미아",
            "Challenger Dominiel": "도전자 도미니엘",
            "Champion Zerato": "승부의 제라토",
            "Chaos Inquisitor": "카오스교 도살추적자",
            "Chaos Sect Axe": "카오스교 도끼대장군",
            "Charles": "찰스",
            "Charlotte": "샬롯",
            "Chloe": "클로에",
            "Choux": "슈",
            "Christy" : "크리스티",
            "Church of Ilryos Axe": "일리오스교 도끼병",
            "Cidd": "시더",
            "Clarissa": "클라릿사",
            "Closer Charles" : "종결자 찰스",
            "Coli": "콜리",
            "Command Model Laika": "지휘관 라이카",
            "Commander Lorina": "지휘관 로리나",
            "Conqueror Lilias" : "지배자 릴리아스",
            "Corvus": "코르부스",
            "Crescent Moon Rin": "초승달 무희 링",
            "Crimson Armin": "홍염의 아밍",
            "Crozet": "크로제",
            "Dark Corvus": "어둠의 코르부스",
            "Desert Jewel Basar": "사막의 보석 바사르",
            "Designer Lilibet": "디자이너 릴리벳",
            "Destina": "데스티나",
            "Diene": "디에네",
            "Dingo": "딩고",
            "Dizzy": "디지",
            "Doll Maker Pearlhorizon": "인형제작자 펄호라이즌",
            "Dominiel": "도미니엘",
            "Doris": "도리스",
            "Eaton": "이튼",
            "Eda": "에다",
            "Elena": "엘레나",
            "Elphelt": "엘페르트",
            "Elson": "엘슨",
            "Emilia" : "에밀리아",
            "Enott": "에노트",
            "Ervalen": "에르발렌",
            "Fairytale Tenebria": "메르헨 테네브리아",
            "Faithless Lidica": "불신자 리디카",
            "Falconer Kluri": "매사냥꾼 쿠루리",
            "Fallen Cecilia": "나락의 세실리아",
            "Fighter Maya": "전투형 마야",
            "Flan": "플랑",
            "Free Spirit Tieria": "여일의 디에리아",
            "Furious": "퓨리우스",
            "General Purrgis": "대장 퍼지스",
            "Glenn": "글렌",
            "Gloomyrain": "글루미레인",
            "Godmother": "갓마더",
            "Great Chief Khawana": "대족장 카와나",
            "Guider Aither": "구도자 아이테르",
            "Gunther": "군터",
            "Hasol": "하솔",
            "Haste": "헤이스트",
            "Hataan": "하탄",
            "Hazel": "헤이즐",
            "Helen" : "헬렌",
            "Helga": "헬가",
            "Holiday Yufine": "바캉스 유피네",
            "Holy Flame Adin": "성염의 아딘",
            "Hurado": "휴라두",
            "Hwayoung": "화영",
            "Ian": "이안",
            "Ilynav": "일리나브",
            "Inferno Khawazu": "광염의 카와주",
            "Iseria": "이세리아",
            "Jack-O": "잭 오",
            "Januta": "자누타",
            "Jecht": "제크토",
            "Jena": "제나",
            "Judge Kise": "심판자 키세",
            "Judith": "쥬디스",
            "Karin": "카린",
            "Kawerik": "카웨릭",
            "Kayron": "카일론",
            "Ken": "켄",
            "Khawana": "카와나",
            "Khawazu": "카와주",
            "Kikirat v2": "키키라트 v2",
            "Kiris": "키리스",
            "Kise": "키세",
            "Kitty Clarissa": "고양이 클라릿사",
            "Kizuna AI": "키즈나 아이",
            "Kluri": "쿠루리",
            "Krau": "크라우",
            "Landy": "랑디",
            "Last Rider Krau": "라스트 라이더 크라우",
            "Lena": "레나",
            "Leo": "레오",
            "Lidica": "리디카",
            "Lilias": "릴리아스",
            "Lilibet": "릴리벳",
            "Lionheart Cermia": "사자왕 체르미아",
            "Little Queen Charlotte": "어린 여왕 샬롯",
            "Lorina": "로리나",
            "Lots": "랏츠",
            "Lucy": "루시",
            "Ludwig": "루트비히",
            "Luluca": "루루카",
            "Luna": "루나",
            "Magic Scholar Doris": "마법학자 도리스",
            "Maid Chloe": "메이드 클로에",
            "Martial Artist Ken": "무투가 켄",
            "Mascot Hazel": "마스코트 헤이즐",
            "Maya": "마야",
            "Mediator Kawerik": "조율자 카웨릭",
            "Melany" : "멜라니",
            "Melissa": "멜리사",
            "Mercedes": "메르세데스",
            "Mercenary Helga": "자유로운 용병 헬가",
            "Mighty Scout" : "척후병 마이티",
            "Milim" : "밀림",
            "Mirsa": "미르사",
            "Mistychain": "미스티체인",
            "Montmorancy": "몽모랑시",
            "Mort": "모르트",
            "Mucacha": "무카차",
            "Mui": "뮤이",
            "Muse Rima": "뮤즈 리마",
            "Muwi": "무위",
            "Nemunas": "네무나스",
            "Operator Sigret": "오퍼레이터 세크레트",
            "Orte": "오르테",
            "Otillie": "오틸리어",
            "Pavel": "파벨",
            "Pearlhorizon": "펄호라이즌",
            "Peira": "페이라",
            "Penelope" : "페넬로페",
            "Pirate Captain Flan": "해적 선장 플랑",
            "Politis": "폴리티스",
            "Purrgis": "퍼지스",
            "Pyllis": "필리스",
            "Ram" : "람",
            "Ran" : "란",
            "Ras": "라스",
            "Ravi": "라비",
            "Ray": "레이",
            "Rem" : "렘",
            "Remnant Violet": "잔영의 비올레토",
            "Requiemroar": "레퀴엠로어",
            "Researcher Carrot": "연구자 캐롯",
            "Righteous Thief Roozid": "의적 루지드",
            "Rikoris": "리코리스",
            "Rima": "리마",
            "Rimuru" : "리무루",
            "Rin": "링",
            "Roaming Warrior Leo": "방랑 용사 레오",
            "Roana": "로앤나",
            "Romann": "로만",
            "Roozid": "루지드",
            "Rose": "로제",
            "Ruele of Light": "빛의 루엘",
            "Sage Baal & Sezan": "현자 바알&세잔",
            "Schuri": "슈리",
            "Seaside Bellona": "해변의 벨로나",
            "Senya": "셰나",
            "Serila": "세릴라",
            "Sez": "세즈",
            "Shadow Knight Pyllis" : "흑기사 필리스",
            "Shadow Rose": "그림자 로제",
            "Shooting Star Achates": "슈팅스타 아카테스",
            "Shuna" : "슈나",
            "Sigret": "세크레트",
            "Silk": "실크",
            "Silver Blade Aramintha": "백은칼날의 아라민타",
            "Sinful Angelica": "죄악의 안젤리카",
            "Sol": "솔",
            "Solitaria of the Snow": "설국의 솔리타리아",
            "Sonia": "소니아",
            "Specimen Sez": "실험체 세즈",
            "Specter Tenebria": "환영의 테네브리아",
            "Spirit Eye Celine" : "영안의 셀린",
            "Straze" : "스트라제스",
            "Summertime Iseria" : "남국의 이세리아",
            "Surin": "수린",
            "Sven": "스벤",
            "Taeyou": "태유",
            "Tamarinne": "타마린느",
            "Taranor Guard": "타라노르 근위부대원",
            "Taranor Royal Guard": "타라노르 왕궁병사",
            "Tempest Surin": "풍운의 수린",
            "Tenebria": "테네브리아",
            "Tieria": "디에리아",
            "Top Model Luluca": "최강 모델 루루카",
            "Troublemaker Crozet": "무법자 크로제",
            "Tywin": "타이윈",
            "Verdant Adin": "신록의 아딘",
            "Vigilante Leader Glenn": "자경단장 글렌",
            "Vildred": "빌트레드",
            "Violet": "비올레토",
            "Vivian": "비비안",
            "Wanda": "완다",
            "Wanderer Silk": "방랑자 실크",
            "Watcher Schuri": "주시자 슈리",
            "Wild Angara" : "야생 앙카라",
            "Yoonryoung": "윤령",
            "Yufine": "유피네",
            "Yulha": "율하",
            "Yuna": "유나",
            "Zahhak" : "자하크",
            "Zealot Carmainerose": "전도자 카마인로즈",
            "Zeno": "제노",
            "Zerato": "제라토"
        },
        "topics": {
            "Criticism": "세계 비판",
            "Reality Check": "현실직시",
            "Heroic Tale": "무용담",
            "Comforting Cheer": "위로 응원",
            "Cute Cheer": "애교 응원",
            "Heroic Cheer": "영웅적 응원",
            "Sad Memory": "슬픈 추억",
            "Joyful Memory": "즐거운 추억",
            "Happy Memory": "행복한 추억",
            "Unique Comment": "4차월 발언",
            "Self-Indulgent": "자아도취",
            "Occult": "오컬트",
            "Myth": "신화",
            "Bizarre Story": "엽기적 이야기",
            "Food Story": "음식 이야기",
            "Horror Story": "공포 이야기",
            "Gossip": "가쉽",
            "Dream": "꿈",
            "Advice": "고민 상담",
            "Complain": "투정",
            "Belief": "신념",
            "Interesting Story": "모험이야기"
        }
    };
}