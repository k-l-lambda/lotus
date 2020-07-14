\version "2.20.0" 

\header {
	encodingsoftware = "Finale 2014.5 for Mac" 
	encodingdate = "2017-04-01" 
	copyright = "?" 
	title = "知   更   鸟" 
}


#(set-global-staff-size 24) 

\paper {
	paper-width = 24.34\cm 
	paper-height = 22.36\cm 
	top-margin = 0.99\cm 
	bottom-margin = 1.67\cm 
	left-margin = 0.99\cm 
	right-margin = 0.89\cm 
	between-system-space = 2.05\cm 
	page-top-space = 1.19\cm 
	ragged-last = ##t 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative g' {
	\clef "treble" \key c \major \time 3/4 |
	\stemUp g4 ( ^5 s2 |
	\stemUp e4 ) ^3 r4 \stemUp g4 ( ^5 |
	\stemUp e4 ) ^3 r4 \stemUp g4 ( ^5 |
	\stemUp f2. ) ~ ^4 |
	\stemUp f4 r4 \stemDown g'4 ( ^5 |
	\stemDown f4 ) ^4 r4 \stemDown g4 ( ^5 |
	\stemDown f4 ) ^4 r4 \stemDown g4 ( ^5 |
	\stemDown e2. ) ~ ^3 |
	\stemDown e4 r4 \stemUp g,4 ( ^5 |
	\barNumberCheck #10 \stemUp e4 ) ^3 r4 \stemUp g4 ( ^5 |
	\stemUp e4 ) ^3 r4 \stemUp g4 ( ^5 |
	\stemUp f2. ) ~ ^4 |
	\stemUp f4 r4 \stemDown g'4 ( ^5 |
	\stemDown f4 ) ^4 r4 \stemDown e4 ( ^3 |
	\stemDown d4 ) ^2 r4 \stemDown e4 ( ^3 |
	\stemDown c2. ) ~ ^1 |
	\stemDown c4 r4 \bar "|." 
}


PartPOneVoiceTwo = \relative c' {
	\clef "bass" \key c \major \time 3/4 r4 s2 \stemDown c2. -\bendAfter #4 _2 \stemDown g2. _5 \stemDown b2. _3 \stemDown g2. _5 \stemDown b2. _3 \stemDown g2. _5 \stemDown c2. _2 \stemDown g2. _5 \stemDown c2. _2 \stemDown g2. _5 \stemDown b2. _3 \stemDown g2. _5 \stemDown b2. _3 \stemDown g2. _5 \stemDown c2. ~ _2 \stemDown c4 r4 \bar "|." 
}


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
		\tempo 4 = 120 
	}
	
}


