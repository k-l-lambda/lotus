
\version "2.18.2"
% automatically converted by musicxml2ly from No.064.xml

\header {
    encodingsoftware = "Finale 2014 for Mac"
    encodingdate = "2017-04-13"
    composer = "C.Czerny"
    copyright = "©"
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
    between-system-space = 3.52\cm
    page-top-space = 2.65\cm
    }
\layout {
    \context { \Score
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative d'' {
    \repeat volta 2 {
        \clef "treble" \key bes \major \time 2/4 | % 1
        <d f>8 \pp ^\markup{ \bold {Allegretto scherzando} } ^. ^1 ^2 [
        <d f>8 ^. <d f>8 ^. <d f>8 ^. ] | % 2
        bes'16 ( ^3 [ a16 c16 bes16 ] d16 ^5 [ c16 bes16 a16 ] | % 3
        g16 [ f16 ^4 es16 d16 ] c16 [ bes16 ^2 a16 bes16 ] | % 4
        c8 ) ^. r8 r4 \break | % 5
        <c f>8 ^. ^1 ^4 [ <c f>8 ^. <c f>8 ^. <c f>8 ^. ] | % 6
        c'16 ( ^3 [ b16 ^2 d16 ^4 c16 ^1 ] es16 ^3 [ d16 c16 bes16 ^4 ]
        | % 7
        a16 [ g16 f16 es16 ^3 ] d16 [ c16 bes16 ^2 c16 ] | % 8
        d8 ) ^. ^4 r8 r4 \break | % 9
        <d f>8 ^. ^1 ^3 [ <d f>8 ^. <d f>8 ^. <d f>8 ^. ] e16 ( ^1 [ f16
        ^2 fis16 ^3 g16 ^1 ] gis16 _\markup{ \bold\italic {cresc.} } ^3
        [ a16 ^1 bes16 ^3 b16 ^1 ] | % 11
        \ottava #1 | % 11
        c16 ) [ cis16 d16 ^1 dis16 ] e16 ^1 [ f16 fis16 g16 ^1 ] | % 12
        gis16 [ a16 ^1 bes16 b16 ^1 ] c16 ^2 [ b16 c16 cis16 ^3 ]
        \pageBreak | % 13
        e16 \p ( ^5 [ d16 _\markup{ \bold\italic {dolce} } cis16 d16 ^4
        ] bes8 ) ^. ^2 [ g8 ^. ^1 ] | % 14
        d'16 ( ^5 [ c16 b16 c16 ^4 ] a8 ) ^. ^2 [ f8 ^. ^1 ] | % 15
        c'16 ( ^5 [ bes16 ^4 a16 bes16 ] a16 [ g16 f16 e16 ^2 ] | % 16
        f8 ) ^. ^3 [ f8 ^. \ottava #0 f8 ^. ] r8 }
    \break \repeat volta 2 {
        | % 17
        s1*2 \p \break s1*2 \pageBreak | % 25
        bes,16 _\markup{ \bold\italic {cresc.} } ( ^4 [ f16 g16
        _\markup{ \bold\italic {- - - - - - - - - - - - - - - - - - - -
                - - - - - - - - - - - - - - -} } a16 ] bes16 [ c16 ^ 1 d 16
        es ?16 ] | % 26
        \ottava #1 | % 26
        f16 ^1 [ g16 a16 bes16 ] c16 ^1 [ d16 es16 f16 ^4 ] | % 27
        es16 [ d16 c16 bes16 ^4 ] a16 [ g16 f16 es16 ^3 ] \ottava #0 | % 28
        d16 [ c16 es16 d16 ] c16 [ bes16 ^4 a16 g16 ] \break | % 29
        f16 \f ) ( ^1 [ bes16 ^2 d16 ^4 f16 ^5 ] d8 ) ^. ^4 [ bes8 ^. ^2
        ] | \barNumberCheck #30
        f16 ( ^1 [ a16 ^2 c16 ^4 es16 ^5 ] c8 ) ^. ^4 [ a8 ^. ^2 ] s2 | % 32
        bes8 ^. [ bes8 ^. bes8 ^. ] r8 }
    }

PartPOneVoiceThree =  \relative bes {
    \repeat volta 2 {
        \clef "bass" \key bes \major \time 2/4 <bes d f>8 ^. _4 [ <bes d
            f>8 ^. <bes d f>8 ^. <bes d f>8 ^. ] | % 2
        <bes d f>8 ^. [ <bes d f>8 ^. <bes d f>8 ^. <bes d f>8 ^. ] | % 3
        <bes d f>8 ^. [ <bes d f>8 ^. <bes d f>8 ^. <bes d f>8 ^. ] | % 4
        <a es' f>8 ^. [ <a es' f>8 ^. <a es' f>8 ^. <a es' f>8 ^. ]
        \break | % 5
        <a es' f>8 ^. [ <a es' f>8 ^. <a es' f>8 ^. <a es' f>8 ^. ] | % 6
        <a es' f>8 ^. [ <a es' f>8 ^. <a es' f>8 ^. <a es' f>8 ^. ] | % 7
        <a es' f>8 ^. [ <a es' f>8 ^. <a es' f>8 ^. <a es' f>8 ^. ] | % 8
        <bes d f>8 ^. _4 [ <bes d f>8 ^. <bes d f>8 ^. <bes d f>8 ^. ]
        \break | % 9
        <bes d f>8 ^. [ <bes d f>8 ^. <bes d f>8 ^. <bes d f>8 ^. ] |
        \barNumberCheck #10
        \clef "treble" <bes c e g>8 _. ^5 [ <bes c e g>8 _. ] <bes c e
            g>8 _. [ <bes c e g>8 _. ] | % 11
        <bes c e g>8 _. [ <bes c e g>8 _. ] <bes c e g>8 _. [ <bes c e
            g>8 _. ] | % 12
        <a c f>8 _. ^3 [ <a c f>8 _. <a c f>8 _. <a c f>8 _. ]
        \pageBreak | % 13
        <bes d g>8 _. ^4 [ <bes d g>8 _. <bes d g>8 _. <bes d g>8 _. ] | % 14
        <c f a>8 _. ^5 [ <c f a>8 _. <c f a>8 _. <c f a>8 _. ] | % 15
        <c e g>8 _. [ <c e g>8 _. <c e g>8 _. <c e g>8 _. ] | % 16
        <f a>8 _. [ <f a>8 _. <f a>8 _. ] r8 }
    \break \repeat volta 2 {
        | % 17
        \clef "bass" <a, c f>8 ^. [ <a c f>8 ^. <a c f>8 ^. <a c f>8 ^.
        ] | % 18
        <a c f>8 ^. [ <a c f>8 ^. <a c f>8 ^. <a c f>8 ^. ] | % 19
        <bes d f>8 ^. [ <bes d f>8 ^. <bes d f>8 ^. <bes d f>8 ^. ] |
        \barNumberCheck #20
        <bes d f>8 ^. [ <bes d f>8 ^. <bes d f>8 ^. <bes d f>8 ^. ]
        \break | % 21
        <f c' es>8 ^. [ <f c' es>8 ^. <f c' es>8 ^. <f c' es>8 ^. ] | % 22
        <f c' es>8 ^. [ <f c' es>8 ^. <f c' es>8 ^. <f c' es>8 ^. ] | % 23
        <bes d>8 ^. [ <bes d>8 ^. <bes d>8 ^. <bes d>8 ^. ] | % 24
        <bes d>8 ^. _2 _4 [ <bes d>8 ^. <bes d>8 ^. <bes d>8 ^. ]
        \pageBreak | % 25
        <d, f bes>8 ^. _1 _3 _5 [ <d f bes>8 ^. <d f bes>8 ^. <d f bes>8
        ^. ] | % 26
        <d f bes>8 ^. [ <d f bes>8 ^. <d f bes>8 ^. <d f bes>8 ^. ] | % 27
        <es g c>8 ^. _4 [ <es g c>8 ^. <es g c>8 ^. <es g c>8 ^. ] | % 28
        <es g c>8 ^. [ <es g c>8 ^. <es g c>8 ^. <es g c>8 ^. ] \break | % 29
        <f bes d>8 ^. [ <f bes d>8 ^. <f bes d>8 ^. <f bes d>8 ^. ] |
        \barNumberCheck #30
        <f c' es>8 ^. [ <f c' es>8 ^. <f c' es>8 ^. <f c' es>8 ^. ] | % 31
        <bes d>8 ^. [ <bes d>8 ^. <bes d>8 ^. <bes d>8 ^. ] | % 32
        <bes d>8 ^. [ <bes d>8 ^. <bes d>8 ^. ] r8 }
    }

