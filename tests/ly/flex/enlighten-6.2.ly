\version "2.20.0" 

\header {
	encodingdate = "2017-10-20" 
	encodingdescription = "Sibelius / MusicXML 3.0" 
	encoder = star 
	encodingsoftware = "Sibelius 8.1.1" 
}


#(set-global-staff-size 28.5714285714) 

\paper {
	paper-width = 21\cm 
	paper-height = 29.7\cm 
	top-margin = 1.5\cm 
	bottom-margin = 1.5\cm 
	left-margin = 1.5\cm 
	right-margin = 1.5\cm 
	between-system-space = 2.3\cm 
	indent = 1.61538461538\cm 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative c' {
	\clef "treble" \key c \major \time 4/4 \omit Staff.TimeSignature s1*4 |
	s1*5 \bar "|." 
}


PartPOneVoiceTwo = \relative g {
	\clef "bass" \key c \major \time 4/4 \omit Staff.TimeSignature |
	\stemDown g4 -\markup { \bold \tiny { 4}} \stemDown a4 -\markup { \bold \tiny { 3}} \stemDown a4 \stemDown b4 -\markup { \bold \tiny { 2}} |
	\stemDown c2 -\markup { \bold \tiny { 1}} \stemDown c2 \stemDown g4 \stemDown a4 \stemDown a4 \stemDown b4 c1 |
	\stemDown g4 -\markup { \bold \tiny { 4}} \stemDown a4 -\markup { \bold \tiny { 3}} \stemDown a4 \stemDown b4 -\markup { \bold \tiny { 2}} |
	\stemDown c4 -\markup { \bold \tiny { 1}} \stemDown b4 \stemDown b4 \stemDown a4 \stemDown g4 \stemDown a4 \stemDown b4 \stemDown b4 \stemDown c4 \stemDown c4 \stemDown c2 \bar "|." 
}


\score {
	<<
		<<
			\new Staff <<
				\context Staff <<
					\mergeDifferentlyDottedOn 
					\mergeDifferentlyHeadedOn 
					\context Voice = "PartPOneVoiceTwo" {
						\voiceTwo \PartPOneVoiceTwo 
					}
					
				>>
				
			>>
			
		>>
		
	>>
	
	\layout {
	}
	
	\midi {
		\tempo 4 = 100 
	}
	
}


naturalWidth = 0.8728855681779493 

naturalHeight = 0.04393247544783527 
