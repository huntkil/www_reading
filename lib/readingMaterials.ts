export interface ReadingChapter {
  id: string
  title: string
  content: string
  difficulty: string
  estimatedTime: number
  type: 'fiction' | 'non-fiction'
  source: string
  questions?: {
    question: string
    options: string[]
    correct: number
  }[]
}

// Alice in Wonderland 챕터들
export const aliceChapters: ReadingChapter[] = [
  {
    id: 'alice_ch1',
    title: "CHAPTER I. Down the Rabbit-Hole",
    content: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"

So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

In another moment down went Alice after it, never once considering how in the world she was to get out again.

The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.

Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled "ORANGE MARMALADE", but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it.

"Well!" thought Alice to herself, "after such a fall as this, I shall think nothing of tumbling down stairs! How brave they'll all think me at home! Why, I wouldn't say anything about it, even if I fell off the top of the house!" (Which was very likely true.)

Down, down, down. Would the fall never come to an end? "I wonder how many miles I've fallen by this time?" she said aloud. "I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think—" (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a very good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) "—yes, that's about the right distance—but then I wonder what Latitude or Longitude I've got to?" (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)`,
    difficulty: "초급",
    estimatedTime: 8,
    type: 'fiction',
    source: 'Alice in Wonderland',
    questions: [
      {
        question: "Alice가 처음에 무엇을 하고 있었나요?",
        options: [
          "책을 읽고 있었다",
          "언니 옆에서 앉아 있었다",
          "데이지 체인을 만들고 있었다",
          "토끼를 쫓고 있었다"
        ],
        correct: 1
      },
      {
        question: "흰 토끼가 무엇을 가지고 있었나요?",
        options: [
          "모자",
          "시계",
          "책",
          "지도"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'alice_ch2',
    title: "CHAPTER II. The Pool of Tears",
    content: `"Curiouser and curiouser!" cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); "now I'm opening out like the largest telescope that ever was! Good-bye, feet!" (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). "Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can;—but I must be kind to them," thought Alice, "or perhaps they won't walk the way I want to go! Let me see: I'll give them a new pair of boots every Christmas."

And she went on planning to herself how she would manage it. "They must go by the carrier," she thought; "and how funny it'll seem, sending presents to one's own feet! And how odd the directions will look!

     Alice's Right Foot, Esq.,
       Hearthrug,
         near the Fender,
           (with Alice's love).
Oh dear, what nonsense I'm talking!"

Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.

Poor Alice! It was as much as she could do, lying down on one side, to look through into the garden with one eye; but to get through was more hopeless than ever: she sat down and began to cry again.

"You ought to be ashamed of yourself," said Alice, "a great girl like you," (she might well say this), "to go on crying in this way! Stop this moment, I tell you!" But she went on all the same, shedding gallons of tears, until there was a large pool all round her, about four inches deep and reaching half down the hall.

After a time she heard a little pattering of feet in the distance, and she hastily dried her eyes to see what was coming. It was the White Rabbit returning, splendidly dressed, with a pair of white kid gloves in one hand and a large fan in the other: he came trotting along in a great hurry, muttering to himself as he came, "Oh! the Duchess, the Duchess! Oh! won't she be savage if I've kept her waiting!" Alice felt so desperate that she was ready to ask help of any one; so, when the Rabbit came near her, she began, in a low, timid voice, "If you please, sir—" The Rabbit started violently, dropped the white kid gloves and the fan, and skurried away into the darkness as hard as he could go.`,
    difficulty: "초급",
    estimatedTime: 10,
    type: 'fiction',
    source: 'Alice in Wonderland',
    questions: [
      {
        question: "Alice가 얼마나 커졌나요?",
        options: [
          "5피트",
          "7피트",
          "9피트 이상",
          "12피트"
        ],
        correct: 2
      },
      {
        question: "Alice가 울어서 무엇이 생겼나요?",
        options: [
          "강",
          "연못",
          "바다",
          "시냇물"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'alice_ch3',
    title: "CHAPTER III. A Caucus-Race and a Long Tale",
    content: `They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them, and all dripping wet, cross, and uncomfortable.

The first question of course was, how to get dry again: they had a consultation about this, and after a few minutes it seemed quite natural to Alice to find herself talking familiarly with them, as if she had known them all her life. Indeed, she had quite a long argument with the Lory, who at last turned sulky, and would only say, "I am older than you, and must know better;" and this Alice would not allow without knowing how old it was, and, as the Lory positively refused to tell its age, there was no more to be said.

At last the Mouse, who seemed to be a person of authority among them, called out, "Sit down, all of you, and listen to me! I'll soon make you dry enough!" They all sat down at once, in a large ring, with the Mouse in the middle. Alice kept her eyes anxiously fixed on it, for she felt sure she would catch a bad cold if she did not get dry very soon.

"Ahem!" said the Mouse with an important air, "are you all ready? This is the driest thing I know. Silence all round, if you please! 'William the Conqueror, whose cause was favoured by the pope, was soon submitted to by the English, who wanted leaders, and had been of late much accustomed to usurpation and conquest. Edwin and Morcar, the earls of Mercia and Northumbria—'"

"Ugh!" said the Lory, with a shiver.

"I beg your pardon!" said the Mouse, frowning, but very politely: "Did you speak?"

"Not I!" said the Lory hastily.

"I thought you did," said the Mouse. "—I proceed. 'Edwin and Morcar, the earls of Mercia and Northumbria, declared for him: and even Stigand, the patriotic archbishop of Canterbury, found it advisable—'"

"Found what?" said the Duck.

"Found it," the Mouse replied rather crossly: "of course you know what 'it' means."

"I know what 'it' means well enough, when I find a thing," said the Duck: "it's generally a frog or a worm. The question is, what did the archbishop find?"

The Mouse did not notice this question, but hurriedly went on, "'—found it advisable to go with Edgar Atheling to meet William and offer him the crown. William's conduct at first was moderate. But the insolence of his Normans—' How are you getting on now, my dear?" it continued, turning to Alice as it spoke.`,
    difficulty: "중급",
    estimatedTime: 12,
    type: 'fiction',
    source: 'Alice in Wonderland',
    questions: [
      {
        question: "동물들이 모인 이유는 무엇인가요?",
        options: [
          "파티를 하기 위해",
          "마르기 위해",
          "Alice를 도우기 위해",
          "음식을 찾기 위해"
        ],
        correct: 1
      },
      {
        question: "Mouse가 무엇을 하려고 했나요?",
        options: [
          "노래를 부르려고 했다",
          "역사 강의를 하려고 했다",
          "춤을 추려고 했다",
          "게임을 하려고 했다"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'alice_ch4',
    title: "CHAPTER IV. The Rabbit Sends in a Little Bill",
    content: `It was the White Rabbit, trotting slowly back again, and looking anxiously about as it went, as if it had lost something; and she heard it muttering to itself "The Duchess! The Duchess! Oh my dear paws! Oh my fur and whiskers! She'll get me executed, as sure as ferrets are ferrets! Where can I have dropped them, I wonder?" Alice guessed in a moment that it was looking for the fan and the pair of white kid gloves, and she very good-naturedly began hunting about for them, but they were nowhere to be seen—everything seemed to have changed since her swim in the pool, and the great hall, with the glass table and the little door, had vanished completely.

Very soon the Rabbit noticed Alice, as she went hunting about, and called out to her in an angry tone, "Why, Mary Ann, what are you doing out here? Run home this moment, and fetch me a pair of gloves and a fan! Quick, now!" And Alice was so much frightened that she ran off at once in the direction it pointed to, without trying to explain the mistake it had made.

"He took me for his housemaid," she said to herself as she ran. "How surprised he'll be when he finds out who I am! But I'd better take him his fan and gloves—that is, if I can find them." As she said this, she came upon a neat little house, on the door of which was a bright brass plate with the name "W. RABBIT," engraved upon it. She went in without knocking, and hurried upstairs, in great fear lest she should meet the real Mary Ann, and be turned out of the house before she had found the fan and gloves.

"How queer it seems," Alice said to herself, "to be going messages for a rabbit! I suppose Dinah'll be sending me on messages next!" And she began fancying the sort of thing that would happen: "'Miss Alice! Come here directly, and get ready for your walk!' 'Coming in a minute, nurse! But I've got to see that the mouse doesn't get out.' Only I don't think," Alice went on, "that they'd let Dinah stop in the house if it began ordering people about like that!"

By this time she had found her way into a tidy little room with a table in the window, and on it (as she had hoped) a fan and two or three pairs of tiny white kid gloves: she took up the fan and a pair of the gloves, and was just going to leave the room, when her eye fell upon a little bottle that stood near the looking-glass. There was no label this time with the words "DRINK ME," but nevertheless she uncorked it and put it to her lips. "I know something interesting is sure to happen," she said to herself, "whenever I eat or drink anything; so I'll just see what this bottle does. I do hope it'll make me grow large again, for really I'm quite tired of being such a tiny little thing!"`,
    difficulty: "중급",
    estimatedTime: 15,
    type: 'fiction',
    source: 'Alice in Wonderland',
    questions: [
      {
        question: "토끼가 Alice를 누구로 착각했나요?",
        options: [
          "공주",
          "메리 앤",
          "여왕",
          "요정"
        ],
        correct: 1
      },
      {
        question: "Alice가 찾은 집의 문에는 무엇이 있었나요?",
        options: [
          "초록색 페인트",
          "밝은 황동판",
          "나무 조각",
          "유리 장식"
        ],
        correct: 1
      }
    ]
  }
]

// 일상 생활 에세이들
export const dailyEssays: ReadingChapter[] = [
  {
    id: 'essay_1',
    title: "도시 공원에서의 아침 산책",
    content: `새벽 6시, 도시가 깨어나기 전의 고요한 시간. 나는 집 근처 공원으로 향했다. 아직 해가 완전히 떠오르지 않은 하늘은 연한 파란색을 띠고 있었고, 공기에는 이슬의 향기가 가득했다.

공원 입구에 도착하자마자 나무들 사이로 새들의 지저귐이 들려왔다. 마치 자연의 오케스트라가 연주하는 아침 교향곡 같았다. 발걸음을 내딛자마자 신선한 공기가 폐를 가득 채웠고, 하루 종일 컴퓨터 앞에 앉아있던 몸이 점점 이완되는 것을 느낄 수 있었다.

산책로를 따라 걷다 보니 이미 몇 명의 사람들이 운동을 하고 있었다. 조깅하는 청년, 스트레칭하는 중년 여성, 그리고 강아지와 함께 걷는 노부부. 모두가 각자의 페이스로 아침을 시작하고 있었다.

공원 중앙의 연못에는 오리들이 헤엄치고 있었고, 물 위에는 나뭇잎들이 떠다니고 있었다. 연못 주변의 벤치에 잠시 앉아서 이 순간을 만끽했다. 도시의 소음에서 벗어나 자연의 소리에 귀 기울이는 시간, 이것이 바로 내가 매일 아침 산책을 하는 이유였다.

아침 산책의 가장 큰 장점은 하루를 시작하기 전에 마음을 정리할 수 있다는 것이다. 복잡한 생각들이 자연 속에서 하나씩 정리되고, 새로운 하루를 맞이할 준비가 된다. 또한 신체적으로도 가벼운 운동이 되어 하루 종일 활력이 넘치게 된다.

이제 해가 완전히 떠올라 도시가 깨어나기 시작했다. 나는 공원을 나서며 오늘 하루도 힘내자고 다짐했다. 아침 산책이 주는 작은 기적 같은 순간들이 하루하루를 특별하게 만들어준다.`,
    difficulty: "초급",
    estimatedTime: 5,
    type: 'non-fiction',
    source: '일상 생활 에세이',
    questions: [
      {
        question: "작자가 산책을 시작한 시간은?",
        options: [
          "새벽 5시",
          "새벽 6시",
          "아침 7시",
          "아침 8시"
        ],
        correct: 1
      },
      {
        question: "공원에서 작자가 느낀 가장 큰 장점은?",
        options: [
          "운동 효과",
          "마음 정리",
          "자연 감상",
          "사람 만남"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'essay_2',
    title: "우리 동네 전통 시장 탐방",
    content: `주말 오후, 우리 동네 전통 시장을 구경하러 나왔다. 시장 입구에 도착하자마자 다양한 음식 냄새가 코를 자극했다. 김치찌개, 순대, 떡볶이, 어묵탕 등 각양각색의 먹거리들이 줄지어 서 있었다.

시장 안으로 들어가니 더욱 활기찬 분위기가 느껴졌다. 상인들의 목소리, 손님들과의 흥정 소리, 그리고 음식점에서 나는 요리 소리가 뒤섞여 마치 하나의 교향곡을 이루고 있었다.

채소 가게에서는 싱싱한 채소들이 가지런히 진열되어 있었고, 생선 가게에서는 아침에 잡힌 신선한 생선들이 팔리고 있었다. 각 가게마다 상인들의 정성스러운 손길이 느껴졌다.

특히 인상 깊었던 것은 시장 한쪽에 있는 할머니의 떡 가게였다. 50년 넘게 이 자리에서 떡을 만들어 팔고 있다는 할머니는 손님들에게 항상 따뜻한 미소를 지어주셨다. 그 분의 떡은 정말 맛있었고, 더욱 맛있게 느껴진 것은 그 분의 정성과 사랑이 담겨있기 때문이었다.

시장을 돌아다니면서 느낀 것은 전통 시장이 단순한 상거래의 장소가 아니라 우리 문화와 정서가 살아있는 공간이라는 것이었다. 대형 마트에서는 느낄 수 없는 인간미와 따뜻함이 가득했다.

시장을 나오면서 작은 포장마차에서 떡볶이를 사 먹었다. 매콤달콤한 양념과 쫄깃한 떡의 조화가 입에서 살살 녹았다. 이렇게 전통 시장에서 느낀 따뜻함과 맛있는 음식들이 주말을 특별하게 만들어주었다.`,
    difficulty: "초급",
    estimatedTime: 6,
    type: 'non-fiction',
    source: '일상 생활 에세이',
    questions: [
      {
        question: "시장에서 작자가 가장 인상 깊었던 것은?",
        options: [
          "대형 마트",
          "할머니의 떡 가게",
          "생선 가게",
          "채소 가게"
        ],
        correct: 1
      },
      {
        question: "전통 시장의 특징으로 올바른 것은?",
        options: [
          "저렴한 가격",
          "인간미와 따뜻함",
          "넓은 공간",
          "현대적 시설"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'essay_3',
    title: "건강한 점심 도시락 만들기",
    content: `요즘은 건강에 대한 관심이 높아져서 집에서 도시락을 만들어 먹는 사람들이 많아졌다. 나도 그 중 하나로, 매일 아침 30분 정도 시간을 내어 건강한 점심 도시락을 만들고 있다.

도시락을 만들 때 가장 중요한 것은 영양의 균형이다. 탄수화물, 단백질, 비타민, 무기질이 골고루 들어가야 한다. 밥은 현미나 잡곡밥으로, 단백질은 닭가슴살이나 생선으로, 그리고 채소는 다양한 색깔의 것들을 준비한다.

특히 채소는 색깔별로 다른 영양소를 가지고 있기 때문에, 빨간색(토마토, 당근), 노란색(옥수수, 노란 파프리카), 초록색(브로콜리, 시금치), 보라색(가지, 적양배추) 등 다양한 색깔의 채소를 포함시키려고 노력한다.

도시락을 예쁘게 담는 것도 중요하다. 먹기 좋게 작게 썰고, 색깔을 고려해서 배치하면 시각적으로도 만족스럽다. 때로는 간단한 장식도 추가해서 먹는 즐거움을 더한다.

도시락을 만들면서 느낀 것은 음식이 단순히 배를 채우는 것이 아니라 건강과 행복을 만드는 것이라는 점이다. 정성스럽게 만든 도시락을 먹을 때마다 하루가 특별해지는 것 같다.

또한 도시락을 만들면서 식재료에 대한 관심도 높아졌다. 계절에 맞는 제철 식재료를 사용하고, 유기농이나 친환경 제품을 선택하려고 노력한다. 이렇게 하면서 음식의 소중함과 자연의 순환을 더 깊이 이해하게 되었다.`,
    difficulty: "초급",
    estimatedTime: 7,
    type: 'non-fiction',
    source: '일상 생활 에세이',
    questions: [
      {
        question: "도시락을 만들 때 가장 중요한 것은?",
        options: [
          "맛",
          "영양의 균형",
          "양",
          "가격"
        ],
        correct: 1
      },
      {
        question: "채소를 색깔별로 선택하는 이유는?",
        options: [
          "예쁘게 보이기 위해",
          "색깔별로 다른 영양소를 위해",
          "저렴하기 때문에",
          "보관이 쉽기 때문에"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 'essay_4',
    title: "스마트폰 사용 줄이기 도전",
    content: `최근 스마트폰 사용 시간이 너무 많아져서 걱정이 되었다. 하루 평균 6시간 이상을 스마트폰을 들여다보고 있다는 통계를 보고 충격을 받았다. 그래서 스마트폰 사용 시간을 줄이는 도전을 시작했다.

첫 번째로 한 것은 스마트폰 사용 시간을 측정하는 앱을 설치한 것이다. 이 앱은 각 앱별 사용 시간을 알려주고, 하루 목표 시간을 설정할 수 있다. 처음에는 하루 4시간으로 목표를 정했다.

두 번째로는 스마트폰을 사용할 수 없는 시간을 정했다. 식사 시간, 취침 전 1시간, 그리고 아침 기상 후 30분은 스마트폰을 보지 않기로 했다. 처음에는 어려웠지만, 점점 익숙해지면서 오히려 더 여유로운 시간을 보낼 수 있게 되었다.

세 번째로는 스마트폰 대신 할 수 있는 활동들을 찾았다. 책 읽기, 그림 그리기, 요리하기, 친구들과 만나서 대화하기 등. 이렇게 하면서 스마트폰 없이도 충분히 즐거운 시간을 보낼 수 있다는 것을 깨달았다.

한 달이 지난 지금, 하루 평균 스마트폰 사용 시간이 3시간으로 줄었다. 더 중요한 것은 스마트폰에 의존하지 않고도 충실한 하루를 보낼 수 있게 되었다는 것이다.

이제 스마트폰은 필요한 정보를 얻거나 중요한 연락을 위한 도구로만 사용하고 있다. 불필요한 스크롤링이나 SNS 체크는 거의 하지 않게 되었다. 대신 실제로 의미 있는 활동들에 더 많은 시간을 투자할 수 있게 되었다.

스마트폰 사용을 줄이면서 얻은 가장 큰 변화는 마음의 여유였다. 끊임없이 들어오는 알림에 신경 쓰지 않아도 되고, 자신만의 시간을 가질 수 있게 되었다. 이제 스마트폰이 나를 지배하는 것이 아니라 내가 스마트폰을 활용하는 주체가 되었다.`,
    difficulty: "중급",
    estimatedTime: 8,
    type: 'non-fiction',
    source: '일상 생활 에세이',
    questions: [
      {
        question: "작자가 처음에 설정한 하루 목표 시간은?",
        options: [
          "2시간",
          "3시간",
          "4시간",
          "5시간"
        ],
        correct: 2
      },
      {
        question: "스마트폰 사용을 줄이면서 얻은 가장 큰 변화는?",
        options: [
          "시간 절약",
          "마음의 여유",
          "건강 개선",
          "돈 절약"
        ],
        correct: 1
      }
    ]
  }
]

export const allReadingMaterials = [...aliceChapters, ...dailyEssays] 