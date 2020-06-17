\version "2.20.0" 

\header {
	encodingsoftware = "Sibelius 8.2" 
	encodingdate = "2016-11-14" 
	composer = \markup \column { \line { " 王蓝茵 词曲" } \line { "  Angle_WL 改编" } } 
	copyright = "版权 © " 
	title = "如果的事" 
}


#(set-global-staff-size 20) 

\paper {
	paper-width = 21\cm 
	paper-height = 29.7\cm 
	top-margin = 1.27\cm 
	bottom-margin = 1.27\cm 
	left-margin = 1.27\cm 
	right-margin = 1.27\cm 
	between-system-space = 2.63\cm 
	page-top-space = 0.94\cm 
	indent = 1.61538461538\cm 
	short-indent = 1.29230769231\cm 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative b {
	\clef "treble" \key d \major \numericTimeSignature \time 4/4 |
	\tempo 4 = 120 |
	\stemUp b4. \stemUp b8 \stemUp cis4. \stemUp b16 [ \stemUp cis16 ] |
	\stemUp d4. \stemUp d8 \stemUp fis8 [ \stemUp e8 \stemUp d8 \stemUp cis8 ] |
	\stemUp b4. \stemUp b8 \stemUp cis4. \stemUp cis8 |
	\stemUp d4. \stemUp <fis a>8 ~ ~ \stemUp <fis a>8 [ \stemUp a8 \stemUp b8 \stemUp a8 ] |
	\stemUp <g b>8 [ \stemUp d8 \stemUp g8 \stemUp b8 ] \stemUp <a cis>8 [ \stemUp e8 ] \stemDown a8 [ \stemDown b16 \stemDown cis16 ] |
	\stemDown d4. \stemUp a8 \stemDown fis'8 [ \stemDown e8 \stemDown d8 \stemDown cis8 ] |
	\stemUp <g b>8 \arpeggio [ \arpeggio \stemUp d8 \stemUp g8 \stemUp b8 ] \stemUp <a cis>8 \arpeggio [ \arpeggio \stemUp e8 \stemUp a8 \stemUp cis8 ] |
	\stemUp <fis, a d>2. \arpeggio \arpeggio \arpeggio r8 \stemUp a8 |
	\stemDown <a d>4 \stemDown cis8 [ \stemDown d8 ~ ] \stemDown d8 \stemDown cis4 \stemUp a8 ~ |
	\barNumberCheck #10 \stemUp a4. \stemUp fis8 \stemUp fis8 [ \stemUp g8 \stemUp a8 \stemUp a8 ~ ] |
	a1 |
	r2 r4 r8 \stemUp a8 |
	\stemDown <a d>4 \stemDown cis8 [ \stemDown d8 ~ ] \stemDown d8 \stemDown e4 \stemDown <a, fis'>8 ~ ~ |
	\stemDown <a fis'>8 \stemUp a4 \stemUp a8 \stemDown a'8 [ \stemDown g8 \stemDown g8 \stemDown fis8 ~ ] |
	\stemDown fis2 r2 |
	r4 r8 \stemUp a,8 \stemDown fis'8 [ \stemDown e8 \stemDown d8 \stemDown e8 ~ ] |
	\stemDown e8 [ \stemDown a,8 \stemDown a8 \stemDown a8 ] \stemUp a8 [ \stemUp fis8 ] \stemDown b4 ~ |
	\stemDown b4. \stemDown b8 \stemDown <a d fis>8 [ \stemDown e'8 \stemDown d8 \stemDown e8 ~ ] |
	\stemDown e8 [ \stemDown e8 \stemDown e8 \stemDown e8 ] \stemDown e8 [ \stemDown d8 ] \stemDown fis4 ~ |
	\barNumberCheck #20 \stemDown fis4. \stemDown <a, a'>8 ~ ~ \stemDown <a a'>8 \stemDown <a fis'>4 \stemDown e'8 ~ |
	\stemDown e8 \stemDown d4. ~ \stemDown d8 \stemDown <b d>4 \stemDown d8 |
	\stemDown <a d>8 \stemUp a4 \stemDown <a d>8 ~ ~ \stemDown <a d>8 \stemDown <a d>4 \stemDown d8 |
	\stemDown <b fis'>4 \stemDown <b g'>4 \stemDown <b e>2 |
	r2 \stemUp e,8 [ \stemUp a8 \stemUp e8 \stemUp <cis a'>8 ] |
	\stemDown <a' d>4 \stemDown cis8 [ \stemDown d8 ~ ] \stemDown d8 \stemDown cis4 \stemUp a8 ~ |
	\stemUp a4. \stemUp fis8 \stemUp fis8 [ \stemUp g8 \stemUp a8 \stemUp a8 ~ ] |
	\stemUp a2 r8 \stemUp cis,4 \stemUp d8 ~ |
	\stemUp d4 \stemUp d8 [ \stemUp e8 ~ ] \stemUp e8 \stemUp a4 \stemUp a8 |
	\stemDown <a d>4 \stemDown cis8 [ \stemDown d8 ~ ] \stemDown d8 \stemDown e4 \stemDown <a, fis'>8 ~ ~ |
	\barNumberCheck #30 \stemDown <a fis'>8 \stemUp a4 \stemUp a8 \stemDown a'8 [ \stemDown g8 \stemDown g8 \stemDown fis8 ~ ] |
	\stemDown fis2 r8 \stemDown cis4 \stemDown d8 ~ |
	\stemDown d8 \stemUp a4 \stemUp a8 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown <a e'>8 ~ ] ~ |
	\stemUp <a e'>8 [ \stemUp a8 \stemUp a8 \stemUp a8 ] \stemUp a8 [ \stemUp fis8 ] \stemDown b4 ~ |
	\stemDown b4. \stemDown b8 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown e8 ~ ] |
	\stemDown e8 [ \stemDown e8 \stemDown e8 \stemDown e8 ] \stemDown e8 [ \stemDown d8 ] \stemDown fis4 ~ |
	\stemDown fis8 \stemDown <fis a>4. \stemDown <fis d'>4. \stemDown <d fis>8 ~ ~ |
	\stemDown <d fis>8 [ \stemDown e8 ] \stemDown d4 ~ \stemDown d4. \stemDown d8 |
	\stemDown <a d>8 \stemDown <d a'>4 \stemDown <d a'>8 ~ ~ \stemDown <d a'>8 \stemDown cis4 \stemDown d8 |
	\stemDown d8 [ \stemDown <d b'>8 ] \stemDown <d a'>2. |
	\barNumberCheck #40 \stemUp <e, a cis>4 \arpeggio \arpeggio \arpeggio r8 \stemUp a8 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown d8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 [ \stemDown a'8 \stemDown <a, d>8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 \stemDown d8 \stemDown d8 ] \stemDown <e cis'>4 \stemDown <d d'>4 |
	\stemDown <d a'>2 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown cis8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 [ \stemDown a'8 \stemDown d,8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 \stemDown d8 \stemDown d8 ] \stemDown fis8 [ \stemDown e8 \stemDown d8 \stemDown d8 ~ ] |
	\stemDown d4. \stemUp a8 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown d8 [ \stemDown cis8 ] |
	\barNumberCheck #50 \stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 [ \stemDown a'8 \stemDown <a, d>8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 \stemDown d8 \stemDown d8 ] \stemDown <e cis'>4 \stemDown <d d'>4 |
	\stemDown <d a'>2 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown cis8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 ( [ \stemDown a'8 ) \stemDown d,8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 \stemDown <b d>8 \stemDown <b d>8 ] \stemDown <a fis'>8 [ \stemDown e'8 \stemDown <a, d>8 \stemDown d8 ~ ] |
	\stemDown d2 \ottava #1 \stemDown <e' fis a d>2 \arpeggio \arpeggio \arpeggio \arpeggio \ottava #0 |
	\stemDown <fis, a>2 \stemDown <fis d'>8 [ \stemDown cis'8 \stemDown b8 \stemDown <fis a>8 ] |
	\stemDown <fis a>4. \stemDown fis8 \stemDown fis8 [ \stemDown g8 \stemDown a8 \stemDown a8 ~ ] |
	\stemDown a4. \stemDown a16 [ \stemDown g16 ] \stemDown fis4. \stemDown e8 |
	\barNumberCheck #60 <d fis>1 |
	\stemDown <b d>8 [ \stemDown cis8 \stemDown d8 \stemDown <d a'>8 ~ ] ~ \stemDown <d a'>8 [ \stemDown cis8 \stemDown d8 \stemDown <d a'>8 ] |
	\stemDown d8 \stemDown b'4 \stemDown a8 ~ \stemDown a4. \stemDown g8 |
	\stemDown fis4. \stemDown g8 \stemDown e4. \startTrillSpan \stemDown d16 \stopTrillSpan [ \stemDown e16 ] |
	<fis, a d>1 |
	\stemUp a8 [ \stemUp e8 \stemUp a8 \stemUp fis8 ~ ] \stemUp fis8 [ \stemUp e8 ] \stemUp e4 |
	\stemUp e8 \stemUp d4 \stemUp d8 \stemUp e4 \stemUp d8 [ \stemUp a'8 ] |
	\stemDown <a d>4 \stemDown cis8 [ \stemDown d8 ~ ] \stemDown d8 \stemDown cis4 \stemUp a8 ~ |
	\stemUp a4. \stemUp fis8 \stemUp fis8 [ \stemUp g8 \stemUp a8 \stemUp a8 ~ ] |
	\stemUp a8 \stemDown <a d>4 \stemUp a8 ~ \stemUp a8 \stemUp a4 \stemDown <a e'>8 ~ ~ |
	\barNumberCheck #70 \stemDown <a e'>8 \stemDown <a e'>4 \stemDown fis'16 [ \stemDown e16 ] \stemDown d4. \stemUp a8 |
	\stemDown <a d>4 \stemDown cis8 [ \stemDown d8 ~ ] \stemDown d8 \stemDown e4 \stemDown <a, fis'>8 ~ ~ |
	\stemDown <a fis'>8 \stemUp a4 \stemUp a8 \stemDown <a a'>4. \stemDown <e' g>8 ~ ~ |
	\stemDown <e g>8 [ \stemDown <e g>8 \stemDown g8 \stemDown fis8 ~ ] \stemDown fis8 \stemDown cis4 \stemDown d8 ~ |
	\stemDown d8 \stemUp a4 \stemUp a8 \stemDown fis'8 [ \stemDown e8 \stemDown d8 \stemDown e8 ~ ] |
	\stemDown e8 [ \stemDown a,8 \stemDown a8 \stemDown a8 ] \stemUp a8 [ \stemUp fis8 ] \stemDown b4 ~ |
	\stemDown b4. \stemDown b8 \stemDown <a d fis>8 [ \stemDown e'8 \stemDown d8 \stemDown e8 ~ ] |
	\stemDown e8 [ \stemDown e8 \stemDown e8 \stemDown e8 ] \stemDown e8 [ \stemDown d8 ] \stemDown fis4 ~ |
	\stemDown fis8 \stemDown <fis a>4. \stemDown <fis d'>4. \stemDown <d fis>8 ~ ~ |
	\stemDown <d fis>8 [ \stemDown e8 ] \stemDown d4 ~ \stemDown d4. \stemDown d8 |
	\barNumberCheck #80 \stemDown <a d>8 \stemDown <d a'>4 \stemDown <d a'>8 ~ ~ \stemDown <d a'>8 \stemDown cis4 \stemDown d8 |
	\stemDown d8 [ \stemDown <d b'>8 ] \stemDown <d a'>2. |
	\stemUp <e, a cis>4 r8 \stemUp a8 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown d8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 [ \stemDown a'8 \stemDown <a, d>8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 \stemDown d8 \stemDown d8 ] \stemDown <e cis'>4 \stemDown <d d'>4 |
	\stemDown <d a'>2 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown d8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 [ \stemDown a'8 \stemDown d,8 \stemDown cis8 ] |
	\stemUp <fis, d'>8 [ \stemUp <fis d'>8 \stemUp <fis d'>8 \stemUp <fis d'>8 ] \stemDown <a fis'>8 [ \stemDown <g e'>8 \stemDown <fis d'>8 \stemDown <fis d'>8 ~ ] ~ |
	\barNumberCheck #90 \stemUp <fis d'>4 r8 \stemUp a8 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown d8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 [ \stemDown a'8 \stemDown <a, d>8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 \stemDown d8 \stemDown d8 ] \stemDown <e cis'>4 \stemDown <d d'>4 |
	\stemDown <d a'>2 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown cis8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 ( [ \stemDown a'8 ) \stemDown d,8 \stemDown cis8 ] |
	\stemUp <fis, d'>8 [ \stemUp <fis d'>8 \stemUp <fis d'>8 \stemUp <fis d'>8 ] \stemDown <a fis'>8 [ \stemDown <g e'>8 \stemDown <fis d'>8 \stemDown <fis d'>8 ~ ] ~ |
	\stemUp <fis d'>4 r8 \stemUp a8 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 ] \stemDown <b d>4 \stemDown <cis a'>4 \stemDown d8 [ \stemDown cis8 ] |
	\barNumberCheck #100 \stemDown <b d>8 [ \stemDown d8 ] \stemDown <a d>4 \stemDown <b fis' b>8 ( [ \stemDown <e a>8 ) \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 \stemDown d8 \stemDown d8 ] \stemDown <e cis'>4 \stemDown <d d'>4 |
	\stemDown <d a'>2 \stemDown <d fis>8 [ \stemDown <cis e>8 \stemDown <b d>8 \stemDown <a cis>8 ] |
	\stemUp <fis d'>8 [ \stemUp <fis d'>8 ] \stemUp <fis d'>4 \stemDown <cis' a'>4 \stemUp <fis, d'>8 [ \stemUp <e cis'>8 ] |
	\stemUp <fis d'>8 [ \stemUp <fis d'>8 ] \stemUp <fis d'>4 \stemDown <d' b'>8 [ \stemDown a'8 \stemDown <fis, d'>8 \stemDown <e cis'>8 ] |
	\stemUp <fis d'>8 [ \stemUp <fis d'>8 \stemUp <fis d'>8 \stemUp <fis d'>8 ] \stemDown <a fis'>8 [ \stemDown <g e'>8 \stemDown <fis d'>8 \stemDown <fis d'>8 ~ ] ~ |
	\stemUp <fis d'>4 r8 \stemUp a8 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown d8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 [ \stemDown a'8 \stemDown d,8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown <b d>8 \stemDown d8 \stemDown d8 ] \stemDown <e cis'>4 \stemDown <d d'>4 |
	\barNumberCheck #110 \stemDown <d a'>2 \stemDown <a fis'>8 [ \stemDown e'8 \stemDown d8 \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <cis a'>4 \stemDown d8 [ \stemDown cis8 ] |
	\stemDown <b d>8 [ \stemDown d8 ] \stemDown d4 \stemDown <d b'>8 ( [ \stemDown a'8 ) \stemDown <fis, d'>8 \stemDown <e cis'>8 ] |
	\stemUp <fis d'>8 [ \stemUp <fis d'>8 \stemUp <fis d'>8 \stemUp <fis d'>8 ] \stemDown <a fis'>8 [ \stemDown <g e'>8 \stemDown <fis d'>8 \stemDown <fis d'>8 ~ ] ~ |
	\stemUp <fis d'>2. \stemDown d'8 [ \stemDown cis8 ] |
	\time 6/4 |
	\stemDown d8 [ \stemDown d8 ^\markup { \bold { Rit . } } \startTrillSpan \stemDown d8 \stemDown d8 \stemDown fis8 \stemDown e8 ] \stemDown d2 \fermata \stemDown e4 |
	\stemDown d2 \stemDown fis,8 [ \stemDown a8 \stemDown d8 \stemDown e8 ] s2 |
	<fis a d>1 \fermata \arpeggio \arpeggio \arpeggio \stopTrillSpan \bar "|." 
}


