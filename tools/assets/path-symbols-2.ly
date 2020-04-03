
\paper {
    paper-width = 2000\cm
    paper-height = 100\cm
    %#(layout-set-staff-size 20)
}


\new PianoStaff <<
	\context Staff = "1" <<
	\relative c'{
		\clef "treble"
		r1
		\clef "bass"
		(c4\sustainOn d e g)
		<c, f a>1 \arpeggio \sustainOff
		c4\sostenutoOn e g c,
		<bes d f>1\sostenutoOff
		\set Staff.pedalSustainStyle = #'bracket
		c4\sustainOn g c d
		d\sustainOff\sustainOn g, c2 \staccatissimo
	}
	>>
	\context Staff = "2"<<
	\relative c,{
		\clef "bass"
		r1
		\clef "tenor"
		c1
		\sfz
		\grace {fis'8 fes fisis feses f}
		c1\startTrillSpan
		c''4\staccato c\mordent b2\turn
		c4 ^\prall
		\mf
		c1\fermata
		\repeat volta 2 {c}
		c4 \segno
		c4 \coda
		c4 \varcoda
	}
	>>
	\context Staff = "3"<<
	\relative c{
		\clef "tenor"
		r1
		\clef "treble"
		(c'8 c16 c32 c64 c128)
		c'8 c16 c32 c64 c128
	}
	>>
>>
