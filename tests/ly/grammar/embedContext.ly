
up = {\stemUp \slurUp \tieUp \phrasingSlurUp}
down = {\stemDown \slurDown \tieDown \phrasingSlurDown}
sreset = {\stemNeutral \slurNeutral \tieNeutral \phrasingSlurNeutral}

% don't display the numbers (or brackets) on tuplets
tupletNumbersOff = {
	\override TupletBracket.bracket-visibility = ##f
	\override TupletBracket.number-visibility % number-visibility is deprecated. Tune the TupletNumber instead
 = ##f
}

% reset \tupletNumbersOff
tupletNumbersOn = {
	\revert TupletBracket.bracket-visibility
	\revert TupletBracket.number-visibility % number-visibility is deprecated. Tune the TupletNumber instead

}

% display the tuplet number for this next tuplet only
tupletNumbersOnce = { \once \override TupletBracket.number-visibility % number-visibility is deprecated. Tune the TupletNumber instead
 = ##t }

% options for breaking up tuplets
quarterTuplets = { \tupletSpan 4 }
halfBarTuplets = { \tupletSpan 2. }
wholeBarTuplets = { \tupletSpan 1*6/4 }

% shorter versions of the pedal commands
pd = \sustainOn
pu = \sustainOff


\relative c'''{
	\time 6/4
	\key bes \minor
	\clef treble
	
	%#(override-auto-beam-setting '(end * * * *) 6 8 'Staff)
	\set Staff.extraNatural = ##f
	
	\context Voice = main {
		
		\partial 2. bes8_\markup{\dynamic p \italic espress.}( c des a bes ges
		f4-.-\<)( f-. f-.) f-\! ges8-\>( f ees c-\!)
		des2-\>( bes4-\!) \tuplet 11/6 { bes'8( c des a bes a gis a c bes ges) }
		\wholeBarTuplets
		\tuplet 22/12 { f8[( ges e f bes-. a-. aes-. g-. ges-. f-. e-. ees-. d-. des-. c des c b c f e ees]) }
		des2->( bes4) bes'4-.-\<( bes-. bes-.-\!)
		% measure 5
		aes2._\markup{\dynamic{fz p}}( ~ << \context Voice = main { \up
			aes2 ~ aes8 ges
			\sreset
		} \\ { \down
			des4-> bes8-\< c des ges-\!
		} >>
		f2.->) ees4( f8-\> ees des beses-\!
		aes2) des4( ees_\markup{\italic smorz.} f8 ees des ees
		f2.) bes8-\p-\>\( c des a \acciaccatura c8 bes ges-\!\)
		f4-.-\<( f-. f-.-\!) f( ges8-\> f ees c-\!)
		% measure 10
		des2->( bes4) \tuplet 11/6 { bes'8( c des a bes \once \override Hairpin.extra-offset = #'(0.0 . -1.0)
			a-\< gis a c bes ges) }
		\once \override Hairpin.extra-offset = #'(0.0 . -1.0)
		\once \override TextScript.extra-offset = #'(0.0 . 0.8)
		\once \override OttavaBracket.extra-offset = #'(0.0 . 1.0)
		\tupletNumbersOff \quarterTuplets \tuplet 3/2 { f8-!-\!-\>_\markup{\italic legatissimo}[
			\ottava #1 f''( e] ees[ des c] bes[ ges f] e[ ees des] c-\![ bes a]
			\ottava #0 ges-\>[ f c-\!]) } \tupletNumbersOn
		des2-\>( bes4-\!) bes'4-.-\<( bes-. bes-.-\!)
		bes2->( d,4) ees-\trill( d8 ees ges8.-> f16)
		f2-\>( e4-\!) \acciaccatura { f16[ ges] } \halfBarTuplets \tuplet 7/6 { f8-\<\( e f g a-. bes-. c-.-\! }
		% measure 15
		\tupletNumbersOff des2_\markup{\dynamic f \italic appassionato} \tuplet 3/2 { bes8( ges? bes,)\) } des2->( c4)
			\tupletNumbersOn
		\acciaccatura bes8 f''4.->_\markup{\italic cresc.}( des8 \noBeam \tuplet 3/2 { bes ges bes,) }  des2->( c4)
		\acciaccatura bes8 \ottava #1 des''4_\markup{\italic{con forza}} ~ \tupletNumbersOff
			\tuplet 3/2 { des8[ bes-. ges-.] \ottava #0 des-.[ bes-. bes,-.] } ces2->( a4-\p \tupletNumbersOn
		bes2.) r2 r4
		\once \override TextScript.extra-offset = #'(0.0 . 1.6)
		<f f'>2.-\pp^\markup{\italic{sotto voce}}( <fes fes'>
		% measure 20
		<ees ees'>8 <f? f'?> <ees ees'>4 <c c'> <bes bes'> <aes aes'>2->
		<bes bes'>4-\< <c c'>2-> <des des'>4 <ees ees'>2->-\!
		<f f'>8 <ges ges'> <bes bes'>4-\> <aes aes'> <f f'>2.-\!)
		<f f'>2._\markup{\italic{poco rallent.}}( <e e'>
		<d d'>8-\ppp <e e'> <d d'>4 <a a'> <b b'>2.->)
		% measure 25
		<d d'>8( <e e'> <d d'>4 <a a'> <bes? bes'?>2.-\f^\markup{\italic{a tempo}})(
		<c c'>2._\markup{\italic cresc.} <des des'>2.)
		<f f'>2.-\p( <fes fes'>
		<ees ees'>8 <f? f'?> <ees ees'>4 <c c'> <bes bes'> <aes aes'>2->
		<bes bes'>4-\< <c c'>2-> <des des'>4 <ees ees'>2->
		% measure 30
		<f f'>8 <ges ges'>-\!-\> <bes bes'>4 <aes aes'> \acciaccatura <aes aes'>8\( <f f'>2.-\!\))
		<f f'>2._\markup{\italic{poco rallent.}}( <e e'>
		<d d'>8-\ppp <e e'> <d d'>4 <a a'> <b b'>2.->)
		<d d'>8( <e e'> <d d'>4 <a a'> <bes? bes'?>2.^\markup{\italic{a tempo}})(
		<c c'>2. <des des'>2.)
		% measure 35
		<ees ees'>2._\markup{\dynamic f \italic{poco stretto}}( <f f'>
		<ges ges'>4 <f f'>8-\< <ges ges'> <aes aes'> <bes bes'>-\!) <bes bes'>4-\>( <ees, ees'>-\!) <aes aes'>4-> ~
		<aes aes'>4( <bes bes'>8-\> <aes aes'> <ges ges'> <f f'>-\!)
			<f f'>4( <ges ges'>8-\> <f f'> <ees ees'> <des des'>-\!)
		<ees ees'>1_\markup{\dynamic{fz p}}^( ~ <ees ees'>4-\< <e e'>4-\!)
		<f f'>2._\markup{\italic{poco rallent.}}( <e e'>
		% measure 40
		<d d'>8-\ppp <e e'> <d d'>4 <a a'> <b b'>2.->)
		<d d'>8( <e e'> <d d'>4 <a a'> <bes? bes'?>2.-\f^\markup{\italic{a tempo}})(
		<c c'>2. <des des'>2.)
		<ees ees'>2._\markup{\dynamic f \italic{poco stretto}}( <f f'>
		<ges ges'>4 <f f'>8-\< <ges ges'> <aes aes'> <bes bes'>-\!) <bes bes'>4-\>( <ees, ees'>-\!) <aes aes'>4-> ~
		% measure 45
		<aes aes'>4( <bes bes'>8-\> <aes aes'> <ges ges'> <f f'>-\!)	
			<f f'>4( <ges ges'>8-\> <f f'> <ees ees'> <des des'>-\!)
		<ees ees'>1_\markup{\dynamic{fz p}}^( ~ <ees ees'>4-\< <e e'>4-\!)
		<f f'>2._\markup{\italic{poco rallent.}}( <e e'>
		<d d'>8-\ppp <e e'> <d d'>4 <a a'> <b b'>2.)
		<d d'>8( <e e'> <d d'>4 <a a'> <bes? bes'?>2.-\f^\markup{\italic{a tempo}})(
		% measure 50
		<c c'>2. <des des'>2.)
		<< \context Voice = main { \up
			f'2^>( ees8 f) ees2( des4)
			\sreset
		} \\ { \down
			<f, ces'>2.-\ff <f ces'>
		} >>
		<ces' aes'>4.( <des bes'>8 <ces aes'> <des bes'> <ces aes'>4.) r8 r4
		<< \context Voice = main { \up
			f2( ees8 f) ees2^>( des4)
			\sreset
		} \\ { \down
			<f, ces'>1 <f ces'>2
		} >>
		<ces' aes'>8( <des bes'> <ces aes'> <des bes'> <ces aes'> <des bes'> <ces aes'>2.)
		% measure 55
		<des' f>4.->_\markup{\italic{con forza}}( <ces ees>8 <aes ces> <f aes>) <ces f>2( <ces ees ges>4
		<< \context Voice = main { \up
			<ges' bes>2.^> <f aes>)
			\sreset
		} \\ { \down
			ces1.
		} >>
		<des f>4.->-\pp( <ces ees>8 <aes ces> <f aes>) <ces f>2^( << \context Voice = main { \up
			ges'4
			<ges bes>2.^> <f aes>)
			\sreset
		} \\ { \down
			<ces ees>4 ~ ces1.
		} >>
		R1.
		% measure 60
		R1.
		<des' f>2->_\markup{\dynamic ppp \italic legatissimo}( <aes ees'>8 <des f>) <aes ees'>2( <f des'>4)
		<f' aes>4.( <ges bes>8 <f aes> <ges bes> <f aes>4.) r8 r4
		<des f>2( <aes ees'>8 <des f>) <aes ees'>2( <f des'>4)
		<f' aes>8( <ges bes> <f aes> <ges bes> <f aes> <ges bes> <f aes>2.)
		% measure 65
		<des' f>4._\markup{\italic{sempre pianissimo}}( <aes ees'>8 <f des'> <f aes>) <des f>2( <ees ges>4
		<ges bes>2. <f aes>)
		<des f>1.->_\markup{\dynamic fz} ~
		<des f>1. ~
		<des f>1._\markup{\italic smorz.}
		% measure 70
		r2_\markup{\italic{rall. e dolciss.}} r4 bes'8( c des a-> bes-> ges)
		\once \override TextScript.extra-offset = #'(0.0 . 1.4)
		f4-.^\markup{\italic{a tempo}}( f-. f-.) f( ges8 f ees c
		des2 bes4) bes'8( c des a \tuplet 3/2 { c8 bes ges) }
		\tupletNumbersOff \tuplet 3/2 { f8[( ges e] f[) \ottava #1 f''_\markup{\italic legatissimo}( e]
			ees[ des c] } \tupletNumbersOn \halfBarTuplets \tuplet 20/6 { bes a ges f e ees des c bes a ges
			\ottava #0 f ges e? f b, c e ees des) }
		des2( bes4-\<) bes'4-.( bes-. bes-.-\!)
		% measure 75
		bes2-\>( d,4-\!) \tuplet 7/6 { ees8( f ees d ees ges8.-> f16) }
		f2-\>( e4-\!) f4^\trill^\markup{\flat} \grace { e16[( f] } g8-\<)-.( a-. bes-. c-.-\!)
		des2-\f( \tuplet 3/2 { bes8 ges? bes,) } des2->( c4)
		\acciaccatura bes8 f''4._\markup{\italic cresc.}( des8 \noBeam \tuplet 3/2 { bes ges bes,) }  des2->( c4)
		\acciaccatura bes8 \ottava #1 des''4-\ff ~ \tupletNumbersOff \tuplet 3/2 { des8[ bes-. ges-.]
			\ottava #0 des-.[ bes-. bes,-.] } ces2->( a4_\markup{\italic dimin.}
		% measure 80
		bes2.-\p) ces2->( a4
		bes2._\markup{\italic smorz.}) ces16->[( ees ges ces] ees8) r8 r8 a,,8(
		\break			% including this makes a system look horrible for a4, but leaving it out makes that
						% system look horrible for both a4 and letter.
		bes2) r4 <ees' ges>2.->-\ff ~
		<ees ges>8_\markup{\italic accelerando} <ces ees>-> <a ces>-> <ges a>-> <ees ges>-> <ces ees>->
			\stemDown <a ces>->_\markup{\italic dimin.} <ges a>-> <ees ges>-> <ces ees>-> \change Staff = "down"
			\stemUp <a ces>8->^\markup{\italic ritenuto \dynamic ppp} <ges a ees'>-> \change Staff = "up"
		s1.
		% measure 85
		s1.

		\bar "|."
		
	} % end of Voice context
}