PartPOneVoiceOneChords = \chordmode {
	|
	g4.:5 s8 a4.:5 s16 s16 |
	b4.:m7 s8 s8 s8 s8 s8 |
	g4.:5 s8 a4.:5 s8 |
	d4.:5 s8 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a8:5 s8 s8 s16 s16 |
	b4.:m5 s8 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a8:5 s8 s8 s8 |
	d2.:5 s8 s8 |
	d4:sus2 s8 s8 s8 s4 s8 |
	\barNumberCheck #10 s4. s8 s8 s8 s8 s8 |
	b1:m5.9 |
	s2 s4 s8 s8 |
	d4:sus2 s8 s8 s8 s4 s8 |
	s8 s4 s8 s8 s8 s8 s8 |
	b2:m5.9 s2 |
	s4 s8 s8 s8 s8 s8 s8 |
	b8:m9/+fis s8 s8 s8 s8 s8 s4 |
	g4.:5.9 s8 s8 s8 s8 s8 |
	s8 b8:m9/+fis s8 s8 s8 s8 s4 |
	\barNumberCheck #20 b4.:m5 s8 s8 s4 s8 |
	g8:5 s4. s8 s4 s8 |
	d8:5/+fis s4 s8 s8 s4 s8 |
	e4:m7.9 s4 s2 |
	e2:sus4/+a s8 s8 s8 s8 |
	d4:maj7 s8 s8 s8 s4 s8 |
	s4. s8 s8 s8 s8 s8 |
	b2:m7 s8 s4 s8 |
	s4 s8 s8 s8 s4 s8 |
	d4:maj7 s8 s8 s8 s4 s8 |
	\barNumberCheck #30 s8 s4 s8 s8 s8 s8 s8 |
	b2:m7 s8 s4 s8 |
	s8 s4 s8 s8 s8 s8 s8 |
	fis8:m7 s8 s8 s8 s8 s8 s4 |
	b4.:m7 s8 s8 s8 s8 s8 |
	fis8:m7 s8 s8 s8 s8 s8 s4 |
	b8:m7 s4. s4. s8 |
	g8:maj7 s8 s4 s4. s8 |
	d8:5/+fis s4 s8 s8 s4 s8 |
	s8 e8:m7.9 s2. |
	\barNumberCheck #40 a4:5 s8 s8 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a4:5 s4 |
	d2:5 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a8:5 s8 s8 s8 |
	d4.:5 s8 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	\barNumberCheck #50 b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a4:5 s4 |
	d2:5 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a8:5 s8 s8 s8 |
	d2:5 s2 |
	g2:maj7.9 a8:5 s8 s8 s8 |
	b4.:m7 s8 s8 s8 s8 s8 |
	g4.:5 s16 s16 a4.:5 s8 |
	\barNumberCheck #60 d1:5 |
	g8:maj7 s8 s8 s8 a8:5 s8 s8 s8 |
	b8:m7 s4 s8 s4. s8 |
	g4.:5 s8 a4.:5 s16 s16 |
	d1:5 |
	d8:sus2 s8 s8 s8 s8 s8 s4 |
	s8 s4 s8 s4 s8 s8 |
	s4 s8 s8 s8 s4 s8 |
	s4. s8 s8 s8 s8 s8 |
	b8:m7.9 s4 s8 s8 s4 s8 |
	\barNumberCheck #70 s8 s4 s16 s16 s4. s8 |
	d4:5 s8 s8 s8 s4 s8 |
	s8 s4 s8 s4. s8 |
	b8:m7.9 s8 s8 s8 s8 s4 s8 |
	s8 s4 s8 s8 s8 s8 s8 |
	fis8:m7 s8 s8 s8 s8 s8 s4 |
	b4.:m7 s8 d8:5/+a s8 a8:7/+g s8 |
	d8:5/+fis s8 s8 s8 s8 s8 s4 |
	b8:m7 s4. s4. s8 |
	g8:5 s8 s4 s4. s8 |
	\barNumberCheck #80 d8:5/+fis s4 s8 s8 s4 s8 |
	e8:m7 s8 s2. |
	a4:5 s8 s8 d8:5/+a s8 a8:5/+e s8 |
	g8:5 s8 s4 a4:sus4 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a4:5 s4 |
	d2:5 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a8:5 s8 s8 s8 |
	\barNumberCheck #90 d4:5 s8 s8 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a4:5 s4 |
	d2:5 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a8:5 s8 s8 s8 |
	d4:5 s8 s8 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	\barNumberCheck #100 b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a4:5 s4 |
	d2:5 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a8:5 s8 s8 s8 |
	d4:5 s8 s8 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a4:5 s4 |
	\barNumberCheck #110 d2:5 s8 s8 s8 s8 |
	g8:5 s8 s4 a4:5 s8 s8 |
	b8:m7 s8 s4 s8 s8 s8 s8 |
	g8:5 s8 s8 s8 a8:5 s8 s8 s8 |
	d2.:5 s8 s8 |
	g8:5 s8 s8 s8 s8 s8 a2:sus4 s4 |
	d2:5 s8 s8 s8 s8*5 |
	s1 \bar "|." 
}


