\version "2.20.0" 

%% additional definitions required by the score:
\language "english" 

\header {
	title = "卷珠帘"
	composer = \markup \column { "作曲  霍尊" }
}


\include "lotus.ly" 

#(set-global-staff-size 24) 

\paper {
	paper-width = 24.34\cm
	paper-height = 22.36\cm
	top-margin = 1.27\cm
	bottom-margin = 1.27\cm
	left-margin = 1.27\cm
	right-margin = 1.27\cm
	between-system-space = 3.67\cm
	page-top-space = 2.82\cm
	ragged-last = ##t
}


\layout {
	\context {
		\Score
		skipBars = ##t
		autoBeaming = ##f
	}
	
}


PartPOneVoiceOne = \relative a {
	\clef "treble" \key c \major \time 2/4 r8 \stemUp a16 ^1 [ c16 ^2 ] e4 ^4 |	 % 1
	r8 a,16 ^1 [ d16 ^3 ] fs4 ^5 |	 % 2
	r8 a,16 [ c16 ] e4 |	 % 3
	r8 a,16 ^1 [ d16 ^2 ] \stemDown fs16 ^4 [ a16 ^1 d16 ^2 fs16 ^4 ] |	 % 4
	a4 ^5 e8 [ g8 ] |	 % 5
	a4 g8 [ a8 ] |	 % 6
	e4 ^2 fs8 ^4 [ d8 ^2 ] |	 % 7
	c4 ^1 a8 ^2 [ c8 ^4 ] |	 % 8
	b2 ~ ^3 |	 % 9
	\barNumberCheck #10 \stemUp b8 [ g16 e16 ] \stemDown d'8 [ c8 ] |	 % 10
	\stemUp a2 ~ ^2 |	 % 11
	a2 |	 % 12
	\numericTimeSignature \time 4/4 r4 \stemDown a8 ^1 [ e'8 ^5 ] d8. ^4 [ c16 ~ ] c8 [ b8 ] |	 % 13
	\repeat volta 2 {
		\stemUp a8. ^1 [ a16 ~ ^4 ] a8 [ g8 ] \acciaccatura {
			\stemUp e8
		}
		\stemUp d2 ~ |	 % 14
		\stemUp d4 \stemDown c'8 ^1 [ g'8 ^5 ] fs8. [ e16 ~ ] e8 [ d8 ] |	 % 15
		e2. e8 ^2 [ g16 a16 ~ |	 % 16
		] a4 g8 [ e8 ] d4 c8 ^2 [ d8 ^3 ] |	 % 17
		e8 ^5 [ d8 ^4 ] \stemUp c8 [ a16 g16 ] a4. g8 ^1 |	 % 18
		a4. ^3 \stemDown c8 \stemUp b8 [ g16 e16 ] \stemDown d'8 [ c8 ]
	}
	\alternative {
		{
			\barNumberCheck #20 a1 ~ |	 % 20
			\stemUp a4 \stemDown a8 [ e'8 ] d8. [ c16 ~ ] c8 [ b8 ]
		}
		{
			\stemUp a2. ~ \stemDown a8 [ g'8 ]
		}
		
	}
	|	 % 15-22
	\lotusRepeatABA {
		{
			\mark \markup { \musicglyph #"scripts.segno" } \stemDown a2 ^5 g4 fs8 [ e8 ^2 ] |	 % 23
			fs8 ^4 [ e16 d16 ] \stemUp a2 \stemDown c8 ^2 [ d8 ^1 ] |	 % 24
			g2 ^5 fs4 e8 [ d8 ] |	 % 25
			e2. ~ e8 [ g8 ] |	 % 26
			a2 ^5 g4 fs8 [ e8 ] |	 % 27
			fs8 [ e16 d16 ] d2 e8 ^5 [ d8 ^4 ] |	 % 28
			\stemUp a2 ~ ^1 \stemDown a8 [ e'16 ^5 d16 ] \stemUp a8 ^2 [ g8 ^1 ] |	 % 29
			\mark \markup { \musicglyph #"scripts.coda" } \barNumberCheck #30
		}
		|	 % 23-29
		a2. ~ \stemDown a8 [ g'8 ] \bar "||" |	 % 30
	}
	|	 % 23-30
	\mark \markup { \musicglyph #"scripts.coda" }
	\stemUp a,2 c,8 [ e8 a8 b8 ] |	 % 31
	<a c e a>1 \arpeggio \bar "|."
}


PartPOneVoiceTwo = \relative a, {
	\clef "bass" \key c \major \time 2/4 \stemUp a16 ^5 [ e'16 ^1 ] r4. |	 % 1
	a,16 [ fs'16 ] r4. |	 % 2
	a,16 [ e'16 ] r4. |	 % 3
	a,16 [ fs'16 ] r4. |	 % 4
	r4 e'8 [ g8 ] |	 % 5
	a4 g8 ^2 [ a8 ^1 ] |	 % 6
	e4 ^3 fs8 ^2 [ d8 ^3 ] |	 % 7
	c4 ^1 a8 [ c8 ] |	 % 8
	\stemDown <e, g b d>2 ~ \arpeggio ~ \arpeggio ~ \arpeggio ~ \arpeggio |	 % 9
	<e g b d>2 |	 % 10
	a,16 ^5 [ e'16 ^2 a16 ^1 c16 ^2 ] e4 ^1 |	 % 11
	a,,16 ^5 [ fs'16 ^2 a16 ^1 d16 ^2 ] fs4 ^1 |	 % 12
	\numericTimeSignature \time 4/4 \stemUp a,,8 [ e'8 ] \stemDown a4 \stemUp a,8 [ fs'8 ] \stemDown a4 |	 % 13
	\repeat volta 2 {
		\stemUp a,8 [ e'8 ] \stemDown a4 \stemUp a,8 [ fs'8 ] \stemDown a4 |	 % 14
		\stemDown c,8 [ e8 ] g4 d8 [ fs8 ] a4 |	 % 15
		e8 ^5 [ a8 ^3 b8 ^2 e8 ^1 ] gs2 ^2 |	 % 16
		f,8 [ c'8 ] f4 g,8 [ d'8 ] g4 |	 % 17
		e,8 [ b'8 ] e4 fs,8 [ c'8 ] e4 |	 % 18
		f,8 [ a8 ] c4 <e, g b d>2 \arpeggio \arpeggio \arpeggio \arpeggio
	}
	\alternative {
		{
			\stemDown a,8 ^5 [ e'8 ^2 a8 ^1 b8 ^2 ] c8 ^1 [ b8 ^2 a8 ^1 e8 ^2 ] |	 % 20
			\stemUp a,8 ^5 [ e'8 ] \stemDown a4 \stemUp a,8 [ fs'8 ] \stemDown a4
		}
		{
			\stemDown a,8 [ e'8 a8 b8 ] c8 [ b8 a8 e8 ]
		}
		
	}
	|	 % 15-22
	\stemDown f8 ^5 [ c'8 ^2 f8 ^1 a8 ^2 ] e,8 [ b'8 e8 g8 ] |	 % 23
	d,8 [ a'8 d8 ^1 e8 ^3 ] fs8 ^2 [ e8 ^3 d8 ^1 a8 ^2 ] |	 % 24
	e8 [ b'8 e8 g8 ] fs,8 ^5 [ a8 ^4 d8 ^2 fs8 ^1 ] |	 % 25
	a,,8 [ e'8 a8 b8 ] c8 [ b8 a8 e8 ] |	 % 26
	f8 [ c'8 f8 a8 ] e,8 [ b'8 e8 g8 ] |	 % 27
	d,8 [ a'8 d8 e8 ] fs8 [ e8 d8 a8 ] |	 % 28
	f,8 [ c'8 f8 a8 ] g,8 [ d'8 g8 b8 ] |	 % 29
	a,8 [ e'8 a8 b8 ] c2 _\markup { \bold \large { D . S . al Coda } } \bar "||" |	 % 30
	a,8 [ e'8 a8 b8 ] r2 |	 % 31
	R1 \bar "|."
}


% The score definition
\score {
	<<
		\new PianoStaff <<
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
		\tempo 4 = 90
		\context {
			\Score
			midiChannelMapping = #'instrument
		}
		
	}
	
}


