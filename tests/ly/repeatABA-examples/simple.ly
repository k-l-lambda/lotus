\version "2.20.0" 

\language "english" 

\header {
}

\include "lotus.ly"


#(set-global-staff-size 40) 

\paper {
	paper-width = 26.94\cm
	paper-height = 25.85\cm
	ragged-last = ##t
}


\score {
	\relative g' {
		\lotusRepeatABA {
			{e d c2}
			\bar "||"
			d4 e f g
		}

		\bar "|."
	}
	
	\layout {
	}
	
	\midi {
	    \tempo 4 = 120
	}
	
}


