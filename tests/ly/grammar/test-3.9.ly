\version "2.20.0" 

\header {
	encodingsoftware = "Finale v25 for Mac" 
	poet = "2" 
	encodingdate = "2018-06-14" 
	copyright = "不再麻烦好妈妈" 
	title = "不再麻烦好妈妈" 
}


#(set-global-staff-size 28.5448571429) 

\paper {
	paper-width = 21.01\cm 
	paper-height = 29.7\cm 
	top-margin = 1.27\cm 
	bottom-margin = 1.27\cm 
	left-margin = 1.27\cm 
	right-margin = 1.27\cm 
	between-system-space = 2.3\cm 
	page-top-space = 1.82\cm 
	indent = 1.61615384615\cm 
	short-indent = 1.29292307692\cm 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative g' {
	\clef "treble" \key c \major \time 4/4 |
	\stemUp g2 ^4 ^\markup { \bold \large { Allegro } } \stemUp g4 ^4 \stemUp a4 ^5 |
	\stemUp g4 \stemUp e4 r4 \stemUp c4 ^1 |
	\stemUp f2. ( ^4 \stemUp e4 |
	d1 ) \stemUp g2 ^2 _\mp _\mf \stemUp g4 ( \stemDown c4 ) ^5 |
	\stemUp g4 ^2 \stemUp e4 ^1 r4 \stemUp c4 ^1 |
	\stemUp f2. ( ^4 \stemUp e4 |
	\stemUp <d e>1 ) ( ^3 \stemUp f4 _\mp \stemUp e4 \stemUp d4 ) |
	\stemUp c2 _> \stemUp c2 |
	\stemUp e4 ( ^3 \stemUp f4 \stemUp e4 \stemUp d4 ) |
	\barNumberCheck #10 \stemUp c2 _> \stemUp c2 \stemUp e4 ( ^3 \stemUp d4 \stemUp e4 \stemUp f4 ) |
	\stemUp g2 _> ^5 \stemUp g2 |
	\stemUp e4 ( ^3 \stemUp d4 \stemUp e4 \stemUp f4 ) |
	\stemUp g2 _> \stemUp g2 c1 ( ^5 _\f |
	g1 ) ^2 |
	\stemUp f4 ( ^1 \stemUp e4 ^3 \stemUp d4 ) ^2 r4 |
	a'1 ^5 \stemUp g4 ( ^4 \stemUp f4 ) ^3 r4 _\markup { \italic { rit . } } \stemUp e4 ( ^2 |
	\stemUp d4 _. ^1 r4 \stemUp e4 _. ^3 r4 |
	c1 ) ~ ^1 |
	\stemUp c2 r2 \bar "|." 
}


PartPOneVoiceOneLyricsOne = \lyricmode {
	\set ignoreMelismata = ##t "妈" "妈、" \skip 1 "妈" "妈，" "您" "歇" "会儿" "吧，" "自" "己" "的" "事" "情" "我" "会" "做" "了。" "自" "己" "穿" "衣" "服" "呀，" "自" "己" "穿" "鞋" "袜" "呀，" "自" "己" "叠" "被" "子" "呀，" "自" "己" "梳" "头" "发" "呀，" "不" "再" "麻" "烦" "您" "了，" "亲" "爱" "的" "好" "妈" "妈！" \skip 1 
}


PartPOneVoiceTwo = \relative c {
	\clef "bass" \key c \major \time 4/4 <c e g>1 ~ _1 _3 _5 ~ ~ <c e g>1 d1 ( _4 \stemDown g2 ) _1 r2 <c, e g c, e g>1 ~ ~ ~ |
	d1 ( ^\> |
	\stemDown g2 ) -\! r2 \stemDown <c, e g>4 r4 \stemDown <c e g>4 r4 c1 e1 g1 \stemDown c,4 \stemDown e4 \stemDown g4 r4 \stemDown c,4 \stemDown e4 \stemDown g4 r4 c,1 e1 g1 \stemDown c,4 \stemDown e4 \stemDown g4 r4 \stemDown c,4 \stemDown e4 \stemDown g4 r4 g1 b1 d1 \stemDown c,4 \stemDown e4 \stemDown g4 r4 \stemDown c,4 \stemDown e4 \stemDown g4 r4 g1 b1 d1 r2 \stemDown c,2 \stemDown e2 \stemDown g2 \stemDown c,2 \stemDown e2 \stemDown g2 \stemDown c,2 \stemDown e2 \stemDown g2 r2 \stemDown c,2 \stemDown f2 \stemDown a2 \stemDown c,2 \stemDown f2 \stemDown a2 \stemDown c,2 \stemDown f2 \stemDown a2 c,1 e1 g1 \stemDown b,4 ^. \stemDown f'4 \stemDown g4 r4 \stemDown b,4 ^. \stemDown f'4 \stemDown g4 r4 c,1 ~ e1 ~ g1 ~ \stemDown c,2 \stemDown e2 \stemDown g2 r2 \bar "|." 
}


\score {
	<<
		\new PianoStaff <<
			\set PianoStaff.instrumentName = "Piano" 
			\set PianoStaff.shortInstrumentName = "Pno." 
			\context Staff = "1" <<
				\mergeDifferentlyDottedOn 
				\mergeDifferentlyHeadedOn 
				\context Voice = "PartPOneVoiceOne" {
					\PartPOneVoiceOne 
				}
				
				\new Lyrics \lyricsto "PartPOneVoiceOne" {
					\set stanza = "1." \PartPOneVoiceOneLyricsOne 
				}
				
			>>
			
			\context Staff = "2" <<
				\mergeDifferentlyDottedOn 
				\mergeDifferentlyHeadedOn 
				\context Voice = "PartPOneVoiceTwo" {
					\PartPOneVoiceTwo 
				}
				
			>>
			
		>>
		
	>>
	
	\layout {
	}
	
	\midi {
		\tempo 4 = 120 
	}
	
}

