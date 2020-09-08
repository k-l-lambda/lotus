
\version "2.18.2"
% automatically converted by musicxml2ly from No.075.xml

\header {
    encodingsoftware = "Finale 2014 for Windows"
    encodingdate = "2017-04-01"
    composer = "C.Czerny"
    title = "                          Exercises
for the Attainment of Freedom and Agility"
    }

#(set-global-staff-size 22.6344518504)
\paper {
    paper-width = 21.0\cm
    paper-height = 29.71\cm
    top-margin = 0.99\cm
    bottom-margin = 1.67\cm
    left-margin = 0.99\cm
    right-margin = 0.89\cm
    between-system-space = 3.08\cm
    page-top-space = 2.07\cm
    }
\layout {
    \context { \Score
        skipBars = ##t
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative es'' {
    \repeat volta 2 {
        \clef "treble" \key es \major \time 3/4 | % 1
        es2. \p ^\markup{ \bold {Moderato} } ^3 | % 2
        \grace { d32 ( [ es32 f32 ] } es4.. ) ( ^^ d16 c4 ) ^1 | % 3
        bes2 ( ~ ^2 bes8. [ es16 ] | % 4
        g,2. ) \break | % 5
        g'2 \< ( ^3 \grace { as32 [ g32 ) ] } f8. [ g16 \! ] | % 6
        as4 c,4 d4 | % 7
        es2. \> ~ | % 8
        es8 \! \< [ g8 ( ^1 as8 bes8 c8 ^1 d8 \! ] \break | % 9
        es2. \mf ) ( ^3 | \barNumberCheck #10
        d8 [ es8 f8 es8 d8 c8 ] | % 11
        bes2 ~ ^2 bes8. [ es16 ] | % 12
        g,2 ~ g8. ) [ g16 ( ^2 ] \break | % 13
        f4 ~ ^1 f8 [ d'8 ^5 bes8 ^3 d,8 ) ^1 ] | % 14
        f4 ( ~ ^4 f8 [ es8 c8 ^1 d8 ^4 ] | % 15
        bes2. ) ~ | % 16
        bes4 r4 r4 }
    \pageBreak \repeat volta 2 {
        | % 17
        \afterGrace { as'2. \f ( \trill \startTrillSpan ^2 } { g32 [ as16
            \stopTrillSpan ] } | % 18
        f'2 as,4 ) ^2 | % 19
        \afterGrace { g2. ( \trill \startTrillSpan ^2 } { f32 [ g32
            \stopTrillSpan ] } | \barNumberCheck #20
        es'2 g,4 ) ^1 \break | % 21
        bes4. ( ^4 as8 [ f8 d8 ) ^1 ] | % 22
        es2 ( ^2 \grace { f32 [ es32 d32 es32 ] } f8 ) [ g8 ] | % 23
        f2. ^> | % 24
        r8 bes8 \> ( ^4 \grace { as32 [ bes32 ] } as8 ) ^3 [ g8 as8 f8
        \! ^1 ] \break | % 25
        es2 \p ( ^3 \times 2/3 {
            \grace { f32*3/2 [ es32*3/2 d32*3/2 ) ] } es8 ( [ f8 ^1 g8
            ^2 ] }
        | % 26
        \once \override TupletNumber #'stencil = ##f
        \times 2/3  {
            as8 _\markup{ \bold\italic {cresc.} } ^3 [ g8 f8 ] }
        \once \override TupletNumber #'stencil = ##f
        \times 2/3  {
            es8 ^3 [ d8 f8 ] }
        \once \override TupletNumber #'stencil = ##f
        \times 2/3  {
            es8 [ d8 c8 ^1 ] }
        | % 27
        bes2 ) ( ~ ^2 bes8. [ es16 ] | % 28
        g,2 ) r4 \break | % 29
        es'16 \pp ^3 [ e16 ^1 f16 fis16 _\markup{ \bold\italic
            {delicatamente} } ] g16 ^1 [ as16 a16 bes16 ^1 ] b16 ^1 [ c16
        cis16 d16 ^1 ] | \barNumberCheck #30
        \ottava #1 | \barNumberCheck #30
        es16 [ e16 ^1 f16 fis16 ] g16 ^1 [ as16 a16 ^1 bes16 ] b16 ^1 [
        c16 cis16 d16 ^4 ] | % 31
        \ottava #0 | % 31
        es2 ^5 r4 | % 32
        R2. }
    }

PartPOneVoiceThree =  \relative es {
    \repeat volta 2 {
        \clef "bass" \key es \major \time 3/4 <es g>2. _2 _4 | % 2
        <es as>2. _2 _4 | % 3
        <es g>2. | % 4
        <es g>2. \break | % 5
        <bes es>2. _3 _5 | % 6
        <bes f'>2. | % 7
        <es g>2. _4 | % 8
        <es g>2. \break | % 9
        <es g>2. | \barNumberCheck #10
        <es as>2. | % 11
        <es g>2. | % 12
        <es g>2. \break | % 13
        <f bes>2. _2 _5 | % 14
        <f a>2. _3 _5 | % 15
        bes2. _4 | % 16
        bes4 }
    s2 \pageBreak \repeat volta 2 {
        | % 17
        bes,2. | % 18
        bes2. | % 19
        bes2. | \barNumberCheck #20
        bes2. \break | % 21
        bes2. | % 22
        bes2. | % 23
        bes2. s2. \break | % 25
        <es g>2. _4 | % 26
        <es as>2. | % 27
        <es g>2. | % 28
        <es g>2. _2 _4 \break | % 29
        <bes es>2. | \barNumberCheck #30
        <bes f'>2. | % 31
        es2. _4 | % 32
        es4 s2 }
    }

PartPOneVoiceTwo =  \relative g {
    \repeat volta 2 {
        \clef "bass" \key es \major \time 3/4 g4 bes4 bes4 | % 2
        as4 c4 c4 | % 3
        g4 bes4 bes4 | % 4
        g4 bes4 bes4 \break | % 5
        es,4 g4 g4 | % 6
        f4 ^2 as4 as4 | % 7
        g4 ^2 bes4 bes4 | % 8
        g4 bes4 bes4 \break | % 9
        g4 bes4 bes4 | \barNumberCheck #10
        as4 c4 c4 | % 11
        g4 bes4 bes4 | % 12
        g4 bes4 bes4 \break | % 13
        bes4 d4 d4 | % 14
        a4 es'4 es4 | % 15
        d4 ( ^2 f4 d4 | % 16
        bes4 ) d,4 \rest d4 \rest }
    \pageBreak \repeat volta 2 {
        | % 17
        bes4 _5 <d f>4 _1 _3 <d f>4 | % 18
        bes4 <d f>4 <d f>4 | % 19
        bes4 <es g>4 _2 <es g>4 | \barNumberCheck #20
        bes4 <es g>4 <es g>4 \break | % 21
        bes4 <f' as>4 _2 <f as>4 | % 22
        bes,4 <es g>4 _2 <es g>4 | % 23
        bes4 <d f>4 <d f>4 | % 24
        bes4 r4 r4 \break | % 25
        g'4 ^2 bes4 bes4 | % 26
        as4 c4 c4 | % 27
        g4 bes4 bes4 | % 28
        g4 bes4 bes4 \break | % 29
        es,4 ^3 g4 g4 | \barNumberCheck #30
        f4 as4 as4 | % 31
        g4 ( ^2 bes4 g4 | % 32
        es4 ) d4 \rest d4 \rest }
    }


% The score definition
\score {
    <<
        \new PianoStaff <<
            \context Staff = "1" << 
                \context Voice = "PartPOneVoiceOne" { \PartPOneVoiceOne }
                >> \context Staff = "2" <<
                \context Voice = "PartPOneVoiceThree" { \voiceOne \PartPOneVoiceThree }
                \context Voice = "PartPOneVoiceTwo" { \voiceTwo \PartPOneVoiceTwo }
                >>
            >>
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    %  \midi {}
    }