PartPOneVoiceOneLyricsOne = \lyricmode {
	\set ignoreMelismata = ##t \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 我 想 过 一 \skip 1 件 事, \skip 1 不 是 坏 的 事. \skip 1 一 直 对 自 \skip 1 己 坚 \skip 1 持 爱 情 的 意 思. \skip 1 像 风 没 有 理 \skip 1 由 轻 轻 吹 着 走, \skip 1 谁 爱 谁 没 有 \skip 1 所 谓 的 对 与 错, \skip 1 不 \skip 1 管 时 \skip 1 间, \skip 1 说 着 我 们 在 \skip 1 一 起有 多 坎 坷. \skip 1 \skip 1 \skip 1 我 不 敢 去 \skip 1 证 实, \skip 1 " 爱 你"   两 个 字. \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 不 是 对 自 \skip 1 己 矜 \skip 1 持 也 不 是 讽 刺. \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 别 人 都 在 说, \skip 1 我 其 实 很 无 知. \skip 1 这 样 的 感 情 \skip 1 被 认 定 很 放 肆. \skip 1 我 很 不 \skip 1 服, \skip 1 \skip 1 我 还 在 想 \skip 1 着 那 件 事. \skip 1 \skip 1 如 果 你 已 经 不 能 控 制 每 天 想 我 一 次, \skip 1 如 果 你 因 为 我 而 诚 实. 如 果 你 看 我 的 电 影, 听 我 爱 的 C D, \skip 1 如 果 你 能 带 我 一 起 旅 行. \skip 1 如 果 你 决 定 跟 随 感 觉, 为 爱 勇 敢 一 次, \skip 1 如 果 你 说 我 们 有 彼 此. 如 果 你 会 开 始 相 信, 这 般 恋 爱 心 情, \skip 1 如 果 你 能 给 我 如 果 的 事. \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 我 不 敢 去 \skip 1 证 实, \skip 1 " 爱 你"  "
    两" 个 字. \skip 1 (" 爱 你"  \skip 1  两 个 \skip 1 字) \skip 1 \skip 1 \skip 1 不 是 对 自 \skip 1 己 矜 \skip 1 持, 也 不 是 \skip 1 讽 刺. \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 是) 别 人 都 在 说, \skip 1 我 其 实 很 无 知, \skip 1 这 样 的 感 情 \skip 1 被 认 定 很 放 肆, \skip 1 我 很 不 \skip 1 服, \skip 1 \skip 1 我 还 在 想 \skip 1 着 那 件 事. \skip 1 \skip 1 如 果 你 已 经 不 能 控 制, 每 天 想 我 一 次, \skip 1 如 果 你 因 为 我 而 诚 实. 如 果 你 看 我 的 电 影, 听 我 爱 的 C D, \skip 1 如 果 你 能 带 我 一 起 旅 行. \skip 1 如 果 你 决 定 跟 随 感 觉, 为 爱 勇 敢 一 次, \skip 1 如 果 你 说 我 们 有 彼 此. 如 果 你 会 开 始 相 信, 这 般 恋 爱 心 情, \skip 1 如 果 你 能 给 我 如 果 的 事. \skip 1 如 果 你 已 经 不 能 控 制, 每 天 想 我 一 次, \skip 1 如 果 你 因 为 我 而 诚 实. 如 果 你 看 我 的 电 影, 听 我 爱 的 C D, \skip 1 如 果 你 能 带 我 一 起 旅 行. \skip 1 如 果 你 决 定 跟 随 感 觉, 为 爱 勇 敢 一 次, \skip 1 如 果 你 说 我 们 有 彼 此. 如 果 你 会 开 始 相 信, 这 般 恋 爱 心 情, \skip 1 我 只 要 你 一 件 如 果 的 事. \skip 1 我 会 奋 不 顾 身 地 去 爱 你. \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 \skip 1 
}


