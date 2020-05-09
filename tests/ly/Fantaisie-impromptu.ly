\version "2.20.0" 

\header {
	encodingsoftware = "Finale 2014.5 for Mac" 
	arranger = "Opus66" 
	encodingdate = "2018-02-25" 
	subtitle = "作于1835年" 
	title = "幻想即兴曲" 
}


#(set-global-staff-size 22.7288571429) 

\paper {
	paper-width = 21.0\cm 
	paper-height = 29.71\cm 
	top-margin = 0.99\cm 
	bottom-margin = 1.67\cm 
	left-margin = 0.99\cm 
	right-margin = 0.89\cm 
	between-system-space = 2.65\cm 
	page-top-space = 1.79\cm 
	indent = 1.61538461538\cm 
	system-system-spacing.basic-distance = #16 
	ragged-last = ##t 
}


\layout {
	\context {
		\Score 
		skipBars = ##t 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative gis' {
	\clef "treble" \key e \major \time 2/2 |
	\tempo "Allegro agitato" 2 = 84 |
	R1*4 |
	r16 \stemUp gis16 ( ^2 [ \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 ^3 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemUp gis,16 ( [ \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemDown a,16 ( [ \stemDown cis16 \stemDown dis16 ] \stemDown fis16 [ _\< \stemDown a16 \stemDown cis16 \stemDown dis16 ) ] \ottava #1 \stemDown b'16 ( [ _\> -\! \stemDown a16 \stemDown gis16 \stemDown fis16 ] \stemDown e16 [ -\! \stemDown dis16 ^4 \stemDown fis16 \stemDown cis16 ) ^3 ] \ottava #0 |
	\stemDown bis16 ( [ \stemDown dis16 \stemDown a16 \stemDown gis16 ^3 ] \stemDown fis16 [ _\> \stemDown a16 \stemDown e16 \stemDown dis16 ^4 ] \stemDown fis16 [ \stemDown cis16 \stemDown bis16 \stemDown dis16 ] \stemUp a16 [ \stemUp gis16 ^2 \stemUp b16 \stemUp a16 ) ~ ] -\! |
	\stemUp a16 ( [ \stemUp gis16 \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	\barNumberCheck #10 r16 \stemUp gis,16 ( [ \stemUp ais16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	\stemDown dis16 ( [ _\markup { \bold \italic { cresc . } } \stemDown e16 \stemDown dis16 \stemDown cisis16 ] \stemDown dis16 [ \stemDown b'16 \stemDown ais16 \stemDown gis16 ) ] \stemDown fisis16 ^1 [ \stemDown e'16 ( \stemDown dis16 \stemDown cis16 ] \stemDown b16 ^1 [ \stemDown ais16 ^4 \stemDown gis16 \stemDown fisis16 ) ] |
	\stemDown ais16 ( [ _\> _\markup { \bold \italic { dim . } } \stemDown gis16 \stemDown b16 \stemDown cisis,16 ) ] -\! \stemDown e16 ( [ _\> \stemDown dis16 \stemDown gis16 \stemDown ais,16 ) ] -\! \stemUp cis16 ( [ _\> \stemUp b16 \stemUp dis16 \stemUp fisis,16 ) ] -\! \stemUp ais16 ( ^4 [ _\> \stemUp gis16 \stemUp fisis16 \stemUp gis16 ) ] -\! |
	\stemDown gis16 ( ^> [ _\f \stemDown gis'16 \stemDown bis,16 \stemDown cis16 ) ] \stemDown fis,16 ( ^> [ \stemDown fis'16 \stemDown bis,16 \stemDown cis16 ) ] \stemDown eis,16 ( ^> [ \stemDown eis'16 \stemDown bis16 \stemDown cis16 ) ] \stemDown fis,16 ( ^> [ \stemDown fis'16 \stemDown bis,16 \stemDown cis16 ) ] |
	\stemUp cis,16 ( _> [ \stemUp cis'16 \stemUp fis,16 \stemUp a16 ) ] \stemUp dis,16 ( _> [ \stemUp dis'16 \stemUp fis,16 \stemUp a16 ) ] \stemUp e16 ( _> [ \stemUp e'16 \stemUp gis,16 \stemUp b16 ) ] \stemDown gis16 ( ^> [ \stemDown gis'16 \stemDown b,16 \stemDown e16 ) ] |
	\stemDown gis,16 ( ^> [ \stemDown gis'16 \stemDown bis,16 \stemDown cis16 ) ] \stemDown fis,16 ( ^> [ \stemDown fis'16 \stemDown bis,16 \stemDown cis16 ) ] \stemDown eis,16 ( ^> [ \stemDown eis'16 \stemDown bis16 \stemDown cis16 ) ] \stemDown fis,16 ( ^> [ \stemDown fis'16 \stemDown bis,16 \stemDown cis16 ) ] |
	\stemDown eis,16 ( [ \stemDown eis'16 \stemDown b16 \stemDown dis16 ) ] \stemDown fis,16 ( [ \stemDown fis'16 \stemDown b,16 \stemDown dis16 ) ] \stemDown a16 ( [ \stemDown a'16 \stemDown b,16 \stemDown e16 ) ] \stemDown gis,16 ( [ \stemDown gis'16 \stemDown b,16 \stemDown e16 ) ] |
	\stemDown gis,16 [ _\p \stemDown gis'16 ^> \stemDown bis,16 \stemDown cis16 ] \stemDown fis,16 [ \stemDown fis'16 ^> \stemDown bis,16 \stemDown cis16 ] \stemDown eis,16 [ \stemDown eis'16 ^> \stemDown bis16 \stemDown cis16 ] \stemDown fis,16 [ \stemDown fis'16 ^> \stemDown bis,16 \stemDown cis16 ] |
	\stemUp cis,16 [ \stemUp cis'16 _> \stemUp fis,16 \stemUp a16 ] \stemUp dis,16 [ \stemUp dis'16 _> \stemUp fis,16 \stemUp a16 ] \stemUp e16 [ \stemUp e'16 _> \stemUp gis,16 _\markup { \bold \italic { cresc . } } \stemUp b16 ] \stemDown gis16 [ \stemDown gis'16 ^> \stemDown b,16 \stemDown e16 ] |
	\stemDown gis,16 [ \stemDown gis'16 ^> \stemDown bis,16 \stemDown cis16 ] \stemDown fis,16 [ \stemDown fis'16 ^> \stemDown bis,16 \stemDown cis16 ] \stemDown dis16 [ \stemDown dis'16 ^> _\f \stemDown fis,16 _\> \stemDown a16 ] \stemDown cis,16 [ \stemDown cis'16 ^> \stemDown fis,16 \stemDown a16 ] -\! |
	\barNumberCheck #20 \stemDown cis,16 [ \stemDown cis'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown bis,16 [ \stemDown bis'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown bis,16 [ \stemDown bis'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown bis,16 [ \stemDown bis'16 ^> \stemDown dis,16 \stemDown fis16 ] |
	\stemDown c16 [ \stemDown c'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown b,16 [ \stemDown b'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown b,16 [ \stemDown b'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown ais,16 [ \stemDown ais'16 ^> \stemDown dis,16 \stemDown fis16 ] |
	\stemDown ais,16 [ \stemDown ais'16 \stemDown dis,16 \stemDown fis16 ] \stemDown a,16 [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ] \stemDown a,16 [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ] \stemDown a,16 [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ] |
	\stemDown c16 ( [ _\pp \stemDown c'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown b,16 ( [ \stemDown b'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown b,16 ( [ \stemDown b'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown ais,16 ( [ \stemDown ais'16 \stemDown dis,16 \stemDown fis16 ) ] |
	\stemDown ais,16 ( [ \stemDown ais'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown a,16 ( [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown a,16 ( [ _\markup { \bold \italic { riten . } } \stemDown a'16 \stemDown dis,16 \stemDown fis16 ) ^4 ] \stemDown gis,16 ( [ \stemDown gis'16 \stemDown dis16 \stemDown fis16 ) ] |
	r16 ^\markup { \bold \italic { a tempo } } \stemUp gis,16 ( [ \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemUp gis,16 ( [ \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemDown a,16 ( [ \stemDown cis16 \stemDown dis16 ] _\< \stemDown fis16 [ \stemDown a16 \stemDown cis16 \stemDown dis16 ] -\! _\> \ottava #1 \stemDown b'16 [ \stemDown a16 \stemDown gis16 -\! \stemDown fis16 ] \stemDown e16 [ \stemDown dis16 \stemDown fis16 \stemDown cis16 ) ] \ottava #0 |
	\stemDown bis16 ( [ \stemDown dis16 \stemDown a16 \stemDown gis16 ] \stemDown fis16 [ \stemDown a16 \stemDown e16 \stemDown dis16 ] \stemDown fis16 [ \stemDown cis16 \stemDown bis16 \stemDown dis16 ] \stemUp a16 [ \stemUp gis16 \stemUp b16 \stemUp a16 ) ~ ] |
	\stemUp a16 ( [ \stemUp gis16 \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 _\markup { \bold \italic { cresc . } } \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	\barNumberCheck #30 \stemDown e16 ( [ \stemDown dis16 \stemDown e16 \stemDown dis16 ] \stemDown cisis16 [ \stemDown dis16 \stemDown fis16 \stemDown a16 ) ] \stemDown fis16 ( [ \stemDown eis16 \stemDown fis16 \stemDown eis16 ] \stemDown disis16 [ \stemDown eis16 \stemDown gis16 \stemDown cis16 ) ] |
	r16 \stemDown cis,16 ( [ \stemDown d16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown fis16 \stemDown a16 ) ] \stemDown fis16 ( [ \stemDown eis16 \stemDown fis16 \stemDown eis16 ] \stemDown disis16 [ \stemDown eis16 \stemDown gis16 \stemDown cis16 ) ] |
	\stemDown gis16 ( [ _\markup { \bold \italic { sempre cresc . } } \stemDown fis16 \stemDown gis16 \stemDown fis16 ] \stemDown eis16 [ \stemDown fis16 \stemDown a16 ^3 \stemDown cis16 ) ] \stemDown a16 ( [ \stemDown gis16 \stemDown a16 \stemDown gis16 ] \stemDown fisis16 [ \stemDown gis16 \stemDown bis16 ^4 \stemDown dis16 ) ] |
	\stemDown gis,16 ( ^2 [ \stemDown a16 \stemDown gis16 \stemDown fisis16 ] \stemDown gis16 [ \stemDown e'16 ^> \stemDown dis16 \stemDown d16 ) ^1 ] \stemDown cis16 ( ^3 [ \stemDown c16 \stemDown b16 \stemDown ais16 ^4 ] \stemDown a16 [ \stemDown gis16 \stemDown g16 \stemDown fis16 ) ^3 ] |
	\stemDown e16 ( ^1 [ \stemDown fis16 ^4 \stemDown e16 \stemDown dis16 ] \stemDown e16 ^1 [ \stemDown e'16 ^> \stemDown dis16 \stemDown d16 ) ] \stemDown cis16 ( [ \stemDown c16 \stemDown b16 \stemDown ais16 ] \stemDown a16 [ \stemDown gis16 \stemDown g16 \stemDown fis16 ) ^2 ] |
	\stemDown gis16 r16 \stemDown gis'16 ( ^3 [ _\f \stemDown g16 ^1 ] \stemDown fis16 ^3 [ \stemDown eis16 \stemDown e16 \stemDown dis16 ^3 ] \stemDown d16 ^1 [ \stemDown cis16 ^3 \stemDown c16 \stemDown b16 ] \stemDown ais16 ^3 [ \stemDown a16 ^1 \stemDown gis16 ^3 \stemDown g16 ^1 ] |
	\stemDown fis16 ^3 [ \stemDown eis16 \stemDown e16 \stemDown dis16 ] \stemDown d16 [ \stemDown cis16 \stemDown c16 \stemDown b16 ] \stemUp ais16 [ \stemUp a16 \stemUp gis16 \stemUp g16 ] \stemUp fis16 [ \stemUp e16 \stemUp dis16 ^4 \stemUp cis16 ) ] |
	\stemUp gis8 r8 \ottava #1 \stemDown a'''16 ( [ \stemDown gis16 \stemDown e'16 \stemDown e,16 ) ] \stemDown fis16 ( [ \stemDown e16 \stemDown cis'16 \stemDown cis,16 ) ] \stemDown dis16 ( [ \stemDown cis16 \stemDown gis'16 \stemDown gis,16 ) ] \ottava #0 |
	\stemDown a16 ( [ \stemDown gis16 \stemDown e'16 \stemDown e,16 ) ] \stemDown fis16 ( [ \stemDown e16 \stemDown cis'16 \stemDown cis,16 ) ] \stemDown dis16 ( [ \stemDown cis16 \stemDown gis'16 \stemDown gis,16 ) ] \stemDown a16 ( [ \stemDown gis16 \stemDown e'16 \stemDown e,16 ) ] |
	\stemUp fis16 ( [ \stemUp e16 \stemUp cis'16 \stemUp cis,16 ) ] \stemUp dis16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp a'16 \stemUp a,16 ) ] |
	\barNumberCheck #40 \stemUp dis16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ _\markup { \bold \italic { riten . } } \stemUp cis16 \stemUp fisis16 \stemUp fisis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp bis16 \stemUp gis'16 \stemUp gis,16 ) ] \bar "||" \key des \major |
	R1*2 ^\markup { \bold \large { Largo } } \bar "||" |
	\tempo "Moderato  cantabile" 4 = 88 _\markup { \bold \italic { sotto voce } } |
	\stemUp as'2 ^2 ^1 \stemDown bes8 ( ^\trill [ \stemDown as8 _\< \stemDown des8 ^2 \stemDown es8 ) ] -\! |
	\stemDown f2 ( _\< \stemDown as2 ) -\! |
	\stemDown ges4 \stemDown f4 ^5 \stemDown es4 \stemDown f8. [ _\> \stemDown des16 ] -\! |
	\stemUp as2 \stemDown bes2 ~ ^> ^2 ^1 |
	\stemDown bes2 \stemDown ces8 ( ^\trill [ _\< -\! \stemDown bes8 \stemDown es8 ^2 \stemDown f8 ) ] |
	\stemDown ges4 ( \stemDown f4 ^5 \stemDown es4 \stemDown f4 ) |
	\stemDown des2 \grace {
		\stemUp c32 ( [ \stemUp des32 \stemUp es32 \stemUp des32 ] 
	}
	\stemDown f4. ) \stemDown es8 |
	\barNumberCheck #50 es1 ^> ^3 |
	\stemUp as,2 ^\markup { \bold \italic { a tempo } } \stemDown bes8 ( ^\trill [ _\< \stemDown as8 -\! \stemDown des8 \stemDown es8 ) ] |
	\stemDown f2 \stemDown as2 ^> |
	\stemDown ges4 \stemDown f4 \stemDown es4 \grace {
		\stemUp f16 [ \stemUp es16 \stemUp des16 \stemUp es16 ] 
	}
	\stemDown f8. [ \stemDown des16 ] |
	\stemUp as2 \stemDown bes2 ~ ^> |
	\stemDown bes2 \stemDown ces8 ( ^\trill [ _\< \stemDown bes8 -\! \stemDown es8 \stemDown f8 ) ] |
	\stemDown ges4 ( \stemDown f4 \stemDown es4 \stemDown f4 ) |
	\stemDown des4. \stemUp g,32 [ \stemUp as32 \stemUp bes32 \stemUp as32 ] \stemDown f'4. _\> \stemDown es8 -\! |
	\stemDown es2 ( \stemDown des4 ) r8 \stemDown as'8 ( |
	\stemUp as,2 ) _\sf \stemDown bes8. ( ^\trill [ _\< -\! \stemDown a16 \stemDown bes8. \stemDown c16 ] |
	\barNumberCheck #60 \stemUp as8 ) r8 \stemDown c'4 ~ _\sf \times 4/7 {
		\stemDown c8 ( [ _\f \stemDown bes8 \stemDown as8 \stemDown fes8 \stemDown des8 ^3 \stemDown bes8. ^2 \stemDown as'16 ) ( ] 
	}
	|
	\stemUp es,2 ) _> \acciaccatura {
		\stemUp c'8 ^3 
	}
	\stemDown bes8. ( [ \stemDown a16 _\< \stemDown bes8. \stemDown es16 ) ] -\! |
	\stemUp as,4 r4 \stemDown bes4 _\pp \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown des8 ( [ _\> \stemDown c8 \stemDown bes8 ) ] 
	}
	-\! |
	\stemUp as2 \stemDown bes8 ( ^\trill [ \stemDown as8 \stemDown des8 \stemDown es8 ) ] |
	\stemDown f2 \stemDown as2 ^> |
	\stemDown ges4 \stemDown f4 \stemDown es4 \grace {
		\stemUp f16 ( [ \stemUp es16 \stemUp des16 \stemUp es16 ] 
	}
	\stemDown f8 ) [ \stemDown des8 ] |
	\stemUp as2 \stemDown bes2 ~ _\sf |
	\stemDown bes2 \stemDown ces8 ( ^\trill [ \stemDown bes8 \stemDown es8 \stemDown f8 ) ] |
	\stemDown ges4 ( \stemDown f4 \stemDown es4 \stemDown f4 ) |
	\stemDown des4. \stemUp g,32 [ \stemUp as32 \stemUp bes32 \stemUp as32 ] _\> \stemDown f'4. ( \stemDown es8 ) -\! |
	\barNumberCheck #70 \stemDown es2 ( \stemDown des4 ) r8 \stemDown as'8 ( |
	\stemUp as,2 ) _\sf \stemDown bes8. ( ^\trill [ \stemDown a16 \stemDown bes8. \stemDown c16 ) ] |
	\stemUp as8 r8 _\f \stemDown c'4 ~ _\> \once \omit TupletBracket \times 4/7 {
		\stemDown c8 ( [ \stemDown bes8 \stemDown as8 -\! \stemDown fes8 \stemDown des8 \stemDown bes8. \stemDown as'16 ) ( ] 
	}
	|
	\stemUp es,2 ) _> \acciaccatura {
		\stemUp c'8 ( 
	}
	\stemDown bes8. ) ( [ \stemDown a16 \stemDown bes8. \stemDown es16 ) ] |
	\stemUp as,4 r4 \stemDown bes4 _\> \once \omit TupletBracket \times 2/3 {
		\stemDown des8 ( [ -\! \stemDown c8 \stemDown bes8 ) ] 
	}
	|
	\stemUp as2 _\< \stemDown bes8 ( ^\trill [ -\! \stemDown as8 \stemDown des8 \stemDown es8 ) ] |
	\stemDown f2 \stemDown as2 ^> |
	\stemDown ges4 \stemDown f4 \stemDown es4 \grace {
		\stemUp f16 [ \stemUp es16 \stemUp des16 \stemUp es16 ] 
	}
	\stemDown f8 [ \stemDown des8 ] |
	\stemUp as2 \stemDown bes2 ~ ^> |
	\stemDown bes2 \stemDown ces8 ( ^\trill [ _\< \stemDown bes8 -\! \stemDown es8 \stemDown f8 ) ] |
	\barNumberCheck #80 \stemDown ges4 ( _\> \stemDown f4 \stemDown es4 -\! \stemDown f4 ) |
	\stemDown des4. \stemUp g,32 ( [ \stemUp as32 \stemUp bes32 \stemUp as32 ) ] \stemDown f'4. \stemDown es8 |
	es1 _\markup { \bold \italic { riten . } } \bar "||" \key e \major |
	r16 ^\markup { \bold \large { Presto } } \stemUp gis,16 ( [ \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemUp gis,16 ( [ \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemDown a,16 ( [ \stemDown cis16 _\< \stemDown dis16 ] \stemDown fis16 [ \stemDown a16 \stemDown cis16 \stemDown dis16 ) ] \ottava #1 \stemDown b'16 ( [ _\> -\! \stemDown a16 \stemDown gis16 \stemDown fis16 ] \stemDown e16 [ \stemDown dis16 \stemDown fis16 \stemDown cis16 ) ] -\! \ottava #0 |
	\stemDown bis16 ( [ \stemDown dis16 \stemDown a16 \stemDown gis16 ] \stemDown fis16 [ _\> \stemDown a16 \stemDown e16 \stemDown dis16 ] \stemDown fis16 [ \stemDown cis16 \stemDown bis16 \stemDown dis16 ] \stemUp a16 [ \stemUp gis16 -\! \stemUp b16 \stemUp a16 ) ~ ] |
	\stemUp a16 ( [ \stemUp gis16 \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemUp gis,16 ( [ \stemUp ais16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ _\markup { \bold \italic { cresc . } } \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	\stemDown dis16 ( [ \stemDown e16 \stemDown dis16 \stemDown cisis16 ] \stemDown dis16 [ \stemDown b'16 \stemDown ais16 \stemDown gis16 ) ] \stemDown fisis16 [ \stemDown e'16 ( \stemDown dis16 \stemDown cis16 ] \stemDown b16 [ \stemDown ais16 \stemDown gis16 \stemDown fisis16 ) ] |
	\barNumberCheck #90 \stemDown ais16 ( [ _\> _\markup { \bold \italic { dim . } } \stemDown gis16 \stemDown b16 \stemDown cisis,16 ) ] -\! \stemDown e16 ( [ _\> \stemDown dis16 \stemDown gis16 \stemDown ais,16 ) ] -\! \stemUp cis16 ( [ _\> \stemUp b16 \stemUp dis16 \stemUp fisis,16 ) ] -\! \stemUp ais16 ( [ _\> \stemUp gis16 \stemUp fisis16 \stemUp gis16 ) ] -\! |
	\stemDown gis16 ( ^> [ _\f \stemDown gis'16 \stemDown bis,16 \stemDown cis16 ) ] \stemDown fis,16 ( ^> [ \stemDown fis'16 \stemDown bis,16 \stemDown cis16 ) ] \stemDown eis,16 ( ^> [ \stemDown eis'16 \stemDown bis16 \stemDown cis16 ) ] \stemDown fis,16 ( ^> [ \stemDown fis'16 \stemDown bis,16 \stemDown cis16 ) ] |
	\stemUp cis,16 ( _> [ \stemUp cis'16 \stemUp fis,16 \stemUp a16 ) ] \stemUp dis,16 ( _> [ \stemUp dis'16 \stemUp fis,16 \stemUp a16 ) ] \stemUp e16 ( _> [ \stemUp e'16 \stemUp gis,16 \stemUp b16 ) ] \stemDown gis16 ( ^> [ \stemDown gis'16 \stemDown b,16 \stemDown e16 ) ] |
	\stemDown gis,16 ( ^> [ \stemDown gis'16 \stemDown bis,16 \stemDown cis16 ) ] \stemDown fis,16 ( ^> [ \stemDown fis'16 \stemDown bis,16 \stemDown cis16 ) ] \stemDown eis,16 ( ^> [ \stemDown eis'16 \stemDown bis16 \stemDown cis16 ) ] \stemDown fis,16 ( ^> [ \stemDown fis'16 \stemDown bis,16 \stemDown cis16 ) ] |
	\stemDown eis,16 ( [ \stemDown eis'16 \stemDown b16 \stemDown dis16 ) ] \stemDown fis,16 ( [ \stemDown fis'16 \stemDown b,16 \stemDown dis16 ) ] \stemDown a16 ( [ \stemDown a'16 \stemDown b,16 \stemDown e16 ) ] \stemDown gis,16 ( [ \stemDown gis'16 \stemDown b,16 \stemDown e16 ) ] |
	\stemDown gis,16 [ _\p \stemDown gis'16 ^> \stemDown bis,16 \stemDown cis16 ] \stemDown fis,16 [ \stemDown fis'16 ^> \stemDown bis,16 \stemDown cis16 ] \stemDown eis,16 [ \stemDown eis'16 ^> \stemDown bis16 \stemDown cis16 ] \stemDown fis,16 [ \stemDown fis'16 ^> \stemDown bis,16 \stemDown cis16 ] |
	\stemUp cis,16 [ \stemUp cis'16 _> \stemUp fis,16 \stemUp a16 ] \stemUp dis,16 [ \stemUp dis'16 _> \stemUp fis,16 \stemUp a16 ] \stemUp e16 [ \stemUp e'16 _> \stemUp gis,16 \stemUp b16 ] \stemDown gis16 [ \stemDown gis'16 ^> \stemDown b,16 \stemDown e16 ] |
	\stemDown gis,16 [ \stemDown gis'16 ^> \stemDown bis,16 \stemDown cis16 ] \stemDown fis,16 [ \stemDown fis'16 ^> \stemDown bis,16 \stemDown cis16 ] \stemDown dis16 [ _\f \stemDown dis'16 ^> \stemDown fis,16 \stemDown a16 ] _\> \stemDown cis,16 [ \stemDown cis'16 ^> \stemDown fis,16 \stemDown a16 ] |
	\stemDown cis,16 [ -\! \stemDown cis'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown bis,16 [ \stemDown bis'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown bis,16 [ \stemDown bis'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown bis,16 [ \stemDown bis'16 ^> \stemDown dis,16 \stemDown fis16 ] |
	\stemDown c16 [ \stemDown c'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown b,16 [ \stemDown b'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown b,16 [ \stemDown b'16 ^> \stemDown dis,16 \stemDown fis16 ] \stemDown ais,16 [ \stemDown ais'16 ^> \stemDown dis,16 \stemDown fis16 ] |
	\barNumberCheck #100 \stemDown ais,16 [ \stemDown ais'16 \stemDown dis,16 \stemDown fis16 ] \stemDown a,16 [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ] \stemDown a,16 [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ] \stemDown a,16 [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ] |
	\stemDown c16 ( [ _\pp \stemDown c'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown b,16 ( [ \stemDown b'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown b,16 ( [ \stemDown b'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown ais,16 ( [ \stemDown ais'16 \stemDown dis,16 \stemDown fis16 ) ] |
	\stemDown ais,16 ( [ \stemDown ais'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown a,16 ( [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown a,16 ( [ \stemDown a'16 \stemDown dis,16 \stemDown fis16 ) ] \stemDown gis,16 ( [ \stemDown gis'16 \stemDown dis16 \stemDown fis16 ) ] |
	r16 ^\markup { \bold \italic { a tempo } } \stemUp gis,16 ( [ \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemUp gis,16 ( [ \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	r16 \stemDown a,16 ( [ \stemDown cis16 \stemDown dis16 ] _\< \stemDown fis16 [ \stemDown a16 \stemDown cis16 \stemDown dis16 ] \ottava #1 \stemDown b'16 [ -\! _\> \stemDown a16 \stemDown gis16 \stemDown fis16 ] -\! \stemDown e16 [ \stemDown dis16 \stemDown fis16 \stemDown cis16 ) ] \ottava #0 |
	\stemDown bis16 ( [ \stemDown dis16 \stemDown a16 \stemDown gis16 ] \stemDown fis16 [ \stemDown a16 \stemDown e16 \stemDown dis16 ] \stemDown fis16 [ \stemDown cis16 \stemDown bis16 \stemDown dis16 ] \stemUp a16 [ \stemUp gis16 \stemUp b16 \stemUp a16 ) ~ ] |
	\stemUp a16 ( [ \stemUp gis16 \stemUp a16 \stemUp gis16 ] \stemUp fisis16 [ \stemUp gis16 \stemUp cis16 \stemUp e16 ] \stemDown dis16 [ _\markup { \bold \italic { cresc . } } \stemDown cis16 \stemDown dis16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown e16 \stemDown gis16 ) ] |
	\stemDown e16 ( [ \stemDown dis16 \stemDown e16 \stemDown dis16 ] \stemDown cisis16 [ \stemDown dis16 \stemDown fis16 \stemDown a16 ) ] \stemDown fis16 ( [ \stemDown eis16 \stemDown fis16 \stemDown eis16 ] \stemDown disis16 [ \stemDown eis16 \stemDown gis16 \stemDown cis16 ) ] |
	r16 \stemDown cis,16 ( [ \stemDown d16 \stemDown cis16 ] \stemDown bis16 [ \stemDown cis16 \stemDown fis16 \stemDown a16 ) ] \stemDown fis16 ( [ \stemDown eis16 \stemDown fis16 \stemDown eis16 ] \stemDown disis16 [ \stemDown eis16 \stemDown gis16 \stemDown cis16 ) ] |
	\barNumberCheck #110 \stemDown gis16 ( [ _\markup { \bold \italic { sempre cresc . } } \stemDown fis16 \stemDown gis16 \stemDown fis16 ] \stemDown eis16 [ \stemDown fis16 \stemDown a16 \stemDown cis16 ) ] \stemDown a16 ( [ \stemDown gis16 \stemDown a16 \stemDown gis16 ] \stemDown fisis16 [ \stemDown gis16 \stemDown bis16 \stemDown dis16 ) ] |
	\stemDown gis,16 ( [ \stemDown a16 \stemDown gis16 \stemDown fisis16 ] \stemDown gis16 [ \stemDown e'16 ^> \stemDown dis16 \stemDown d16 ) ] \stemDown cis16 ( [ \stemDown c16 \stemDown b16 \stemDown ais16 ] \stemDown a16 [ \stemDown gis16 \stemDown g16 \stemDown fis16 ) ] |
	\stemDown e16 ( [ \stemDown fis16 \stemDown e16 \stemDown dis16 ] \stemDown e16 [ \stemDown e'16 ^> \stemDown dis16 \stemDown d16 ) ] \stemDown cis16 ( [ \stemDown c16 \stemDown b16 \stemDown ais16 ] \stemDown a16 [ \stemDown gis16 \stemDown g16 \stemDown fis16 ) ] |
	\stemDown gis16 r16 \stemDown gis'16 ( [ _\f \stemDown g16 ] \stemDown fis16 [ \stemDown eis16 \stemDown e16 \stemDown dis16 ] \stemDown d16 [ \stemDown cis16 \stemDown c16 \stemDown b16 ] \stemDown ais16 [ \stemDown a16 \stemDown gis16 \stemDown g16 ) ] |
	\stemDown fis16 ( [ \stemDown eis16 \stemDown e16 \stemDown dis16 ] \stemDown d16 [ \stemDown cis16 \stemDown c16 \stemDown b16 ] \stemUp ais16 [ \stemUp a16 \stemUp gis16 \stemUp g16 ] \stemUp fis16 [ \stemUp e16 \stemUp dis16 \stemUp cis16 ) ] |
	\stemUp gis8 _\ff r8 \ottava #1 \stemDown a'''16 ( [ \stemDown gis16 \stemDown e'16 \stemDown e,16 ) ] \stemDown fis16 ( [ \stemDown e16 \stemDown cis'16 \stemDown cis,16 ) ] \stemDown dis16 ( [ \stemDown cis16 \stemDown gis'16 \stemDown gis,16 ) ] \ottava #0 |
	\stemDown a16 ( [ \stemDown gis16 \stemDown e'16 \stemDown e,16 ) ] \stemDown fis16 ( [ \stemDown e16 \stemDown cis'16 \stemDown cis,16 ) ] \stemDown dis16 ( [ \stemDown cis16 \stemDown gis'16 \stemDown gis,16 ) ] \stemUp a16 ( [ \stemUp gis16 \stemUp e'16 \stemUp e,16 ) ] |
	\stemUp fis16 ( [ \stemUp e16 \stemUp cis'16 \stemUp cis,16 ) ] \stemUp dis16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp a'16 \stemUp a,16 ) ] |
	\stemUp dis16 [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ] \stemUp dis'16 [ \stemUp cis16 \stemUp fisis16 \stemUp fisis,16 ] \stemUp dis'16 [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ] \stemUp dis'16 [ \stemUp bis16 \stemUp gis'16 \stemUp gis,16 ] |
	\stemUp dis'16 [ _\markup { \bold \italic { sempre } } \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ] \stemUp a'16 ( [ \stemUp gis16 \stemUp e'16 _> \stemUp e,16 ) ] \stemUp a16 ( [ \stemUp gis16 \stemUp e'16 _> \stemUp e,16 ) ] \stemUp a16 ( [ \stemUp gis16 \stemUp dis'16 _> \stemUp dis,16 ) ] |
	\barNumberCheck #120 \stemUp a'16 ( [ \stemUp gis16 \stemUp dis'16 _> \stemUp dis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp cis16 _> \stemUp cis,16 ) ] \stemUp e16 ( [ _\p \stemUp dis16 \stemUp gis16 _> \stemUp gis,16 ) ] \stemUp e'16 ( [ \stemUp dis16 \stemUp gis16 _> \stemUp gis,16 ) ] |
	\stemUp dis'16 [ _\ff \stemUp cis16 \stemUp gis'16 _> \stemUp gis,16 ] \stemUp a'16 ( [ \stemUp gis16 \stemUp e'16 _> \stemUp e,16 ) ] \stemUp a16 ( [ \stemUp gis16 \stemUp e'16 _> \stemUp e,16 ) ] \stemUp a16 ( [ \stemUp gis16 \stemUp dis'16 _> \stemUp dis,16 ) ] |
	\stemUp a'16 ( [ \stemUp gis16 \stemUp dis'16 _> \stemUp dis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp cis16 _> \stemUp cis,16 ) ] \stemUp e16 ( [ _\p \stemUp dis16 \stemUp gis16 _> \stemUp gis,16 ) ] \stemUp e'16 ( [ \stemUp dis16 \stemUp gis16 _> \stemUp gis,16 ) ] |
	\stemUp dis'16 ( [ _\ff \stemUp cis16 \stemUp gis'16 _> \stemUp gis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp e'16 _> \stemUp e,16 ) ] \stemUp fis16 ( [ \stemUp e16 \stemUp cis'16 _> \stemUp cis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp e'16 _> \stemUp e,16 ) ] |
	\stemUp dis16 ( [ \stemUp cis16 \stemUp gis'16 _> \stemUp gis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp e'16 _> \stemUp e,16 ) ] \stemUp fis16 ( [ \stemUp e16 \stemUp cis'16 _> \stemUp cis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp e'16 _> \stemUp e,16 ) ] |
	\stemUp fis16 ( [ _\markup { \bold \italic { poco } } \stemUp e16 \stemUp cis'16 \stemUp cis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp cis16 \stemUp cis,16 ) ] _\markup { \bold \italic { a } } \stemUp fis16 ( [ \stemUp e16 \stemUp cis'16 \stemUp cis,16 ) ] \stemUp a'16 ( [ _\markup { \bold \italic { poco } } \stemUp gis16 \stemUp cis16 \stemUp cis,16 ) ] |
	\stemUp fis16 ( [ _\markup { \bold \italic { diminuendo } } \stemUp e16 \stemUp cis'16 \stemUp cis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp cis16 \stemUp cis,16 ) ] \stemUp fis16 ( [ \stemUp e16 \stemUp cis'16 \stemUp cis,16 ) ] \stemUp a'16 ( [ \stemUp gis16 \stemUp cis16 \stemUp cis,16 ) ] |
	\stemUp dis16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ _\p \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] |
	\stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] |
	\stemUp dis'16 ( [ _\pp \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 _\markup { \bold \italic { il canto marcato } } \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] |
	\barNumberCheck #130 \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] |
	\stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] |
	\stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] |
	\stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] |
	\stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp gis,16 ) ] |
	\stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp eis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp eis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp eis,16 ) ] \stemUp dis'16 ( [ \stemUp cis16 \stemUp gis'16 \stemUp eis,16 ) ] |
	\stemUp eis'16 ( [ \stemUp dis16 \stemUp gis16 \stemUp fis,16 ) \stemUp eis'16 ( \stemUp dis16 \stemUp gis16 \stemUp fis,16 ) ] \stemUp eis'16 ( [ \stemUp dis16 \stemUp gis16 \stemUp fis,16 ) \stemUp eis'16 ( \stemUp dis16 \stemUp gis16 \stemUp fis,16 ) ] |
	dis'1 \arpeggio _\ppp |
	cis1 \arpeggio \bar "|." 
}


PartPOneVoiceTwo = \relative gis, {
	\clef "bass" \key e \major \time 2/2 <gis gis'>1 ~ ~ \sustainOn ^\sf <gis gis'>1 |
	\once \omit TupletBracket \times 4/6 {
		\stemUp <cis, cis'>8 ( [ \sustainOff \sustainOn \stemUp gis''8 _3 \stemUp cis8 \stemUp e8 \stemUp cis8 \stemUp gis8 ) ] 
	}
	\once \omit TupletBracket \times 4/6 {
		\stemDown cis,8 ( [ \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	|
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ ^\p \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) _4 ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) _3 ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown a'8 \stemDown cis8 \stemDown fis8 \stemDown cis8 \stemDown a8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown fis8 ( [ \stemDown cis'8 \stemDown dis8 \stemDown a'8 \stemDown dis,8 \stemDown cis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) _4 ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis8 ( [ \sustainOn \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff |
	\barNumberCheck #10 \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \sustainOn \stemDown gis'8 \stemDown ais8 \stemDown e'8 \stemDown ais,8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \sustainOn \stemDown gis8 \stemDown ais8 \stemDown cis8 \stemDown ais8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown gis8 \stemDown b8 \stemDown dis8 \stemDown b8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown ais'8 \stemDown cis8 \stemDown fisis8 \stemDown cis8 \stemDown ais8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown gis8 \stemDown b8 \stemDown gis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown gis8 \stemDown b8 \stemDown gis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown b8 ( [ \sustainOn \stemDown fis'8 \stemDown a8 \stemDown b8 \stemDown a8 \stemDown fis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp e,8 ( [ \sustainOn \stemUp b'8 \stemUp e8 \stemUp gis8 _2 \stemUp e8 _3 \stemUp b8 ) ] 
	}
	|
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOff \sustainOn \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown b8 ( [ \sustainOn \stemDown dis8 \stemDown a'8 \stemDown b8 \stemDown a8 \stemDown dis,8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp e,8 ( [ \sustainOn \stemUp b'8 \stemUp e8 \stemUp gis8 \stemUp e8 \stemUp b8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown b8 ( [ \sustainOff \sustainOn \stemDown fis'8 \stemDown a8 \stemDown b8 \stemDown a8 \stemDown fis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp e,8 ( [ \sustainOn \stemUp b'8 \stemUp e8 \stemUp gis8 \stemUp e8 \stemUp b8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff |
	\barNumberCheck #20 \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	|
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOff \sustainOn \stemDown dis8 \stemDown fis8 \stemDown b8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ais8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown ais8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bis8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bis8 ( [ \stemDown dis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown b8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ais8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown ais8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown b8 ( [ \sustainOff \sustainOn \stemDown dis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \sustainOff \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bis8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown gis8 \stemDown fis8 \stemDown dis8 ) _4 ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis8 ( [ \sustainOn ^\p \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOff \sustainOn \stemDown a'8 \stemDown cis8 \stemDown fis8 \stemDown cis8 \stemDown a8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown fis8 ( [ \stemDown cis'8 \stemDown dis8 \stemDown a'8 \stemDown dis,8 \stemDown cis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis8 ( [ \sustainOn \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \sustainOn \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) _4 ] 
	}
	|
	\barNumberCheck #30 \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown fis8 ( [ \sustainOff \sustainOn \stemDown cis'8 \stemDown dis8 \stemDown a'8 \stemDown dis,8 \stemDown cis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp gis8 ( [ \sustainOn \stemUp cis8 \clef "treble" \stemUp eis8 \stemUp b'8 \stemUp eis,8 \stemUp cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp a8 ( [ \sustainOff \stemUp cis8 \stemUp fis8 \stemUp a8 \stemUp fis8 \stemUp cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp gis8 ( [ \stemUp cis8 \stemUp eis8 \stemUp b'8 \stemUp eis,8 \stemUp cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp a8 ( [ \sustainOn \stemUp cis8 \stemUp fis8 \stemUp a8 \stemUp fis8 \stemUp cis8 ) ] 
	}
	\sustainOff \clef "bass" \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bis,8 ( [ \sustainOn \stemDown fis'8 \stemDown gis8 \stemDown dis'8 \stemDown gis,8 \stemDown fis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis8 ( [ \sustainOn \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown gis8 \stemDown bis8 \stemDown fis'8 \stemDown bis,8 \stemDown gis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \sustainOn \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown fis8 ( [ \sustainOn \stemDown cis'8 \stemDown dis8 \stemDown a'8 \stemDown dis,8 \stemDown cis8 ) ] 
	}
	\sustainOff \stemDown <gis cis e gis>8 r8 r4 \stemDown <fisis cis' e a>4 \sustainOn r4 \sustainOff R1 \stemUp <gis,, gis'>8 \sustainOn ^\ff r8 \clef "treble" \stemUp <e''' e'>4 \stemUp <cis cis'>4 \stemUp <gis gis'>4 |
	\clef "bass" \stemDown <e e'>4 \stemDown <cis cis'>4 \stemUp <gis gis'>4 \stemUp <e e'>4 |
	\stemUp <cis cis'>4 \sustainOff \sustainOn \stemUp <gis gis'>4 \stemUp <gis gis'>4 \sustainOff \stemUp <a a'>4 \sustainOn \stemUp <gis gis'>4 \sustainOff \sustainOn \stemUp <fisis fisis'>4 \sustainOff \sustainOn \stemUp <gis gis'>2 \sustainOff \sustainOn \bar "||" \key des \major \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des'8 ( [ \sustainOff \sustainOn ^\markup { \bold \italic { pesante } } \stemDown as'8 _3 ^\< \stemDown des8 _2 \stemDown f8 \stemDown as8 _4 \stemDown des8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown f8 ( [ -\! \stemDown des8 ^\> \stemDown as8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ -\! \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown as8 \stemDown des8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown f8 ( [ \stemDown des8 \stemDown as8 \stemDown f8 \stemDown des8 \stemDown as8 ) ~ ] 
	}
	\bar "||" \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown <des, as'>8 [ \sustainOff \sustainOn \stemDown as''8 ( ^1 \stemDown c8 ^2 \stemDown es8 \stemDown c8 \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \sustainOff \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown f'8 \stemDown as8 \stemDown f8 \stemDown as,8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown ges'8 ( [ \sustainOn \stemDown es8 \stemDown as,8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown f'8 ( [ \sustainOff \sustainOn \stemDown des8 _3 \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown es'8 ( ^> [ \sustainOff \sustainOn \stemDown c8 \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown des8 ( _1 [ \sustainOff \sustainOn \stemDown as8 _2 \stemDown f8 ) _3 ] 
	}
	|
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOff \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \sustainOff \stemDown es8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ges,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes8 _2 \stemDown des8 \stemDown bes8 \stemDown ges8 ) _3 ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bes,8 ( [ \sustainOn \stemDown f'8 _3 \stemDown bes8 \stemDown d8 \stemDown bes8 \sustainOff \stemDown f8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bes,8 ( [ \sustainOn \stemDown bes'8 \stemDown d8 _2 \stemDown as'8 \stemDown d,8 \stemDown bes8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown es,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes,8 ) _2 ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown f8 ( [ \sustainOn \sustainOff \stemDown f'8 \stemDown a,8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown ges8 ( _4 [ \sustainOff \sustainOn \stemDown es'8 \stemDown bes8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown as8 ( [ \sustainOff \sustainOn \stemDown ges'8 \stemDown c,8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown es8 ( [ \sustainOn \stemDown g8 \stemDown des'8 \stemDown es8 \stemDown des8 \stemDown g,8 ) ] 
	}
	\sustainOff |
	\barNumberCheck #50 \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 ^\markup { \bold \italic { rit . } } \stemDown ges8 \stemDown bes8 ^> \stemDown ges8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \stemDown as8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \sustainOff \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown f'8 \stemDown as8 ^> \stemDown f8 \stemDown as,8 ) ] 
	}
	|
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown ges'8 ( ^> [ \sustainOff \sustainOn \stemDown es8 \stemDown as,8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown f'8 ( ^> [ \sustainOn \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown es'8 ( ^> [ \sustainOn \stemDown c8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown des8 ( ^> [ \sustainOn \stemDown as8 \stemDown f8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ges,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes8 \stemDown des8 \stemDown bes8 \stemDown ges8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bes,8 ( [ \sustainOn \stemDown f'8 \stemDown bes8 \stemDown d8 \stemDown bes8 \sustainOff \stemDown f8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bes,8 ( [ \sustainOn \stemDown bes'8 \stemDown d8 \stemDown as'8 \stemDown d,8 \stemDown bes8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown es,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes,8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown f8 ( [ \sustainOff \sustainOn \stemDown f'8 \stemDown a,8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown ges8 ( [ \sustainOff \sustainOn \stemDown es'8 \stemDown bes8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown as8 ( [ \sustainOff \sustainOn \stemDown ges'8 \stemDown c,8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOff \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \stemDown as8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \sustainOff \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \sustainOff \stemDown es8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown g8 \stemDown des'8 \stemDown g,8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) _4 ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown fes8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown es,8 ( [ \sustainOn \stemDown es'8 _1 \stemDown as8 _2 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown es,8 ( [ \sustainOn \stemDown es'8 \stemDown g8 _2 \stemDown des'8 \stemDown g,8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ges,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes8 \stemDown des8 \stemDown bes8 \stemDown ges8 ) ] 
	}
	|
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOff \sustainOn \stemDown as'8 \stemDown c8 \stemDown es8 \stemDown c8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown es8 ( [ \sustainOn \stemDown as8 \stemDown c8 \stemDown ges'8 ^\< \stemDown c,8 \stemDown as8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ -\! \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown f'8 \stemDown as8 ^> \stemDown f8 \stemDown as,8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown ges'8 ( ^> [ \sustainOn \stemDown es8 \stemDown as,8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown f'8 ( ^> [ \sustainOn \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown es'8 ( ^> [ \sustainOn \stemDown c8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown des8 ( ^> [ \sustainOn ^\> \stemDown as8 \stemDown f8 ) ] 
	}
	\sustainOff -\! \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ges,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes8 \stemDown des8 \stemDown bes8 \stemDown ges8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bes,8 ( [ \sustainOn \stemDown f'8 \stemDown bes8 \stemDown d8 ^\< \stemDown bes8 \stemDown f8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bes,8 ( [ \sustainOn \stemDown bes'8 -\! \stemDown d8 \stemDown as'8 \stemDown d,8 \stemDown bes8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown es,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes,8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown f8 ( [ \sustainOff \sustainOn \stemDown f'8 \stemDown a,8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown ges8 ( [ \sustainOff \sustainOn \stemDown es'8 \stemDown bes8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown as8 ( [ \sustainOff \sustainOn \stemDown ges'8 \stemDown c,8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOff \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \stemDown as8 ) ] 
	}
	\sustainOff |
	\barNumberCheck #70 \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown g8 \stemDown des'8 \stemDown g,8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown fes8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown es,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \sustainOff \stemDown es8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown es,8 ( [ \sustainOn \stemDown es'8 \stemDown g8 \stemDown des'8 \stemDown g,8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ges,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes8 \stemDown des8 \stemDown bes8 \stemDown ges8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \sustainOff \stemDown es8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \stemDown as8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \sustainOff \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown f'8 \stemDown as8 ^> \stemDown f8 \stemDown as,8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown ges'8 ( ^> [ \sustainOn \stemDown es8 \stemDown as,8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown f'8 ( ^> [ \sustainOn \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown es'8 ( ^> [ \sustainOn \stemDown c8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown des8 ( ^> [ \sustainOn \stemDown as8 \stemDown f8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown as,8 ( [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown c8 \stemDown as8 \stemDown es8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ges,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes8 \stemDown des8 \stemDown bes8 \stemDown ges8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bes,8 ( [ \sustainOn \stemDown f'8 \stemDown bes8 \stemDown d8 \stemDown bes8 \stemDown f8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bes,8 ( [ \sustainOn \stemDown bes'8 \stemDown d8 \stemDown as'8 \stemDown d,8 \stemDown bes8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown es,8 ( [ \sustainOn \stemDown ges'8 \stemDown bes,8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown f8 ( [ \sustainOn \stemDown f'8 \stemDown a,8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown ges8 ( [ \sustainOn \stemDown es'8 \stemDown bes8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 2/3 {
		\stemDown as8 ( [ \sustainOn \stemDown ges'8 \stemDown c,8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown des8 \stemDown f8 \stemDown des8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \stemDown as8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \sustainOn \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \stemDown as8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown des,8 ( [ \stemDown as'8 \stemDown c8 \stemDown ges'8 \stemDown c,8 \stemDown as8 ) ] 
	}
	\sustainOff \bar "||" \key e \major \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \sustainOn \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \sustainOn \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown a'8 \stemDown cis8 \stemDown fis8 \stemDown cis8 \stemDown a8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown fis8 ( [ \stemDown cis'8 \stemDown dis8 \stemDown a'8 \stemDown dis,8 \stemDown cis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis8 ( [ \sustainOn \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \sustainOn \stemDown gis'8 \stemDown ais8 \stemDown e'8 \stemDown ais,8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \sustainOn \stemDown gis8 \stemDown ais8 \stemDown cis8 \stemDown ais8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown gis8 \stemDown b8 \stemDown dis8 \stemDown b8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown ais'8 \stemDown cis8 \stemDown fisis8 \stemDown cis8 \stemDown ais8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown gis8 \stemDown b8 \stemDown gis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown gis8 \stemDown b8 \stemDown gis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown b8 ( [ \sustainOn \stemDown fis'8 \stemDown a8 \stemDown b8 \stemDown a8 \stemDown fis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp e,8 ( [ \sustainOn \stemUp b'8 \stemUp e8 \stemUp gis8 \stemUp e8 \stemUp b8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown b8 ( [ \sustainOn \stemDown dis8 \stemDown a'8 \stemDown b8 \stemDown a8 \stemDown dis,8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp e,8 ( [ \sustainOn \stemUp b'8 \stemUp e8 \stemUp gis8 \stemUp e8 \stemUp b8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown b8 ( [ \sustainOn \stemDown fis'8 \stemDown a8 \stemDown b8 \stemDown a8 \stemDown fis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp e,8 ( [ \sustainOn ^\markup { \bold \italic { cresc . } } \stemUp b'8 \stemUp e8 \stemUp gis8 \stemUp e8 \stemUp b8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOff \sustainOn \stemDown cis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown cis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown b8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ais8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown ais8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff |
	\barNumberCheck #100 \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bis8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bis8 ( [ \stemDown dis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown a8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown b8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown ais8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown ais8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown b8 ( [ \sustainOn \stemDown dis8 \stemDown fis8 \stemDown a8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff ^\markup { \bold \italic { riten . } } \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bis8 ( [ \stemDown dis8 \sustainOn \stemDown fis8 \stemDown gis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis8 ( [ \sustainOff \sustainOn ^\p \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis,8 ( [ \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown a'8 \stemDown cis8 \stemDown fis8 \stemDown cis8 \stemDown a8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown fis8 ( [ \stemDown cis'8 \stemDown dis8 \stemDown a'8 \stemDown dis,8 \stemDown cis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \sustainOn \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown gis,8 ( [ \stemDown dis'8 \stemDown fis8 \stemDown bis8 \stemDown fis8 \stemDown dis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis8 ( [ \sustainOn \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \sustainOn \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown fis8 ( [ \sustainOn \stemDown cis'8 \stemDown dis8 \stemDown a'8 \stemDown dis,8 \stemDown cis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp gis8 ( [ \sustainOn \stemUp cis8 \clef "treble" \stemUp eis8 \stemUp b'8 \stemUp eis,8 \stemUp cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp a8 ( [ \sustainOff \stemUp cis8 \stemUp fis8 \stemUp a8 \stemUp fis8 \stemUp cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp gis8 ( [ \stemUp cis8 \stemUp eis8 \stemUp b'8 \stemUp eis,8 \stemUp cis8 ) ] 
	}
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemUp a8 ( [ \sustainOn \stemUp cis8 \stemUp fis8 \stemUp a8 \stemUp fis8 \stemUp cis8 ) ] 
	}
	\sustainOff \clef "bass" \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown bis,8 ( [ \sustainOn \stemDown fis'8 \stemDown gis8 \stemDown dis'8 \stemDown gis,8 \stemDown fis8 ) ] 
	}
	\sustainOff |
	\once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown cis8 ( [ \sustainOn \stemDown gis'8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown dis8 ( [ \sustainOn \stemDown gis8 \stemDown bis8 \stemDown fis'8 \stemDown bis,8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown e8 ( [ \sustainOn \stemDown gis8 \stemDown cis8 \stemDown e8 \stemDown cis8 \stemDown gis8 ) ] 
	}
	\sustainOff \once \omit TupletBracket \once \omit TupletNumber \times 4/6 {
		\stemDown fis8 ( [ \sustainOn \stemDown cis'8 \stemDown dis8 \stemDown a'8 \stemDown dis,8 \stemDown cis8 ) ] 
	}
	\sustainOff \stemDown <gis cis e gis>8 r8 r4 \stemDown <fisis cis' e a>4 \sustainOn r4 \sustainOff R1 \stemDown <gis,, gis'>8 r8 \clef "treble" \stemUp <e''' e'>4 \sustainOn \stemUp <cis cis'>4 \stemUp <gis gis'>4 |
	\clef "bass" \stemDown <e e'>4 \stemDown <cis cis'>4 \stemUp <gis gis'>4 \stemUp <e e'>4 |
	\stemUp <cis cis'>4 \sustainOff \sustainOn \stemUp <gis gis'>4 \stemUp <gis gis'>4 \stemUp <a a'>4 \sustainOff \sustainOn \stemUp <gis gis'>4 \sustainOff \stemUp <fisis fisis'>4 \stemUp <gis gis'>2 \stemUp cis8 ( [ \sustainOn \stemUp e'8 ^\ff \stemUp cis8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp fis'8 \stemUp bis,8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp fis'8 \stemUp bis,8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp fis'8 \stemUp bis,8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp fis'8 \stemUp bis,8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \stemUp cis,8 ( [ \stemUp gis''8 \stemUp cis,8 \stemUp gis8 ) ] \sustainOff |
	\stemUp cis,8 ( [ \sustainOn \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \stemUp cis,8 ( [ \stemUp gis''8 \stemUp cis,8 \stemUp gis8 ) ] \sustainOff \stemUp cis,8 ( [ \sustainOn \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \stemUp cis,8 ( [ \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \stemUp cis,8 ( [ \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \stemUp cis,8 ( [ \stemUp e'8 \stemUp cis8 \stemUp gis8 ) ] \stemUp cis,4 \sustainOff r4 r2 R1 <cis gis'>1 ^> ^1 \sustainOn \stemUp ais'4 ( _2 \sustainOff \stemUp gis4 _\< \stemUp cis4 \stemDown dis4 ) _2 -\! eis1 |
	gis1 ^> _2 \sustainOn \stemDown fis2 ( \sustainOff \stemDown eis2 ) _1 \stemDown dis2 \stemDown eis4 ( \stemUp cis4 ) |
	gis1 \sustainOn <gis, gis'>1 \sustainOff \sustainOn ^\markup { \bold \italic { riten . } } <cis gis' fis' gis bis>1 ( \sustainOff \sustainOn |
	<cis gis' eis' gis>1 ) \sustainOff \sustainOn \bar "|." 
}


\score {
	<<
		\new PianoStaff <<
			\set PianoStaff.instrumentName = "4b." 
			\context Staff = "1" <<
				\mergeDifferentlyDottedOn 
				\mergeDifferentlyHeadedOn 
				\context Voice = "PartPOneVoiceOne" {
					\PartPOneVoiceOne 
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
		\tempo 4 = 40 
	}
	
}