PartPOneVoiceTwo =  \relative c''' {
    \repeat volta 2 {
        \clef "treble" \key bes \major \time 2/4 | % 1
        s1*2 \pp ^\markup{ \bold {Allegretto scherzando} } \break s1*2
        \break s2. s4 _\markup{ \bold\italic {cresc.} } | % 11
        \ottava #1 s1 \pageBreak | % 13
        s16 \p s16*27 _\markup{ \bold\italic {dolce} } \ottava #0 s4 }
    \break \repeat volta 2 {
        | % 17
        <c es>16 \p ^3 ^5 [ f,16 <c' es>16 f,16 ] <c' es>16 [ f,16 <c'
            es>16 f,16 ] | % 18
        <c' es>8 c,16 \rest f16 ( ^3 g16 ^4 [ f16 ^3 e16 ^2 f16 ^1 ] | % 19
        <bes d>16 ) ^3 ^5 [ f16 <bes d>16 f16 ] <bes d>16 [ f16 <bes d>16
        f16 ] | \barNumberCheck #20
        <bes d>8 c,16 \rest f16 ( ^3 g16 [ f16 e16 ^2 f16 ^1 ] \break | % 21
        <a c>16 ) ^3 ^5 [ f16 <a c>16 f16 ] <a c>16 [ f16 <a c>16 f16 ]
        | % 22
        <a c>8 c,16 \rest f16 ( ^3 g16 [ f16 e16 ^2 f16 ^1 ] | % 23
        <bes d>16 ) ^3 ^5 [ f16 <bes d>16 f16 ] <bes d>16 [ f16 <bes d>16
        f16 ] | % 24
        <bes d>8 c,16 \rest f16 ( ^3 g16 [ f16 e16 ^2 f16 ^1 ]
        \pageBreak | % 25
        s8 _\markup{ \bold\italic {cresc.} } s4. _\markup{ \bold\italic
            {- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                - - - - -} } | % 26
        \ottava #1 s1 \ottava #0 s2 \break | % 29
        s1 \f | % 31
        bes16 [ f16 d'16 f,16 ] bes16 [ f16 d'16 f,16 ] s2 }
    }


% The score definition
\score {
    <<
        \new PianoStaff <<
            \context Staff = "1" << 
                \context Voice = "PartPOneVoiceOne" { \voiceOne \PartPOneVoiceOne }
                \context Voice = "PartPOneVoiceTwo" { \voiceTwo \PartPOneVoiceTwo }
                >> \context Staff = "2" <<
                \context Voice = "PartPOneVoiceThree" { \PartPOneVoiceThree }
                >>
            >>
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    %  \midi {}
    }