PartPOneVoiceFive = \relative g, {
	\clef "bass" \key d \major \numericTimeSignature \time 4/4 \stemUp g8 [ \sustainOn \stemUp d'8 ] \stemDown g4 \stemUp a,8 [ \sustainOn \stemUp e'8 ] \stemDown a4 |
	\stemDown b,8 [ \sustainOn \stemDown fis'8 \stemDown b8 \stemDown <fis a>8 ~ ] ~ \stemDown <fis a>4 \stemDown fis4 |
	\stemUp g,8 [ \sustainOn \stemUp d'8 ] \stemDown g4 \stemUp a,8 [ \sustainOn \stemUp e'8 ] \stemDown a4 |
	\stemUp d,,8 [ \sustainOn \stemUp a'8 \stemUp d8 \stemUp <fis a>8 ] \stemDown d'2 |
	\stemUp <g,, d' g>2 \arpeggio \arpeggio \arpeggio -\markup { \bold { Simile } } \stemDown <a e' a>2 \arpeggio \arpeggio \arpeggio <b fis' b>1 \arpeggio \arpeggio \arpeggio \stemUp <g d' g>2 \stemDown <a e' a>2 <d a' d>1 \arpeggio \arpeggio \arpeggio \stemDown d8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown d'8 \stemDown e8 ] \stemDown fis,,8 [ \stemDown cis'8 \stemDown a'8 \stemDown b8 ] \stemDown cis8 [ \stemDown b8 \stemDown cis8 \stemDown d8 ] \stemDown g,,8 [ \stemDown d'8 \stemDown a'8 \stemDown b8 ] \stemDown d4 \stemDown a4 \stemDown fis,8 [ \stemDown cis'8 \stemDown a'8 \stemDown b8 ] \stemDown cis8 [ \stemDown b8 \stemDown cis8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown fis8 [ \stemDown e8 ] \stemDown a,4 \stemDown g,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemDown d8 [ \stemDown g8 \stemDown d8 \stemDown b8 ] \stemDown fis,8 [ \stemDown d'8 \stemDown fis8 \stemDown a8 ] \stemDown d8 [ \stemDown fis8 \stemDown d8 \stemDown a8 ] \stemDown e,8 [ \stemDown b'8 \stemDown g'8 \stemDown b8 ] \stemDown d8 [ \stemDown g8 \stemDown e8 \stemDown b8 ] \stemDown a,8 [ \stemDown e'8 \stemDown b'8 \stemDown cis8 ~ ] \stemDown cis2 \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown cis8 \stemDown d8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown cis8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown d'8 \stemDown e8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown b8 \stemDown fis8 ] \stemUp b,8 \stemDown fis'4. \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown cis8 \stemDown d8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown cis8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown d'8 \stemDown e8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown d'8 \stemDown e8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown d'8 \stemDown e8 ] \stemDown fis,,8 [ \stemDown cis'8 \stemDown a'8 \stemDown b8 ] \stemDown cis8 [ \stemDown b8 \stemDown cis8 \stemDown d8 ] \stemDown g,,8 [ \stemDown d'8 \stemDown a'8 \stemDown b8 ] \stemDown a4 \stemUp a,4 \stemDown fis8 [ \stemDown cis'8 \stemDown a'8 \stemDown b8 ] \stemDown cis8 [ \stemDown b8 \stemDown cis8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown a,8 [ \stemDown fis'8 \stemDown a8 \stemDown d8 ] \stemDown g,,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemDown d8 [ \stemDown g8 \stemDown d8 \stemDown b8 ] \stemDown fis,8 [ \stemDown d'8 \stemDown fis8 \stemDown a8 ] \stemDown d8 [ \stemDown fis8 \stemDown d8 \stemDown a8 ] \stemUp e,8 [ \stemUp b'8 \stemUp d8 \stemUp g8 ] \stemDown b8 [ \stemDown d8 \stemDown b8 \stemDown g8 ] \stemDown <a, e' a>4 \arpeggio \arpeggio \arpeggio r8 \stemUp a8 \stemDown <e' a cis>4 \stemDown a8 [ \stemDown e8 ] \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown <fis a>4 \stemDown fis8 [ \stemDown e8 ] \stemDown g,,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown g8 ] \stemDown a,8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemUp d,8 [ \stemUp a'8 \stemUp d8 \stemUp e8 ] \stemUp <a, d fis>4 \stemUp d8 [ \stemUp a8 ] \stemDown g8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown <d fis>4 \stemDown d8 [ \stemDown fis,8 ] \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemUp d,8 [ \stemUp a'8 \stemUp d8 \stemUp e8 ] \stemUp <a, d fis>4 \stemUp d8 [ \stemUp a8 ] \stemDown g8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown <fis a>4 \stemDown fis8 [ \stemDown a,8 ] \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemUp d,8 [ \stemUp a'8 \stemUp d8 \stemUp e8 ] \stemUp <a, d fis>4 \stemUp d8 [ \stemUp a8 ] \stemDown g8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown <b d>8 \stemDown fis8 ] \stemDown <d' fis>8 [ \stemDown d8 \stemDown b8 \stemDown fis8 ] \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemUp d,8 [ \stemUp a'8 \stemUp d8 \stemUp fis8 ] \stemDown a2 \stemDown g,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemDown a,8 [ \stemDown e'8 \stemDown a8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown fis8 [ \stemDown e8 \stemDown d8 \stemDown cis8 ] \stemDown g,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemDown a,8 [ \stemDown e'8 \stemDown a8 \stemDown cis8 ] \stemUp d,,8 [ \stemUp a'8 \stemUp d8 \stemUp fis8 ] \stemDown a8 [ \stemDown d8 \stemDown a8 \stemDown fis8 ] \stemDown g,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemUp a,8 [ \stemUp e'8 ] \stemDown a8 [ \stemDown b16 \stemDown cis16 ] \stemDown b,8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown fis8 [ \stemDown e8 \stemDown d8 \stemDown cis8 ] \stemDown g,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemDown a,8 [ \stemDown e'8 \stemDown a8 \stemDown cis8 ] \stemUp d,,8 [ \stemUp a'8 \stemUp d8 \stemUp fis8 ] \stemDown <fis a d>2 \stemDown <d a' d>2. \stemDown a'4 d,,1 \stemDown d'8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown cis'8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown d'8 \stemDown e8 ] \stemDown fis,,8 [ \stemDown cis'8 \stemDown a'8 \stemDown b8 ] \stemDown cis8 [ \stemDown b8 \stemDown cis8 \stemDown d8 ] \stemDown g,,8 [ \stemDown d'8 \stemDown a'8 \stemDown b8 ] \stemDown a4 \stemUp g,4 \stemDown fis8 [ \stemDown cis'8 \stemDown a'8 \stemDown b8 ] \stemDown cis8 [ \stemDown b8 \stemDown cis8 \stemDown d8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown fis8 [ \stemDown d8 \stemDown b8 \stemDown fis8 ] \stemDown g,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemDown d8 [ \stemDown g8 \stemDown d8 \stemDown b8 ] \stemDown fis,8 [ \stemDown d'8 \stemDown fis8 \stemDown a8 ] \stemDown d8 [ \stemDown fis8 \stemDown d8 \stemDown a8 ] \stemDown e,8 [ \stemDown b'8 \stemDown g'8 \stemDown b8 ] \stemDown d8 [ \stemDown g8 \stemDown e8 \stemDown b8 ] \stemDown <a, e' a>4 r8 \stemDown a'8 \stemDown <a d>4 \stemDown <e a cis>4 \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown <fis a>4 \stemDown d8 [ \stemDown cis8 ] \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown g8 ] \stemDown a,8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemUp d,8 [ \stemUp a'8 \stemUp d8 \stemUp e8 ] \stemUp <a, d fis>4 \stemUp d8 [ \stemUp a8 ] \stemDown g8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown <fis a>4 \stemDown d8 [ \stemDown fis,8 ] \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemUp d,8 [ \stemUp a'8 \stemUp d8 \stemUp e8 ] \stemUp <a, d fis>4 \stemUp d8 [ \stemUp a8 ] \stemDown g8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown <fis a>4 \stemDown fis8 [ \stemDown e8 ] \stemDown g,,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemUp d,8 [ \stemUp a'8 \stemUp d8 \stemUp e8 ] \stemUp <a, d fis>4 \stemUp d8 [ \stemUp a8 ] \stemDown g8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemDown b8 [ \stemDown fis'8 \stemDown <b d>8 \stemDown fis8 ] \stemDown <d' fis>8 [ \stemDown b8 \stemDown fis'8 \stemDown fis,8 ] \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemDown a8 [ \stemDown e'8 \stemDown <a cis>8 \stemDown e8 ] \stemUp d,8 [ \stemUp a'8 \stemUp d8 \stemUp e8 ] \stemUp <a, d fis>2 \clef "treble" \stemUp g'8 [ \stemUp d'8 ] \stemUp g4 \stemUp a,8 [ \stemUp e'8 ] \stemUp a4 \stemUp <b, fis'>2 \stemUp fis'4 \stemUp fis8 [ \stemUp e8 ] \stemUp g,8 [ \stemUp d'8 ] \stemUp g4 \stemUp a,8 [ \stemUp e'8 ] \stemUp a4 \clef "bass" \stemDown d,,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown <a, d fis>2 \arpeggio \arpeggio \arpeggio \stemUp g,8 [ \stemUp d'8 \stemUp g8 \stemUp d8 ] \stemDown a8 [ \stemDown e'8 \stemDown cis'8 \stemDown a8 ] \stemDown b,8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown fis,4 \stemDown d'8 [ \stemDown a8 ] \stemDown g,8 [ \stemDown d'8 \stemDown <g b>8 \stemDown d8 ] \stemUp a8 [ \stemUp e'8 ] \stemDown <a cis>4 \stemUp d,,8 [ \stemUp a'8 \stemUp d8 \stemUp fis8 ] \stemDown <fis a d>2 \clef "treble" \stemUp g8 [ \stemUp d'8 ] \stemUp g4 \stemUp a,8 [ \stemUp e'8 ] \stemUp a4 \stemUp b,8 [ \stemUp fis'8 ] \stemDown b4 \stemUp fis4 \stemUp b,4 \stemUp g8 [ \stemUp d'8 ] \stemUp g4 \stemUp a,8 [ \stemUp e'8 ] \stemUp a4 \clef "bass" \stemDown d,,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown <d fis>2 \stemDown g,,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemUp a,8 [ \stemUp e'8 ] \stemDown a8 [ \stemDown b16 \stemDown cis16 ] \stemDown b,8 [ \stemDown fis'8 \stemDown b8 \stemDown d8 ] \stemDown fis8 [ \stemDown e8 \stemDown d8 \stemDown cis8 ] \stemDown g,8 [ \stemDown d'8 \stemDown g8 \stemDown b8 ] \stemDown a,8 [ \stemDown e'8 \stemDown a8 \stemDown cis8 ] \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ] \stemDown <d fis>2 \clef "treble" |
	\time 6/4 \stemUp g,8 [ \stemUp d'8 \stemUp g8 \stemUp b8 ] \stemUp <d, g b>4 \arpeggio \arpeggio \arpeggio \stemUp <a e' a>2. \clef "bass" \stemDown d,8 [ \stemDown a'8 \stemDown d8 \stemDown e8 ~ ] \stemDown e2 s2 r1 \bar "|." 
}


\score {
	<<
		\context ChordNames = "PartPOneVoiceOneChords" {
			\PartPOneVoiceOneChords 
		}
		
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
				\context Voice = "PartPOneVoiceFive" {
					\PartPOneVoiceFive 
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

