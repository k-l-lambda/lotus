\version "2.20.0" 

%% additional definitions required by the score:
\language "english" 

\header {
	title = "伏尔塔瓦河"
	composer = \markup \column { \line { "作曲：斯美塔那" } }
}

\include "lotus.ly"


#(set-global-staff-size 24) 

\paper {
	paper-width = 24.34\cm
	paper-height = 22.36\cm
	top-margin = 0.99\cm
	bottom-margin = 1.67\cm
	left-margin = 0.99\cm
	right-margin = 0.89\cm
	between-system-space = 4.14\cm
	page-top-space = 3.1\cm
	ragged-last = ##t
}


\layout {
	\context {
		\Score
		skipBars = ##t
		autoBeaming = ##f
	}
	
}


PartPOneVoiceOne = \relative b' {
	\clef "treble" \key g \major \time 6/8
	\partial 8 \stemDown b8 ^1 |	 % 1
	\lotusRepeatABA {
		{
			\repeat volta 2 {
				\mark \markup { \musicglyph #"scripts.segno" } e4 ^2 fs8 ^3 g4 ^1 a8 ^2 |	 % 2
				\stemDown b4 ^3 b8 b4 b8 |	 % 3
				c4. ^4 c4. |	 % 4
				b4. ~ b4 b8 |	 % 5
				a4. a4 a8 |	 % 6
				g4 a8 g4 g8 ^1 |	 % 7
				fs4. ^3 fs4 fs8
			}
			\alternative {
				{
					\stemDown e4. ~ ^2 e4 b8
				}
				{
					\stemDown e4. ~ e4 \stemUp g,8 ^1
				}
				
			}
			|	 % 3-10
			\barNumberCheck #10 \stemDown c4 ^2 d8 ^3 e4 ^1 fs8 |	 % 11
			g4 ^3 a8 ^1 b4 c8 |	 % 12
			d4. ^4 a4 c8 |	 % 13
			b4. ~ b4 \stemUp e,,8 ^1 |	 % 14
			a4 \stemDown b8 c4 ^1 d8 |	 % 15
			e4 ^1 fs8 g4 a8 |	 % 16
			b4. fs4 ^2 a8 |	 % 17
			g4. ~ ^3 g4 g8 |	 % 18
			g4. e4 g8 |	 % 19
			b4. fs4 ^2 fs8 |	 % 20
			\barNumberCheck #20 g4. e4 g8 |	 % 21
			b4. fs4 fs8 |	 % 22
			b4. fs4 fs8 |	 % 23
			\stemUp b2. ~ |	 % 24
			b2. |	 % 25
			\stemDown b2. ~ |	 % 26
			b4. ~ b4 b,8 |	 % 27
		}
		\repeat volta 2 {
			\mark \markup { \musicglyph #"scripts.coda" } e4 ^2 fs8 gs4 ^4 _1 a8 ^1 |	 % 28
			\stemDown b4 b8 b4 b8 |	 % 29
			c4. ^3 c4. |	 % 30
			\barNumberCheck #30 b4. ~ ^2 b4 b8 ^3 |	 % 31
			a4. a4 a8 |	 % 32
			g4 ^1 a8 g4 g8 |	 % 33
			fs4. ^3 fs4 fs8
		}
		\alternative {
			{
				\stemDown e4. ~ e4 b8
			}
			{
				\stemDown e2. ~
			}
			
		}
		|	 % 29-36
		\stemDown e4. ~ e4 b8 |	 % 37
	}
	\key e \major \mark \markup { \musicglyph #"scripts.coda" } e4 fs8 ^\markup { \bold \large { Coda } } gs4 ^4 a8 ^1 |	 % 38
	b4 b8 b4 b8 |	 % 39
	cs4. ^3 cs4. |	 % 40
	\barNumberCheck #40 b4. ~ b4 b8 |	 % 41
	cs4. cs4. |	 % 42
	b4. ~ b4 b8 |	 % 43
	a4. a4 a8 ^1 |	 % 44
	gs4 ^3 a8 gs4 gs8 |	 % 45
	fs4. ^2 fs4 fs8 |	 % 46
	b4. ~ b4 b8 |	 % 47
	a4. a4 a8 |	 % 48
	gs4 a8 gs4 gs8 |	 % 49
	fs4. fs4. |	 % 50
	\barNumberCheck #50 d'2. |	 % 51
	cs4. ^4 c4. ^3 |	 % 52
	b4. a4. ^1 |	 % 53
	gs4 ^3 a8 gs4 gs8 |	 % 54
	fs4 gs8 fs4 fs8 |	 % 55
	e4 ^1 fs8 gs4 gs8 |	 % 56
	b4. ^5 b4. ^2 |	 % 57
	e2. ~ |	 % 58
	e2. ~ |	 % 59
	e2. ~ |	 % 60
	\barNumberCheck #60 e4. r4 \bar "|."
}


PartPOneVoiceThree = \relative e {
	\clef "bass" \key g \major \time 6/8
	\partial 8 r8 |	 % 1
	\repeat volta 2 {
		\stemDown <e g b>2. |	 % 2
		\stemDown <e g b>2. |	 % 3
		<c e g>2. |	 % 4
		<g' b d>2. |	 % 5
		<a c fs>2. |	 % 6
		<b e g>2. |	 % 7
		<b ds fs>2.
	}
	\alternative {
		{
			\stemDown <e, g b>2.
		}
		{
			\stemDown <e g b>2.
		}
		
	}
	|	 % 3-10
	\stemDown c8 _5 [ g'8 _2 c8 _1 ] e8 _2 [ c8 g8 ] |	 % 11
	b,8 [ g'8 b8 ] d8 [ b8 g8 ] |	 % 12
	d8 [ a'8 c8 ] fs8 [ c8 a8 ] |	 % 13
	\stemUp g,8 [ d'8 g8 ] \stemDown b4. |	 % 14
	\stemUp a,8 _5 [ c8 _3 e8 _2 ] \stemDown a8 _1 [ e8 c8 ] |	 % 15
	\stemUp g8 [ b8 e8 ] \stemDown g8 [ e8 b8 ] |	 % 16
	\stemUp fs8 _5 [ b8 ds8 ] \stemDown fs8 _1 [ ds8 b8 ] |	 % 17
	\stemUp e,8 [ b'8 e8 _1 ] \stemDown g4. _2 |	 % 18
	as,8 [ e'8 g8 ] cs4. |	 % 19
	b,8 [ ds8 fs8 _2 ] b4. _1 |	 % 20
	as,8 [ e'8 g8 _1 ] cs4. _2 |	 % 21
	b,8 [ ds8 fs8 ] b4. _1 |	 % 22
	b,8 [ ds8 fs8 ] b4. |	 % 23
	b,8 [ _"L.H" ds8 fs8 ] r4 r8 |	 % 24
	\change Staff = "1" b8 [ \change Staff = "2" \change Staff = "1" ds8 ^"L.H" fs8 ] \change Staff = "2" r4 r8 |	 % 25
	R2.*2 |	 % 26-27
	\repeat volta 2 {
		e,8 ~ _5 [ <e gs>8 ~ _3 ~ <e gs b>8 ~ _2 ] ~ ~ <e gs b e>4. |	 % 28
		\stemDown e8 ~ [ <e gs>8 ~ ~ <e gs b>8 ~ ] ~ ~ <e gs b e>4. |	 % 29
		\stemUp a,8 _5 [ c8 e8 _1 ] \stemDown d8 _5 [ fs8 a8 _1 ] |	 % 30
		g8 ~ [ <g b>8 ~ ~ <g b d>8 ~ ] ~ ~ <g b d g>4. |	 % 31
		\stemUp a,8 _5 [ c8 e8 ] \stemDown b8 _5 [ d8 f8 ] |	 % 32
		c8 ~ [ <c e>8 ~ ~ <c e g>8 ~ ] ~ ~ <c e g c>4. |	 % 33
		b8 ~ [ <b ds>8 ~ ~ <b ds fs>8 ~ ] ~ ~ <b ds fs a>4.
	}
	\alternative {
		{
			\stemDown e8 ~ [ <e g>8 ~ ~ <e g b>8 ~ ] ~ ~ <e g b e>4.
		}
		{
			\stemDown e8 [ g8 b8 ] e8 [ b8 g8 ]
		}
		
	}
	|	 % 29-36
	\stemDown e8 [ g8 b8 ] e4. _\markup { \bold \large { D . S . al Coda } } |	 % 37
	\key e \major e,8 _5 [ gs8 b8 ] e8 _1 [ b8 gs8 ] |	 % 38
	e8 [ gs8 b8 ] e8 [ b8 gs8 ] |	 % 39
	ds8 [ a'8 b8 ] ds8 [ b8 a8 ] |	 % 40
	e8 ~ [ <e gs>8 ~ ~ <e gs b>8 ~ ] ~ ~ <e gs b e>4. |	 % 41
	ds8 [ a'8 b8 ] ds8 [ b8 a8 ] |	 % 42
	e8 ~ [ <e gs>8 ~ ~ <e gs b>8 ~ ] ~ ~ <e gs b e>4. |	 % 43
	\stemUp a,8 [ cs8 fs8 ] \stemDown a8 _1 [ fs8 cs8 ] |	 % 44
	b8 [ e8 gs8 ] b8 _1 [ gs8 e8 ] |	 % 45
	\stemUp a,8 [ b8 ds8 ] \stemDown fs8 _1 [ ds8 b8 ] |	 % 46
	gs8 ~ [ <gs b>8 ~ ~ <gs b d>8 ~ ] ~ ~ \stemUp <gs b d f>4. |	 % 47
	a8 [ cs8 fs8 ] \stemDown a8 [ fs8 cs8 ] |	 % 48
	b8 [ e8 gs8 ] b8 [ gs8 e8 ] |	 % 49
	\stemUp a,8 [ b8 ds8 ] \stemDown fs8 [ ds8 b8 ] |	 % 50
	\stemUp gs8 [ b8 d8 ] \stemDown f8 [ d8 b8 ] |	 % 51
	\stemUp a8 [ cs8 fs8 _1 ] fs,8 [ a8 c8 ] |	 % 52
	gs8 [ b8 e8 ] a,8 [ cs8 fs8 ] |	 % 53
	\stemDown b,8 [ e8 gs8 ] b8 [ gs8 e8 ] |	 % 54
	b8 [ ds8 fs8 ] a8 [ fs8 ds8 ] |	 % 55
	e8 [ gs8 b8 ] e4. |	 % 56
	b,8 [ fs'8 a8 ] b4. |	 % 57
	e,8 [ gs8 b8 ] e8 [ b8 gs8 ] |	 % 58
	e8 [ gs8 b8 ] e8 [ b8 gs8 ] |	 % 59
	e2. ( |	 % 60
	\stemUp e,4. ) r4 \bar "|."
}


PartPOneVoiceTwo = \relative b {
	\clef "treble" \key g \major \time 6/8
	\partial 8 s8 |
	\repeat volta 2 {
		s2.
		s1. |	 % 3-4
		s4*9 |	 % 5-7
		s2.
	}
	\alternative {
		{
			s2.
		}
		{
			s2.
		}
		
	}
	|	 % 3-10
	s4*9 |	 % 11-13
	s4*9 |	 % 14-16
	s4*9 |	 % 17-19
	s4*9 |	 % 20-22
	s8*9 |	 % 23
	\stemDown b8 ^1 [ ds8 ^2 _"R.H" fs8 ^3 ] |	 % 24
	s4. b8 [ ds8 ^"R.H" fs8 ] |	 % 25
	s4*6 |	 % 26-27
	\repeat volta 2 {
		s4*3
		s4*9 |	 % 29-31
		s4*9
	}
	\alternative {
		{
			s2.
		}
		{
			s2.
		}
		
	}
	|	 % 29-36
	s2. |	 % 37
	\key e \major s4*9 |	 % 38-40
	s4*9 |	 % 41-43
	s4*9 |	 % 44-46
	s4*9 |	 % 47-49
	s4*9 |	 % 50-52
	s4*9 |	 % 53-55
	s4*9 |	 % 56-58
	s8*17 |	 % 60-61
	\bar "|."
}


% The score definition
\score {
	<<
		\new PianoStaff <<
			\context Staff = "1" <<
				\mergeDifferentlyDottedOn
				\mergeDifferentlyHeadedOn
				\context Voice = "PartPOneVoiceOne" {
					\voiceOne \PartPOneVoiceOne
				}
				
				\context Voice = "PartPOneVoiceTwo" {
					\voiceTwo \PartPOneVoiceTwo
				}
				
			>>
			
			\context Staff = "2" <<
				\mergeDifferentlyDottedOn
				\mergeDifferentlyHeadedOn
				\context Voice = "PartPOneVoiceThree" {
					\PartPOneVoiceThree
				}
				
			>>
			
		>>
		
	>>
	
	\layout {
	}
	
	% To create MIDI output, uncomment the following line:
	\midi {
		\tempo 4 = 98
		\context {
			\Score
			midiChannelMapping = #'instrument
		}
		
	}
	
}


