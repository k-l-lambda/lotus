\version "2.20.0" 

\header {
	encodingdate = "2017-10-20" 
	encodingdescription = "Sibelius / MusicXML 3.0" 
	encoder = star 
	encodingsoftware = "Sibelius 8.1.1" 
}


#(set-global-staff-size 30) 

\paper {
	paper-width = 60.49\cm 
	paper-height = 48.61\cm 
	top-margin = 1.5\cm 
	bottom-margin = 1.5\cm 
	left-margin = 1.5\cm 
	right-margin = 1.5\cm 
	between-system-space = 2.3\cm 
	indent = 1.61538461538\cm 
	ragged-last = ##t 
}


\layout {
	\context {
		\Score 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative c' {
	\clef "treble" \key c \major \time 4/4 \omit Staff.TimeSignature s1*3 |
	s1*3 \bar "|." 
}


PartPOneVoiceTwo = \relative c' {
	\clef "bass" \key c \major \time 4/4 \omit Staff.TimeSignature |
	\stemDown c2 -\markup { \bold \tiny { 1}} \stemDown a2 -\markup { \bold \tiny { 3}} \stemDown c4 \stemDown c4 \stemDown a2 |
	\stemDown b4 -\markup { \bold \tiny { 2}} \stemDown b4 \stemDown c4 \stemDown c4 |
	\stemDown a4 -\markup { \bold \tiny { 3}} \stemDown a4 \stemDown a2 \stemDown b2 \stemDown c2 a1 \bar "|." 
}


\score {
	<<
		<<
			\new Staff <<
				\PartPOneVoiceTwo 
			>>
			
		>>
		
	>>
	
	\layout {
		indent = #0
	}
	
	\midi {
		\tempo 4 = 100 
	}
	
}


naturalWidth = 0.5934073683175274 

naturalHeight = 0.04393247544783527 
