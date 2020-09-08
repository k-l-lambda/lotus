\version "2.20.0" 

\header {
	encodingsoftware = "Sibelius 8.2" 
	encodingdate = "2017-09-22" 
	composer = "Pianoboy高至豪  曲" 
	copyright = "版权 © " 
	title = Annabelle 
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
	page-top-space = 1.27\cm 
	indent = 1.61538461538\cm 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative a' {
	\repeat volta 2 {
		\repeat volta 2 {
			\clef "treble" \key bes \major \numericTimeSignature \time 4/4 |
			\tempo 4 = 120 |
			r4 -\mf \stemUp a8 [ \stemUp bes8 ~ ] \stemDown bes2 |
			r4 \stemUp a8 [ \stemUp bes8 ~ ] \stemDown bes2 |
			r4 \stemUp d,8 [ \stemUp a'8 ~ ] \stemUp a2 
		}
		\alternative {
			{
				|
				bes1 
			}
			
		}
		
	}
	\alternative {
		{
			|
			\stemDown bes2 ~ \stemUp bes8 [ \stemUp <es, g>8 \stemUp <d es g>8 \stemUp <d a'>8 ] 
		}
		
	}
	|
	\stemUp <d a'>8 [ \stemUp <d bes'>8 ] \stemUp <d bes'>4 ~ ~ \stemUp <d bes'>8 \stemUp d4 \stemUp d8 |
	\stemUp <d bes'>4 \stemUp <d bes'>8 [ \stemUp <d a'>8 ~ ] ~ \stemUp <d a'>8 \stemUp <d g>4 \stemUp <c g'>8 ~ ~ |
	\stemUp <c g'>2 r8 \stemUp c8 [ r8 \stemUp es8 ] |
	\stemUp <d bes'>4 \stemUp <d a'>8 [ \stemUp <d bes'>8 ~ ] ~ \stemUp <d bes'>4 \stemUp <f c'>8 [ \stemUp <d bes'>8 ~ ] ~ |
	\barNumberCheck #10 \stemUp <d bes'>2 r8 \stemUp d8 [ r8 \stemUp bes'8 ] |
	\stemDown <g d'>4 \stemUp <g d'>8 [ \stemUp <g c>8 ~ ] ~ \stemUp <g c>8 \stemUp <g bes>4 \stemUp <f a>8 ~ ~ |
	\stemUp <f a>2 r8 \stemUp c8 [ \stemUp f8 \stemUp a8 ] |
	\stemDown <f es'>4 \stemUp <f es'>8 [ \stemUp <f d'>8 ~ ] ~ \stemUp <f d'>8 \stemUp <f c'>4 \stemUp <f d'>8 |
	\stemUp <f c'>4 \stemUp <f bes>8 [ \stemUp <f bes>8 ~ ] ~ \stemUp <f bes>8 [ \stemUp bes8 \stemUp c8 \stemUp <g d'>8 ~ ] ~ |
	\stemDown <g d'>2. r8 \stemUp es8 |
	\stemUp bes'8 [ \stemUp es,8 \stemUp es8 \stemUp es8 ~ ] \stemUp es8 [ \stemUp <d bes'>8 \stemUp <d c'>8 \stemUp <d bes'>8 ~ ] ~ |
	\stemUp <d bes'>2 r8 \stemDown bes'8 [ \stemDown c8 \stemDown <g d'>8 ~ ] ~ |
	\stemDown <g d'>2. \stemUp c8 [ \stemUp <es, bes'>8 ~ ] ~ |
	\stemUp <es bes'>2. ~ ~ \stemUp <es bes'>8 [ \stemUp <d bes'>8 ] |
	\barNumberCheck #20 \stemUp <d bes'>8 [ \stemUp <d a'>8 \stemUp <d a'>8 \stemUp <d a'>8 ~ ] ~ \stemUp <d a'>8 [ \stemUp d8 \stemUp <d g>8 \stemUp <d fis>8 ~ ] ~ |
	\stemUp <d fis>4 \stemUp <d g>8 [ \stemUp a'8 ] \stemUp d,8 [ \stemUp <c g'>8 \stemUp <c g'>8 \stemUp <d a'>8 ] |
	\stemUp <d a'>8 [ \stemUp <d bes'>8 ] \stemUp <d bes'>4 r8 \stemUp d8 [ \stemUp es8 \stemUp g8 ] |
	\stemUp <d bes'>4 \stemUp <d bes'>8 [ \stemUp <d a'>8 ~ ] ~ \stemUp <d a'>8 \stemUp <d g>4 \stemUp <c g'>8 ~ ~ |
	\stemUp <c g'>4. \stemUp <c f>8 r8 \stemUp c8 [ \stemUp f8 \stemUp g8 ] |
	\stemUp <d bes'>4 \stemUp <d a'>8 [ \stemUp <d bes'>8 ~ ] ~ \stemUp <d bes'>4 \stemUp <f c'>8 [ \stemUp <f bes>8 ~ ] ~ |
	\stemUp <f bes>2 ~ ~ \stemUp <f bes>8 [ \stemUp <f a>8 \stemUp bes8 \stemUp c8 ] |
	\stemDown <g d'>4 \stemUp <g d'>8 [ \stemUp <g c>8 ~ ] ~ \stemUp <g c>8 \stemUp <g bes>4 \stemUp <f a>8 ~ ~ |
	\stemUp <f a>2 r8 \stemUp c8 [ \stemUp f8 \stemUp a8 ] |
	\stemDown <f es'>4 \stemUp <f es'>8 [ \stemUp <f d'>8 ~ ] ~ \stemUp <f d'>8 \stemUp <f c'>4 \stemUp <f d'>8 |
	\barNumberCheck #30 \stemUp <f c'>4 \stemUp <f bes>8 [ \stemUp <f bes>8 ~ ] ~ \stemUp <f bes>8 [ \stemUp bes8 \stemUp c8 \stemUp <g d'>8 ~ ] ~ |
	\stemDown <g d'>2 r8 \stemUp bes,8 [ \stemUp es8 \stemUp bes'8 ] |
	\stemUp bes8 [ \stemUp es,8 \stemUp es8 \stemUp es8 ~ ] \stemUp es8 [ \stemUp <d bes'>8 \stemUp <d c'>8 \stemUp <d bes'>8 ~ ] ~ |
	\stemUp <d bes'>2 r8 \stemDown bes'8 [ \stemDown c8 \stemDown <g d'>8 ~ ] ~ |
	\stemDown <g d'>2 ~ ~ \stemUp <g d'>8 [ \stemUp <f d'>8 \stemUp c'8 \stemUp <f, bes>8 ~ ] ~ |
	\stemUp <f bes>2 r8 \stemUp d8 [ r8 \stemUp bes'8 ] |
	\stemUp <d, bes'>8 [ \stemUp <d a'>8 \stemUp <d a'>8 \stemUp <d a'>8 ~ ] ~ \stemUp <d a'>8 [ \stemUp d8 \stemUp g8 \stemUp <d fis>8 ~ ] ~ |
	\stemUp <d fis>4 \stemUp <d g>8 [ \stemUp <d a'>8 ~ ] ~ \stemUp <d a'>8 [ \stemUp <d fis>8 ~ ] ~ \stemUp <d fis>4 |
	\stemUp <d g>4 -> -. r4 r2 |
	r4 r4 r8 \stemUp <d g>8 [ -\f \stemUp <d g>8 \stemUp <d a'>8 ] |
	\barNumberCheck #40 \stemUp bes'8 [ \stemUp a8 ] \stemUp bes4 \stemUp bes8 [ \stemUp a8 ] \stemUp bes4 |
	r8 \stemUp <f bes>16 [ \stemUp a16 ] \stemDown bes8 [ \stemDown bes8 ~ ] \stemUp bes8 [ \stemUp a8 \stemUp a8 \stemUp bes8 ] |
	\stemUp <f a>4 \stemUp <d f>8 [ \stemUp <d f>8 ~ ] \stemUp d8 \stemUp d4 \stemUp <f a>8 |
	\stemUp <f a>8 [ \stemUp <d bes'>8 ] \stemUp <d bes'>4 ~ ~ \stemUp <d bes'>8 [ \stemUp g8 \stemUp g8 \stemUp a8 ] |
	\stemUp bes8 [ \stemUp a8 ] \stemUp bes4 \stemUp bes8 [ \stemUp a8 ] \stemUp bes4 |
	r8 \stemUp <f bes>16 [ \stemUp a16 ] \stemDown bes8 [ \stemDown bes8 ~ ] \stemDown bes8 \stemUp <f a>4 \stemUp <f bes>8 |
	\stemUp <f c'>4 \stemUp <f c'>8 [ \stemUp <f d'>8 ~ ] ~ \stemDown <f d'>8 \stemUp <f d'>4 \stemDown <f es'>8 |
	\stemUp <f es'>8 [ \stemUp <f d'>8 ] \stemUp <f d'>4 \stemUp g8 [ \stemUp g8 \stemUp <g bes>8 \stemUp <g bes>8 ] |
	\stemUp <g d'>8 [ \stemUp <g bes>8 ] \stemDown <g d'>4 \stemUp <g d'>8 [ \stemUp <g bes>8 \stemUp <g d'>8 \stemUp g8 ] |
	r8 \stemDown <g d'>16 [ \stemDown bes16 ] \stemDown d8 [ \stemDown <g, d'>8 ~ ] ~ \stemDown <g d'>8 [ \stemDown <g es'>8 ~ ~ \stemDown <g es'>8 \stemDown <g d'>8 ] |
	\barNumberCheck #50 \stemDown <g d'>4 \stemUp <f a>8 [ \stemUp <f a>8 ~ ] ~ \stemUp <f a>8 [ \stemUp <f bes>8 ~ ~ \stemUp <f bes>8 \stemUp f8 ] |
	\stemUp <f bes>8 [ \stemUp <f c'>8 ] \stemUp <f c'>4 \stemUp g8 [ \stemUp g8 \stemUp <g bes>8 \stemUp <g bes>8 ] |
	\stemUp <g d'>8 [ \stemUp <g bes>8 ] \stemDown <g d'>4 \stemUp <g d'>8 [ \stemUp <g bes>8 \stemUp <g d'>8 \stemUp g8 ] |
	r4 \stemDown <g d'>8 [ \stemDown <g es'>8 ~ ] ~ \stemUp <g es'>8 [ \stemUp g8 \stemUp <g d'>8 \stemUp <g bes>8 ~ ] ~ |
	\stemUp <g bes>2 r8 \stemUp <d a'>8 ~ ~ \stemUp <d a'>4 |
	\stemUp <bes bes'>4 -- \stemUp <a a'>4 -- \stemUp <bes bes'>4 -- r4 |
	\key as \major |
	\stemUp <f' c'>4 \stemUp as4 \stemUp <f c'>4 \stemUp as4 |
	\stemUp <f c'>4 \stemUp as4 \stemUp <f c'>4 \stemUp as4 |
	\stemUp <es c'>4 \stemUp as4 \stemUp <es c'>4 \stemUp <es des'>8 [ \stemUp <es c'>8 ~ ] ~ |
	\stemUp <es c'>4 \stemUp <es as>4 \stemUp es4 \stemUp es4 |
	\barNumberCheck #60 \stemUp <f c'>4 \stemUp as4 \stemUp <f c'>4 \stemUp as4 |
	\stemUp <f c'>4 \stemUp as4 \stemUp <f c'>4 \stemUp as4 |
	\stemUp <es c'>4 \stemUp as4 \stemUp <es c'>4 \stemUp <es des'>8 [ \stemUp <es c'>8 ~ ] ~ |
	\stemUp <es c'>4 \stemUp <es c'>8 [ \stemUp <es es'>8 ~ ] ~ \stemUp <es es'>8 \stemUp <des des'>4 \stemUp <c c'>8 |
	r4 \stemUp f8 [ \stemUp c'8 ~ ] \stemDown c4 \stemUp f,8 [ \stemUp c'8 ] |
	r8 \stemUp f,8 [ \stemUp f8 \stemUp c'8 ~ ] \stemDown c4 \stemUp f,8 [ \stemUp c'8 ] |
	r8 \stemUp f,8 [ \stemUp f8 \stemUp c'8 ~ ] \stemUp c8 [ \stemUp <es, c'>8 \stemUp <es des'>8 \stemUp <es c'>8 ] |
	\stemUp <es c'>8 [ \stemUp as8 \stemUp as8 \stemUp es8 ] \stemUp es8 [ \stemUp as8 ] \stemUp as4 |
	r8 \stemUp f8 [ \stemUp f8 \stemUp c'8 ~ ] \stemUp c8 [ \stemUp f,8 \stemUp f8 \stemUp c'8 ] |
	r4 \stemUp f,8 [ \stemUp c'8 ~ ] \stemUp c8 [ \stemUp f,8 \stemUp f8 \stemUp c'8 ] |
	\barNumberCheck #70 r8 \stemUp f,8 [ \stemUp f8 \stemUp c'8 ] r8 \stemUp <es, c'>8 [ \stemUp <es des'>8 \stemUp <es c'>8 ] |
	\stemDown <c' es>8 [ \stemDown <bes des>8 \stemDown <bes des>8 \stemDown <as c>8 ] \stemUp <g bes>8 [ \stemUp <f as>8 \stemUp <g bes>8 \stemUp <as c>8 ~ ] ~ |
	\stemDown <as c>2 -\mf r8 \stemUp f8 [ \stemUp bes8 \stemUp as8 ~ ] |
	\stemUp as2 r8 \stemUp es8 [ r8 \stemUp as8 ] |
	\stemUp as8 [ \stemUp c,8 \stemUp c8 \stemUp c8 ~ ] \stemUp c8 [ \stemUp <c g'>8 \stemUp <c bes'>8 \stemUp <c as'>8 ~ ] ~ |
	\stemUp <c as'>2 ~ ~ \stemUp <c as'>8 [ \stemUp <f as>8 \stemUp <g bes>8 \stemUp <as c>8 ~ ] ~ |
	\stemDown <as c>2 \stemUp f8 [ \stemUp as8 \stemUp bes8 \stemUp as8 ~ ] |
	\stemUp as2 r8 \stemUp des,8 [ r8 \stemUp as'8 ] |
	\stemUp as8 [ \stemUp g8 \stemUp g8 \stemUp g8 ~ ] \stemUp g4 \stemDown f8 [ \stemDown <c' c'>8 ~ ] ~ |
	\stemDown <c c'>8 -> [ \stemDown <c c'>8 -> \stemDown <des des'>8 -> \stemDown <c c'>8 -> ] r8 \stemUp <c, f>8 [ -\f \stemUp <c f>8 \stemUp <c g'>8 ] |
	\barNumberCheck #80 \stemUp <des as'>8 [ \stemUp g8 ] \stemUp as4 \stemUp <des, as'>8 [ \stemUp g8 ] \stemUp as4 |
	r8 \stemUp <es as>16 [ \stemUp g16 ] \stemUp as8 [ \stemUp as8 ~ ] \stemUp as8 \stemUp g4 \stemUp as8 |
	\stemUp <es g>4 \stemUp es8 [ \stemUp es8 ~ ] \stemUp es8 \stemUp <es g>4 \stemUp <es g>8 |
	\stemUp <es g>8 [ \stemUp <es as>8 ] \stemUp <es as>4 ~ ~ \stemUp <es as>8 [ \stemUp f8 \stemUp f8 \stemUp g8 ] |
	\stemUp <des as'>8 [ \stemUp g8 ] \stemUp as4 \stemUp <des, as'>8 [ \stemUp g8 ] \stemUp as4 |
	r8 \stemUp <es as>16 [ \stemUp g16 ] \stemUp as8 [ \stemUp as8 ~ ] \stemUp as8 \stemUp <es g>4 \stemUp <es as>8 |
	\stemUp <es bes'>4 \stemUp <es bes'>8 [ \stemUp <es c'>8 ~ ] ~ \stemUp <es c'>8 \stemUp <es c'>4 \stemUp <es des'>8 |
	\stemUp <es des'>8 [ \stemUp <es c'>8 ] \stemUp <es c'>4 \stemUp f8 [ \stemUp f8 \stemUp <f as>8 \stemUp <f as>8 ] |
	\stemUp <f c'>8 [ \stemUp as8 ] \stemUp <f c'>4 \stemDown <as f'>8 [ \stemDown c8 ] \stemDown <as f'>4 |
	\stemDown <c as'>8 [ \stemDown f8 ] \stemDown <c as'>4 ~ ~ \stemDown <c as'>8 [ \stemDown <c as'>8 ~ ] ~ \stemDown <c as'>8 [ \stemDown <c f>16 \stemDown g'16 ] |
	\barNumberCheck #90 \stemDown <c, as'>8 [ \stemDown <c g'>8 \stemDown <c g'>8 \stemDown <c f>8 ] \stemDown <c f>8 [ \stemDown c8 \stemDown <f, c'>8 \stemDown <f bes>8 ] |
	\stemDown <g c>8 [ \stemDown <g f'>8 ] \stemDown <g f'>4 \stemUp f4 \stemUp <f as>4 |
	\stemUp <f c'>8 [ \stemUp <f as>8 ] \stemUp <f c'>4 \stemDown <as f'>8 [ \stemDown <as c>8 ] \stemDown <as f'>4 |
	\stemDown <c as'>8 [ \stemDown <c f>8 ] \stemDown <c as'>4 ~ ~ \stemDown <c as'>8 \stemDown <c g'>4 \stemDown <c as'>8 |
	\stemDown <c g'>4 \stemDown <c f>8 [ \stemDown <c f>8 ~ ] ~ \stemDown <c f>2 \bar "||" |
	\key bes \major |
	r4 r4 r8 \stemUp <d, g>8 [ \stemUp <d g>8 \stemUp <d a'>8 ] |
	\stemUp <es bes'>8 [ \stemUp a8 ] \stemUp <es bes'>4 \stemUp <es bes'>8 [ \stemUp a8 ] \stemUp <es bes'>4 |
	r8 \stemUp <f bes>16 [ \stemUp a16 ] \stemDown bes8 [ \stemDown bes8 ~ ] \stemDown bes8 \stemUp <f a>4 \stemUp <f bes>8 |
	\stemUp <d a'>4 \stemUp <d f>8 [ \stemUp <d f>8 ] \stemUp d8 \stemUp <d a'>4 \stemUp <d a'>8 |
	\stemUp <f a>8 [ \stemUp <f bes>8 ] \stemUp <f bes>4 ~ ~ \stemUp <f bes>8 [ \stemUp g8 \stemUp g8 \stemUp a8 ] |
	\barNumberCheck #100 \stemUp <es bes'>8 [ \stemUp a8 ] \stemUp <es bes'>4 \stemUp <es bes'>8 [ \stemUp a8 ] \stemUp <es bes'>4 |
	r8 \stemUp <f bes>16 [ \stemUp a16 ] \stemDown bes8 [ \stemDown bes8 ~ ] \stemDown bes8 \stemUp <f a>4 \stemUp <f bes>8 |
	\stemUp <f c'>4 \stemUp <f c'>8 [ \stemUp <f d'>8 ~ ] ~ \stemDown <f d'>8 \stemUp <f d'>4 \stemDown <f es'>8 |
	\stemUp <f es'>8 [ \stemUp <f d'>8 ] \stemUp <f d'>4 \stemUp <d g>8 [ \stemUp <d g>8 \stemUp <d bes'>8 \stemUp <d bes'>8 ] |
	\stemUp <g d'>8 [ \stemUp <g bes>8 ] \stemDown <g d'>4 \stemDown <bes g'>8 [ \stemDown <bes d>8 ] \stemDown <bes g'>4 |
	\stemDown <d a'>8 [ \stemDown d8 ] \stemDown <d a'>4 ~ ~ \stemDown <d a'>8 [ \stemDown <d bes'>8 ~ ] ~ \stemDown <d bes'>8 [ \stemDown <d g>16 \stemDown a'16 ] |
	\stemDown <d, bes'>8 [ \stemDown <d a'>8 \stemDown <d a'>8 \stemDown <d g>8 ] \stemDown <d g>8 [ \stemDown <g, d'>8 \stemDown <g d'>8 \stemDown <g c>8 ] |
	\stemDown <a d>8 [ \stemDown <d g>8 ] \stemDown <d g>4 \stemUp g,4 \stemUp <g bes>4 |
	\stemUp <g d'>8 [ \stemUp <g bes>8 ] \stemDown <g d'>4 \stemDown <bes g'>8 [ \stemDown <bes d>8 ] \stemDown <bes g'>4 |
	\stemDown <d bes'>8 [ \stemDown <d g>8 ] \stemDown <d bes'>4 ~ ~ \stemDown <d bes'>8 \stemDown <d a'>4 \stemDown <d bes'>8 |
	\barNumberCheck #110 \stemDown <d a'>4 \stemDown <d g>8 [ \stemDown <d g>8 ~ ] ~ \stemDown <d g>2 |
	r4 \stemUp a,4 \stemUp bes2 \repeat volta 2 {
		|
		r4 \stemUp a'8 [ \stemUp bes8 ~ ] \stemDown bes2 |
		r4 \stemUp a8 [ \stemUp bes8 ~ ] \stemDown bes2 |
		r4 \stemUp d,8 [ \stemUp a'8 ~ ] \stemUp a2 
	}
	\alternative {
		{
			|
			bes1 
		}
		{
			|
			<bes, g'>1 \fermata 
		}
		
	}
	
}


PartPOneVoiceOneChords = \chordmode {
	\repeat volta 2 {
		|
		g4:m5 s8 s8 s2 |
		es4:5 s8 s8 s2 |
		f4:5 s8 s8 s2 
	}
	\alternative {
		{
			|
			g1:m5 
		}
		{
			|
			g2:m5 s8 s8 s8 s8 
		}
		
	}
	|
	g8:m5 s8 s4 s8 s4 s8 |
	es4:5 s8 s8 s8 s4 s8 |
	f2:5 s8 s8 s8 s8 |
	bes4:5 s8 s8 f4:5/+a s8 s8 |
	\barNumberCheck #10 g2:m5 s8 s8 s8 s8 |
	es4:5 s8 s8 s8 s4 s8 |
	f2:5 s8 s8 s8 s8 |
	bes4:5 s8 s8 f8:5/+a s4 s8 |
	g4:m5 s8 s8 s8 s8 s8 s8 |
	c2.:m5 s8 s8 |
	d8:5 s8 s8 s8 d8:5/+fis s8 s8 s8 |
	g2:m5 s8 s8 s8 s8 |
	bes2.:5/+d s8 s8 |
	c2.:m9 s8 s8 |
	\barNumberCheck #20 d8:5 s8 s8 s8 s8 s8 s8 s8 |
	d4:5/+fis s8 s8 s8 s8 s8 s8 |
	g8:m5 s8 s4 s8 s8 s8 s8 |
	es4:5 s8 s8 s8 s4 s8 |
	f4.:5 s8 s8 s8 s8 s8 |
	bes4:5 s8 s8 f4:5/+a s8 s8 |
	g2:m5 s8 s8 s8 s8 |
	es4:5 s8 s8 s8 s4 s8 |
	f2:5 s8 s8 s8 s8 |
	bes4:5 s8 s8 f8:5/+a s4 s8 |
	\barNumberCheck #30 g4:m5 s8 s8 s8 s8 s8 s8 |
	c2:m5 s8 s8 s8 s8 |
	d8:5 s8 s8 s8 d8:5/+fis s8 s8 s8 |
	g2:m5 s8 s8 s8 s8 |
	c2:m5 s8 s8 s8 s8 |
	es2:5 s8 s8 s8 s8 |
	d8:5 s8 s8 s8 s8 s8 s8 s8 |
	d4:5/+fis s8 s8 s8 s8 s4 |
	g4:m5 s4 s2 |
	s4 s4 s8 s8 s8 s8 |
	\barNumberCheck #40 es8:5 s8 s4 s8 s8 s4 |
	f8:5 s16 s16 s8 s8 s8 s8 s8 s8 |
	g4:m5 s8 s8 s8 s4 s8 |
	d8:m5 s8 s4 s8 s8 s8 s8 |
	es8:5 s8 s4 s8 s8 s4 |
	f8:5 s16 s16 s8 s8 s8 s4 s8 |
	g4:m5 s8 s8 s8 s4 s8 |
	d8:m5 s8 s4 s8 s8 s8 s8 |
	es8:5 s8 s4 s8 s8 s8 s8 |
	f8:5 s16 s16 s8 s8 s8 s8 s8 s8 |
	\barNumberCheck #50 g4:m5 s8 s8 s8 s8 s8 s8 |
	s8 d8:m5 s4 s8 s8 s8 s8 |
	es8:5 s8 s4 s8 s8 s8 s8 |
	f4:5 s8 s8 s8 s8 s8 s8 |
	g2:m5 s8 s8 s4 |
	g4:m5 s4 s4 s4 |
	f4:m5 s4 s4 s4 |
	des4:5 s4 s4 s4 |
	es4:5 s4 s4 s8 s8 |
	as4:5 s4 es4:5/+g s4 |
	\barNumberCheck #60 f4:m5 s4 s4 s4 |
	des4:5 s4 s4 s4 |
	es4:5 s4 s4 s8 s8 |
	as4:5 s8 s8 es8:5/+g s4 s8 |
	f4:m5 s8 s8 s4 s8 s8 |
	des8:5 s8 s8 s8 s4 s8 s8 |
	es8:5 s8 s8 s8 s8 s8 s8 s8 |
	as8:5 s8 s8 s8 es8:5/+g s8 s4 |
	f8:m5 s8 s8 s8 s8 s8 s8 s8 |
	des4:5 s8 s8 s8 s8 s8 s8 |
	\barNumberCheck #70 es8:5 s8 s8 s8 s8 s8 s8 s8 |
	as8:5 s8 s8 s8 es8:5/+g s8 s8 s8 |
	f2:m5 s8 s8 s8 s8 |
	des2:5 s8 s8 s8 s8 |
	c8:5 s8 s8 s8 c8:5/+e s8 s8 s8 |
	f2:m5 s8 s8 s8 s8 |
	bes2:m5 s8 s8 s8 s8 |
	des2:5 s8 s8 s8 s8 |
	c8:5 s8 s8 s8 s4 s8 s8 |
	c8:5 s8 s8 s8 s8 s8 s8 s8 |
	\barNumberCheck #80 des8:5 s8 s4 s8 s8 s4 |
	es8:5 s16 s16 s8 s8 s8 s4 s8 |
	f4:m5 s8 s8 s8 s4 s8 |
	c8:m5 s8 s4 s8 s8 s8 s8 |
	des8:5 s8 s4 s8 s8 s4 |
	es8:5 s16 s16 s8 s8 s8 s4 s8 |
	f4:m5 s8 s8 s8 s4 s8 |
	c8:m5 s8 s4 s8 s8 s8 s8 |
	des8:5 s8 s4 s8 s8 s4 |
	es8:5 s8 s4 s8 s8 s8 s16 s16 |
	\barNumberCheck #90 f8:m5 s8 s8 s8 s8 s8 s8 s8 |
	c8:m5 s8 s4 s4 s4 |
	des8:5 s8 s4 s8 s8 s4 |
	es8:5 s8 s4 s8 s4 s8 |
	f4:m5 s8 s8 s2 \bar "||" fis4:m5 s4 s8 g8:m5 s8 s8 |
	es8:5 s8 s4 s8 s8 s4 |
	f8:5 s16 s16 s8 s8 s8 s4 s8 |
	g4:m5 s8 s8 s8 s4 s8 |
	d8:m5 s8 s4 s8 s8 s8 s8 |
	\barNumberCheck #100 es8:5 s8 s4 s8 s8 s4 |
	f8:5 s16 s16 s8 s8 s8 s4 s8 |
	g4:m5 s8 s8 s8 s4 s8 |
	d8:m5 s8 s4 s8 s8 s8 s8 |
	es8:5 s8 s4 s8 s8 s4 |
	f8:5 s8 s4 s8 s8 s8 s16 s16 |
	g8:m5 s8 s8 s8 s8 s8 s8 s8 |
	d8:m5 s8 s4 s4 s4 |
	es8:5 s8 s4 s8 s8 s4 |
	f8:5 s8 s4 s8 s4 s8 |
	\barNumberCheck #110 g4:m5 s8 s8 s2 |
	g4:m5 s4 s2 \repeat volta 2 {
		|
		g4:m5 s8 s8 s2 |
		es4:5 s8 s8 s2 |
		f4:5 s8 s8 s2 
	}
	\alternative {
		{
			|
			g1:m5 
		}
		{
			|
			g1:m5 
		}
		
	}
	
}


PartPOneVoiceTwo = \relative es' {
	\repeat volta 2 {
		\repeat volta 2 {
			\clef "treble" \key bes \major \numericTimeSignature \time 4/4 s1*3 
		}
		\alternative {
			{
				s1 
			}
			
		}
		
	}
	\alternative {
		{
			s1 
		}
		
	}
	s1*3 s1*4 s1*4 s1*4 s1*4 s1*4 s1*4 s1*4 s1*3 \stemDown es2 \stemDown es2 s1*3 \stemDown es2 \stemDown es2 s1*4 s1*4 s1 s1 s1 |
	\key as \major s1*3 s1*4 s1*4 s1*4 s1*4 s1*3 s1*4 s1*4 s1*4 s1 s1 s1 s1 s1 \bar "||" |
	\key bes \major s1*4 s1*4 s1*3 s1*3 s1*3 \repeat volta 2 {
		s1 s1*2 
	}
	\alternative {
		{
			s1 
		}
		{
			s1 
		}
		
	}
	
}


PartPOneVoiceFive = \relative g {
	\repeat volta 2 {
		\repeat volta 2 {
			\clef "bass" \key bes \major \numericTimeSignature \time 4/4 \stemDown g8 [ \sustainOn \stemDown d'8 ~ ] \stemDown d2. |
			\stemDown es,8 [ \sustainOn \stemDown bes'8 ~ ] \stemDown bes2. |
			\stemDown f8 [ \sustainOn \stemDown c'8 ~ ] \stemDown c2. 
		}
		\alternative {
			{
				|
				\stemDown g8 [ \sustainOn \stemDown a8 \stemDown bes8 \stemDown d8 ~ ] \stemDown d8 [ \stemDown es8 ~ ] \stemDown es4 
			}
			
		}
		
	}
	\alternative {
		{
			|
			\stemDown g,8 [ \sustainOn \stemDown a8 \stemDown bes8 \stemDown d8 ~ ] \stemDown d8 r8 r4 
		}
		
	}
	|
	\stemDown g,,8 [ \sustainOn \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes4 \stemUp <g, g'>4 |
	\stemUp <es es'>8 [ -\markup { \bold { Simile } } \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown g8 ] \stemDown a4 \stemUp <f, f'>4 \stemDown <bes bes'>8 [ \stemDown f'8 ] \stemDown bes4 \stemDown <a, a'>8 [ \stemDown f'8 ] \stemDown a4 \stemDown <g, g'>8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes4 \stemUp <g, g'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown g8 ] \stemDown a4 \stemUp <f, f'>4 \stemDown <bes bes'>8 [ \stemDown f'8 ] \stemDown bes4 \stemDown <a, a'>8 [ \stemDown f'8 ] \stemDown a4 \stemDown <g, g'>8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes4 \stemUp <g, g'>4 \stemUp <c, c'>8 [ \stemUp g'8 \stemUp c8 \stemUp es8 ] \stemDown g8 [ \stemDown bes8 ] \stemUp <c,, c'>4 \stemUp <d d'>8 [ \stemUp a'8 ] \stemDown d4 \stemUp <fis, fis'>8 [ \stemUp d'8 ] \stemDown fis4 \stemDown <g, g'>8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes4 \stemUp <g, g'>4 \stemUp <d d'>8 [ \stemUp bes'8 \stemUp d8 \stemUp f8 ] \stemDown a8 [ \stemDown bes8 ] \stemUp bes,4 \stemUp c8 [ \stemUp g'8 \stemUp bes8 \stemDown d8 ] \stemDown es8 [ \stemUp g,8 ] \stemUp c,4 \stemUp <d, d'>8 [ \stemUp a'8 \stemUp d8 \stemUp fis8 ] \stemDown a4 \stemUp <d,, d'>4 \stemDown <fis fis'>8 [ \stemDown d'8 \stemDown fis8 \stemDown a8 ~ ] \stemDown a2 \stemDown g,8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes4 \stemUp <g, g'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown g8 ] \stemDown a4 \stemUp <f, f'>4 \stemDown <bes bes'>8 [ \stemDown f'8 ] \stemDown bes4 \stemDown <a, a'>8 [ \stemDown f'8 ] \stemDown a4 \stemDown <g, g'>8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes4 \stemUp <g, g'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown g8 ] \stemDown a4 \stemUp <f, f'>4 \stemDown <bes bes'>8 [ \stemDown f'8 ] \stemDown bes4 \stemDown <a, a'>8 [ \stemDown f'8 ] \stemDown a4 \stemDown <g, g'>8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes4 \stemUp <g, g'>4 \stemUp <c, c'>8 [ \stemUp g'8 \stemUp c8 \stemUp es8 ] \stemDown g4 \stemUp <c,, c'>4 \stemUp <d d'>8 [ \stemUp a'8 ] \stemDown d4 \stemUp <fis, fis'>8 [ \stemUp d'8 ] \stemDown fis8 r8 \stemDown <g, g'>8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes4 \stemUp <g, g'>4 \stemUp <c, c'>8 [ \stemUp g'8 \stemUp c8 \stemUp es8 ] \stemDown g4 \stemUp <c,, c'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemUp <d d'>8 [ \stemUp a'8 ] \stemDown d4 \stemUp a4 \stemUp d,4 \stemDown <fis fis'>8 [ \stemDown d'8 \stemDown fis8 \stemDown a8 ] r4 \stemUp <fis, fis'>4 \stemDown g8 -> -. [ \stemDown d'8 -> -. \stemDown bes'8 -> -. \stemDown a8 -> -. ] r8 \stemDown g8 -> -. [ r8 \stemDown d8 -> -. ] \stemDown es8 -> -. [ r8 \stemDown g8 -> -. \stemDown a8 -> -. ] r4 \stemUp <g, g'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>8 [ \stemUp bes'8 ] \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown a8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown <g g'>8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown g4 \stemDown d4 \stemUp <d, d'>8 [ \stemUp a'8 \stemUp d8 \stemUp f8 ] \stemDown a4 \stemUp <d,, d'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown a8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown <g g'>8 [ \stemDown d'8 \stemDown g8 \stemDown bes8 ] \stemDown d4 \stemUp <g,, g'>4 \stemUp <d d'>8 [ \stemUp a'8 \stemUp d8 \stemUp f8 ] \stemDown a4 \stemUp <d,, d'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown a8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown <g g'>8 [ \stemDown d'8 \stemDown g8 \stemDown bes8 ] \stemDown d4 \stemUp <g,, g'>4 \stemUp <d d'>8 [ \stemUp a'8 \stemUp d8 \stemUp f8 ] \stemDown a4 \stemUp <d,, d'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown a8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown g8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ~ ] \stemDown a4 \stemDown d,4 \stemUp g,8 [ \stemUp d'8 ] \stemDown g2 r4 |
	\key as \major |
	\stemDown <f, f'>8 [ \sustainOn \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c2 \stemUp <des,, des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as2 \stemUp <es, es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes2 |
	\stemDown <as, as'>8 [ \sustainOn \stemDown es'8 \stemDown as8 \stemDown es8 ] \stemDown g,8 [ \sustainOn \stemDown es'8 \stemDown g8 \stemDown es8 ] |
	\barNumberCheck #60 \stemDown <f, f'>8 [ \sustainOn \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c2 \stemUp <des,, des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as2 \stemUp <es, es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes2 \stemDown <as, as'>8 [ \stemDown es'8 \stemDown as8 \stemDown es8 ] \stemDown g,8 [ \stemDown es'8 \stemDown g8 \stemDown es8 ] \stemDown <f, f'>8 [ \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c4 \stemUp <f,, f'>4 \stemUp <des des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as4 \stemUp <des,, des'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown as8 [ \stemDown es'8 \stemDown as8 \stemDown es8 ] \stemDown <g, g'>8 [ \stemDown es'8 \stemDown g8 \stemDown es8 ] \stemDown <f, f'>8 [ \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c4 \stemUp <f,, f'>4 \stemUp <des des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as4 \stemUp <des,, des'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <as as'>8 [ \stemDown es'8 \stemDown as8 \stemDown es8 ] \stemDown <g, g'>8 [ \stemDown es'8 \stemDown g8 \stemDown es8 ] \stemDown f,8 [ \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c4 \stemUp <f,, f'>4 \stemUp <des des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as4 \stemUp <des,, des'>4 \stemUp <c c'>8 [ \stemUp g'8 ] \stemUp c4 \stemUp <e, e'>8 [ \stemUp c'8 ] \stemDown e8 r8 \stemDown <f, f'>8 [ \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown <bes bes'>8 [ \stemDown f'8 \stemDown bes8 \stemDown des8 ~ ] \stemDown des4 \stemUp bes,4 \stemUp <des, des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as4 \stemUp <des,, des'>4 \stemUp <c c'>8 [ \stemUp g'8 \stemUp c8 \stemUp e8 ] \stemDown g4 \stemUp c,8 [ \stemUp g8 ] \stemUp <c, c'>8 -> [ \stemUp <c c'>8 -> \stemUp <d d'>8 -> \stemUp <e e'>8 -> ] r4 \stemUp <c c'>4 \stemUp <des des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as4 \stemUp <des,, des'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c4 \stemUp <f,, f'>4 \stemUp <c c'>8 [ \stemUp g'8 \stemUp c8 \stemUp es8 ] \stemDown g4 \stemUp <c,, c'>4 \stemUp <des des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as4 \stemUp <des,, des'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c4 \stemUp <f,, f'>4 \stemUp <c c'>8 [ \stemUp g'8 \stemUp c8 \stemUp es8 ] \stemDown g4 \stemUp <c,, c'>4 \stemUp <des des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as4 \stemUp <des,, des'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c4 \stemUp <f,, f'>4 \stemUp <c c'>8 [ \stemUp g'8 \stemUp c8 \stemUp es8 ] \stemDown g4 \stemUp <c,, c'>4 \stemUp <des des'>8 [ \stemUp as'8 \stemUp des8 \stemUp f8 ] \stemDown as4 \stemUp <des,, des'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown as8 ] \stemDown c8 [ \stemDown as8 \stemDown f8 \stemDown c8 ] \bar "||" |
	\key bes \major \stemUp fis,8 [ \stemUp cis'8 \stemUp fis8 \stemUp cis8 ] \stemUp g8 [ \stemUp d'8 \stemUp g8 \stemUp d8 ] \stemUp <es, es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown a8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown <g g'>8 [ \stemDown d'8 \stemDown g8 \stemDown bes8 ] \parenthesize \stemDown d4 \stemUp <g,, g'>4 \stemUp <d d'>8 [ \stemUp a'8 \stemUp d8 \stemUp f8 ] \stemDown a4 \stemUp <d,, d'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown a8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown <g g'>8 [ \stemDown d'8 \stemDown g8 \stemDown bes8 ] \stemDown d4 \stemUp <g,, g'>4 \stemUp <d d'>8 [ \stemUp a'8 \stemUp d8 \stemUp f8 ] \stemDown a4 \stemUp <d,, d'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown a8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown <g g'>8 [ \stemDown d'8 \stemDown g8 \stemDown bes8 ] \stemDown d4 \stemUp <g,, g'>4 \stemUp <d d'>8 [ \stemUp a'8 \stemUp d8 \stemUp f8 ] \stemDown a4 \stemUp <d,, d'>4 \stemUp <es es'>8 [ \stemUp bes'8 \stemUp es8 \stemUp g8 ] \stemDown bes4 \stemUp <es,, es'>4 \stemDown <f f'>8 [ \stemDown c'8 \stemDown f8 \stemDown a8 ] \stemDown c4 \stemUp <f,, f'>4 \stemDown g8 [ \stemDown d'8 \stemDown g8 \stemDown a8 ] \stemDown bes8 [ \stemDown a8 \stemDown g8 \stemDown d8 ] \stemUp g,8 [ \stemUp d'8 ] \stemDown g4 \stemUp g,2 \repeat volta 2 {
		\stemDown g'8 [ \stemDown d'8 ~ ] \stemDown d2. \stemDown es,8 [ \stemDown bes'8 ~ ] \stemDown bes2. \stemDown f8 [ \stemDown c'8 ~ ] \stemDown c2. 
	}
	\alternative {
		{
			\stemDown g8 [ \stemDown a8 \stemDown bes8 \stemDown d8 ~ ] \stemDown d8 [ \stemDown es8 ~ ] \stemDown es4 
		}
		{
			<g,,, g'>1 \fermata 
		}
		
	}
	
}


\score {
	<<
		\context ChordNames = "PartPOneVoiceOneChords" {
			\PartPOneVoiceOneChords 
		}
		
		\new PianoStaff <<
			\set PianoStaff.instrumentName = "[Piano] (a)" 
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

