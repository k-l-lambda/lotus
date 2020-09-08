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
			{e ^\markup {to Coda \musicglyph #"scripts.coda"} d d2} |
			d4 ^\markup {D.C. al Coda} e f g \bar "||" |
		}
		c,1 ^\markup{\musicglyph #"scripts.coda"} \bar "|."
	}
	
	\layout {
	}
	
	\midi {
	    \tempo 4 = 120
	}
	
}


