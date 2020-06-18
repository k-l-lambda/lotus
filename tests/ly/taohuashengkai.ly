\version "2.20.0" 

\header {
	poet = "2" 
	encodingsoftware = "Sibelius 8.2" 
	encodingdate = "2017-08-18" 
	composer = \markup \column { \line { "邬大为 词" } \line { "铁源 曲" } \line { " Find音乐制作部 改编" } } 
	title = "在那桃花盛开的地方" 
}


#(set-global-staff-size 20.6625714286) 

\paper {
	paper-width = 21.59\cm 
	paper-height = 27.93\cm 
	top-margin = 1.27\cm 
	bottom-margin = 1.27\cm 
	left-margin = 2.53\cm 
	right-margin = 1.27\cm 
	between-system-space = 2.71\cm 
	page-top-space = 1.32\cm 
	indent = 1.66076923077\cm 
	short-indent = 0.611862348178\cm 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative des' {
	\clef "treble_8" \key ges \major \numericTimeSignature \time 4/4 s1*4 s1*4 \tempo 4 = 106 s1 |
	\stemDown des4 \stemDown des8 ( [ \stemDown bes8 ) ] \stemDown ges'4 ( \stemDown f8 [ \stemDown es8 ) ] |
	\barNumberCheck #10 \stemDown des8 ( [ \stemDown bes8 ] \stemDown des2 \stemDown bes4 ) |
	\stemDown es4 \stemDown es8 [ \stemDown des8 ] \stemDown ges4 ( \stemUp bes,8 [ \stemUp as8 ) ] |
	\stemUp ges8 ( [ \stemUp es8 ] \stemUp ges2. ) |
	\stemDown bes4. ( \stemDown des8 ) \stemUp es,4 ( \stemUp des4 ) |
	\stemDown bes'4 ( \stemDown es4 ) \stemDown des4 \stemDown bes4 |
	\stemUp as4 ( \stemUp es8 [ \stemUp ges8 ] \stemUp f8 [ \stemUp as8 ] \stemUp es4 ) |
	des'1 |
	\stemDown es4 \stemDown es8 ( [ \stemDown ges8 ) ] \stemDown es8 ( [ \stemDown des8 \stemDown des8 \stemDown bes8 ) ] |
	\stemUp as2. \stemUp ges4 |
	\stemUp f8 ( [ \stemUp f8 ) \stemUp f8 \stemUp as8 ] \stemUp es8 ( [ \stemUp f8 ] \stemUp des4 ) |
	\barNumberCheck #20 es1 |
	\stemUp ges4 ( \stemUp es8 [ \stemUp ges8 ) ] \stemUp as4. ( \stemDown bes8 ) |
	\stemDown des8 ( [ \stemDown bes8 \stemDown ges'8 \stemDown f8 ) ] \stemDown es4 \stemDown des4 |
	\stemUp as4 \stemUp es8 [ \stemUp ges8 ] \stemUp f8 ( [ \stemUp as8 ] \stemUp es4 ) |
	\stemUp des2. \stemDown des'8 ( [ \stemDown bes8 ] |
	\stemDown ges'4. \stemDown f8 ) \stemDown es8 ( [ \stemDown f8 ] \stemDown des4 ) |
	es1 |
	\stemDown des8 [ \stemDown bes8 \stemDown ges'8 \stemDown f8 ] \stemDown es8 ( [ \stemDown des8 \stemDown des8 \stemDown bes8 ) ] |
	des1 |
	\stemDown es4. \stemDown des8 \stemDown bes8. [ \stemDown ges'16 ] \stemDown es8 [ \stemDown des8 ] |
	\barNumberCheck #30 \stemDown es8 [ \stemDown des8 \stemDown des8 ( \stemDown bes8 ) ] \stemUp as2 |
	r4 \stemUp as8 [ \stemUp bes8 ] \stemDown des4 \stemUp des,4 ( ~ |
	\stemUp des2. \stemUp es4 ) |
	\stemUp ges8 ( [ \stemUp es8 \stemUp des'8 \stemUp bes8 ) ] \stemUp as4. \stemDown bes8 |
	\stemUp as4 ( \stemUp es8 [ \stemUp ges8 ] \stemUp f8 [ \stemUp as8 ] \stemUp es4 ) |
	des1 s1 s1*2 |
	r2 \stemDown es'8 ( [ \stemDown f8 ] \stemDown des4 ) |
	\barNumberCheck #40 es1 |
	\stemDown des8 [ \stemDown bes8 \stemDown ges'8 \stemDown f8 ] \stemDown es8 ( [ \stemDown des8 \stemDown des8 \stemDown bes8 ) ] |
	des1 |
	\stemDown es4. \stemDown des8 \stemDown bes8. [ \stemDown ges'16 ] \stemDown es8 [ \stemDown des8 ] |
	\stemDown es8 [ \stemDown des8 \stemDown des8 ( \stemDown bes8 ) ] \stemUp as2 |
	r4 \stemUp as8 [ \stemUp bes8 ] \stemDown des4 \stemUp des,4 ( ~ |
	\stemUp des2. \stemUp es4 ) |
	\stemUp ges8 ( [ \stemUp es8 \stemUp des'8 \stemUp bes8 ) ] \stemUp as4. \stemDown bes8 |
	as'1 ( |
	\stemDown es4. \stemDown ges8 \stemDown f8 [ \stemDown es8 \stemDown des8 \stemDown es8 ) ] |
	\barNumberCheck #50 des1 s1*4 \bar "|." 
}


PartPOneVoiceOneLyricsOne = \lyricmode {
	\set ignoreMelismata = ##t 在 那 \skip 1 桃 \skip 1 \skip 1 花 \skip 1 \skip 1 \skip 1 盛 开 的 地 \skip 1 \skip 1 方 \skip 1 \skip 1 有 \skip 1 我 \skip 1 可 \skip 1 爱 的 故 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 乡, 桃 树 \skip 1 倒 \skip 1 \skip 1 \skip 1 映 在 明 \skip 1 净 的 水 \skip 1 \skip 1 面, 桃 \skip 1 \skip 1 林 \skip 1 环 \skip 1 \skip 1 \skip 1 抱 着 秀 丽 的 村 \skip 1 \skip 1 庄. 啊 \skip 1 \skip 1 \skip 1 故 \skip 1 \skip 1 乡, 生 我 养 我的 地 \skip 1 \skip 1 \skip 1 方, 无 论 我 在 哪 里 放 哨 站 \skip 1 岗, 总 是 把 你 \skip 1 \skip 1 深 \skip 1 \skip 1 \skip 1 情 地 向 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 往. 故 \skip 1 \skip 1 乡, 生 我 养 我的 地 \skip 1 \skip 1 \skip 1 方, 无 论 我 在 哪 里 放 哨 站 \skip 1 岗, 总 是 把 你 \skip 1 \skip 1 深 \skip 1 \skip 1 \skip 1 情 地 向 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 往. 
}


PartPTwoVoiceOne = \relative des'' {
	\clef "treble" \key ges \major \numericTimeSignature \time 4/4 \stemDown <des des'>8 [ \stemDown <bes bes'>8 ] s2. |
	\stemDown <ges' ges'>4. \stemDown <f f'>8 \stemDown <es es'>8. [ \stemDown <f f'>16 ] \stemDown <des des'>4 |
	\stemDown <es es'>2 \stemUp ges,16 [ \stemUp des16 \stemUp es16 \stemUp ges16 ] \stemDown as8 [ \stemDown bes16 \stemDown es16 ] |
	\stemDown <des des'>8 [ \stemDown <bes bes'>8 \stemDown <ges' ges'>8 \stemDown <f f'>8 ] \stemDown <es es'>8 [ \stemDown <des des'>8 \stemDown <des des'>8 \stemDown <bes bes'>8 ] |
	\stemDown <des des'>8. [ \stemDown <des des'>16 ] \stemDown des'16 [ \stemDown <des, des'>16 \stemDown des8 ] r4 \stemUp es,16 [ \stemUp ges16 \stemUp as16 \stemUp bes16 ] |
	\stemDown <ges' bes es>4. \stemDown <des des'>8 \stemDown <des des'>8 [ \stemDown <bes bes'>8 ] \stemDown <bes bes'>4 |
	\stemDown <des ges bes des>4. \stemDown <bes bes'>8 \stemDown <bes bes'>8 [ \stemDown <as as'>8 ] \stemDown <as as'>4 |
	\stemDown <c as'>4 \stemDown es8 [ \stemDown ges8 ] \stemDown f8 [ \stemDown as8 ] \stemDown <es, es'>8 [ \stemDown f'16 \stemDown es16 ] |
	\stemUp <des, ges des'>4 \stemUp bes8 [ \stemUp des8 ] \stemUp es8 [ \stemUp ges8 \stemUp as8 \stemUp bes8 ] |
	\stemDown des4 \stemDown bes4 \stemDown <ges ges'>4 \stemDown f'8 [ \stemDown es8 ] |
	\barNumberCheck #10 \stemDown des8 [ \stemDown bes8 ] \stemDown des2. |
	\stemDown <bes es>4 \stemDown <bes es ges>4 \stemDown <bes es>2 |
	bes1 |
	\stemUp <des, ges bes>4. \stemDown des'8 \stemUp ges,4 \stemUp <as, des>4 |
	\stemUp <ges' bes>4 \stemDown <ges es'>4 \stemUp <es ges des'>4 \stemDown bes'4 |
	\stemUp <c, as'>4 \stemUp es8 [ \stemUp ges8 ] \stemUp <c, f>8 [ \stemUp as'8 ] \stemUp es8 [ \times 2/3 {
		\stemUp es16 \stemUp f16 \stemUp es16 ] 
	}
	|
	\stemUp des4. \stemUp es8 \stemUp ges8. [ \stemUp as16 ] \stemDown des4 |
	\stemDown es4. \stemDown es'8 \stemDown des4 \stemDown bes4 |
	\stemDown as8 [ \stemDown as,8 \stemDown ces8 \stemDown as8 ] \stemUp es8 [ \stemUp as8 \stemUp ces8 \stemUp as8 ] |
	\stemDown <f f'>2 \stemDown des'8 \stemDown bes4. |
	\barNumberCheck #20 \times 4/5 {
		\stemUp es,16*385/384 [ \stemUp f16*385/384 \stemUp es16*385/384 \stemUp des16*385/384 \stemUp es16*95/96 ~ ] 
	}
	\stemUp es4 \stemUp <bes des>4 \stemUp <bes es>4 |
	\stemUp <ces es ges>4. \stemUp as'8 \stemDown bes4 \stemUp ges4 |
	\stemUp <des ges des'>8 [ \stemUp bes'8 \stemUp <ges bes es>8 \stemUp bes8 ] \stemUp <des, es ges des'>4 \stemUp <des ges>4 |
	\stemUp <c as'>4 \stemUp es8 [ \stemUp ges8 ] \stemUp f8 [ \stemUp as8 ] \stemUp es8 [ \times 2/3 {
		\stemUp es16 \stemUp f16 \stemUp es16 ] 
	}
	|
	\stemUp des4 \stemDown <es es'>8 [ \stemDown <f f'>8 ] \stemDown <ges ges'>8 [ \stemDown <as as'>8 \stemDown <bes bes'>8 \stemDown <ces ces'>8 ] |
	\stemDown <des bes' des>4. \stemDown <ges bes>8 \stemDown <ges ges'>8 [ \stemDown f'8 \stemDown es8 \stemDown des8 ] |
	\stemDown <es, es'>8. [ \stemDown <ges, ces es>16 ] \stemDown <ges ces es>8. [ \stemDown ces16 ] \stemUp <ges ces>4 \stemUp <ces, ges'>4 |
	\stemDown des'8 [ \stemDown bes8 \stemDown ges'8 \stemDown f8 ] \stemDown <ges, es'>8 [ \stemDown des'8 \stemDown des8 \stemDown bes8 ] |
	\stemDown <as des>2. \stemDown bes8 [ \stemDown des8 ] |
	<ges, bes es>1 |
	\barNumberCheck #30 \stemDown <bes es>4 \stemDown ges'4 \stemUp <f, as>2 ~ ~ |
	\stemUp <f as>4 \stemUp as8 [ \stemUp bes8 ] \stemUp <des, des'>4 \stemUp des4 ~ |
	\stemUp des4 r4 r4 \stemUp es4 |
	\stemUp <bes ges'>8 [ \stemUp es8 \stemUp <ges es'>8 \stemUp des'8 ] \stemUp <des, es bes'>4. \stemDown bes'8 |
	\stemUp <es, as>4 \stemUp es8 [ \stemUp ges8 ] \stemUp <as, des f>8 [ \stemUp as'8 ] \stemUp es8 [ \times 2/3 {
		\stemUp es16 \stemUp f16 \stemUp es16 ] 
	}
	|
	\stemUp des4 \stemDown <es es'>8 [ \stemDown <f f'>8 ] \stemDown <ges ges'>8 [ \stemDown <as as'>8 \stemDown <bes bes'>8 \stemDown <ces ces'>8 ] |
	\stemDown <ges bes des ges>2 \stemDown bes'8 [ \stemDown <des,, bes'>8 \stemDown des'8 \stemDown bes'8 ] |
	\stemDown <c, es as>4 \stemUp c,8. [ \stemUp <es as c>16 ] \stemUp <es as c>4 \stemDown <c' es as>8 [ \stemDown as8 ] |
	\stemDown <c es as c>4 \stemDown <as c es as>8. [ \stemDown <as c es>16 ] \stemUp <es as c es>4 \stemUp ges4 |
	\stemDown <as des f>4. \stemDown as'8 \stemDown es8. [ \stemDown f16 ] \stemDown es8 [ \stemDown des8 ] |
	\barNumberCheck #40 \stemDown <as bes es>4 \stemUp <es ges>8 [ \stemUp <f bes>8 ] \stemDown <ges des'>8 [ \stemDown <as es'>8 \stemDown <des ges>8 \stemDown as'8 ] |
	\stemDown des,8 [ \stemDown bes8 \stemDown ges'8 \stemDown f8 ] \stemDown <ges, es'>8 [ \stemDown des'8 \stemDown des8 \stemDown bes8 ] |
	\stemDown <as des>4 \stemUp <des, ges>8 [ \stemUp es8 ] \stemUp <des ges>4 \stemDown bes'8 [ \stemDown des8 ] |
	\stemDown <ges, bes es>2 \stemUp des2 |
	\stemDown <bes' es>4 \stemDown ges'4 \stemUp <des, f as>2 |
	r4 \stemUp as'8 [ \stemUp bes8 ] \stemUp <des, des'>4 \stemUp des4 |
	r2 r4 \stemUp es4 |
	\stemUp <bes ges'>8 [ \stemUp es8 \stemUp <ges es'>8 \stemUp des'8 ] \stemUp <es, as>2 |
	\stemUp <es bes'>2 \stemUp <des ges des'>4 -\markup { \italic { rit . } } \stemUp bes4 ~ |
	\stemUp bes8 \stemUp des4 \stemDown <as' c es as>8 ~ \stemDown <as c es as>4 \stemDown as'4 |
	\barNumberCheck #50 \stemDown es4 \stemDown bes4 \once \omit TupletBracket \once \omit TupletNumber \times 1/1 {
		\stemUp <des, es>32 [ \stemUp as'32 ] 
	}
	s16*7 |
	<des, es>\breve*1/2 :256 :256 as'\breve*1/2 :256 |
	des,\breve*1/2 :256 des'\breve*1/2 :256 |
	des,\breve*1/2 :256 des'\breve*1/2 :256 |
	\once \omit TupletBracket \once \omit TupletNumber \times 1/1 {
		\stemUp des,32 [ \stemUp des'32 ] 
	}
	\stemUp des,16 [ \stemUp ges16 \stemUp as16 \stemUp des16 ] \stemDown ges8 [ \stemDown as8 ] |
	\stemDown des4 r4 r2 \bar "|." 
}


PartPTwoVoiceFive = \relative ges, {
	\clef "bass" \key ges \major \numericTimeSignature \time 4/4 r4 s2. \stemDown ges8 [ \stemDown des'8 \stemDown as'8 \stemDown ges8 ] \stemDown bes8 [ \stemDown des8 \stemDown ges8 \stemDown des8 ] \stemDown ces,8 [ \stemDown ges'16 \stemDown as16 ] \stemDown des16 [ \stemDown bes16 \stemDown des16 \stemDown es16 ] r2 \stemUp ges,,8 [ \stemUp des'8 \stemUp ges8 \stemUp des8 ] \stemUp as8 [ \stemUp es'8 ] \stemDown ces'4 \stemUp des,,8 [ \stemUp as'8 \stemUp des8 \stemUp es8 ] \stemDown ges16 [ \stemDown as16 \stemDown bes16 \stemDown des16 ] r4 \stemDown <ges, bes es>4. \stemDown as8 \stemDown <des, as'>4 \stemDown <bes ges'>4 \stemDown des'4. \stemDown bes8 \stemDown bes8 [ \stemDown as8 ] \stemDown as4 \stemUp <as,, as'>8 [ \stemUp es''8 ] \stemDown ces'4 \stemUp <c,, c'>8 [ \stemUp as''8 ] r4 \stemUp <des,, des'>4 \stemDown <es' bes'>8 [ \stemDown ges8 ] \stemDown as8 [ \stemDown bes8 \stemDown des8 \stemDown es8 ] \stemDown ges,,8 [ \stemDown des'8 \stemDown as'8 \stemDown ges8 ] \stemDown bes2 \stemDown ges,8 [ \stemDown des'8 \stemDown as'8 \stemDown ges8 ] \stemDown bes8 [ \stemDown des8 \stemDown es8 \stemDown ges8 ] \stemDown <es ges>4 \stemDown ges4 \stemDown <es ges>2 \stemDown <bes des es ges>2 \stemDown <ges des' ges>4 \stemDown des4 \stemDown ges,8 [ \stemDown des'8 \stemDown bes'8 \stemDown des8 ] r4 \stemUp f,,4 \stemUp es8 [ \stemUp bes'8 ] \stemDown ges'4 \stemDown <ges bes des>4 \stemDown bes4 \stemUp as,8 \stemDown ges'4. \stemDown <c, as'>4 r4 \stemUp des,8 [ \stemUp as'8 \stemUp ges'8 \stemUp as8 ] \clef "treble" \stemUp des8 [ \stemUp es8 ] r4 \stemUp <es ges bes>2 \stemDown <des' f>4 \stemDown <ges, des'>4 \clef "bass" \stemUp as,8 \stemDown es'4. \stemDown <ces, as' ces>2 \stemDown bes8 [ \stemDown as'8 \stemDown des8 \stemDown f8 ] \stemDown bes,4 \stemDown f'8 [ \stemDown des8 ] \stemUp es,,8 [ \stemUp bes'8 ] \stemDown ges'4 \stemDown ges4 \stemDown <des ges>4 \stemDown <ces ges'>4. \stemDown ces'8 \stemDown <des es>2 \stemUp es,,2 \stemDown <ges' bes>4 \stemDown es4 \stemUp as,8 \stemDown ges'4. \stemDown <c, as'>2 \stemUp des,8 [ \stemUp as'8 \stemUp c8 \stemUp ces8 ] \stemUp bes8 [ \stemUp as8 \stemUp ges8 \stemUp f8 ] \stemDown ges8 [ \stemDown des'8 \stemDown bes'8 \stemDown ges8 ] \stemDown bes,8 [ \stemDown ges'8 ] \stemDown des'4 \stemDown <ces, ges'>4 \stemDown es'8. [ \stemDown ces16 ] \stemDown ces4 \stemDown ges4 \stemUp ges,16 [ \stemUp des'16 \stemUp es16 \stemUp des16 ] \stemDown bes'16 [ \stemDown as16 \stemDown bes16 \stemDown des16 ] \stemDown <des, ges bes>4 \stemDown des'16 [ \stemDown bes16 \stemDown ges16 \stemDown es16 ] \stemDown des8. [ \stemDown as'16 ] \stemDown <des ges>8 [ \stemDown es8 ] \stemDown <des ges>2 \stemDown <es, bes'>2 \stemDown des'2 \stemDown bes2 \stemDown des2 r2 \stemUp bes,4 \stemDown as'4 \stemUp bes,,4 \stemDown bes''4 \stemDown f4 r4 \stemUp es,4 \stemUp bes'4 \stemDown <ges' bes>2 \stemUp as,8 \stemDown ges'4. \stemDown <c, as'>2 \grace {
		\stemUp as8 
	}
	\stemUp des,8 [ \stemUp des'8 ] \stemUp c8 [ \stemUp bes8 ] \stemUp as8 [ \stemUp ges8 \stemUp f8 \stemUp es8 ] \stemDown ges8 [ \stemDown des'8 \stemDown as'8 \stemDown ges8 ] \stemDown bes4 \stemDown es8 [ \stemDown ges8 ] \stemUp as,,8 \stemDown es'4 \stemDown bes'4 r8 \stemDown es4 r2 r4 r8 \stemUp as,,8 \stemUp des,8 [ \stemUp as'8 \stemUp f'8 \stemUp as8 ] \stemDown bes8 [ \stemDown des8 ] r4 \stemUp ces,,8 [ \stemUp ces'8 ~ ] \stemUp ces2 r4 \stemUp ges16 [ \stemUp des'16 \stemUp es16 \stemUp des16 ] \stemDown bes'16 [ \stemDown as16 \stemDown bes16 \stemDown des16 ] \stemDown <des, ges bes>4 \stemDown des'16 [ \stemDown bes16 \stemDown ges16 \stemDown es16 ] \stemDown des8 [ \stemDown as'8 ~ ] \stemDown as4 \stemDown ges4 r4 <es bes'>1 bes'1 \stemDown des,4 r4 \stemUp bes4 \stemDown as'4 \stemUp bes,,4 \stemDown bes''4 \stemDown f4 r4 \stemUp es,4 \stemUp bes'4 \stemDown <ges' bes>2 \stemUp <es, ges'>2 \stemDown des'2 ~ \stemDown des4. \stemDown as'8 ~ \stemDown as2 r2 \once \omit TupletBracket \once \omit TupletNumber \times 1/1 {
		\stemUp as,,32 [ \stemUp as'32 ] 
	}
	s16*7 \times 1/4 {
		as,\breve :256 as'\breve :256 
	}
	\times 1/4 {
		des,\breve :256 des'\breve :256 
	}
	\times 1/4 {
		des,\breve :256 des'\breve :256 
	}
	\times 1/4 {
		des,\breve :256 des'\breve :256 
	}
	\bar "|." 
}


\score {
	<<
		\new Staff <<
			\set Staff.instrumentName = "男高独唱" 
			\set Staff.shortInstrumentName = "T. Solo" 
			\context Staff <<
				\mergeDifferentlyDottedOn 
				\mergeDifferentlyHeadedOn 
				\context Voice = "PartPOneVoiceOne" {
					\PartPOneVoiceOne 
				}
				
				\new Lyrics \lyricsto "PartPOneVoiceOne" {
					\set stanza = "1." \PartPOneVoiceOneLyricsOne 
				}
				
			>>
			
		>>
		
		\new PianoStaff <<
			\set PianoStaff.instrumentName = "SmartMusicSoftSynth" 
			\context Staff = "1" <<
				\mergeDifferentlyDottedOn 
				\mergeDifferentlyHeadedOn 
				\context Voice = "PartPTwoVoiceOne" {
					\PartPTwoVoiceOne 
				}
				
			>>
			
			\context Staff = "2" <<
				\mergeDifferentlyDottedOn 
				\mergeDifferentlyHeadedOn 
				\context Voice = "PartPTwoVoiceFive" {
					\PartPTwoVoiceFive 
				}
				
			>>
			
		>>
		
	>>
	
	\layout {
	}
	
	\midi {
		\tempo 4 = 106 
	}
	
}

