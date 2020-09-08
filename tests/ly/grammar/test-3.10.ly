\version "2.20.0" 

\header {
	encodingsoftware = "Sibelius 8.2" 
	encodingdate = "2017-09-25" 
	copyright = "©" 
	title = "乐队表演" 
}


#(set-global-staff-size 28.5714285714) 

\paper {
	paper-width = 21.6\cm 
	paper-height = 27.95\cm 
	top-margin = 1.27\cm 
	bottom-margin = 1.27\cm 
	left-margin = 2.53\cm 
	right-margin = 1.27\cm 
	between-system-space = 3.75\cm 
	page-top-space = 1.82\cm 
	indent = 1.66153846154\cm 
}


\layout {
	\context {
		\Score 
		skipBars = ##t 
		autoBeaming = ##f 
	}
	
}


PartPOneVoiceOne = \relative f' {
	\clef "treble" \key c \major \numericTimeSignature \time 4/4 |
	\stemUp f2. -4 \stemUp e4 |
	f1 |
	\stemUp d2. \stemUp e4 |
	f1 \stemUp f2. \stemUp e4 |
	\stemUp d2 \stemUp e4 \stemUp d4 |
	c1 \bar "|." 
}


PartPOneVoiceFive = \relative c' {
	\clef "bass" \key c \major \numericTimeSignature \time 4/4 R1*4 R1*3 \bar "|." 
}


\score {
	<<
		\new PianoStaff <<
			\set PianoStaff.instrumentName = "SmartMusicSoftSynth" 
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
				\context Voice = "PartPOneVoiceFive" {
					\PartPOneVoiceFive 
				}
				
			>>
			
		>>
		
	>>
	
	\layout {
	}
	
	\midi {
		\tempo 4 = 60 
	}
	
}

