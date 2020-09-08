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
			{e d d2 \mark \markup { \musicglyph #"scripts.coda"} } |
			d4 _\markup {D. C. al Coda} e f g \bar "||" |
		}
		\mark \markup{\musicglyph #"scripts.coda"} c,1 \bar "|."
	}
	
	\layout {
	}
	
	\midi {
	    \tempo 4 = 120
	}
	
}


