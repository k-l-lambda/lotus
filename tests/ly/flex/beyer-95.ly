\version "2.20.0" 

\header {
	encodingdate = "2017-05-03" 
	encodingsoftware = "Finale 2014.5 for Mac" 
}


#(set-global-staff-size 22.7288571429) 

\paper {
	paper-width = 21\cm 
	paper-height = 29.71\cm 
	top-margin = 0.99\cm 
	bottom-margin = 1.67\cm 
	left-margin = 0.99\cm 
	right-margin = 0.89\cm 
	between-system-space = 2.41\cm 
	page-top-space = 1.55\cm 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative f' {
	\clef "treble" \key f \major \numericTimeSignature \time 4/4 \partial 4 \stemUp f4 ( ^1 _\p |
	\stemUp f4 _\< \stemUp f4 \stemUp a4 ^2 \stemUp a4 |
	\stemDown d4 ^5 \stemDown d4 \stemDown c4. ) \stemDown c8 ( ^5 -\! |
	\stemUp a2 _\> \stemUp g2 |
	\stemUp f2 ) -\! r4 \stemUp f4 ( |
	\stemUp f4 _\< \stemUp f4 \stemUp a4 \stemUp a4 |
	\stemDown d4 \stemDown d4 \stemDown c4. ) \stemDown c8 ( ^5 |
	\stemUp a2 -\! _\> \stemUp g2 |
	\stemUp f2. ) r4 -\! |
	\stemUp e2 _- ^2 _\< \stemUp f4. _- \stemUp f8 ( |
	\barNumberCheck #10 \stemUp a4 _- \stemUp a4 _- \stemUp g4 _- \stemUp g4 _- |
	\stemUp d2 _- ^2 \stemUp c2 ) _- |
	\stemUp a'4 ( ^3 -\! _\mf \stemUp g4 ^1 \stemUp a4 \stemDown bes4 |
	\stemDown c4 \stemDown d4 \stemDown c4 ) \stemDown bes4 ( |
	\stemUp a4 ^2 \stemUp f4 ^1 \stemUp d4 ^2 \stemUp c4 |
	\stemUp a'2 ^5 _\> \stemUp g2 |
	\stemUp f2. ) -\! \bar "|." 
}


PartPOneVoiceTwo = \relative f' {
	\clef "bass" \key f \major \numericTimeSignature \time 4/4 \partial 4 \stemDown f4 ( _1 \stemDown e4 \stemDown d4 \stemDown c4 \stemDown d4 _1 \stemDown bes4 _2 \stemDown g4 \stemDown a4 _3 \stemDown bes4 ) ( \stemDown c4 \stemUp c,4 _5 \stemDown d4 \stemDown e4 \stemDown f4 \stemDown g4 _1 \stemDown a4 ) _3 \stemDown f'4 ( \stemDown e4 \stemDown d4 \stemDown c4 \stemDown d4 _1 \stemDown bes4 _2 \stemDown g4 \stemDown a4 _3 \stemDown bes4 ) ( \stemDown c4 \stemUp c,4 \stemDown d4 \stemDown e4 \stemDown f4 \stemDown g4 \stemDown a4 _3 \stemDown bes4 ) |
	\stemDown c4 ( \stemDown bes4 \stemDown a4 _1 \stemDown g4 \stemDown f4 \stemDown d4 \stemDown e4 \stemDown f4 \stemDown g4 \stemDown f4 \stemDown e4 \stemDown g4 ) \stemDown f4 ( \stemDown e4 \stemDown f4 \stemDown d'4 _1 \stemDown c4 \stemDown bes4 \stemDown a4 ) ( _1 \stemDown g4 _4 \stemDown f4 \stemDown a4 \stemDown bes4 \stemDown c4 \stemUp c,4 _5 \stemDown d4 \stemDown e4 \stemUp c4 \stemDown a'4 _1 \stemDown g4 \stemDown f4 ) \bar "|." 
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


naturalWidth = 1.9583841085847156 

naturalHeight = 0.1449771689778564 
