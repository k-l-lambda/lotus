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
	\relative c' {
		c d e f
		\lotusRepeatABA {
			{
				e ^\markup { \musicglyph #"scripts.segno" } d c2 ^\markup {Fine}
			}
			\bar "|."
			d4 e f g ^\markup {D.S. al Fine}
		}

		\bar "||"
	}
	
	\layout {
	}
	
	\midi {
	    \tempo 4 = 120
	}
	
}


